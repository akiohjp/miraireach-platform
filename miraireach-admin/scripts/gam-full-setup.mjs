/**
 * One-shot: link Auth user (by email) to NEXT_PUBLIC_GAM_ORGANIZATION_ID as owner,
 * then run seed-env-org (categories, budgets, client, projects, ledger).
 *
 *   npm run gam:setup -- you@email.com
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_GAM_ORGANIZATION_ID
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";

function loadEnvLocal() {
  const tryFiles = [resolve(process.cwd(), ".env.local"), resolve(process.cwd(), "src", ".env.local")];
  for (const p of tryFiles) {
    if (!existsSync(p)) continue;
    const raw = readFileSync(p, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const orgId = process.env.NEXT_PUBLIC_GAM_ORGANIZATION_ID?.trim();
const emailArg = process.argv[2]?.trim();

if (!supabaseUrl || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
if (!emailArg || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailArg)) {
  console.error("Usage: npm run gam:setup -- <email>");
  process.exit(1);
}
if (!orgId || !/^[0-9a-f-]{36}$/i.test(orgId)) {
  console.error("Set NEXT_PUBLIC_GAM_ORGANIZATION_ID to a valid UUID.");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserIdByEmail(email) {
  const pageSize = 1000;
  let page = 1;
  const target = email.toLowerCase();
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: pageSize });
    if (error) throw error;
    const hit = data.users.find((u) => (u.email ?? "").toLowerCase() === target);
    if (hit) return hit.id;
    if (data.users.length < pageSize) return null;
    page += 1;
  }
}

async function main() {
  const userId = await findUserIdByEmail(emailArg);
  if (!userId) {
    console.error("No Auth user for:", emailArg);
    process.exit(1);
  }
  const { error: memErr } = await admin.from("organization_members").upsert(
    { organization_id: orgId, user_id: userId, role: "owner" },
    { onConflict: "organization_id,user_id" },
  );
  if (memErr) throw memErr;
  console.log("organization_members: linked", emailArg, "→", orgId);

  const seedScript = resolve(process.cwd(), "scripts", "seed-env-org.mjs");
  const r = spawnSync(process.execPath, [seedScript, userId], {
    stdio: "inherit",
    cwd: process.cwd(),
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
