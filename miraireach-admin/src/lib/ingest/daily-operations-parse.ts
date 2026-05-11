import {
  branchKeyFromName,
  factsExternalRef,
  ledgerExternalRef,
} from "@/lib/ingest/daily-operations-constants";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export type DailyOperationsMoneyMinor = bigint;

export interface DailyOperationsParsedRow {
  sheetRow: number;
  opsDate: string;
  branchName: string;
  bKey: string;
  /** Functional currency, minor units; null = omit / delete ledger line */
  totalSalesMinor: DailyOperationsMoneyMinor | null;
  cogsMinor: DailyOperationsMoneyMinor | null;
  wasteMinor: DailyOperationsMoneyMinor | null;
  metaAdSpendMinor: DailyOperationsMoneyMinor | null;
  /** Strict counts — bigint for BI / ROI joins */
  totalCustomers: bigint | null;
  metaImpressions: bigint | null;
  gbpViews: bigint | null;
  gbpConversions: bigint | null;
}

function cellStr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  if (typeof v === "boolean") return v ? "1" : "0";
  return String(v).trim();
}

function parseIsoDate(raw: string, col: string): string {
  const s = raw.trim();
  if (!s) throw new Error(`${col}: date required`);
  if (!ISO_DATE.test(s)) throw new Error(`${col}: expected YYYY-MM-DD`);
  const [y, mo, d] = s.split("-").map(Number);
  const dt = new Date(y!, mo! - 1, d!);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo! - 1 || dt.getDate() !== d) {
    throw new Error(`${col}: invalid calendar date`);
  }
  return s;
}

/** Non-negative integer counts only (no decimals). */
function parseCount(raw: string, col: string): bigint | null {
  if (!raw) return null;
  if (!/^\d+$/.test(raw)) throw new Error(`${col}: expected whole number`);
  return BigInt(raw);
}

/**
 * Major currency units from sheet → minor units (ledger bigint).
 * JPY minor_units=0 → integer yen; USD minor_units=2 → cents.
 */
export function majorToMinorUnits(major: number, minorUnits: number): bigint {
  if (!Number.isFinite(major) || major < 0) throw new Error("amount must be a finite non-negative number");
  const scale = 10 ** minorUnits;
  const rounded = Math.round(major * scale + Number.EPSILON);
  return BigInt(rounded);
}

function parseMoneyMajorOptional(raw: string, col: string, minorUnits: number): bigint | null {
  if (!raw) return null;
  const n = Number(raw.replace(/[,，]/g, ""));
  if (!Number.isFinite(n)) throw new Error(`${col}: invalid number`);
  if (n < 0) throw new Error(`${col}: must be >= 0`);
  if (n === 0) return null;
  return majorToMinorUnits(n, minorUnits);
}

export function isRowEmpty(row: unknown[]): boolean {
  return row.every((c) => {
    if (c == null || c === "") return true;
    if (typeof c === "string" && c.trim() === "") return true;
    return false;
  });
}

export function parseDailyOperationsRow(
  row: unknown[],
  sheetRow: number,
  minorUnits: number,
): DailyOperationsParsedRow {
  const a = cellStr(row[0]);
  const b = cellStr(row[1]);

  const opsDate = parseIsoDate(a, "Date");
  const branchName = b;
  if (!branchName) throw new Error("Branch_Name required");

  const bKey = branchKeyFromName(branchName);

  return {
    sheetRow,
    opsDate,
    branchName,
    bKey,
    totalSalesMinor: parseMoneyMajorOptional(cellStr(row[2]), "Total_Sales", minorUnits),
    totalCustomers: parseCount(cellStr(row[3]), "Total_Customers"),
    cogsMinor: parseMoneyMajorOptional(cellStr(row[4]), "COGS_Total", minorUnits),
    wasteMinor: parseMoneyMajorOptional(cellStr(row[5]), "Waste_Loss", minorUnits),
    metaAdSpendMinor: parseMoneyMajorOptional(cellStr(row[6]), "Meta_Ad_Spend", minorUnits),
    metaImpressions: parseCount(cellStr(row[7]), "Meta_Impressions"),
    gbpViews: parseCount(cellStr(row[8]), "GBP_Views"),
    gbpConversions: parseCount(cellStr(row[9]), "GBP_Conversions"),
  };
}

export function ledgerRefsForRow(parsed: DailyOperationsParsedRow): {
  sales: string;
  cogs: string;
  waste: string;
  metaAds: string;
  facts: string;
} {
  const { opsDate, bKey } = parsed;
  return {
    sales: ledgerExternalRef(opsDate, bKey, "sales"),
    cogs: ledgerExternalRef(opsDate, bKey, "cogs"),
    waste: ledgerExternalRef(opsDate, bKey, "waste"),
    metaAds: ledgerExternalRef(opsDate, bKey, "meta_ads"),
    facts: factsExternalRef(opsDate, bKey),
  };
}
