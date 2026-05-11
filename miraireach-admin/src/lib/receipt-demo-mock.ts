import type { ReceiptGeminiParse } from "@/lib/receipt-gemini-schema";

/** Dubai-style mixed EN/AR receipt mock for presentations (no Gemini call). */
export function getPresentationReceiptMock(isoDate: string): ReceiptGeminiParse {
  return {
    transactionDate: isoDate,
    vendorName: "Carrefour City — Dubai Mall / كارفور",
    totalAmount: 47.25,
    currencyCode: "AED",
    taxAmount: 2.25,
  };
}

/** SVG data URL that looks like a minimal receipt for slide demos. */
export const DEMO_RECEIPT_IMAGE_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="420" viewBox="0 0 320 420">
  <rect fill="#fafafa" width="320" height="420"/>
  <rect fill="#e5e5e5" x="16" y="16" width="288" height="388" rx="8"/>
  <text x="160" y="48" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="bold" fill="#111">CARREFOUR CITY</text>
  <text x="160" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#444">Dubai Mall · دبي مول</text>
  <text x="32" y="100" font-family="system-ui,sans-serif" font-size="10" fill="#333">Date التاريخ: ${new Date().toLocaleDateString("en-GB")}</text>
  <text x="32" y="130" font-family="monospace" font-size="11" fill="#222">Fresh items / أغذية</text>
  <text x="280" y="130" text-anchor="end" font-family="monospace" font-size="11" fill="#222">45.00</text>
  <line x1="32" y1="200" x2="288" y2="200" stroke="#ccc" stroke-width="1"/>
  <text x="32" y="228" font-family="system-ui,sans-serif" font-size="10" fill="#555">VAT 5% ضريبة</text>
  <text x="280" y="228" text-anchor="end" font-family="monospace" font-size="10" fill="#555">2.25</text>
  <text x="32" y="268" font-family="system-ui,sans-serif" font-size="12" font-weight="bold" fill="#111">TOTAL / المجموع AED</text>
  <text x="280" y="268" text-anchor="end" font-family="monospace" font-size="14" font-weight="bold" fill="#111">47.25</text>
  <text x="160" y="340" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#888">— DEMO RECEIPT —</text>
  </svg>`,
)}`;
