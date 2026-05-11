import type { SupabaseClient } from "@supabase/supabase-js";
import {
  DAILY_OPS_COST_SLUGS,
  DAILY_OPS_SOURCE_SYSTEM,
} from "@/lib/ingest/daily-operations-constants";
import {
  isRowEmpty,
  ledgerRefsForRow,
  parseDailyOperationsRow,
  type DailyOperationsParsedRow,
} from "@/lib/ingest/daily-operations-parse";
import { fetchSheetRange, inferStartRowFromRangeA1 } from "@/lib/ingest/google-sheets";

export type SheetIngestConfigRow = {
  id: string;
  organization_id: string;
  layout_kind: string;
  spreadsheet_id: string;
  sheet_name: string;
  data_range_a1: string;
  enabled: boolean;
};

export type SyncRunResult = {
  configId: string;
  organizationId: string;
  runId: string;
  rowsScanned: number;
  rowsOk: number;
  rowsFailed: number;
  status: "success" | "partial" | "failed";
  error?: string;
};

function toCellJson(row: unknown[]): unknown[] {
  return row.map((c) => {
    if (typeof c === "bigint") return c.toString();
    return c ?? null;
  });
}

async function ensureCostCategoryIds(
  supabase: SupabaseClient,
  organizationId: string,
): Promise<{ cogs: string; waste: string; ads: string }> {
  const defs = [
    { slug: DAILY_OPS_COST_SLUGS.cogs, label: "COGS (Daily_Operations)", sort_order: 50 },
    { slug: DAILY_OPS_COST_SLUGS.waste, label: "Waste / loss (Daily_Operations)", sort_order: 51 },
    { slug: DAILY_OPS_COST_SLUGS.ads, label: "Ads — Meta (Daily_Operations)", sort_order: 52 },
  ];
  const out: Record<string, string> = {};
  for (const c of defs) {
    const { data, error } = await supabase
      .from("cost_categories")
      .upsert(
        { organization_id: organizationId, slug: c.slug, label: c.label, sort_order: c.sort_order },
        { onConflict: "organization_id,slug" },
      )
      .select("id")
      .single();
    if (error || !data) throw new Error(`cost_categories ${c.slug}: ${error?.message ?? "no row"}`);
    out[c.slug] = data.id as string;
  }
  return out as { cogs: string; waste: string; ads: string };
}

async function deleteLedgerByRef(
  supabase: SupabaseClient,
  organizationId: string,
  externalRef: string,
): Promise<void> {
  await supabase
    .from("ledger_entries")
    .delete()
    .eq("organization_id", organizationId)
    .eq("source_system", DAILY_OPS_SOURCE_SYSTEM)
    .eq("external_ref", externalRef);
}

async function upsertLedgerLine(opts: {
  supabase: SupabaseClient;
  organizationId: string;
  externalRef: string;
  entryType: "revenue" | "expense";
  amountMinor: bigint;
  amountFunctionalMinor: bigint;
  currencyCode: string;
  transactionDate: string;
  costCategoryId: string | null;
  memo: string;
}): Promise<void> {
  const {
    supabase,
    organizationId,
    externalRef,
    entryType,
    amountMinor,
    amountFunctionalMinor,
    currencyCode,
    transactionDate,
    costCategoryId,
    memo,
  } = opts;

  const amountStr = amountMinor.toString();
  const amountFnStr = amountFunctionalMinor.toString();

  const { data: existing, error: selErr } = await supabase
    .from("ledger_entries")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("source_system", DAILY_OPS_SOURCE_SYSTEM)
    .eq("external_ref", externalRef)
    .maybeSingle();
  if (selErr) throw new Error(selErr.message);

  const base = {
    organization_id: organizationId,
    project_id: null as string | null,
    cost_category_id: costCategoryId,
    entry_type: entryType,
    transaction_date: transactionDate,
    recognition_date: null as string | null,
    amount_minor: amountStr,
    currency_code: currencyCode,
    amount_functional_minor: amountFnStr,
    fx_rate_applied: null as string | null,
    memo,
    source_system: DAILY_OPS_SOURCE_SYSTEM,
    external_ref: externalRef,
    metadata: {} as Record<string, never>,
    created_by: null as string | null,
  };

  if (existing?.id) {
    const { error } = await supabase.from("ledger_entries").update(base).eq("id", existing.id as string);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("ledger_entries").insert(base);
    if (error) throw new Error(error.message);
  }
}

