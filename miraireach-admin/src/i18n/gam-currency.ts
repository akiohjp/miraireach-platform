import type { GamLocale } from "@/i18n/gam-messages";

/** Supported reporting currencies (ISO 4217). Amounts in the UI are converted from a JPY reference using illustrative FX. */
export type GamCurrencyCode = "JPY" | "USD" | "AED" | "EUR" | "SAR" | "GBP";

export const gamCurrencyCodes: GamCurrencyCode[] = ["JPY", "USD", "AED", "EUR", "SAR", "GBP"];

/** Minor units per ISO row seeded in `currencies` for GAM HQ. */
export const gamCurrencyMinorUnits: Record<GamCurrencyCode, number> = {
  JPY: 0,
  USD: 2,
  AED: 2,
  EUR: 2,
  SAR: 2,
  GBP: 2,
};

export function isGamCurrencyCode(code: string): code is GamCurrencyCode {
  return gamCurrencyCodes.includes(code as GamCurrencyCode);
}

export function minorUnitsForCurrencyCode(code: string): number {
  const u = code.trim().toUpperCase();
  if (isGamCurrencyCode(u)) return gamCurrencyMinorUnits[u];
  return 2;
}

export function normalizeGamCurrencyCode(code: string): GamCurrencyCode | null {
  const u = code.trim().toUpperCase();
  return isGamCurrencyCode(u) ? u : null;
}

const STORAGE_KEY = "gam-currency";

/** JPY per one unit of foreign currency (illustrative demo rates only). */
const JPY_PER_UNIT: Record<GamCurrencyCode, number> = {
  JPY: 1,
  USD: 150,
  AED: 41,
  EUR: 165,
  SAR: 40,
  GBP: 190,
};

/**
 * Book an expense line: negative minors in tx currency + functional snapshot (illustrative JPY bridge, same as dashboard demo FX).
 */
export function ledgerExpenseAmountsFromTxMajor(
  major: number,
  txCode: GamCurrencyCode,
  functionalCode: GamCurrencyCode,
): { amountMinor: number; amountFunctionalMinor: number } {
  const txMu = gamCurrencyMinorUnits[txCode];
  const fnMu = gamCurrencyMinorUnits[functionalCode];
  const amountMinor = -majorUnitsToMinor(major, txMu);
  const jpyRef = major * JPY_PER_UNIT[txCode];
  const functionalMajor = jpyRef / JPY_PER_UNIT[functionalCode];
  const amountFunctionalMinor = -majorUnitsToMinor(functionalMajor, fnMu);
  return { amountMinor, amountFunctionalMinor };
}

/** Book a revenue line: positive minors in tx currency + functional snapshot (illustrative JPY bridge). */
export function ledgerRevenueAmountsFromTxMajor(
  major: number,
  txCode: GamCurrencyCode,
  functionalCode: GamCurrencyCode,
): { amountMinor: number; amountFunctionalMinor: number } {
  const txMu = gamCurrencyMinorUnits[txCode];
  const fnMu = gamCurrencyMinorUnits[functionalCode];
  const amountMinor = majorUnitsToMinor(major, txMu);
  const jpyRef = major * JPY_PER_UNIT[txCode];
  const functionalMajor = jpyRef / JPY_PER_UNIT[functionalCode];
  const amountFunctionalMinor = majorUnitsToMinor(functionalMajor, fnMu);
  return { amountMinor, amountFunctionalMinor };
}

export function getStoredCurrency(): GamCurrencyCode | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && gamCurrencyCodes.includes(raw as GamCurrencyCode)) return raw as GamCurrencyCode;
  } catch {
    /* ignore */
  }
  return null;
}

export function storeCurrency(code: GamCurrencyCode): void {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* ignore */
  }
}

export function resolveNumberFormatLocale(uiLocale: GamLocale): string {
  if (uiLocale === "ja") return "ja-JP";
  if (uiLocale === "ar") return "ar-AE";
  return "en-US";
}

/** Convert a typed major amount (e.g. 150.25 USD) into minor units (cents). */
export function majorUnitsToMinor(major: number, minorUnits: number): number {
  if (!Number.isFinite(major)) return 0;
  const f = Math.pow(10, minorUnits);
  return Math.round(major * f);
}

/** Scale ledger `amount_functional_minor` into major units (e.g. yen or dollars). */
export function functionalMinorToMajor(minor: number, minorUnits: number): number {
  const d = Math.pow(10, minorUnits);
  return minor / d;
}

/**
 * Convert functional-currency minor units into the app’s JPY *reference* amount used by `formatGamCurrency`.
 * Uses the same illustrative JPY-per-unit table as display FX (demo only).
 */
export function functionalMinorToJpyReference(minor: number, functionalCode: string, minorUnits: number): number {
  const code: GamCurrencyCode = isGamCurrencyCode(functionalCode) ? functionalCode : "JPY";
  const major = functionalMinorToMajor(minor, minorUnits);
  if (code === "JPY") return Math.round(major);
  const mult = JPY_PER_UNIT[code];
  return Math.round(major * mult);
}

/** Convert an amount expressed in reference JPY into the selected currency. */
export function convertFromJpy(amountJpy: number, currency: GamCurrencyCode): number {
  if (currency === "JPY") return Math.round(amountJpy);
  const divisor = JPY_PER_UNIT[currency];
  const v = amountJpy / divisor;
  return Math.round(v * 100) / 100;
}

export function formatGamCurrency(
  amountJpy: number,
  currency: GamCurrencyCode,
  uiLocale: GamLocale,
  options?: { compact?: boolean },
): string {
  const n = convertFromJpy(amountJpy, currency);
  const loc = resolveNumberFormatLocale(uiLocale);
  if (options?.compact) {
    return new Intl.NumberFormat(loc, {
      style: "currency",
      currency,
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: currency === "JPY" ? 1 : 2,
    }).format(n);
  }
  return new Intl.NumberFormat(loc, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(n);
}

export function currencySelectLabel(code: GamCurrencyCode, uiLocale: GamLocale): string {
  const loc = resolveNumberFormatLocale(uiLocale);
  try {
    const name = new Intl.DisplayNames([loc], { type: "currency" }).of(code);
    if (name) return `${code} — ${name}`;
  } catch {
    /* ignore */
  }
  return code;
}
