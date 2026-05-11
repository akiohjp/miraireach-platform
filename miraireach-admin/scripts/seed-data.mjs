/**
 * Partner demo: realistic multi-currency ledger + FX rows for GAM HQ (Dubai-centric narratives).
 *
 * Usage:
 *   npm run seed:data -- <auth_user_uuid>
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (merged from .env.local + src/.env.local).
 * Creates/updates org slug `miraireach-partner-demo` (functional JPY) and replaces clients, projects, budgets,
 * fx_rates, and ledger for that org.
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

/** JPY functional minor per 1 major unit of transaction currency (aligned with app gam-currency demo table). */
const JPY_PER_MAJOR = { JPY: 1, USD: 150, AED: 41, EUR: 165, SAR: 40, GBP: 190 };

function toSignedMinorAndFunctional(major, currencyCode, isExpense) {
  const sign = isExpense ? -1 : 1;
  const jp = JPY_PER_MAJOR[currencyCode];
  if (!jp) throw new Error("Unknown currency " + currencyCode);
  const func = Math.round(major * jp) * sign;
  let txMinor;
  if (currencyCode === "JPY") txMinor = Math.round(major) * sign;
  else if (currencyCode === "USD" || currencyCode === "AED" || currencyCode === "EUR" || currencyCode === "SAR" || currencyCode === "GBP") {
    txMinor = Math.round(major * 100) * sign;
  } else throw new Error(currencyCode);
  return { amount_minor: txMinor, amount_functional_minor: func };
}

function monthMeta(now, monthsAgo) {
  const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return { start, end, startStr: isoDate(start), endStr: isoDate(end) };
}

