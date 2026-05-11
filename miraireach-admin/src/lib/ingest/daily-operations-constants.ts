/** Mnemonic: "test-org-uuid-001" — valid UUID placeholder for local ingest config / docs. */
export const GAM_TEST_ORG_PLACEHOLDER = "a0000001-0001-4001-8001-000000000001";

export const DAILY_OPS_SOURCE_SYSTEM = "daily_operations_sheet" as const;

export const DAILY_OPS_LAYOUT_KIND = "daily_operations_v1" as const;

/** Prefix for ledger line keys: sales, cogs, waste, meta_ads */
export function ledgerExternalRef(opsDate: string, branchKey: string, lineSuffix: string): string {
  return `daily_ops:v1:${opsDate}:${branchKey}:${lineSuffix}`;
}

/** Prefix for daily_operation_facts upsert */
export function factsExternalRef(opsDate: string, branchKey: string): string {
  return `daily_ops_fact:v1:${opsDate}:${branchKey}`;
}

/** Normalize branch label for stable keys (keeps CJK alphanumerics). */
export function branchKeyFromName(branchName: string): string {
  const t = branchName.trim().replace(/\s+/g, "_");
  if (!t) return "unknown";
  return t.slice(0, 128);
}

/** Slugs auto-provisioned for sheet-derived expense lines (aligns with dashboard "ads" ROI). */
export const DAILY_OPS_COST_SLUGS = {
  cogs: "cogs",
  waste: "waste",
  ads: "ads",
} as const;
