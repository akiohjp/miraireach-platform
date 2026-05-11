import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { GamCurrencyCode } from "@/i18n/gam-currency";
import { isGamCurrencyCode } from "@/i18n/gam-currency";

export type OrgResolution =
  | {
      ok: true;
      organizationId: string;
      /** true when NEXT_PUBLIC_GAM_ORGANIZATION_ID is set and user is a member of that org */
      envPinMatched: boolean;
      /** Session has no membership row but app uses env org (limited DB access until `npm run link:org-member`). */
      weakAccess?: boolean;
    }
  | { ok: false; reason: "no_session" | "no_membership" | "invalid_env" };

function toISODateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Empty charts / KPIs when org row is not readable (e.g. before organization_members is linked). */
export function buildEmptyDashboardPayload(): GamDashboardPayload {
  const now = new Date();
  const pl7: PlDayPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    pl7.push({ date: toISODateLocal(day), revenueMinor: 0, costMinor: 0, netMinor: 0 });
  }
  const pl6m: PlMonthPoint[] = [];
  for (let m = 5; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    pl6m.push({ month: key, revenueMinor: 0, costMinor: 0, netMinor: 0 });
  }
  return {
    functionalCurrency: "JPY",
    functionalMinorUnits: 0,
    todayRevenueMinor: 0,
    yesterdayRevenueMinor: 0,
    mtdNetMinor: 0,
    mtdRevenueMinor: 0,
    mtdExpenseMinor: 0,
    priorMtdNetMinor: 0,
    forecastMonthEndNetMinor: 0,
    activeProjectCount: 0,
    priorFullMonthNetMinor: 0,
    priorFullMonthRevenueMinor: 0,
    priorFullMonthExpenseMinor: 0,
    collectionsRatePct: null,
    costBurnPct: null,
    pl7,
    pl6m,
    costRows: [],
    costAlert: null,
    cashBands: null,
    activity: [],
    projects: [],
    /** Allow 7-day / 6-month charts to render at zero so the shell is presentation-ready. */
    flags: { hasLedgerRows: true, hasBudget: false, hasAnyCostLine: false },
    marketing: {
      mtdSpendMinor: 0,
      priorMtdSpendMinor: 0,
      spend6m: pl6m.map((p) => ({ month: p.month, spendMinor: 0 })),
      revenueToSpendRatio: null,
    },
  };
}

/** Human-readable PostgREST / Postgres errors for UI and logs. */
export function formatSupabaseError(e: unknown): string {
  if (e && typeof e === "object") {
    const o = e as { message?: string; details?: string; hint?: string; code?: string };
    const parts = [o.message, o.details, o.hint, o.code].filter(
      (x) => x != null && String(x).trim() !== "",
    );
    if (parts.length) return parts.join(" · ");
  }
  if (e instanceof Error) return e.message;
  return "Unknown error";
}

function num(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/**
 * Resolve org for dashboard: env id (if member) else first membership. Requires an authenticated session for RLS.
 * Pass `preloadedSession` when you already called `getSession()` to avoid overlapping auth internal locks (e.g. React Strict Mode double mount).
 */
export async function resolveGamOrganizationId(
  supabase: SupabaseClient,
  preloadedSession?: Session | null,
): Promise<OrgResolution> {
  const envRaw = process.env.NEXT_PUBLIC_GAM_ORGANIZATION_ID?.trim();
  if (envRaw && !/^[0-9a-f-]{36}$/i.test(envRaw)) {
    return { ok: false, reason: "invalid_env" };
  }

  const session =
    preloadedSession !== undefined
      ? preloadedSession
      : (await supabase.auth.getSession()).data.session;
  if (!session?.user) {
    return { ok: false, reason: "no_session" };
  }

  const uid = session.user.id;

  if (envRaw) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("organization_id", envRaw)
      .eq("user_id", uid)
      .maybeSingle();
    if (member?.organization_id) {
      return { ok: true, organizationId: member.organization_id, envPinMatched: true };
    }
  }

  const { data: rows, error } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", uid)
    .order("organization_id", { ascending: true })
    .limit(1);

  if (error || !rows?.length) {
    /** When env org UUID is set, allow resolving it without a membership row unless explicitly disabled (demo / prez fallback). */
    const allowWeak =
      typeof process !== "undefined" &&
      !!envRaw &&
      /^[0-9a-f-]{36}$/i.test(envRaw) &&
      process.env.NEXT_PUBLIC_GAM_USE_ENV_ORG_WITHOUT_MEMBER !== "false";
    if (allowWeak && envRaw && /^[0-9a-f-]{36}$/i.test(envRaw)) {
      return {
        ok: true,
        organizationId: envRaw,
        envPinMatched: false,
        weakAccess: true,
      };
    }
    return { ok: false, reason: "no_membership" };
  }
  return { ok: true, organizationId: rows[0].organization_id, envPinMatched: false };
}

