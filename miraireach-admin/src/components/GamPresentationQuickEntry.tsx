"use client";

import { useCallback, useEffect, useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { useGamLocale } from "@/components/LocaleProvider";
import { GOLD } from "@/components/gam-branding";
import { getBrowserSupabase } from "@/lib/supabase";
import {
  fetchGamOrganizationMeta,
  resolveGamOrganizationId,
  type OrgResolution,
} from "@/lib/gam-dashboard-data";
import { appendPresentationOverlayLine } from "@/lib/gam-presentation-overlay";
import { broadcastGamDashboardRefresh } from "@/lib/gam-broadcast";
import {
  ledgerExpenseAmountsFromTxMajor,
  ledgerRevenueAmountsFromTxMajor,
  normalizeGamCurrencyCode,
  type GamCurrencyCode,
} from "@/i18n/gam-currency";
import type { GamMessages } from "@/i18n/gam-messages";

const PRE_SLUGS = ["pre_consult", "pre_tools", "pre_misc"] as const;
type PreSlug = (typeof PRE_SLUGS)[number];

const SORT: Record<PreSlug, number> = {
  pre_consult: 10,
  pre_tools: 11,
  pre_misc: 12,
};

function labelForSlug(t: GamMessages, slug: PreSlug): string {
  switch (slug) {
    case "pre_consult":
      return t.presentationQuick.catConsult;
    case "pre_tools":
      return t.presentationQuick.catTools;
    case "pre_misc":
      return t.presentationQuick.catOther;
    default:
      return slug;
  }
}

export function GamPresentationQuickEntry() {
  const { t } = useGamLocale();
  const [orgRes, setOrgRes] = useState<OrgResolution | null>(null);
  const [functionalCode, setFunctionalCode] = useState<GamCurrencyCode>("JPY");
  const [categoryBySlug, setCategoryBySlug] = useState<Record<string, string>>({});
  const [booting, setBooting] = useState(true);
  const [kind, setKind] = useState<"revenue" | "expense">("expense");
  const [slug, setSlug] = useState<PreSlug>("pre_consult");
  const [txCode, setTxCode] = useState<GamCurrencyCode>("JPY");
  const [amountRaw, setAmountRaw] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [mockUploadMsg, setMockUploadMsg] = useState<string | null>(null);

  const boot = useCallback(async () => {
    setBooting(true);
    const supabase = getBrowserSupabase();
    const resolved = await resolveGamOrganizationId(supabase);
    setOrgRes(resolved);
    if (!resolved.ok) {
      setBooting(false);
      return;
    }
    const meta = await fetchGamOrganizationMeta(supabase, resolved.organizationId);
    setFunctionalCode(meta?.functionalCurrency ?? "JPY");

    const map: Record<string, string> = {};
    const supa = getBrowserSupabase();
    for (const s of PRE_SLUGS) {
      const label = labelForSlug(t, s);
      const { data: row, error } = await supa
        .from("cost_categories")
        .upsert(
          {
            organization_id: resolved.organizationId,
            slug: s,
            label,
            sort_order: SORT[s],
          },
          { onConflict: "organization_id,slug" },
        )
        .select("id")
        .single();
      if (!error && row?.id) {
        map[s] = row.id;
      } else if (error) {
        console.warn("[GamPresentationQuickEntry] category:", error.message);
      }
    }
    setCategoryBySlug(map);
    setBooting(false);
  }, [t]);

  useEffect(() => {
    queueMicrotask(() => {
      void boot();
    });
  }, [boot]);

  async function submitLine() {
    if (!orgRes?.ok) return;
    const major = Number.parseFloat(amountRaw.replace(/,/g, ""));
    if (!Number.isFinite(major) || major <= 0) return;
    const fn = functionalCode;
    const tx = txCode;
    const amounts =
      kind === "revenue"
        ? ledgerRevenueAmountsFromTxMajor(major, tx, fn)
        : ledgerExpenseAmountsFromTxMajor(major, tx, fn);

    const txDate = new Date().toISOString().slice(0, 10);
    setErrMsg(null);
    setStatus("saving");

    const supabase = getBrowserSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const catId = kind === "expense" ? categoryBySlug[slug] ?? null : null;

    const memo =
      kind === "revenue"
        ? `${t.presentationQuick.memoPrefix} · ${t.presentationQuick.revenue}`
        : `${t.presentationQuick.memoPrefix} · ${t.presentationQuick.expense} · ${labelForSlug(t, slug)}`;

    const { error } = await supabase.from("ledger_entries").insert({
      organization_id: orgRes.organizationId,
      project_id: null,
      cost_category_id: catId,
      entry_type: kind,
      transaction_date: txDate,
      amount_minor: amounts.amountMinor,
      currency_code: tx,
      amount_functional_minor: amounts.amountFunctionalMinor,
      memo,
      created_by: user?.id ?? null,
    });

    if (error) {
      if (orgRes.weakAccess) {
        appendPresentationOverlayLine({
          transactionDate: txDate,
          entryType: kind,
          amountFunctionalMinor: amounts.amountFunctionalMinor,
        });
        setErrMsg(`${error.message} · ${t.presentationQuick.overlayHint}`);
        setStatus("ok");
        setAmountRaw("");
        broadcastGamDashboardRefresh();
        window.setTimeout(() => setStatus("idle"), 2400);
        return;
      }
      setErrMsg(error.message);
      setStatus("err");
      return;
    }

    setStatus("ok");
    setAmountRaw("");
    broadcastGamDashboardRefresh();
    window.setTimeout(() => setStatus("idle"), 1600);
  }

  function onMockUpload() {
    setMockUploadMsg(t.presentationQuick.uploadSuccess);
    window.setTimeout(() => setMockUploadMsg(null), 3200);
  }

  if (booting) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-4 text-sm font-semibold text-neutral-600">
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
        {t.dashboard.loading}
      </div>
    );
  }

  if (!orgRes?.ok) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/80 p-4 text-center text-xs font-medium text-neutral-600">
        {t.presentationQuick.needLogin}
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6"
      style={{ boxShadow: `inset 0 0 0 1px ${GOLD}22` }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{t.receiptOcr.presentationCallout}</p>
      <h3 className="mt-1 text-lg font-black tracking-tight text-black">{t.presentationQuick.title}</h3>
      <p className="mt-1 text-sm font-medium text-neutral-600">{t.presentationQuick.subtitle}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setKind("expense")}
          className={`rounded-xl px-3 py-2 text-xs font-black transition ${
            kind === "expense"
              ? "bg-black text-white"
              : "border border-neutral-200 bg-neutral-50 text-neutral-700"
          }`}
        >
          {t.presentationQuick.expense}
        </button>
        <button
          type="button"
          onClick={() => setKind("revenue")}
          className={`rounded-xl px-3 py-2 text-xs font-black transition ${
            kind === "revenue"
              ? "bg-black text-white"
              : "border border-neutral-200 bg-neutral-50 text-neutral-700"
          }`}
        >
          {t.presentationQuick.revenue}
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            {t.presentationQuick.amount}
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={amountRaw}
            onChange={(e) => setAmountRaw(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 text-sm font-bold text-black outline-none focus:border-black"
            dir="ltr"
            placeholder="10000"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            {t.presentationQuick.currency}
          </span>
          <select
            value={txCode}
            onChange={(e) => {
              const c = normalizeGamCurrencyCode(e.target.value);
              if (c) setTxCode(c);
            }}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 text-sm font-bold text-black outline-none focus:border-black"
          >
            <option value="JPY">JPY</option>
            <option value="AED">AED</option>
          </select>
        </label>
      </div>

      <label className="mt-3 block">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          {t.presentationQuick.category}
        </span>
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value as PreSlug)}
          disabled={kind === "revenue"}
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 text-sm font-bold text-black outline-none focus:border-black disabled:opacity-50"
        >
          {PRE_SLUGS.map((s) => (
            <option key={s} value={s}>
              {labelForSlug(t, s)}
            </option>
          ))}
        </select>
      </label>
      {kind === "revenue" ? (
        <p className="mt-1 text-[11px] font-medium text-neutral-400">{t.presentationQuick.revenueCategoryNote}</p>
      ) : null}

      <button
        type="button"
        disabled={status === "saving"}
        onClick={() => void submitLine()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-black text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60"
        style={{ boxShadow: `inset 0 0 0 1px ${GOLD}44` }}
      >
        {status === "saving" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {t.presentationQuick.saving}
          </>
        ) : status === "ok" ? (
          t.presentationQuick.saved
        ) : (
          t.presentationQuick.submit
        )}
      </button>
      {errMsg ? (
        <p className="mt-2 text-xs font-medium leading-relaxed text-amber-900" dir="ltr">
          {errMsg}
        </p>
      ) : null}

      <div className="mt-6 border-t border-neutral-100 pt-5">
        <p className="text-sm font-black text-black">{t.presentationQuick.uploadTitle}</p>
        <p className="mt-1 text-xs font-medium text-neutral-600">{t.presentationQuick.uploadHint}</p>
        <button
          type="button"
          onClick={onMockUpload}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-bold text-neutral-900 transition hover:border-black"
        >
          <FileUp className="h-4 w-4 shrink-0" strokeWidth={2} />
          {t.presentationQuick.uploadButton}
        </button>
        {mockUploadMsg ? (
          <p className="mt-2 text-xs font-bold text-emerald-700">{mockUploadMsg}</p>
        ) : null}
      </div>

      <p className="mt-3 text-[10px] font-medium text-neutral-400" dir="ltr">
        {t.currencyHint} · FC: {functionalCode}
      </p>
    </div>
  );
}
