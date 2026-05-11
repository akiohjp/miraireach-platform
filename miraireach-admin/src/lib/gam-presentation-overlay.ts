import type { GamDashboardPayload } from "@/lib/gam-dashboard-data";

export type PresentationOverlayLine = {
  transactionDate: string;
  entryType: "revenue" | "expense";
  /** Revenue: positive functional minor. Expense: negative functional minor. */
  amountFunctionalMinor: number;
};

const STORAGE_KEY = "gam_presentation_overlay_v1";

function toISODateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function readPresentationOverlay(): PresentationOverlayLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as unknown;
    if (!Array.isArray(p)) return [];
    return p.filter(
      (row): row is PresentationOverlayLine =>
        row &&
        typeof row === "object" &&
        typeof (row as PresentationOverlayLine).transactionDate === "string" &&
        ((row as PresentationOverlayLine).entryType === "revenue" ||
          (row as PresentationOverlayLine).entryType === "expense") &&
        typeof (row as PresentationOverlayLine).amountFunctionalMinor === "number",
    );
  } catch {
    return [];
  }
}

export function appendPresentationOverlayLine(line: PresentationOverlayLine): void {
  if (typeof window === "undefined") return;
  const cur = readPresentationOverlay();
  cur.push(line);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cur));
  window.dispatchEvent(new Event("gam-presentation-overlay-changed"));
}

/**
 * Client-only P&L adjustments when ledger insert is blocked by RLS (e.g. before organization_members is linked).
 */
export function mergePresentationOverlayIntoPayload(
  payload: GamDashboardPayload | null,
  lines: PresentationOverlayLine[],
  now: Date = new Date(),
): GamDashboardPayload | null {
  if (!payload || lines.length === 0) return payload;

  const todayStr = toISODateLocal(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthStartStr = toISODateLocal(monthStart);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const monthEndStr = toISODateLocal(monthEnd);

  const yDate = new Date(now);
  yDate.setDate(yDate.getDate() - 1);
  const yesterdayStr = toISODateLocal(yDate);

  const out: GamDashboardPayload = structuredClone(payload);
  out.flags = { ...out.flags, hasLedgerRows: true };

  for (const l of lines) {
    const { transactionDate: td, entryType: typ, amountFunctionalMinor: am } = l;
    if (td >= monthStartStr && td <= monthEndStr) {
      out.mtdNetMinor += am;
      if (typ === "revenue") out.mtdRevenueMinor += am;
      if (typ === "expense") out.mtdExpenseMinor += Math.abs(am);
    }
    if (typ === "revenue") {
      if (td === todayStr) out.todayRevenueMinor += am;
      if (td === yesterdayStr) out.yesterdayRevenueMinor += am;
    }

    const pt = out.pl7.find((p) => p.date === td);
    if (pt) {
      if (typ === "revenue") {
        pt.revenueMinor += am;
        pt.netMinor += am;
      } else {
        pt.costMinor += Math.abs(am);
        pt.netMinor += am;
      }
    }

    const ym = td.slice(0, 7);
    const pm = out.pl6m.find((m) => m.month === ym);
    if (pm) {
      if (typ === "revenue") {
        pm.revenueMinor += am;
        pm.netMinor += am;
      } else {
        pm.costMinor += Math.abs(am);
        pm.netMinor += am;
      }
    }
  }

  const dom = now.getDate();
  const dim = monthEnd.getDate();
  out.forecastMonthEndNetMinor =
    dom > 0 ? Math.round((out.mtdNetMinor / dom) * dim) : out.mtdNetMinor;

  return out;
}