export type GamOrgMeta = {
  functionalCurrency: GamCurrencyCode;
  functionalMinorUnits: number;
};

export async function fetchGamOrganizationMeta(
  supabase: SupabaseClient,
  organizationId: string,
): Promise<GamOrgMeta | null> {
  const { data: org, error: oErr } = await supabase
    .from("organizations")
    .select("functional_currency")
    .eq("id", organizationId)
    .maybeSingle();
  if (oErr || !org) return null;
  const fcRaw = String(org.functional_currency ?? "JPY").trim();
  const functionalCurrency: GamCurrencyCode = isGamCurrencyCode(fcRaw) ? fcRaw : "JPY";
  const { data: cur } = await supabase
    .from("currencies")
    .select("minor_units")
    .eq("code", functionalCurrency)
    .maybeSingle();
  const u = num(cur?.minor_units);
  const functionalMinorUnits = u === 0 || u === 2 || u === 3 ? u : 0;
  return { functionalCurrency, functionalMinorUnits };
}

export type PlDayPoint = {
  date: string;
  revenueMinor: number;
  costMinor: number;
  netMinor: number;
};

export type PlMonthPoint = {
  month: string;
  revenueMinor: number;
  costMinor: number;
  netMinor: number;
};

export type CostRow = {
  slug: string;
  label: string;
  budgetMinor: number;
  actualMinor: number;
  utilizationPct: number | null;
  overBudget: boolean;
};

export type CostAlert = { severity: "over" | "near"; slug: string; label: string; pct: number };

export type GamDashboardPayload = {
  functionalCurrency: GamCurrencyCode;
  functionalMinorUnits: number;
  todayRevenueMinor: number;
  yesterdayRevenueMinor: number;
  mtdNetMinor: number;
  mtdRevenueMinor: number;
  mtdExpenseMinor: number;
  priorMtdNetMinor: number;
  /** Simple linear run-rate: MTD net extrapolated to month-end (functional minor). */
  forecastMonthEndNetMinor: number;
  activeProjectCount: number;
  priorFullMonthNetMinor: number;
  priorFullMonthRevenueMinor: number;
  priorFullMonthExpenseMinor: number;
  collectionsRatePct: number | null;
  costBurnPct: number | null;
  pl7: PlDayPoint[];
  pl6m: PlMonthPoint[];
  costRows: CostRow[];
  costAlert: CostAlert | null;
  cashBands: { low: number; mid: number; high: number } | null;
  activity: { createdAt: string; body: string }[];
  projects: { code: string; name: string; status: string }[];
  flags: {
    hasLedgerRows: boolean;
    hasBudget: boolean;
    hasAnyCostLine: boolean;
  };
  /** BizDev + Ads categories (ledger-derived) for marketing effectiveness. */
  marketing: {
    mtdSpendMinor: number;
    priorMtdSpendMinor: number;
    spend6m: { month: string; spendMinor: number }[];
    revenueToSpendRatio: number | null;
  };
};

function periodsOverlapMonth(
  periodStart: string,
  periodEnd: string,
  monthStart: string,
  monthEnd: string,
): boolean {
  return periodStart <= monthEnd && periodEnd >= monthStart;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))));
  return sorted[idx]!;
}

/** Format `created_at` for activity list (local wall time). */
export function formatActivityClock(createdAt: string, localeCode: string): string {
  const dt = new Date(createdAt);
  if (Number.isNaN(dt.getTime())) return "—";
  return new Intl.DateTimeFormat(localeCode, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dt);
}

