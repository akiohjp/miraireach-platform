import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq > 0 && process.env[t.slice(0, eq).trim()] === undefined) {
    process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
}
let url = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "").replace(/\/rest\/v1\/?$/i, "");
const sb = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const runId = process.argv[2] || "1e5fcbe7-592b-4de4-b5ca-8cbf95e5c38f";
const { data, error } = await sb
  .from("sheet_import_row_errors")
  .select("row_number, error_message, raw_cells")
  .eq("run_id", runId);
if (error) throw error;
console.log(JSON.stringify(data, null, 2));
