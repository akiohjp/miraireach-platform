import { NextResponse, type NextRequest } from "next/server";
import { syncDailyOperationsConfigs } from "@/lib/ingest/sync-daily-operations";
import { createSupabaseServiceRole } from "@/lib/supabase-service";

/**
 * POST /api/integrations/sheets/daily-operations/sync
 *
 * Pulls configured Daily_Operations ranges from Google Sheets and upserts:
 * - ledger_entries (sales, COGS, waste, Meta ads) with source_system daily_operations_sheet
 * - daily_operation_facts (customers, impressions, GBP metrics)
 *
 * Env (server only):
 * - SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL
 * - GOOGLE_SERVICE_ACCOUNT_JSON — full service account JSON (shared viewer on the sheet)
 * - SHEETS_INGEST_CRON_SECRET — required header x-ingest-secret
 *
 * Body (optional JSON): { "configId"?: string, "organizationId"?: string }
 * Placeholder org UUID (mnemonic test-org-uuid-001): see GAM_TEST_ORG_PLACEHOLDER in daily-operations-constants.ts
 */
export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-ingest-secret");
  if (!secret || secret !== process.env.SHEETS_INGEST_CRON_SECRET?.trim()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { configId?: string; organizationId?: string } = {};
  try {
    const t = await req.text();
    if (t) body = JSON.parse(t) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const configId = typeof body.configId === "string" ? body.configId.trim() : undefined;
  const organizationId =
    typeof body.organizationId === "string" ? body.organizationId.trim() : undefined;

  try {
    const supabase = createSupabaseServiceRole();
    const runs = await syncDailyOperationsConfigs({ supabase, configId, organizationId });
    return NextResponse.json({ ok: true, runs });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("GOOGLE_SERVICE_ACCOUNT_JSON") || msg.includes("SUPABASE_SERVICE_ROLE")) {
      return NextResponse.json({ ok: false, error: "Server misconfigured", detail: msg }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: "Sync failed", detail: msg }, { status: 500 });
  }
}
