import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseReceiptGeminiJsonText, type ReceiptGeminiParse } from "@/lib/receipt-gemini-schema";

const RECEIPT_PROMPT = `You are an expert accountant assistant specialized in UAE / Dubai receipts and tax invoices.

The image may contain English, Arabic, or mixed text. Numbers may appear as Western digits (0-9) or Eastern Arabic digits (٠١٢٣٤٥٦٧٨٩). Always interpret them correctly.

Extract:
- transactionDate: ISO date YYYY-MM-DD (use the invoice or purchase date; if only a time is visible, infer the most likely date from context or null)
- vendorName: merchant / supplier name (prefer English transliteration if both languages appear, or the most prominent legal name)
- totalAmount: Grand total paid or payable as a positive decimal number (not a string)
- currencyCode: One of AED, USD, JPY, EUR, SAR, GBP — use the currency explicitly printed on the receipt. If unclear but explicitly "د.إ" or "AED", use AED.
- taxAmount: VAT / tax total if clearly labeled (e.g. "VAT", "ضريبة", "Value Added Tax"); otherwise null

Return ONLY a single JSON object with these exact keys: transactionDate, vendorName, totalAmount, currencyCode, taxAmount. Use null for unknown values. No markdown, no explanation.`;

export async function analyzeReceiptWithGemini(imageBase64: string, mimeType: string): Promise<ReceiptGeminiParse> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1024,
    },
  });

  const safeMime = mimeType.startsWith("image/") ? mimeType : "image/jpeg";
  const res = await model.generateContent([
    { text: RECEIPT_PROMPT },
    { inlineData: { mimeType: safeMime, data: imageBase64 } },
  ]);
  const text = res.response.text();
  return parseReceiptGeminiJsonText(text);
}
