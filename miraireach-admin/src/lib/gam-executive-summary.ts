import type { GamDashboardPayload } from "@/lib/gam-dashboard-data";
import type { GamMessages } from "@/i18n/gam-messages";

function epsForNet(prior: number, cur: number): number {
  return Math.max(1, Math.abs(prior)) * 0.005 || Math.max(1, Math.abs(cur)) * 0.005;
}

/**
 * Client-side “AI-style” one-liner from dashboard payload (rule-based, no model call).
 */
export function buildExecutiveSummaryOneLiner(
  display: GamDashboardPayload | null,
  base: GamDashboardPayload | null,
  t: GamMessages,
  formatMoneyCompact: (n: number) => string,
  jpyNetMtd: number,
  jpyRevMtd: number,
  jpyCostMtd: number,
): string {
  if (!display) return t.executiveSummary.empty;

  const rev = display.mtdRevenueMinor;
  const cost = display.mtdExpenseMinor;
  const marginPct = rev > 0 ? Math.round(((rev - cost) / rev) * 100) : 0;

  let vsPrior = t.executiveSummary.vsPriorFlat;
  if (base) {
    const e = epsForNet(base.priorMtdNetMinor, display.mtdNetMinor);
    const diff = display.mtdNetMinor - base.priorMtdNetMinor;
    if (base.priorMtdNetMinor === 0 && display.mtdNetMinor === 0) vsPrior = t.executiveSummary.vsPriorFlat;
    else if (base.priorMtdNetMinor === 0 && display.mtdNetMinor > 0) vsPrior = t.executiveSummary.vsPriorUp;
    else if (base.priorMtdNetMinor === 0 && display.mtdNetMinor < 0) vsPrior = t.executiveSummary.vsPriorDown;
    else if (Math.abs(diff) < e) vsPrior = t.executiveSummary.vsPriorFlat;
    else if (diff > 0) vsPrior = t.executiveSummary.vsPriorUp;
    else vsPrior = t.executiveSummary.vsPriorDown;
  }

  let risk = "";
  if (display.costAlert) {
    risk =
      " " +
      t.executiveSummary.riskSuffix
        .replace("{label}", display.costAlert.label)
        .replace("{pct}", String(Math.round(display.costAlert.pct)));
  }

  const mkt =
    display.marketing.mtdSpendMinor > 0
      ? t.executiveSummary.marketingSuffix.replace(
          "{ratio}",
          display.marketing.revenueToSpendRatio != null
            ? display.marketing.revenueToSpendRatio.toFixed(1)
            : "—",
        )
      : "";

  const line = t.executiveSummary.line
    .replace("{net}", formatMoneyCompact(jpyNetMtd))
    .replace("{revenue}", formatMoneyCompact(jpyRevMtd))
    .replace("{cost}", formatMoneyCompact(jpyCostMtd))
    .replace("{margin}", String(marginPct))
    .replace("{projects}", String(display.activeProjectCount))
    .replace("{vsPrior}", vsPrior)
    .replace("{risk}", risk);

  return mkt ? `${line} ${mkt}` : line;
}