export async function fetchGamDashboardData(
  supabase: SupabaseClient,
  organizationId: string,
): Promise<{ data: GamDashboardPayload | null; error: string | null }> {
  try {
    const now = new Date();
    const todayStr = toISODateLocal(now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStartStr = toISODateLocal(monthStart);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const monthEndStr = toISODateLocal(monthEnd);

    const priorMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const priorEndDay = Math.min(now.getDate(), priorMonthEnd.getDate());
    const priorSegmentEnd = new Date(now.getFullYear(), now.getMonth() - 1, priorEndDay);
    const priorMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const priorMonthStartStr = toISODateLocal(priorMonthStart);
    const priorSegmentEndStr = toISODateLocal(priorSegmentEnd);

    const ledgerSince = new Date(now);
    ledgerSince.setDate(ledgerSince.getDate() - 200);
    const ledgerSinceStr = toISODateLocal(ledgerSince);

    const [orgRes, catRes, budgetRes, ledgerRes, projectRes] = await Promise.all([
      supabase
        .from("organizations")
        .select("id, functional_currency")
        .eq("id", organizationId)
        .maybeSingle(),
      supabase
        .from("cost_categories")
        .select("id, slug, label, sort_order")
        .eq("organization_id", organizationId)
        .order("sort_order", { ascending: true }),
      supabase
        .from("budget_periods")
        .select("id, project_id, cost_category_id, period_start, period_end, budget_amount_functional_minor")
        .eq("organization_id", organizationId),
      supabase
        .from("ledger_entries")
        .select(
          "transaction_date, entry_type, amount_functional_minor, memo, created_at, cost_category_id",
        )
        .eq("organization_id", organizationId)
        .gte("transaction_date", ledgerSinceStr)
        .order("transaction_date", { ascending: true })
        .limit(20000),
      supabase
        .from("projects")
        .select("code, name, status")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false })
        .limit(48),
    ]);

    if (orgRes.error) throw orgRes.error;
    if (catRes.error) throw catRes.error;
    if (budgetRes.error) throw budgetRes.error;
    if (ledgerRes.error) throw ledgerRes.error;
    if (projectRes.error) throw projectRes.error;

    if (!orgRes.data) {
      return { data: buildEmptyDashboardPayload(), error: null };
    }

    const fcRaw = orgRes.data.functional_currency?.trim() ?? "JPY";
    const functionalCurrency: GamCurrencyCode = isGamCurrencyCode(fcRaw) ? fcRaw : "JPY";

    const curRes = await supabase
      .from("currencies")
      .select("minor_units")
      .eq("code", functionalCurrency)
      .maybeSingle();

    const functionalMinorUnits = num(curRes.data?.minor_units);
    const minorUnitsSafe = functionalMinorUnits === 0 || functionalMinorUnits === 2 || functionalMinorUnits === 3
      ? functionalMinorUnits
      : 0;

    const categories = catRes.data ?? [];
    const categoryById = new Map(categories.map((c) => [c.id, c] as const));
    const budgets = budgetRes.data ?? [];
    const ledgerRows = ledgerRes.data ?? [];

    const flags = {
      hasLedgerRows: ledgerRows.length > 0,
      hasBudget: budgets.length > 0,
      hasAnyCostLine: categories.length > 0,
    };

    /** MTD / today sums */
    let todayRevenueMinor = 0;
    let yesterdayRevenueMinor = 0;
    const yDate = new Date(now);
    yDate.setDate(yDate.getDate() - 1);
    const yesterdayStr = toISODateLocal(yDate);

    let mtdNetMinor = 0;
    let mtdRevenueMinor = 0;
    let mtdExpenseMinor = 0;
    let priorMtdNetMinor = 0;

    const priorFullMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const priorFullMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const priorFullMonthStartStr = toISODateLocal(priorFullMonthStart);
    const priorFullMonthEndStr = toISODateLocal(priorFullMonthEnd);

    let priorFullMonthNetMinor = 0;
    let priorFullMonthRevenueMinor = 0;
    let priorFullMonthExpenseMinor = 0;

    for (const row of ledgerRows) {
      const td = row.transaction_date as string;
      const typ = row.entry_type as string;
      const am = num(row.amount_functional_minor);

      if (td >= monthStartStr && td <= todayStr) {
        mtdNetMinor += am;
        if (typ === "revenue") mtdRevenueMinor += am;
        if (typ === "expense") mtdExpenseMinor += Math.abs(am);
      }
      if (td >= priorMonthStartStr && td <= priorSegmentEndStr) {
        priorMtdNetMinor += am;
      }
      if (td >= priorFullMonthStartStr && td <= priorFullMonthEndStr) {
        priorFullMonthNetMinor += am;
        if (typ === "revenue") priorFullMonthRevenueMinor += am;
        if (typ === "expense") priorFullMonthExpenseMinor += Math.abs(am);
      }
      if (typ === "revenue") {
        if (td === todayStr) todayRevenueMinor += am;
        if (td === yesterdayStr) yesterdayRevenueMinor += am;
      }
    }

    const dom = now.getDate();
    const dim = monthEnd.getDate();
    const forecastMonthEndNetMinor =
      dom > 0 ? Math.round((mtdNetMinor / dom) * dim) : mtdNetMinor;

    const activeProjectCount = (projectRes.data ?? []).filter((p) => p.status === "active").length;

    /* ── Last 7 calendar days P&L ── */
    const pl7: PlDayPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const dateStr = toISODateLocal(day);
      let rev = 0;
      let costAbs = 0;
      let net = 0;
      for (const row of ledgerRows) {
        if ((row.transaction_date as string) !== dateStr) continue;
        const am = num(row.amount_functional_minor);
        const typ = row.entry_type as string;
        net += am;
        if (typ === "revenue") rev += am;
        if (typ === "expense") costAbs += Math.abs(am);
      }
      pl7.push({
        date: dateStr,
        revenueMinor: rev,
        costMinor: costAbs,
        netMinor: net,
      });
    }

    /* ── Last 6 calendar months (functional) ── */
    const pl6m: PlMonthPoint[] = [];
    const idxByMonth = new Map<string, number>();
    for (let m = 5; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      pl6m.push({ month: key, revenueMinor: 0, costMinor: 0, netMinor: 0 });
      idxByMonth.set(key, pl6m.length - 1);
    }
    for (const row of ledgerRows) {
      const td = row.transaction_date as string;
      const ym = td.slice(0, 7);
      const i = idxByMonth.get(ym);
      if (i === undefined) continue;
      const am = num(row.amount_functional_minor);
      const typ = row.entry_type as string;
      const p = pl6m[i]!;
      p.netMinor += am;
      if (typ === "revenue") p.revenueMinor += am;
      if (typ === "expense") p.costMinor += Math.abs(am);
    }

    const marketingSlugs = new Set(["ads", "bizdev"]);
    const marketingCatIds = new Set(
      categories
        .filter((c) => marketingSlugs.has(String(c.slug ?? "")))
        .map((c) => c.id as string),
    );
    const spend6m = pl6m.map((p) => ({ month: p.month, spendMinor: 0 }));
    const spendIdx = new Map(spend6m.map((x, i) => [x.month, i] as const));
    let marketingMtd = 0;
    let marketingPriorMtd = 0;
    for (const row of ledgerRows) {
      if ((row.entry_type as string) !== "expense") continue;
      const cid = row.cost_category_id as string | null;
      if (!cid || !marketingCatIds.has(cid)) continue;
      const am = Math.abs(num(row.amount_functional_minor));
      const td = row.transaction_date as string;
      const ym = td.slice(0, 7);
      const si = spendIdx.get(ym);
      if (si !== undefined) spend6m[si]!.spendMinor += am;
      if (td >= monthStartStr && td <= todayStr) marketingMtd += am;
      if (td >= priorMonthStartStr && td <= priorSegmentEndStr) marketingPriorMtd += am;
    }
    const revenueToSpendRatio =
      marketingMtd > 0 && mtdRevenueMinor > 0 ? mtdRevenueMinor / marketingMtd : null;

    /* ── Cost rows: org-level budgets (project_id null) overlapping this month ── */
    const budgetByCategory = new Map<string, number>();
    for (const b of budgets) {
      if (b.project_id != null) continue;
      const cid = b.cost_category_id as string | null;
      if (!cid) continue;
      const ps = b.period_start as string;
      const pe = b.period_end as string;
      if (!periodsOverlapMonth(ps, pe, monthStartStr, monthEndStr)) continue;
      const prev = budgetByCategory.get(cid) ?? 0;
      budgetByCategory.set(cid, prev + num(b.budget_amount_functional_minor));
    }

    const actualByCategory = new Map<string, number>();
    for (const row of ledgerRows) {
      if ((row.entry_type as string) !== "expense") continue;
      const td = row.transaction_date as string;
      if (td < monthStartStr || td > todayStr) continue;
      const cid = row.cost_category_id as string | null;
      if (!cid) continue;
      const am = num(row.amount_functional_minor);
      const prev = actualByCategory.get(cid) ?? 0;
      actualByCategory.set(cid, prev + Math.abs(am));
    }

    const costRows: CostRow[] = [];
    const seen = new Set<string>();

    for (const c of categories) {
      const bud = budgetByCategory.get(c.id) ?? 0;
      const act = actualByCategory.get(c.id) ?? 0;
      if (bud <= 0 && act <= 0) continue;
      seen.add(c.id);
      const utilizationPct = bud > 0 ? (act / bud) * 100 : null;
      const overBudget = bud > 0 && act > bud;
      costRows.push({
        slug: c.slug ?? "",
        label: c.label ?? c.slug ?? "",
        budgetMinor: bud,
        actualMinor: act,
        utilizationPct,
        overBudget,
      });
    }

    for (const [cid, act] of actualByCategory) {
      if (seen.has(cid) || act <= 0) continue;
      const c = categoryById.get(cid);
      costRows.push({
        slug: c?.slug ?? "uncategorized",
        label: c?.label ?? "Uncategorized",
        budgetMinor: 0,
        actualMinor: act,
        utilizationPct: null,
        overBudget: false,
      });
    }

    let totalBudgetMinor = 0;
    for (const v of budgetByCategory.values()) totalBudgetMinor += v;
    let totalActualMinor = 0;
    for (const row of ledgerRows) {
      if ((row.entry_type as string) !== "expense") continue;
      const td = row.transaction_date as string;
      if (td < monthStartStr || td > todayStr) continue;
      totalActualMinor += Math.abs(num(row.amount_functional_minor));
    }

    const costBurnPct =
      totalBudgetMinor > 0 ? Math.min(999, (totalActualMinor / totalBudgetMinor) * 100) : null;

    let costAlert: CostAlert | null = null;
    for (const row of costRows) {
      const pct = row.utilizationPct;
      if (pct == null) continue;
      if (pct > 100 && (!costAlert || costAlert.severity !== "over")) {
        costAlert = { severity: "over", slug: row.slug, label: row.label, pct };
      } else if (pct >= 90 && pct <= 100 && !costAlert) {
        costAlert = { severity: "near", slug: row.slug, label: row.label, pct };
      }
    }

    /* ── Cash band: last 14 days daily net ── */
    const dailyNet = new Map<string, number>();
    for (let i = 13; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      dailyNet.set(toISODateLocal(day), 0);
    }
    for (const row of ledgerRows) {
      const td = row.transaction_date as string;
      if (!dailyNet.has(td)) continue;
      dailyNet.set(td, (dailyNet.get(td) ?? 0) + num(row.amount_functional_minor));
    }
    const series = [...dailyNet.values()].sort((a, b) => a - b);
    const cashBands =
      series.length > 0
        ? {
            low: percentile(series, 0.25),
            mid: percentile(series, 0.5),
            high: percentile(series, 0.75),
          }
        : null;

    /* ── Activity: latest ledger rows by created_at ── */
    const { data: activityRows, error: actErr } = await supabase
      .from("ledger_entries")
      .select("memo, entry_type, amount_functional_minor, created_at, transaction_date")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(15);

    if (actErr) throw actErr;

    const activity = (activityRows ?? []).map((r) => {
      const memo = (r.memo as string)?.trim();
      const typ = r.entry_type as string;
      const body =
        memo ||
        `${typ} · ${functionalCurrency} ${num(r.amount_functional_minor)} (${r.transaction_date})`;
      return {
        createdAt: r.created_at as string,
        body,
      };
    });

    const projects = (projectRes.data ?? []).map((p) => ({
      code: p.code ?? "",
      name: p.name ?? "",
      status: p.status ?? "",
    }));

    const data: GamDashboardPayload = {
      functionalCurrency,
      functionalMinorUnits: minorUnitsSafe,
      todayRevenueMinor,
      yesterdayRevenueMinor,
      mtdNetMinor,
      mtdRevenueMinor,
      mtdExpenseMinor,
      priorMtdNetMinor,
      forecastMonthEndNetMinor,
      activeProjectCount,
      priorFullMonthNetMinor,
      priorFullMonthRevenueMinor,
      priorFullMonthExpenseMinor,
      collectionsRatePct: null,
      costBurnPct,
      pl7,
      pl6m,
      costRows,
      costAlert,
      cashBands,
      activity,
      projects,
      flags,
      marketing: {
        mtdSpendMinor: marketingMtd,
        priorMtdSpendMinor: marketingPriorMtd,
        spend6m,
        revenueToSpendRatio,
      },
    };

    return { data, error: null };
  } catch (e) {
    return { data: null, error: formatSupabaseError(e) };
  }
}
