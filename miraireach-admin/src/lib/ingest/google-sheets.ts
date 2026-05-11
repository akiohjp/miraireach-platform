import { google, type sheets_v4 } from "googleapis";

export type SheetGrid = (string | number | boolean | null | undefined)[][];

function getCredentials(): Record<string, unknown> {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set");
  }
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON must be valid JSON");
  }
}

/** Read-only Sheets API client (service account). */
export async function getSheetsClient(): Promise<sheets_v4.Sheets> {
  const auth = new google.auth.GoogleAuth({
    credentials: getCredentials(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client as never });
}

export async function fetchSheetRange(spreadsheetId: string, rangeA1: string): Promise<SheetGrid> {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: rangeA1,
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });
  const v = res.data.values;
  if (!v || !Array.isArray(v)) return [];
  return v as SheetGrid;
}

export function inferStartRowFromRangeA1(a1: string): number {
  const m = a1.match(/![A-Za-z]+(\d+)\s*:/i);
  if (m?.[1]) return parseInt(m[1], 10);
  return 2;
}
