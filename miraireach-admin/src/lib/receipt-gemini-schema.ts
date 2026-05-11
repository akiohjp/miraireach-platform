import type { GamCurrencyCode } from "@/i18n/gam-currency";

export type ReceiptGeminiParse = {
  transactionDate: string | null;
  vendorName: string | null;
  totalAmount: number | null;
  currencyCode: GamCurrencyCode | null;
  taxAmount: number | null;
};

const ALLOWED: GamCurrencyCode[] = ["AED", "USD", "JPY", "EUR", "SAR", "GBP"];

export function parseReceiptGeminiJsonText(raw: string): ReceiptGeminiParse {
  const trimmed = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  let data: unknown;
  try {
    data = JSON.parse(trimmed);
  } catch {
    return emptyParse();
  }
  if (!data || typeof data !== "object") return emptyParse();
  const o = data as Record<string, unknown>;

  const transactionDate =
    typeof o.transactionDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.transactionDate.trim())
      ? o.transactionDate.trim()
      : null;

  const vendorName =
    typeof o.vendorName === "string" && o.vendorName.trim().length > 0 ? o.vendorName.trim() : null;

  let totalAmount: number | null = null;
  if (typeof o.totalAmount === "number" && Number.isFinite(o.totalAmount)) {
    totalAmount = o.totalAmount > 0 ? o.totalAmount : null;
  } else if (typeof o.totalAmount === "string") {
    const n = Number.parseFloat(o.totalAmount.replace(/,/g, ""));
    if (Number.isFinite(n) && n > 0) totalAmount = n;
  }

  let taxAmount: number | null = null;
  if (typeof o.taxAmount === "number" && Number.isFinite(o.taxAmount) && o.taxAmount >= 0) {
    taxAmount = o.taxAmount;
  } else if (typeof o.taxAmount === "string") {
    const n = Number.parseFloat(o.taxAmount.replace(/,/g, ""));
    if (Number.isFinite(n) && n >= 0) taxAmount = n;
  }

  let currencyCode: GamCurrencyCode | null = null;
  if (typeof o.currencyCode === "string") {
    const u = o.currencyCode.trim().toUpperCase();
    if (ALLOWED.includes(u as GamCurrencyCode)) currencyCode = u as GamCurrencyCode;
  }

  return { transactionDate, vendorName, totalAmount, taxAmount, currencyCode };
}

function emptyParse(): ReceiptGeminiParse {
  return {
    transactionDate: null,
    vendorName: null,
    totalAmount: null,
    currencyCode: null,
    taxAmount: null,
  };
}
