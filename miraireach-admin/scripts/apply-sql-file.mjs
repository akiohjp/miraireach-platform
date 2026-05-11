/**
 * Apply a SQL file to Supabase Postgres over the IPv4 pooler (Session mode).
 * Requires SUPABASE_DB_PASSWORD (Database password from Supabase Dashboard → Settings → Database).
 * Optional: SUPABASE_POOLER_REGION (default ap-northeast-1). Project ref is read from NEXT_PUBLIC_SUPABASE_URL.
 *
 * Usage: node scripts/apply-sql-file.mjs supabase/migrations/20260205120000_fix_rls_org_members_recursion.sql
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvFile(rel) {
  const fp = path.join(root, rel);
  if (!fs.existsSync(fp)) return;
  const text = fs.readFileSync(fp, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] ??= m[2].trim();
  }
}

loadEnvFile("src/.env.local");
loadEnvFile(".env.local");

const urlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const password = process.env.SUPABASE_DB_PASSWORD?.trim();
const sqlFile = process.argv[2];
const ref = urlRaw?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

const regions = (process.env.SUPABASE_POOLER_REGIONS || "ap-northeast-1,ap-southeast-1,us-east-1,eu-central-1")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (!ref || !sqlFile) {
  console.error("Usage: node scripts/apply-sql-file.mjs <path-to.sql>");
  console.error("Needs NEXT_PUBLIC_SUPABASE_URL in .env.local.");
  process.exit(1);
}

if (!password) {
  console.error("Missing SUPABASE_DB_PASSWORD (Database password from Supabase project settings).");
  console.error(
    "Example (PowerShell): $env:SUPABASE_DB_PASSWORD='your-db-password'; node scripts/apply-sql-file.mjs supabase/migrations/20260205120000_fix_rls_org_members_recursion.sql",
  );
  process.exit(1);
}

const sqlPath = path.isAbsolute(sqlFile) ? sqlFile : path.join(root, sqlFile);
const sql = fs.readFileSync(sqlPath, "utf8");

const user = `postgres.${ref}`;

let lastErr = "";
for (const region of regions) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  const connectionString = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:5432/postgres`;
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    await client.query(sql);
    console.log("OK: applied", sqlPath, `(pooler ${region})`);
    await client.end();
    process.exit(0);
  } catch (e) {
    lastErr = e instanceof Error ? e.message : String(e);
    await client.end().catch(() => {});
  }
}

console.error("Failed (tried regions %s): %s", regions.join(", "), lastErr);
process.exit(1);
