/**
 * Seed ledger + categories + budgets into the organization pinned by NEXT_PUBLIC_GAM_ORGANIZATION_ID.
 * Use when .env already points at the tenant you use in the app (any org UUID).
 *
 *   npm run seed:env -- <auth_user_uuid>
 *
 * Requires same env as seed-gam (.env.local + src/.env.local for service role).
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

function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthBounds(now) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: isoDate(start), end: isoDate(end) };
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const userId = process.argv[2]?.trim();
const orgId = process.env.NEXT_PUBLIC_GAM_ORGANIZATION_ID?.trim();

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (merge from root + src/.env.local).");
  process.exit(1);
}
if (!userId || !/^[0-9a-f-]{36}$/i.test(userId)) {
  console.error("Usage: npm run seed:env -- <auth_user_uuid>");
  process.exit(1);
}
if (!orgId || !/^[0-9a-f-]{36}$/i.test(orgId)) {
  console.error("Set NEXT_PUBLIC_GAM_ORGANIZATION_ID in .env.local to a valid organization UUID.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const now = new Date();
const { start: periodStart, end: periodEnd } = monthBounds(now);

async function main() {
  const { data: orgRow, error: orgErr } = await supabase
    .from("organizations")
    .select("id,name,slug")
    .eq("id", orgId)
    .maybeSingle();
  if (orgErr) throw orgErr;
  if (!orgRow?.id) {
    console.error("No organization with id", orgId, "- check NEXT_PUBLIC_GAM_ORGANIZATION_ID.");
    process.exit(1);
  }
  console.log("Target org:", orgRow.name, `(${orgRow.slug})`, orgId);

  const { error: memErr } = await supabase.from("organization_members").upsert(
    { organization_id: orgId, user_id: userId, role: "owner" },
    { onConflict: "organization_id,user_id" },
  );
  if (memErr) throw memErr;
  console.log("Linked user as owner on this org.");

  const categoryDefs = [
    { slug: "infra", label: "Infrastructure & platform", sort_order: 10 },
    { slug: "api", label: "Third-party APIs & tooling", sort_order: 20 },
    { slug: "labor", label: "Professional staff (fixed)", sort_order: 30 },
    { slug: "bizdev", label: "Business development & proposals", sort_order: 40 },
  ];

  const categoryIds = {};
  for (const c of categoryDefs) {
    const { data: row, error } = await supabase
      .from("cost_categories")
      .upsert(
        { organization_id: orgId, slug: c.slug, label: c.label, sort_order: c.sort_order },
        { onConflict: "organization_id,slug" },
      )
      .select("id")
      .single();
    if (error) throw error;
    categoryIds[c.slug] = row.id;
  }
  console.log("Upserted cost categories.");

  const { error: delBudget } = await supabase
    .from("budget_periods")
    .delete()
    .eq("organization_id", orgId)
    .is("project_id", null);
  if (delBudget) throw delBudget;

  const budgetInserts = Object.keys(categoryIds).map((slug) => ({
    organization_id: orgId,
    project_id: null,
    cost_category_id: categoryIds[slug],
    period_start: periodStart,
    period_end: periodEnd,
    budget_amount_functional_minor: 800_000,
  }));
  const { error: bIns } = await supabase.from("budget_periods").insert(budgetInserts);
  if (bIns) throw bIns;
  console.log("Inserted monthly budgets (org-level).");

  let { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("organization_id", orgId)
    .eq("display_name", "Acme Corp (seed)")
    .maybeSingle();

  if (!client) {
    const { data: inserted, error: ciErr } = await supabase
      .from("clients")
      .insert({
        organization_id: orgId,
        display_name: "Acme Corp (seed)",
        legal_name: "Acme Corp LLC",
        country_code: "US",
        default_currency: "USD",
      })
      .select("id")
      .single();
    if (ciErr) throw ciErr;
    client = inserted;
  }
  const clientId = client.id;

  const projectDefs = [
    { code: "ACME-01", name: "Digital transformation program", status: "active" },
    { code: "ACME-02", name: "Annual strategy retainer", status: "active" },
  ];
  for (const p of projectDefs) {
    const { error: pe } = await supabase.from("projects").upsert(
      {
        organization_id: orgId,
        client_id: clientId,
        code: p.code,
        name: p.name,
        status: p.status,
        billing_currency: "JPY",
      },
      { onConflict: "organization_id,code" },
    );
    if (pe) throw pe;
  }
  console.log("Upserted clients & projects.");

  const { data: mainProj, error: mainPE } = await supabase
    .from("projects")
    .select("id")
    .eq("organization_id", orgId)
    .eq("code", "ACME-01")
    .single();
  if (mainPE || !mainProj) throw mainPE || new Error("ACME-01 project missing");

  const { error: delLedger } = await supabase.from("ledger_entries").delete().eq("organization_id", orgId);
  if (delLedger) throw delLedger;

  const rows = [];
  for (let i = 0; i < 10; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const day = isoDate(d);
    const baseRev = 350_000 + (i % 4) * 40_000;
    rows.push({
      organization_id: orgId,
      project_id: mainProj.id,
      cost_category_id: null,
      entry_type: "revenue",
      transaction_date: day,
      amount_minor: baseRev,
      currency_code: "JPY",
      amount_functional_minor: baseRev,
      memo: `Fee revenue (${day})`,
      created_by: userId,
    });
    rows.push({
      organization_id: orgId,
      project_id: mainProj.id,
      cost_category_id: categoryIds.api,
      entry_type: "expense",
      transaction_date: day,
      amount_minor: -(45_000 + i * 2000),
      currency_code: "JPY",
      amount_functional_minor: -(45_000 + i * 2000),
      memo: `API & tooling · ${day}`,
      created_by: userId,
    });
    rows.push({
      organization_id: orgId,
      project_id: mainProj.id,
      cost_category_id: categoryIds.infra,
      entry_type: "expense",
      transaction_date: day,
      amount_minor: -(28_000 + (i % 3) * 3000),
      currency_code: "JPY",
      amount_functional_minor: -(28_000 + (i % 3) * 3000),
      memo: `Cloud infra · ${day}`,
      created_by: userId,
    });
  }

  const { error: insL } = await supabase.from("ledger_entries").insert(rows);
  if (insL) throw insL;
  console.log(`Inserted ${rows.length} ledger lines. Refresh the app dashboard. Done.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
