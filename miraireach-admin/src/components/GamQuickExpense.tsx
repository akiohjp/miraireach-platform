"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useGamLocale } from "@/components/LocaleProvider";
import { GAM_ROUTES } from "@/components/GamHqShell";
import { GOLD } from "@/components/gam-branding";
import { getBrowserSupabase } from "@/lib/supabase";
import { fetchGamOrganizationMeta, resolveGamOrganizationId } from "@/lib/gam-dashboard-data";
import { broadcastGamDashboardRefresh } from "@/lib/gam-broadcast";
import { majorUnitsToMinor, type GamCurrencyCode } from "@/i18n/gam-currency";
import type { GamMessages } from "@/i18n/gam-messages";
import { GamReceiptOcrSection } from "@/components/GamReceiptOcrSection";

const FIELD_SLUGS = ["field_food", "field_labor", "field_supplies", "field_misc"] as const;
type FieldSlug = (typeof FIELD_SLUGS)[number];

const SORT: Record<FieldSlug, number> = {
  field_food: 50,
  field_labor: 51,
  field_supplies: 52,
  field_misc: 53,
};

function labelForSlug(t: GamMessages, slug: FieldSlug): string {
  switch (slug) {
    case "field_food":
      return t.mobileQuick.catFood;
    case "field_labor":
      return t.mobileQuick.catLabor;
    case "field_supplies":
      return t.mobileQuick.catSupplies;
    case "field_misc":
      return t.mobileQuick.catMisc;
    default:
      return slug;
  }
}

