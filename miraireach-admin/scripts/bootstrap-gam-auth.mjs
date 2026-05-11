/**
 * Create or update a Supabase Auth user and attach them to a GAM organization as owner.
 *
 * ─ New account (or link existing user to org without changing password) ─
 *   npm run bootstrap:auth -- new@example.com 'YourPassword'
 *   npm run bootstrap:auth -- new@example.com 'YourPassword' my-org-slug
 *
 * ─ Same email but NEW password (account must already exist in Auth) ─
 *   npm run bootstrap:auth -- --reset-password you@example.com 'NewPassword'
 *   npm run bootstrap:auth -- --reset-password you@example.com 'NewPassword' my-org-slug
 *
 * ─ Account already exists: link to org AND set password in one go ─
 *   npm run bootstrap:auth -- you@example.com 'NewPassword' --apply-password
 *   npm run bootstrap:auth -- you@example.com 'NewPassword' my-org-slug --apply-password
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (e.g. .env.local)
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

function parseCli() {
  const args = process.argv.slice(2);
  let resetPassword = false;
  let applyPassword = false;
  const positional = [];
  for (const a of args) {
    if (a === "--reset-password") resetPassword = true;
    else if (a === "--apply-password") applyPassword = true;
    else positional.push(a);
  }
  const emailArg = positional[0]?.trim();
  const passwordArg = positional[1];
  const orgSlug = (positional[2]?.trim() || "demo-gam-firm").toLowerCase();
  return { resetPassword, applyPassword, emailArg, passwordArg, orgSlug };
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const { resetPassword, applyPassword, emailArg, passwordArg, orgSlug } = parseCli();

if (!supabaseUrl || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. in .env.local).");
  process.exit(1);
}
if (!emailArg || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailArg)) {
  console.error("\n用法:");
  console.error("  新規 or 紐づけのみ:  npm run bootstrap:auth -- メール 'パスワード' [orgスラッグ]");
  console.error("  パスワードだけ変更:  npm run bootstrap:auth -- --reset-password メール '新パスワード' [orgスラッグ]");
  console.error("  既存に紐づけ+パス再設定: npm run bootstrap:auth -- メール 'パスワード' --apply-password");
  process.exit(1);
}
if (passwordArg === undefined || String(passwordArg).length < 6) {
  console.error("パスワードは6文字以上にしてください。");
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

async function setPassword(userId, password) {
  const { error } = await admin.auth.admin.updateUserById(userId, {
    password: String(password),
    email_confirm: true,
  });
  if (error) throw error;
  console.log("Auth: password updated (and email marked confirmed).");
}

async function ensureOrg(slug) {
  const { data: existing } = await admin.from("organizations").select("id").eq("slug", slug).maybeSingle();
  if (existing?.id) return existing.id;
  const { data: org, error } = await admin
    .from("organizations")
    .insert({
      name: "GAM Firm",
      slug,
      functional_currency: "JPY",
    })
    .select("id")
    .single();
  if (error) throw error;
  console.log("Created organization:", org.id, `(slug: ${slug})`);
  return org.id;
}

async function linkOwner(orgId, userId) {
  const { error: memErr } = await admin.from("organization_members").upsert(
    { organization_id: orgId, user_id: userId, role: "owner" },
    { onConflict: "organization_id,user_id" },
  );
  if (memErr) throw memErr;
  console.log("organization_members: owner link OK.");
}

async function main() {
  const orgId = await ensureOrg(orgSlug);
  console.log("Organization id:", orgId);

  if (resetPassword) {
    const userId = await findUserIdByEmail(emailArg);
    if (!userId) {
      console.error("このメールのユーザーが Auth に見つかりません。新規作成する場合は --reset-password を付けず実行してください。");
      process.exit(1);
    }
    await setPassword(userId, passwordArg);
    await linkOwner(orgId, userId);
    printNext(emailArg, orgId, userId);
    return;
  }

  let userId;
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: emailArg,
    password: String(passwordArg),
    email_confirm: true,
  });

  if (createErr) {
    const msg = createErr.message?.toLowerCase?.() ?? "";
    const exists =
      msg.includes("already") ||
      msg.includes("registered") ||
      msg.includes("exists") ||
      createErr.status === 422;
    if (!exists) {
      console.error(createErr);
      process.exit(1);
    }
    userId = await findUserIdByEmail(emailArg);
    if (!userId) {
      console.error("ユーザーは存在すると表示されましたが、メールで検索できませんでした。Dashboard → Authentication を確認してください。");
      process.exit(1);
    }
    console.log("User already exists:", userId);
    if (applyPassword) {
      await setPassword(userId, passwordArg);
    } else {
      console.log("(パスワードは変更していません。新パスワードにしたい場合は --apply-password か --reset-password を付けて再実行してください。)");
    }
  } else if (created.user?.id) {
    userId = created.user.id;
    console.log("Created Auth user:", userId);
  } else {
    console.error("Unexpected response from createUser");
    process.exit(1);
  }

  await linkOwner(orgId, userId);
  printNext(emailArg, orgId, userId);
}

function printNext(email, orgId, userId) {
  console.log("\n--- 次の手順 ---");
  console.log(`1) /login で「${email}」と設定したパスワードでサインイン`);
  console.log("2) （任意）.env.local:");
  console.log(`   NEXT_PUBLIC_GAM_ORGANIZATION_ID=${orgId}`);
  console.log("3) （任意）デモ台帳: npm run seed:gam -- " + userId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
