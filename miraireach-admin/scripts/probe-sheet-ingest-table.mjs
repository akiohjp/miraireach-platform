/**
 * One-off: check if sheet_ingest_configs exists (service role).
 * Usage: node scripts/probe-sheet-ingest-table.mjs
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

for (const rel of ["src/.env.local", ".env.local"]) {
  const fp = path.join(root, rel);
  if (!fs.existsSync(fp)) continue;
  for (const line of fs.readFileSync(fp, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && process.env[m[1].trim()] === undefined) process.env[m[1].trim()] = m[2].trim();
  }
}

let url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
url = url.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !key) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const { error } = await sb.from("sheet_ingest_configs").select("id").limit(1);
if (error) {
  console.error("sheet_ingest_configs:", error.code ?? "", error.message);
  process.exit(1);
}
console.log("sheet_ingest_configs exists / readable.");
