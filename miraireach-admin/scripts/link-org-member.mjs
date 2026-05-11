/**
 * Link an existing Supabase Auth user (by email) to a GAM organization via organization_members.
 *
 *   npm run link:org-member -- akio.h.jp@gmail.com
 *   npm run link:org-member -- you@example.com 7a970ba6-c47e-43b7-9400-d5b0555fdce4
 *
 * Org id defaults to NEXT_PUBLIC_GAM_ORGANIZATION_ID from .env.local when omitted.
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

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
const emailArg = process.argv[2]?.trim();
const orgArg = process.argv[3]?.trim();

const orgId =
  orgArg && /^[0-9a-f-]{36}$/i.test(orgArg)
    ? orgArg
    : process.env.NEXT_PUBLIC_GAM_ORGANIZATION_ID?.trim();

if (!supabaseUrl || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. in .env.local).");
  process.exit(1);
}
if (!emailArg || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailArg)) {
  console.error("Usage: npm run link:org-member -- <email> [organization_uuid]");
  process.exit(1);
}
if (!orgId || !/^[0-9a-f-]{36}$/i.test(orgId)) {
  console.error("No valid organization UUID. Pass as 2nd arg or set NEXT_PUBLIC_GAM_ORGANIZATION_ID.");
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
    console.error("No Auth user found for:", emailArg);
    process.exit(1);
  }
  const { error } = await admin.from("organization_members").upsert(
    { organization_id: orgId, user_id: userId, role: "owner" },
    { onConflict: "organization_id,user_id" },
  );
  if (error) throw error;
  console.log("Linked:", emailArg, "→ organization", orgId, "as owner");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
