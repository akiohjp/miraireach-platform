/**
 * Insert / upsert initial sheet_ingest_configs row (service role).
 * Prereq: migration applied (table exists).
 *
 * Usage:
 *   node scripts/seed-sheet-ingest-config.mjs
 *   node scripts/seed-sheet-ingest-config.mjs <organization_uuid>
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (src/.env.local or .env.local)
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

const argOrg = process.argv[2]?.trim();
const organizationId =
  argOrg && /^[0-9a-f-]{36}$/i.test(argOrg) ? argOrg : process.env.NEXT_PUBLIC_GAM_ORGANIZATION_ID?.trim();

const PLACEHOLDER_SPREADSHEET_ID = "PLACEHOLDER_REPLACE_WITH_REAL_SPREADSHEET_ID";

if (!url || !serviceKey) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.");
  process.exit(1);
}
if (!organizationId || !/^[0-9a-f-]{36}$/i.test(organizationId)) {
  console.error("Set NEXT_PUBLIC_GAM_ORGANIZATION_ID or pass organization UUID as argv[1].");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

const row = {
  organization_id: organizationId,
  layout_kind: "daily_operations_v1",
  spreadsheet_id: PLACEHOLDER_SPREADSHEET_ID,
  sheet_name: "Daily_Operations",
  data_range_a1: "Daily_Operations!A2:J10000",
  enabled: true,
};

const { data, error } = await supabase
  .from("sheet_ingest_configs")
  .upsert(row, { onConflict: "organization_id,spreadsheet_id,sheet_name" })
  .select("id, organization_id, spreadsheet_id")
  .single();

if (error) {
  console.error("Upsert failed:", error.message, error.code ?? "");
  process.exit(1);
}

console.log("sheet_ingest_configs OK:", data);
