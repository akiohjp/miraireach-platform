"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tags, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { useGamLocale } from "@/components/LocaleProvider";
import { GAM_ROUTES } from "@/components/GamHqShell";
import { GOLD } from "@/components/gam-branding";
import { getBrowserSupabase } from "@/lib/supabase";
import { fetchGamOrganizationMeta, resolveGamOrganizationId } from "@/lib/gam-dashboard-data";
import { broadcastGamDashboardRefresh } from "@/lib/gam-broadcast";
import { majorUnitsToMinor, functionalMinorToMajor } from "@/i18n/gam-currency";

type Category = { id: string; slug: string; label: string; sort_order: number };

function currentMonthBounds() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const last = new Date(y, m + 1, 0);
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    start: `${y}-${p(m + 1)}-01`,
    end: `${y}-${p(m + 1)}-${p(last.getDate())}`,
    label: `${y}-${p(m + 1)}`,
  };
}

export function GamCostsBudgetsForm() {
  const { t } = useGamLocale();
  const router = useRouter();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [minorUnits, setMinorUnits] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgetInputs, setBudgetInputs] = useState<Record<string, string>>({});
  const [slug, setSlug] = useState("");
  const [label, setLabel] = useState("");
  const [sortOrder, setSortOrder] = useState("10");
  const [catBusy, setCatBusy] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [catErr, setCatErr] = useState<string | null>(null);
  const [budBusy, setBudBusy] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [budErr, setBudErr] = useState<string | null>(null);

  const { start: monthStart, end: monthEnd, label: monthLabel } = currentMonthBounds();

  const reload = useCallback(async () => {
    if (!orgId) return;
    setCatErr(null);
    setBudErr(null);
    const supabase = getBrowserSupabase();
    const [{ data: cats, error: catErr }, { data: buds, error: budErr }] = await Promise.all([
      supabase
        .from("cost_categories")
        .select("id,slug,label,sort_order")
        .eq("organization_id", orgId)
        .order("sort_order", { ascending: true }),
      supabase
        .from("budget_periods")
        .select("id,cost_category_id,budget_amount_functional_minor,period_start,period_end")
        .eq("organization_id", orgId)
        .is("project_id", null)
        .lte("period_start", monthEnd)
        .gte("period_end", monthStart),
    ]);

    if (catErr) {
      console.error("[GamCostsBudgetsForm] categories", catErr);
      setCatErr(catErr.message);
      return;
    }
    if (budErr) {
      console.error("[GamCostsBudgetsForm] budgets", budErr);
      setBudErr(budErr.message);
      return;
    }

    const list = (cats as Category[]) ?? [];
    setCategories(list);

    const nextInputs: Record<string, string> = {};
    for (const c of list) {
      const row = buds?.find(
        (b: { cost_category_id: string | null }) => b.cost_category_id === c.id,
      ) as { budget_amount_functional_minor: number } | undefined;
      const minor = row ? Number(row.budget_amount_functional_minor) : 0;
      const major = minor === 0 ? "" : String(functionalMinorToMajor(minor, minorUnits));
      nextInputs[c.id] = major;
    }
    setBudgetInputs(nextInputs);
  }, [orgId, monthStart, monthEnd, minorUnits]);

  useEffect(() => {
    (async () => {
      const supabase = getBrowserSupabase();
      const res = await resolveGamOrganizationId(supabase);
      if (!res.ok) return;
      setOrgId(res.organizationId);
      const meta = await fetchGamOrganizationMeta(supabase, res.organizationId);
      if (meta) setMinorUnits(meta.functionalMinorUnits);
    })();
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void reload();
    });
  }, [reload]);

  const card =
    "rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6";
  const lbl =
    "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-500";
  const input =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 text-sm font-semibold text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10";

  async function onAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!orgId || !slug.trim() || !label.trim()) return;
    setCatErr(null);
    setCatBusy("saving");
    const supabase = getBrowserSupabase();
    const so = Number.parseInt(sortOrder, 10);
    const { error } = await supabase.from("cost_categories").insert({
      organization_id: orgId,
      slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"),
      label: label.trim(),
      sort_order: Number.isFinite(so) ? so : 0,
    });
    if (error) {
      setCatErr(error.message);
      setCatBusy("err");
      return;
    }
    setCatBusy("ok");
    setSlug("");
    setLabel("");
    setSortOrder("10");
    await reload();
    broadcastGamDashboardRefresh();
    router.refresh();
    setTimeout(() => setCatBusy("idle"), 2000);
  }

  async function onSaveBudgets(e: React.FormEvent) {
    e.preventDefault();
    if (!orgId || !categories.length) return;
    setBudErr(null);
    setBudBusy("saving");
    const supabase = getBrowserSupabase();

    for (const c of categories) {
      const raw = budgetInputs[c.id]?.trim() ?? "";
      const major = raw === "" ? 0 : Number.parseFloat(raw.replace(/,/g, ""));
      if (!Number.isFinite(major) || major < 0) {
        setBudErr(t.dataEntry.saveError);
        setBudBusy("err");
        return;
      }
      const minorAmt = majorUnitsToMinor(major, minorUnits);
      const payload = {
        organization_id: orgId,
        project_id: null as null,
        cost_category_id: c.id,
        period_start: monthStart,
        period_end: monthEnd,
        budget_amount_functional_minor: minorAmt,
      };
      const { error } = await supabase.from("budget_periods").upsert(payload, {
        onConflict: "organization_id,project_id,cost_category_id,period_start,period_end",
      });
      if (error) {
        setBudErr(error.message);
        setBudBusy("err");
        return;
      }
    }

    setBudBusy("ok");
    await reload();
    broadcastGamDashboardRefresh();
    router.refresh();
    setTimeout(() => setBudBusy("idle"), 2000);
  }

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
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t.costsBudgets.pageTitle}</h2>
          <p className="mt-1 text-sm font-medium text-neutral-600">{t.costsBudgets.pageSub}</p>
        </div>
        <Link
          href={GAM_ROUTES.plEntry}
          className="text-xs font-bold text-neutral-700 underline-offset-2 hover:text-black hover:underline"
        >
          {t.costsBudgets.linkPlHint} →
        </Link>
      </div>

      <section className={card}>
        <div className="mb-4 flex items-start gap-3 border-b border-neutral-100 pb-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-white"
            style={{ boxShadow: `0 0 0 1px ${GOLD}` }}
          >
            <Tags className="h-5 w-5 text-black" strokeWidth={2} />
          </span>
          <div>
            <h3 className="text-lg font-black tracking-tight text-black">{t.costsBudgets.categoriesTitle}</h3>
            <p className="mt-1 text-sm text-neutral-600">{t.costsBudgets.categoriesSub}</p>
          </div>
        </div>
        {categories.length > 0 && (
          <ul className="mb-6 space-y-2 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 text-sm">
            {categories.map((c) => (
              <li key={c.id} className="flex flex-wrap justify-between gap-2 font-medium text-neutral-800">
                <span>
                  <span className="font-black text-black">{c.slug}</span> · {c.label}
                </span>
                <span className="text-xs text-neutral-500">sort {c.sort_order}</span>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={onAddCategory} className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className={lbl} htmlFor="gam-cc-slug">
              {t.costsBudgets.slug}
            </label>
            <input id="gam-cc-slug" className={input} value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <div>
            <label className={lbl} htmlFor="gam-cc-label">
              {t.costsBudgets.label}
            </label>
            <input id="gam-cc-label" className={input} value={label} onChange={(e) => setLabel(e.target.value)} required />
          </div>
          <div>
            <label className={lbl} htmlFor="gam-cc-so">
              {t.costsBudgets.sortOrder}
            </label>
            <input
              id="gam-cc-so"
              type="number"
              className={input}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
          <div className="sm:col-span-3 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={catBusy === "saving"}
              className="rounded-xl bg-black px-5 py-2.5 text-sm font-black text-white disabled:opacity-60"
              style={{ boxShadow: `inset 0 0 0 1px ${GOLD}33` }}
            >
              {catBusy === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : t.costsBudgets.addCategory}
            </button>
            {catBusy === "ok" && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {t.costsBudgets.categoryAdded}
              </span>
            )}
            {catBusy === "err" && catErr && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-700">
                <AlertCircle className="h-4 w-4" /> {catErr}
              </span>
            )}
          </div>
        </form>
      </section>

      <section className={card}>
        <h3 className="text-lg font-black tracking-tight text-black">{t.costsBudgets.budgetsTitle}</h3>
        <p className="mt-1 text-sm text-neutral-600">{t.costsBudgets.budgetsSub}</p>
        <p className="mt-2 text-xs font-bold text-neutral-500">
          {t.costsBudgets.monthNote}: {monthLabel}
        </p>

        {!categories.length ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
            {t.costsBudgets.noCategories}
          </p>
        ) : (
          <form onSubmit={onSaveBudgets} className="mt-4 space-y-4">
            {categories.map((c) => (
              <div key={c.id}>
                <label className={lbl} htmlFor={`bud-${c.id}`}>
                  {c.label} ({c.slug})
                </label>
                <input
                  id={`bud-${c.id}`}
                  type="text"
                  inputMode="decimal"
                  className={input}
                  value={budgetInputs[c.id] ?? ""}
                  onChange={(e) => setBudgetInputs((prev) => ({ ...prev, [c.id]: e.target.value }))}
                  placeholder="0"
                  dir="ltr"
                />
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={budBusy === "saving"}
                className="rounded-xl bg-black px-5 py-2.5 text-sm font-black text-white disabled:opacity-60"
              >
                {budBusy === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : t.costsBudgets.saveBudgets}
              </button>
              {budBusy === "ok" && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> {t.costsBudgets.budgetsSaved}
                </span>
              )}
              {budBusy === "err" && budErr && (
                <span className="flex items-center gap-1 text-xs font-bold text-red-700">
                  <AlertCircle className="h-4 w-4" /> {budErr}
                </span>
              )}
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