function parseMajorFromDigits(raw: string, minorUnits: number): number | null {
  if (!raw || raw === ".") return null;
  if (minorUnits === 0) {
    if (raw.includes(".")) return null;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function formatDisplay(raw: string, minorUnits: number): string {
  if (!raw) return minorUnits === 0 ? "0" : "0";
  if (minorUnits === 0) return raw.replace(/\D/g, "") || "0";
  return raw;
}

const keyBtnClass =
  "min-h-[3.75rem] rounded-2xl border-2 border-neutral-200 bg-white text-2xl font-black text-black transition hover:bg-neutral-50 active:scale-[0.98] active:bg-neutral-100 lg:min-h-[3.25rem]";

export function GamQuickExpense() {
  const { t } = useGamLocale();
  const router = useRouter();
  const [gate, setGate] = useState<"loading" | "no_session" | "no_org" | "boot_error" | "ready">("loading");
  const [bootErr, setBootErr] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [functionalCurrency, setFunctionalCurrency] = useState("JPY");
  const [minorUnits, setMinorUnits] = useState(0);
  const [categoryBySlug, setCategoryBySlug] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<FieldSlug | null>(null);
  const [digits, setDigits] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const boot = useCallback(async () => {
    setGate("loading");
    setBootErr(null);
    const supabase = getBrowserSupabase();
    const resolved = await resolveGamOrganizationId(supabase);
    if (!resolved.ok) {
      setGate(resolved.reason === "no_session" ? "no_session" : "no_org");
      setOrgId(null);
      return;
    }
    setOrgId(resolved.organizationId);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);
    const meta = await fetchGamOrganizationMeta(supabase, resolved.organizationId);
    if (meta) {
      setFunctionalCurrency(meta.functionalCurrency);
      setMinorUnits(meta.functionalMinorUnits);
    }

    const map: Record<string, string> = {};
    for (const slug of FIELD_SLUGS) {
      const label = labelForSlug(t, slug);
      const { data: row, error } = await supabase
        .from("cost_categories")
        .upsert(
          {
            organization_id: resolved.organizationId,
            slug,
            label,
            sort_order: SORT[slug],
          },
          { onConflict: "organization_id,slug" },
        )
        .select("id")
        .single();
      if (error) {
        console.error(error);
        setBootErr(error.message);
        setGate("boot_error");
        return;
      }
      map[slug] = row.id;
    }
    setCategoryBySlug(map);
    setGate("ready");
  }, [t]);

  useEffect(() => {
    queueMicrotask(() => {
      void boot();
    });
  }, [boot]);

  const displayAmount = useMemo(() => formatDisplay(digits, minorUnits), [digits, minorUnits]);
  const parsedMajor = useMemo(() => parseMajorFromDigits(digits, minorUnits), [digits, minorUnits]);

  function appendKey(key: string) {
    if (status === "ok") setStatus("idle");
    if (key === ".") {
      if (minorUnits === 0) return;
      if (digits.includes(".")) return;
      setDigits((d) => (d === "" ? "0." : `${d}.`));
      return;
    }
    setDigits((d) => {
      if (minorUnits === 0) {
        const next = `${d}${key}`.replace(/^0+(?=\d)/, "") || key;
        return next.length > 12 ? d : next;
      }
      const parts = d.split(".");
      if (parts.length === 2 && parts[1]!.length >= 2) return d;
      const next = d === "" && key === "0" ? "0" : `${d}${key}`;
      return next.length > 14 ? d : next;
    });
  }

  function backspace() {
    setDigits((d) => d.slice(0, -1));
    if (status === "ok") setStatus("idle");
  }

  function clearAll() {
    setDigits("");
    if (status === "ok") setStatus("idle");
  }

  async function post() {
    if (!orgId || !selected || parsedMajor == null) return;
    const catId = categoryBySlug[selected];
    if (!catId) return;
    setErrMsg(null);
    setStatus("saving");
    const supabase = getBrowserSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const txDate = new Date().toISOString().slice(0, 10);
    const minor = majorUnitsToMinor(parsedMajor, minorUnits);
    const signed = -minor;
    const memo = `${t.mobileQuick.ledgerMemoPrefix} · ${labelForSlug(t, selected)}`;
    const { error } = await supabase.from("ledger_entries").insert({
      organization_id: orgId,
      project_id: null,
      cost_category_id: catId,
      entry_type: "expense",
      transaction_date: txDate,
      amount_minor: signed,
      currency_code: functionalCurrency,
      amount_functional_minor: signed,
      memo,
      created_by: user?.id ?? null,
    });
    if (error) {
      setErrMsg(error.message);
      setStatus("err");
      return;
    }
    setStatus("ok");
    setDigits("");
    broadcastGamDashboardRefresh();
    router.refresh();
    window.setTimeout(() => setStatus("idle"), 1600);
  }

  const loginHref = `${GAM_ROUTES.login}?next=${encodeURIComponent("/m/quick")}`;

  if (gate === "loading") {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-6">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" aria-hidden />
        <p className="mt-4 text-sm font-semibold text-neutral-600">{t.dashboard.loading}</p>
      </div>
    );
  }

  if (gate === "boot_error") {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-6 pb-12">
        <p className="text-center text-sm font-bold text-neutral-800">{t.mobileQuick.error}</p>
        {bootErr ? (
          <p className="mt-2 max-w-sm text-center font-mono text-xs text-red-700" dir="ltr">
            {bootErr}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void boot()}
          className="mt-8 w-full max-w-xs rounded-2xl bg-black py-3.5 text-sm font-black text-white"
          style={{ boxShadow: `inset 0 0 0 1px ${GOLD}` }}
        >
          {t.dashboard.retry}
        </button>
        <Link href={GAM_ROUTES.overview} className="mt-6 text-sm font-bold text-neutral-500 underline underline-offset-2">
          {t.mobileQuick.home}
        </Link>
      </div>
    );
  }

  if (gate === "no_session") {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-white px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12">
        <p className="text-center text-lg font-black text-black">{t.mobileQuick.needLogin}</p>
        <Link
          href={loginHref}
          className="mx-auto mt-8 w-full max-w-sm rounded-2xl bg-black py-4 text-center text-sm font-black text-white"
          style={{ boxShadow: `inset 0 0 0 1px ${GOLD}` }}
        >
          {t.auth.signInCta}
        </Link>
      </div>
    );
  }

  if (gate === "no_org") {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-6 text-center">
        <p className="font-bold text-black">{t.mobileQuick.noOrg}</p>
        <Link href={GAM_ROUTES.overview} className="mt-6 text-sm font-bold underline underline-offset-2">
          {t.mobileQuick.home}
        </Link>
      </div>
    );
  }

  const canPost = selected != null && parsedMajor != null && status !== "saving";

  return (
    <div
      className="flex min-h-[100dvh] flex-col bg-white text-black"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <header
        className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-black bg-white px-3 py-3 lg:px-8 lg:py-4"
        style={{ borderBottomColor: GOLD, paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <Link
          href={GAM_ROUTES.overview}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-black transition hover:border-neutral-400"
          aria-label={t.mobileQuick.home}
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
        </Link>
        <div className="min-w-0 flex-1 px-2 text-center">
          <h1 className="text-sm font-black tracking-tight lg:text-base">{t.mobileQuick.title}</h1>
          <p className="text-[10px] font-bold text-neutral-500 lg:text-xs">{t.mobileQuick.subtitle}</p>
        </div>
        <div className="w-11" aria-hidden />
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-4 pb-6 lg:px-8 lg:pt-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
          <section className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-wider text-neutral-400">{t.mobileQuick.selectCategory}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 lg:gap-3">
              {FIELD_SLUGS.map((slug) => {
                const on = selected === slug;
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => {
                      setSelected(slug);
                      if (status === "ok") setStatus("idle");
                    }}
                    className={`min-h-[4.25rem] rounded-2xl border-2 px-3 py-3 text-left text-sm font-black leading-snug transition active:scale-[0.98] lg:min-h-[4.5rem] lg:text-[0.95rem] ${
                      on
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 bg-neutral-50 text-black hover:border-neutral-400"
                    }`}
                    style={on ? { boxShadow: `0 0 0 1px ${GOLD}, 0 8px 24px rgba(0,0,0,0.12)` } : undefined}
                  >
                    {labelForSlug(t, slug)}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 lg:mt-8 lg:p-5">
              <p className="text-[11px] font-black uppercase tracking-wider text-neutral-500">{t.mobileQuick.amountLabel}</p>
              <p className="mt-1 text-[10px] font-medium text-neutral-500 lg:text-xs">{t.mobileQuick.currencyHint}</p>
              <p
                className="mt-2 break-all text-4xl font-black tabular-nums tracking-tight text-black sm:text-5xl lg:text-6xl"
                dir="ltr"
              >
                {displayAmount}
                <span className="ms-2 text-2xl font-black text-neutral-400 lg:text-3xl">{functionalCurrency}</span>
              </p>
            </div>
          </section>

          <section className="mt-6 flex min-w-0 flex-col lg:mt-0 lg:sticky lg:top-20 lg:self-start">
            <div className="mx-auto grid w-full max-w-md flex-1 grid-cols-3 gap-2 pb-2 lg:max-w-none">
              {(["7", "8", "9", "4", "5", "6", "1", "2", "3"] as const).map((k) => (
                <button key={k} type="button" onClick={() => appendKey(k)} className={keyBtnClass}>
                  {k}
                </button>
              ))}
              {minorUnits > 0 ? (
                <button type="button" onClick={() => appendKey(".")} className={keyBtnClass}>
                  .
                </button>
              ) : (
                <button type="button" onClick={clearAll} className={keyBtnClass + " text-sm text-neutral-600"}>
                  {t.mobileQuick.clear}
                </button>
              )}
              <button type="button" onClick={() => appendKey("0")} className={keyBtnClass}>
                0
              </button>
              <button
                type="button"
                onClick={backspace}
                className="min-h-[3.75rem] rounded-2xl border-2 border-neutral-800 bg-neutral-900 text-sm font-black text-white transition hover:opacity-95 active:scale-[0.98] active:opacity-90 lg:min-h-[3.25rem]"
                style={{ boxShadow: `inset 0 0 0 1px ${GOLD}55` }}
              >
                {t.mobileQuick.backspace}
              </button>
            </div>

            <div className="mx-auto mt-2 w-full max-w-md space-y-2 pb-4 lg:max-w-none">
              <button
                type="button"
                disabled={!canPost}
                onClick={() => void post()}
                className="flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-2xl bg-black text-base font-black text-white transition hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-45"
                style={{ boxShadow: `inset 0 0 0 2px ${GOLD}` }}
              >
                {status === "saving" ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {status === "ok" ? <Check className="h-5 w-5 text-emerald-400" strokeWidth={3} /> : null}
                {status === "saving"
                  ? t.mobileQuick.saving
                  : status === "ok"
                    ? t.mobileQuick.saved
                    : t.mobileQuick.submit}
              </button>
              {errMsg ? <p className="text-center text-xs font-bold text-red-700">{t.mobileQuick.error}</p> : null}
              {errMsg ? (
                <p className="text-center font-mono text-[10px] text-red-600/90" dir="ltr">
                  {errMsg}
                </p>
              ) : null}
              <Link
                href={GAM_ROUTES.plEntry}
                className="block py-2 text-center text-xs font-bold text-neutral-500 underline underline-offset-2 hover:text-black"
              >
                {t.mobileQuick.openFullPl}
              </Link>
            </div>
          </section>
        </div>

        {orgId ? (
          <GamReceiptOcrSection
            orgId={orgId}
            userId={userId ?? ""}
            functionalCurrency={functionalCurrency as GamCurrencyCode}
            costCategoryId={selected ? categoryBySlug[selected] ?? null : null}
            categoryLabel={selected ? labelForSlug(t, selected) : null}
            ledgerMemoPrefix={t.mobileQuick.ledgerMemoPrefix}
            onPosted={() => {
              broadcastGamDashboardRefresh();
              router.refresh();
            }}
            onCopyToKeypad={(raw) => {
              setDigits(raw);
              setStatus("idle");
            }}
            onDemoSampleReady={() => {
              setSelected("field_supplies");
              setStatus("idle");
            }}
          />
        ) : null}
      </main>
    </div>
  );
}
