/**
 * POST the Daily_Operations sync API (local or deployed).
 *
 * Env:
 *   SHEETS_INGEST_CRON_SECRET — must match x-ingest-secret
 *   SYNC_BASE_URL — optional, default http://localhost:3000
 *
 * Usage:
 *   node scripts/trigger-sheet-sync.mjs
 *   node scripts/trigger-sheet-sync.mjs '{"organizationId":"7a970ba6-..."}'
 */
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

const secret = process.env.SHEETS_INGEST_CRON_SECRET?.trim();
const base = (process.env.SYNC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const bodyRaw = process.argv[2]?.trim();

if (!secret) {
  console.error("Missing SHEETS_INGEST_CRON_SECRET. Add to src/.env.local e.g.");
  console.error('  SHEETS_INGEST_CRON_SECRET=your-long-random-string');
  console.error("Then restart `npm run dev`.");
  process.exit(1);
}

let body = {};
if (bodyRaw) {
  try {
    body = JSON.parse(bodyRaw);
  } catch {
    console.error("Invalid JSON for argv[1]");
    process.exit(1);
  }
}

const url = `${base}/api/integrations/sheets/daily-operations/sync`;
const res = await fetch(url, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-ingest-secret": secret,
  },
  body: JSON.stringify(body),
});

const text = await res.text();
console.log("HTTP", res.status, res.statusText);
try {
  console.log(JSON.stringify(JSON.parse(text), null, 2));
} catch {
  console.log(text);
}

if (!res.ok) process.exit(1);
