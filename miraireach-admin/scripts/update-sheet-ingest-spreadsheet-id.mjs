/**
 * Update sheet_ingest_configs.spreadsheet_id for Daily_Operations (service role).
 * Usage: node scripts/update-sheet-ingest-spreadsheet-id.mjs <spreadsheet_id> [organization_uuid]
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvFile(rel) {
  const fp = path.join(root, rel);
  if (!fs.existsSync(fp)) return;
  const text = fs.readFileSync(fp, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const k = trimmed.slice(0, eq).trim();
    let v = trimmed.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

loadEnvFile("src/.env.local");
loadEnvFile(".env.local");

let url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
url = url.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

const spreadsheetId = process.argv[2]?.trim();
const orgArg = process.argv[3]?.trim();
const organizationId =
  orgArg && /^[0-9a-f-]{36}$/i.test(orgArg) ? orgArg : process.env.NEXT_PUBLIC_GAM_ORGANIZATION_ID?.trim();

if (!url || !serviceKey) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
if (!spreadsheetId) {
  console.error("Usage: node scripts/update-sheet-ingest-spreadsheet-id.mjs <spreadsheet_id> [organization_uuid]");
  process.exit(1);
}
if (!organizationId || !/^[0-9a-f-]{36}$/i.test(organizationId)) {
  console.error("Set NEXT_PUBLIC_GAM_ORGANIZATION_ID or pass org uuid as third argument.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

const { data: rows, error: selErr } = await supabase
  .from("sheet_ingest_configs")
  .select("id, spreadsheet_id, sheet_name, organization_id")
  .eq("organization_id", organizationId)
  .eq("sheet_name", "Daily_Operations");

if (selErr) {
  console.error("Select failed:", selErr.message);
  process.exit(1);
}

if (!rows?.length) {
  console.error("No sheet_ingest_configs row for this org + Daily_Operations. Run migration/seed first.");
  process.exit(1);
}

const { data: updated, error: updErr } = await supabase
  .from("sheet_ingest_configs")
  .update({ spreadsheet_id: spreadsheetId, updated_at: new Date().toISOString() })
  .eq("organization_id", organizationId)
  .eq("sheet_name", "Daily_Operations")
  .select("id, spreadsheet_id, sheet_name");

if (updErr) {
  console.error("Update failed:", updErr.message);
  process.exit(1);
}

console.log("Updated:", updated);