function daysInMonth(y, m0) {
  return new Date(y, m0 + 1, 0).getDate();
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const userId = process.argv[2]?.trim();

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
if (!userId || !/^[0-9a-f-]{36}$/i.test(userId)) {
  console.error("Usage: npm run seed:data -- <auth_user_uuid>");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ORG_SLUG = "miraireach-partner-demo";

const categoryDefs = [
  { slug: "infra", label: "Infrastructure & platform", sort_order: 10 },
  { slug: "api", label: "APIs, SaaS & research tools", sort_order: 20 },
  { slug: "ads", label: "Paid media & performance", sort_order: 25 },
  { slug: "outsource", label: "Outsourced delivery & vendors", sort_order: 28 },
  { slug: "labor", label: "Professional staff", sort_order: 30 },
  { slug: "bizdev", label: "BD, proposals & events", sort_order: 40 },
];

const clientProjectPlan = [
  {
    client: {
      display_name: "Japan Foodbridge K.K.",
      legal_name: "Japan Foodbridge Kabushiki Kaisha",
      country: "JP",
      default_currency: "JPY",
    },
    project: {
      code: "JP-FNB-01",
      name: "Multi-unit Japanese dining rollout · UAE & GCC",
      status: "active",
      billing_currency: "JPY",
    },
  },
  {
    client: {
      display_name: "Grand Bazaar Anatolia Textiles",
      legal_name: "Anatolia Textiles Ltd.",
      country: "TR",
      default_currency: "USD",
    },
    project: {
      code: "TR-RUG-02",
      name: "Turkish carpet retail · GEO & AIO visibility program",
      status: "active",
      billing_currency: "USD",
    },
  },
  {
    client: {
      display_name: "Marina F&B Collective DWC-LLC",
      legal_name: "Marina F&B Collective DWC-LLC",
      country: "AE",
      default_currency: "AED",
    },
    project: {
      code: "AE-HOSP-03",
      name: "Dubai Marina restaurant cluster · creator + paid social",
      status: "active",
      billing_currency: "AED",
    },
  },
  {
    client: {
      display_name: "Riyadh Cloud Kitchens Co.",
      legal_name: "Riyadh Cloud Kitchens JSC",
      country: "SA",
      default_currency: "SAR",
    },
    project: {
      code: "SA-FNB-04",
      name: "Riyadh cloud-kitchen brand sprints",
      status: "on_hold",
      billing_currency: "SAR",
    },
  },
  {
    client: {
      display_name: "US MenuMind Restaurant Group",
      legal_name: "MenuMind Inc.",
      country: "US",
      default_currency: "USD",
    },
    project: {
      code: "US-AI-05",
      name: "North America LLM menu & upsell pilot (lead)",
      status: "draft",
      billing_currency: "USD",
    },
  },
  {
    client: {
      display_name: "Shibuya AI Ad Ops Co.",
      legal_name: "Shibuya AI Ad Ops KK",
      country: "JP",
      default_currency: "JPY",
    },
    project: {
      code: "JP-MKT-06",
      name: "Tokyo performance marketing retainer (closed phase)",
      status: "closed",
      billing_currency: "JPY",
    },
  },
  {
    client: {
      display_name: "Emirates Mall Retail FZ-LLC",
      legal_name: "Emirates Mall Retail FZ-LLC",
      country: "AE",
      default_currency: "AED",
    },
    project: {
      code: "AE-GEO-07",
      name: "Mall kiosk SEO / local pack recovery",
      status: "active",
      billing_currency: "AED",
    },
  },
  {
    client: {
      display_name: "London Dark Kitchen Analytics Ltd",
      legal_name: "London Dark Kitchen Analytics Ltd",
      country: "GB",
      default_currency: "GBP",
    },
    project: {
      code: "UK-FNB-08",
      name: "UK dark-kitchen data layer & BI workshops",
      status: "on_hold",
      billing_currency: "GBP",
    },
  },
];

async function main() {
  let orgId;
  const { data: existing } = await supabase.from("organizations").select("id").eq("slug", ORG_SLUG).maybeSingle();
  if (existing?.id) {
    orgId = existing.id;
    console.log("Using existing organization:", orgId);
  } else {
    const { data: org, error: oErr } = await supabase
      .from("organizations")
      .insert({
        name: "MIRAIREACH Gulf Advisory (partner demo)",
        slug: ORG_SLUG,
        functional_currency: "JPY",
      })
      .select("id")
      .single();
    if (oErr) throw oErr;
    orgId = org.id;
    console.log("Created organization:", orgId);
  }

  await supabase.from("organization_members").upsert(
    { organization_id: orgId, user_id: userId, role: "owner" },
    { onConflict: "organization_id,user_id" },
  );
  console.log("Linked user (owner).");

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

  await supabase.from("ledger_entries").delete().eq("organization_id", orgId);
  await supabase.from("budget_periods").delete().eq("organization_id", orgId);
  await supabase.from("fx_rates").delete().eq("organization_id", orgId);
  await supabase.from("projects").delete().eq("organization_id", orgId);
  await supabase.from("clients").delete().eq("organization_id", orgId);

  const clientIdByCode = {};
  const projectIdByCode = {};

  for (const plan of clientProjectPlan) {
    const { data: cli, error: cErr } = await supabase
      .from("clients")
      .insert({
        organization_id: orgId,
        display_name: plan.client.display_name,
        legal_name: plan.client.legal_name,
        country_code: plan.client.country,
        default_currency: plan.client.default_currency,
      })
      .select("id")
      .single();
    if (cErr) throw cErr;
    clientIdByCode[plan.project.code] = cli.id;

    const { data: proj, error: pErr } = await supabase
      .from("projects")
      .insert({
        organization_id: orgId,
        client_id: cli.id,
        code: plan.project.code,
        name: plan.project.name,
        status: plan.project.status,
        billing_currency: plan.project.billing_currency,
      })
      .select("id")
      .single();
    if (pErr) throw pErr;
    projectIdByCode[plan.project.code] = proj.id;
  }
  console.log("Inserted clients & projects.");

  const now = new Date();
  const { start: periodStart, end: periodEnd } = (function monthBounds() {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start: isoDate(start), end: isoDate(end) };
  })();

  const budgetInserts = Object.keys(categoryIds).map((slug) => ({
    organization_id: orgId,
    project_id: null,
    cost_category_id: categoryIds[slug],
    period_start: periodStart,
    period_end: periodEnd,
    budget_amount_functional_minor:
      slug === "ads" ? 1_200_000 : slug === "outsource" ? 2_400_000 : slug === "labor" ? 3_500_000 : 900_000,
  }));
  const { error: bIns } = await supabase.from("budget_periods").insert(budgetInserts);
  if (bIns) throw bIns;
  console.log("Inserted org-level monthly budgets (functional JPY).");

  for (let mo = 0; mo < 6; mo++) {
    const { start } = monthMeta(now, mo);
    const anchor = isoDate(start);
    await supabase.from("fx_rates").insert([
      {
        organization_id: orgId,
        base_currency: "USD",
        quote_currency: "JPY",
        valid_on: anchor,
        rate: String(JPY_PER_MAJOR.USD),
        source: "seed illustrative",
      },
      {
        organization_id: orgId,
        base_currency: "AED",
        quote_currency: "JPY",
        rate: String(JPY_PER_MAJOR.AED),
        source: "seed illustrative",
      },
      {
        organization_id: orgId,
        base_currency: "USD",
        quote_currency: "AED",
        valid_on: anchor,
        rate: "3.6725",
        source: "seed illustrative",
      },
    ]);
  }
  console.log("Inserted FX reference rows (6 months).");

  const rows = [];
  const pushLine = (partial) => {
    rows.push({
      organization_id: orgId,
      cost_category_id: partial.cost_category_id ?? null,
      entry_type: partial.entry_type,
      transaction_date: partial.transaction_date,
      currency_code: partial.currency_code,
      amount_minor: partial.amount_minor,
      amount_functional_minor: partial.amount_functional_minor,
      fx_rate_applied: partial.fx_rate_applied ?? null,
      memo: partial.memo,
      project_id: partial.project_id,
      created_by: userId,
    });
  };

  for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo--) {
    const { start } = monthMeta(now, monthsAgo);
    const y = start.getFullYear();
    const m0 = start.getMonth();
    const dim = daysInMonth(y, m0);

    let costSpike = 1;
    let revSoft = 1;
    if (monthsAgo === 3) costSpike = 1.75;
    if (monthsAgo === 1) {
      costSpike = 1.35;
      revSoft = 0.88;
    }
    if (monthsAgo === 0) costSpike = 1.12;

    const spread = monthsAgo >= 4 ? [3, 7, 12, 18, 22, 28] : [2, 5, 9, 14, 19, 24, dim];

    for (const day of spread) {
      const d = new Date(y, m0, Math.min(day, dim));
      const dayStr = isoDate(d);

      for (const plan of clientProjectPlan) {
        const code = plan.project.code;
        const pid = projectIdByCode[code];
        const st = plan.project.status;

        if (st === "draft" && monthsAgo > 1) continue;
        if (st === "closed" && monthsAgo > 2) continue;

        const bc = plan.project.billing_currency;
        let baseRev =
          bc === "JPY"
            ? 180_000 + monthsAgo * 7000
            : bc === "USD"
              ? 1200 + monthsAgo * 45
              : bc === "AED"
                ? 4200 + monthsAgo * 120
                : bc === "SAR"
                  ? 4100 + monthsAgo * 100
                  : bc === "GBP"
                    ? 900 + monthsAgo * 35
                    : 1200;

        if (st === "on_hold") baseRev *= 0.55;
        if (st === "closed") baseRev *= 0.35;
        if (st === "draft") baseRev *= 0.25;

        baseRev *= revSoft;

        const r = toSignedMinorAndFunctional(baseRev, bc, false);
        pushLine({
          project_id: pid,
          entry_type: "revenue",
          transaction_date: dayStr,
          currency_code: bc,
          amount_minor: r.amount_minor,
          amount_functional_minor: r.amount_functional_minor,
          fx_rate_applied: JPY_PER_MAJOR[bc],
          memo: `Professional fees · ${plan.project.code} · ${dayStr}`,
        });

        const toolMajor = bc === "JPY" ? 22_000 : bc === "AED" ? 820 : bc === "USD" ? 210 : 200;
        const e1 = toSignedMinorAndFunctional(toolMajor * costSpike, bc, true);
        pushLine({
          project_id: pid,
          cost_category_id: categoryIds.api,
          entry_type: "expense",
          transaction_date: dayStr,
          currency_code: bc,
          amount_minor: e1.amount_minor,
          amount_functional_minor: e1.amount_functional_minor,
          memo: `Tools & APIs · ${code}`,
        });
      }
    }

    const midMonth = isoDate(new Date(y, m0, Math.min(15, dim)));
    const oMajor = monthsAgo === 3 ? 18_000 : 6500;
    const oUSD = toSignedMinorAndFunctional(oMajor * costSpike, "USD", true);
    pushLine({
      project_id: projectIdByCode["TR-RUG-02"],
      cost_category_id: categoryIds.outsource,
      entry_type: "expense",
      transaction_date: midMonth,
      currency_code: "USD",
      amount_minor: oUSD.amount_minor,
      amount_functional_minor: oUSD.amount_functional_minor,
      memo: "Ankara content studio · localization sprint",
    });

    const adsMajor = monthsAgo === 3 ? 14_000 : monthsAgo === 1 ? 9800 : 5200;
    const adsAED = toSignedMinorAndFunctional(adsMajor * costSpike, "AED", true);
    pushLine({
      project_id: projectIdByCode["AE-HOSP-03"],
      cost_category_id: categoryIds.ads,
      entry_type: "expense",
      transaction_date: midMonth,
      currency_code: "AED",
      amount_minor: adsAED.amount_minor,
      amount_functional_minor: adsAED.amount_functional_minor,
      memo: "Meta + TikTok flight (Marina cluster)",
    });

    const laborJPY = Math.round((280_000 + (5 - monthsAgo) * 12_000) * costSpike);
    const eL = toSignedMinorAndFunctional(laborJPY, "JPY", true);
    pushLine({
      project_id: null,
      cost_category_id: categoryIds.labor,
      entry_type: "expense",
      transaction_date: endStr,
      currency_code: "JPY",
      amount_minor: eL.amount_minor,
      amount_functional_minor: eL.amount_functional_minor,
      memo: "Monthly contractor payroll accrual (HQ)",
    });

    const infraJPY = Math.round(95_000 * (monthsAgo === 3 ? 1.4 : 1));
    const eI = toSignedMinorAndFunctional(infraJPY, "JPY", true);
    pushLine({
      project_id: null,
      cost_category_id: categoryIds.infra,
      entry_type: "expense",
      transaction_date: endStr,
      currency_code: "JPY",
      amount_minor: eI.amount_minor,
      amount_functional_minor: eI.amount_functional_minor,
      memo: "Cloud & data platform · month close",
    });

    if (monthsAgo <= 2) {
      const biz = toSignedMinorAndFunctional(4200, "USD", true);
      pushLine({
        project_id: projectIdByCode["US-AI-05"],
        cost_category_id: categoryIds.bizdev,
        entry_type: "expense",
        transaction_date: endStr,
        currency_code: "USD",
        amount_minor: biz.amount_minor,
        amount_functional_minor: biz.amount_functional_minor,
        memo: "Partner workshops & scoping (US lead)",
      });
    }
  }

  const { error: insErr } = await supabase.from("ledger_entries").insert(rows);
  if (insErr) throw insErr;
  console.log(`Inserted ${rows.length} ledger lines (6 months, AED/JPY/USD/SAR/GBP mix).`);

  console.log(
    "\nDone. Point the app at this tenant (optional):\n  NEXT_PUBLIC_GAM_ORGANIZATION_ID=" + orgId,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
