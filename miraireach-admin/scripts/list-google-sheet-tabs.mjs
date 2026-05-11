/**
 * List tab titles + sheetId for a spreadsheet (service account).
 * Usage: node scripts/list-google-sheet-tabs.mjs <spreadsheet_id>
 */
import { google } from "googleapis";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

for (const rel of [".env.local", "src/.env.local"]) {
  const fp = path.join(root, rel);
  if (!fs.existsSync(fp)) continue;
  const text = fs.readFileSync(fp, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && process.env[m[1].trim()] === undefined) process.env[m[1].trim()] = m[2].trim();
  }
}

const ssId = process.argv[2]?.trim();
if (!ssId) {
  console.error("Usage: node scripts/list-google-sheet-tabs.mjs <spreadsheet_id>");
  process.exit(1);
}

function getCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON missing (use root .env.local)");
  return JSON.parse(raw);
}

const auth = new google.auth.GoogleAuth({
  credentials: getCredentials(),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const client = await auth.getClient();
const sheets = google.sheets({ version: "v4", auth: client });

const meta = await sheets.spreadsheets.get({
  spreadsheetId: ssId,
  fields: "properties.title,sheets(properties(sheetId,title))",
});

for (const s of meta.data.sheets ?? []) {
  const p = s.properties;
  console.log(`${p.sheetId}\t${p.title}`);
}