async function persistParsedRow(opts: {
  supabase: SupabaseClient;
  organizationId: string;
  functionalCurrency: string;
  categoryIds: { cogs: string; waste: string; ads: string };
  parsed: DailyOperationsParsedRow;
}): Promise<void> {
  const { supabase, organizationId, functionalCurrency, categoryIds, parsed } = opts;
  const refs = ledgerRefsForRow(parsed);
  const memoBase = `Daily_Operations · ${parsed.branchName} · ${parsed.opsDate}`;

  await supabase.from("daily_operation_facts").upsert(
    {
      organization_id: organizationId,
      ops_date: parsed.opsDate,
      branch_name: parsed.branchName,
      total_customers: parsed.totalCustomers === null ? null : parsed.totalCustomers.toString(),
      meta_impressions: parsed.metaImpressions === null ? null : parsed.metaImpressions.toString(),
      gbp_views: parsed.gbpViews === null ? null : parsed.gbpViews.toString(),
      gbp_conversions: parsed.gbpConversions === null ? null : parsed.gbpConversions.toString(),
      source_system: DAILY_OPS_SOURCE_SYSTEM,
      external_ref: refs.facts,
      sheet_row: parsed.sheetRow,
    },
    { onConflict: "organization_id,external_ref" },
  );

  if (parsed.totalSalesMinor != null && parsed.totalSalesMinor > BigInt(0)) {
    await upsertLedgerLine({
      supabase,
      organizationId,
      externalRef: refs.sales,
      entryType: "revenue",
      amountMinor: parsed.totalSalesMinor,
      amountFunctionalMinor: parsed.totalSalesMinor,
      currencyCode: functionalCurrency,
      transactionDate: parsed.opsDate,
      costCategoryId: null,
      memo: `${memoBase} · sales`,
    });
  } else {
    await deleteLedgerByRef(supabase, organizationId, refs.sales);
  }

  if (parsed.cogsMinor != null && parsed.cogsMinor > BigInt(0)) {
    const neg = -parsed.cogsMinor;
    await upsertLedgerLine({
      supabase,
      organizationId,
      externalRef: refs.cogs,
      entryType: "expense",
      amountMinor: neg,
      amountFunctionalMinor: neg,
      currencyCode: functionalCurrency,
      transactionDate: parsed.opsDate,
      costCategoryId: categoryIds.cogs,
      memo: `${memoBase} · COGS`,
    });
  } else {
    await deleteLedgerByRef(supabase, organizationId, refs.cogs);
  }

  if (parsed.wasteMinor != null && parsed.wasteMinor > BigInt(0)) {
    const neg = -parsed.wasteMinor;
    await upsertLedgerLine({
      supabase,
      organizationId,
      externalRef: refs.waste,
      entryType: "expense",
      amountMinor: neg,
      amountFunctionalMinor: neg,
      currencyCode: functionalCurrency,
      transactionDate: parsed.opsDate,
      costCategoryId: categoryIds.waste,
      memo: `${memoBase} · waste`,
    });
  } else {
    await deleteLedgerByRef(supabase, organizationId, refs.waste);
  }

  if (parsed.metaAdSpendMinor != null && parsed.metaAdSpendMinor > BigInt(0)) {
    const neg = -parsed.metaAdSpendMinor;
    await upsertLedgerLine({
      supabase,
      organizationId,
      externalRef: refs.metaAds,
      entryType: "expense",
      amountMinor: neg,
      amountFunctionalMinor: neg,
      currencyCode: functionalCurrency,
      transactionDate: parsed.opsDate,
      costCategoryId: categoryIds.ads,
      memo: `${memoBase} · Meta ads`,
    });
  } else {
    await deleteLedgerByRef(supabase, organizationId, refs.metaAds);
  }
}

