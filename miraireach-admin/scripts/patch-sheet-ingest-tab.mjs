/**
 * Fix sheet tab name + A1 range for ingest config (service role).
 * Usage: node scripts/patch-sheet-ingest-tab.mjs
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadRootEnv() {
  const fp = path.join(root, ".env.local");
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

loadRootEnv();

let url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
url = url.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const organizationId = process.env.NEXT_PUBLIC_GAM_ORGANIZATION_ID?.trim();

if (!url || !serviceKey || !organizationId) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_GAM_ORGANIZATION_ID in root .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

const sheetTitle = "シート1";
const dataRangeA1 = `'${sheetTitle}'!A2:J10000`;

const { data, error } = await supabase
  .from("sheet_ingest_configs")
  .update({
    sheet_name: sheetTitle,
    data_range_a1: dataRangeA1,
    updated_at: new Date().toISOString(),
  })
  .eq("organization_id", organizationId)
  .eq("spreadsheet_id", "1fdGr9yg81pT2Vh_AaE1sfX4E-4PvPbfng8pLKkjxL8I")
  .select("id, sheet_name, data_range_a1");

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log("Patched:", data);
