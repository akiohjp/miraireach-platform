"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Receipt, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useGamLocale } from "@/components/LocaleProvider";
import { GAM_ROUTES } from "@/components/GamHqShell";
import { GOLD } from "@/components/gam-branding";
import { getBrowserSupabase } from "@/lib/supabase";
import { fetchGamOrganizationMeta, resolveGamOrganizationId } from "@/lib/gam-dashboard-data";
import { broadcastGamDashboardRefresh } from "@/lib/gam-broadcast";
import { majorUnitsToMinor } from "@/i18n/gam-currency";

type ProjectOpt = { id: string; code: string; name: string };
type CatOpt = { id: string; slug: string; label: string };

export function GamPlEntryForm() {
  const { t } = useGamLocale();
  const router = useRouter();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [functionalCurrency, setFunctionalCurrency] = useState("JPY");
  const [minorUnits, setMinorUnits] = useState(0);
  const [projects, setProjects] = useState<ProjectOpt[]>([]);
  const [categories, setCategories] = useState<CatOpt[]>([]);

  const [kind, setKind] = useState<"revenue" | "expense">("revenue");
  const [txDate, setTxDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [amountMajor, setAmountMajor] = useState("");
  const [projectId, setProjectId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [memo, setMemo] = useState("");

  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (kind !== "revenue") return;
    queueMicrotask(() => {
      setCategoryId("");
    });
  }, [kind]);

  useEffect(() => {
    (async () => {
      const supabase = getBrowserSupabase();
      const res = await resolveGamOrganizationId(supabase);
      if (!res.ok) return;
      setOrgId(res.organizationId);
      const meta = await fetchGamOrganizationMeta(supabase, res.organizationId);
      if (meta) {
        setFunctionalCurrency(meta.functionalCurrency);
        setMinorUnits(meta.functionalMinorUnits);
      }
      const [{ data: prows }, { data: crows }] = await Promise.all([
        supabase
          .from("projects")
          .select("id,code,name")
          .eq("organization_id", res.organizationId)
          .order("code", { ascending: true }),
        supabase
          .from("cost_categories")
          .select("id,slug,label")
          .eq("organization_id", res.organizationId)
          .order("sort_order", { ascending: true }),
      ]);
      setProjects((prows as ProjectOpt[]) ?? []);
      setCategories((crows as CatOpt[]) ?? []);
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orgId) return;
    const raw = Number.parseFloat(amountMajor.replace(/,/g, ""));
    if (!Number.isFinite(raw) || raw <= 0) return;
    if (kind === "expense" && !categoryId) return;

    setErrMsg(null);
    setStatus("saving");
    const supabase = getBrowserSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const minor = majorUnitsToMinor(raw, minorUnits);
    const signed = kind === "revenue" ? minor : -minor;
    const { error } = await supabase.from("ledger_entries").insert({
      organization_id: orgId,
      project_id: projectId || null,
      cost_category_id: kind === "expense" ? categoryId : null,
      entry_type: kind,
      transaction_date: txDate,
      amount_minor: signed,
      currency_code: functionalCurrency,
      amount_functional_minor: signed,
      memo: memo.trim() || null,
      created_by: user?.id ?? null,
    });
    if (error) {
      setErrMsg(error.message);
      setStatus("err");
      return;
    }
    setStatus("ok");
    setAmountMajor("");
    setMemo("");
    broadcastGamDashboardRefresh();
    router.refresh();
    setTimeout(() => setStatus("idle"), 2400);
  }

  const card =
    "rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6";
  const label = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-500";
  const input =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 text-sm font-semibold text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={GAM_ROUTES.overview}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-800 shadow-sm transition hover:border-black"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          {t.dataEntry.backDashboard}
        </Link>
        {orgId ? (
          <p className="text-[10px] font-medium text-neutral-500" dir="ltr">
            {functionalCurrency} · {minorUnits === 0 ? "0" : String(minorUnits)} dp minor
          </p>
        ) : null}
      </div>

      <section className={card}>
        <div className="mb-5 flex items-start gap-3 border-b border-neutral-100 pb-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-white"
            style={{ boxShadow: `0 0 0 1px ${GOLD}` }}
          >
            <Receipt className="h-5 w-5 text-black" strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-lg font-black tracking-tight text-black">{t.dataEntry.plSection}</h2>
            <p className="mt-1 text-sm font-medium text-neutral-600">{t.dataEntry.plSectionSub}</p>
            <p className="mt-2 text-xs font-medium text-neutral-500">{t.dataEntry.entryHint}</p>
            {kind === "expense" && categories.length === 0 ? (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                {t.dashboard.emptyCostHint}
              </p>
            ) : null}
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="gam-l-kind">
              {t.dataEntry.entryKind}
            </label>
            <select
              id="gam-l-kind"
              className={input}
              value={kind}
              onChange={(e) => setKind(e.target.value as "revenue" | "expense")}
            >
              <option value="revenue">{t.dataEntry.kindRevenue}</option>
              <option value="expense">{t.dataEntry.kindExpense}</option>
            </select>
          </div>
          <div>
            <label className={label} htmlFor="gam-l-date">
              {t.dataEntry.transactionDate}
            </label>
            <input
              id="gam-l-date"
              type="date"
              className={input}
              value={txDate}
              onChange={(e) => setTxDate(e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="gam-l-amt">
              {t.dataEntry.amount} ({functionalCurrency}) · {t.dataEntry.required}
            </label>
            <input
              id="gam-l-amt"
              type="text"
              inputMode="decimal"
              className={input}
              value={amountMajor}
              onChange={(e) => setAmountMajor(e.target.value)}
              placeholder={minorUnits === 0 ? "150000" : "1500.50"}
              required
              dir="ltr"
            />
            <p className="mt-1 text-[11px] font-medium text-neutral-500">{t.dataEntry.amountHintFunctional}</p>
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="gam-l-proj">
              {t.dataEntry.linkProject}
            </label>
            <select id="gam-l-proj" className={input} value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">{t.dataEntry.noProject}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} · {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="gam-l-cat">
              {t.dataEntry.costCategory}
              {kind === "expense" ? ` · ${t.dataEntry.required}` : ` (${t.dataEntry.costCategoryExpenseOnly})`}
            </label>
            <select
              id="gam-l-cat"
              className={input}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={kind === "revenue"}
              required={kind === "expense"}
            >
              <option value="">{kind === "revenue" ? "—" : t.dataEntry.required}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="gam-l-memo">
              {t.dataEntry.memo}
            </label>
            <input
              id="gam-l-memo"
              className={input}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder={t.dataEntry.memoPlaceholder}
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={status === "saving" || (kind === "expense" && !categoryId)}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60"
              style={{ boxShadow: `inset 0 0 0 1px ${GOLD}33` }}
            >
              {status === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              {status === "saving" ? t.dataEntry.saving : t.dataEntry.postEntry}
            </button>
            {status === "ok" && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {t.dataEntry.entryPosted}
              </span>
            )}
            {status === "err" && errMsg && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-700">
                <AlertCircle className="h-4 w-4" /> {errMsg}
              </span>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