export async function syncDailyOperationsConfigs(opts: {
  supabase: SupabaseClient;
  configId?: string;
  organizationId?: string;
}): Promise<SyncRunResult[]> {
  const { supabase, configId, organizationId } = opts;
  let q = supabase.from("sheet_ingest_configs").select("*").eq("enabled", true);
  if (configId) q = q.eq("id", configId);
  if (organizationId) q = q.eq("organization_id", organizationId);
  const { data: configs, error: cErr } = await q;
  if (cErr) throw new Error(cErr.message);
  const list = (configs ?? []) as SheetIngestConfigRow[];
  const results: SyncRunResult[] = [];

  for (const config of list) {
    if (config.layout_kind !== "daily_operations_v1") {
      results.push({
        configId: config.id,
        organizationId: config.organization_id,
        runId: "",
        rowsScanned: 0,
        rowsOk: 0,
        rowsFailed: 0,
        status: "failed",
        error: `unsupported layout_kind: ${config.layout_kind}`,
      });
      continue;
    }

    let rowsScanned = 0;
    let rowsOk = 0;
    let rowsFailed = 0;
    let runId = "";
    let topError: string | undefined;

    const { data: runRow, error: runInsErr } = await supabase
      .from("sheet_import_runs")
      .insert({
        config_id: config.id,
        organization_id: config.organization_id,
        status: "running",
        rows_scanned: 0,
        rows_ok: 0,
        rows_failed: 0,
      })
      .select("id")
      .single();

    if (runInsErr || !runRow) {
      results.push({
        configId: config.id,
        organizationId: config.organization_id,
        runId: "",
        rowsScanned: 0,
        rowsOk: 0,
        rowsFailed: 0,
        status: "failed",
        error: runInsErr?.message ?? "run insert failed",
      });
      continue;
    }

    runId = runRow.id as string;

    try {
      const { data: org, error: oErr } = await supabase
        .from("organizations")
        .select("id, functional_currency")
        .eq("id", config.organization_id)
        .single();
      if (oErr || !org) throw new Error(oErr?.message ?? "organization not found");

      const fc = org.functional_currency as string;
      const { data: cur, error: curErr } = await supabase
        .from("currencies")
        .select("minor_units")
        .eq("code", fc)
        .single();
      if (curErr || cur == null) throw new Error(curErr?.message ?? "functional currency not in currencies table");

      const minorUnits = Number(cur.minor_units);
      if (![0, 2, 3].includes(minorUnits)) throw new Error(`unsupported minor_units: ${minorUnits}`);

      const categoryIds = await ensureCostCategoryIds(supabase, config.organization_id);

      const grid = await fetchSheetRange(config.spreadsheet_id, config.data_range_a1);
      const startRow = inferStartRowFromRangeA1(config.data_range_a1);

      for (let i = 0; i < grid.length; i++) {
        const row = grid[i] ?? [];
        const sheetRow = startRow + i;
        const cells = [...row];
        while (cells.length < 10) cells.push("");

        if (isRowEmpty(cells)) continue;
        rowsScanned++;

        try {
          const parsed = parseDailyOperationsRow(cells, sheetRow, minorUnits);
          await persistParsedRow({
            supabase,
            organizationId: config.organization_id,
            functionalCurrency: fc,
            categoryIds,
            parsed,
          });
          rowsOk++;
        } catch (e) {
          rowsFailed++;
          const msg = e instanceof Error ? e.message : String(e);
          await supabase.from("sheet_import_row_errors").insert({
            run_id: runId,
            row_number: sheetRow,
            raw_cells: toCellJson(cells),
            error_code: "ROW_PARSE_OR_PERSIST",
            error_message: msg.slice(0, 2000),
          });
        }
      }

      const status: SyncRunResult["status"] =
        rowsFailed === 0 ? "success" : rowsOk > 0 ? "partial" : rowsFailed > 0 ? "failed" : "success";

      await supabase
        .from("sheet_import_runs")
        .update({
          finished_at: new Date().toISOString(),
          status,
          rows_scanned: rowsScanned,
          rows_ok: rowsOk,
          rows_failed: rowsFailed,
          error_summary: rowsFailed ? `${rowsFailed} row(s) failed` : null,
        })
        .eq("id", runId);
    } catch (e) {
      topError = e instanceof Error ? e.message : String(e);
      await supabase
        .from("sheet_import_runs")
        .update({
          finished_at: new Date().toISOString(),
          status: "failed",
          rows_scanned: rowsScanned,
          rows_ok: rowsOk,
          rows_failed: rowsFailed,
          error_summary: topError.slice(0, 2000),
        })
        .eq("id", runId);
    }

    results.push({
      configId: config.id,
      organizationId: config.organization_id,
      runId,
      rowsScanned,
      rowsOk,
      rowsFailed,
      status:
        topError != null
          ? "failed"
          : rowsFailed === 0
            ? "success"
            : rowsOk > 0
              ? "partial"
              : "failed",
      error: topError,
    });
  }

  return results;
}
