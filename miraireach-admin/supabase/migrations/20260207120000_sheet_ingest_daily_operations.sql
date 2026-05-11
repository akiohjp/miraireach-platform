-- GAM HQ — Google Sheets ingest: Daily_Operations hub + import audit + non-P&L facts.
-- Layout reference: Daily_Operations sheet
--   A Date, B Branch_Name, C Total_Sales, D Total_Customers, E COGS_Total, F Waste_Loss,
--   G Meta_Ad_Spend, H Meta_Impressions, I GBP_Views, J GBP_Conversions.
--
-- Ledger lines use source_system = 'daily_operations_sheet' and stable external_ref for upserts.
-- Integer metrics (customers, impressions, views, conversions) live in daily_operation_facts (bigint).

-- ── Ingest configuration ───────────────────────────────────────────────────
create table if not exists public.sheet_ingest_configs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  layout_kind text not null default 'daily_operations_v1'
    check (layout_kind = 'daily_operations_v1'),
  spreadsheet_id text not null,
  sheet_name text not null default 'Daily_Operations',
  data_range_a1 text not null,
  enabled boolean not null default true,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sheet_ingest_configs_org_sheet_unique unique (organization_id, spreadsheet_id, sheet_name)
);

create index if not exists sheet_ingest_configs_org_enabled_idx
  on public.sheet_ingest_configs (organization_id) where enabled = true;

comment on table public.sheet_ingest_configs is 'Maps an org to a spreadsheet tab/range for automated ingest.';
comment on column public.sheet_ingest_configs.data_range_a1 is 'Google A1 range for data rows (e.g. Daily_Operations!A2:J5000).';

-- ── Import run audit (one row per worker execution) ─────────────────────────
create table if not exists public.sheet_import_runs (
  id uuid primary key default gen_random_uuid(),
  config_id uuid not null references public.sheet_ingest_configs (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running', 'success', 'partial', 'failed')),
  rows_scanned int not null default 0 check (rows_scanned >= 0),
  rows_ok int not null default 0 check (rows_ok >= 0),
  rows_failed int not null default 0 check (rows_failed >= 0),
  error_summary text,
  meta jsonb not null default '{}'
);

create index if not exists sheet_import_runs_org_started_idx
  on public.sheet_import_runs (organization_id, started_at desc);

comment on table public.sheet_import_runs is 'Audit trail for each sheet sync run; supports partial success.';

-- ── Per-row failures (does not block other rows) ────────────────────────────
create table if not exists public.sheet_import_row_errors (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.sheet_import_runs(id) on delete cascade,
  -- 1-based row index within the sheet (as seen by the worker).
  row_number int not null,
  raw_cells jsonb not null default '[]',
  error_code text not null,
  error_message text not null,
  created_at timestamptz not null default now()
);

create index if not exists sheet_import_row_errors_run_idx
  on public.sheet_import_row_errors (run_id);

-- ── Non-ledger facts (counts / impressions) — strict bigint, non-negative ──
create table if not exists public.daily_operation_facts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  ops_date date not null,
  branch_name text not null,
  total_customers bigint check (total_customers is null or total_customers >= 0),
  meta_impressions bigint check (meta_impressions is null or meta_impressions >= 0),
  gbp_views bigint check (gbp_views is null or gbp_views >= 0),
  gbp_conversions bigint check (gbp_conversions is null or gbp_conversions >= 0),
  source_system text not null default 'daily_operations_sheet',
  -- Stable idempotency key, e.g. daily_ops_fact:v1:YYYY-MM-DD:branchKey
  external_ref text not null,
  sheet_row int check (sheet_row is null or sheet_row >= 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_operation_facts_org_ref_unique unique (organization_id, external_ref)
);

create index if not exists daily_operation_facts_org_date_idx
  on public.daily_operation_facts (organization_id, ops_date desc);

comment on table public.daily_operation_facts is 'Daily ops metrics not modeled as ledger amounts (customers, impressions, etc.).';

-- ── Ledger idempotency: one line per (org, source, external_ref) for sheet ingest ──
create unique index if not exists ledger_entries_daily_ops_external_uidx
  on public.ledger_entries (organization_id, external_ref)
  where source_system = 'daily_operations_sheet' and external_ref is not null;

-- ── updated_at ───────────────────────────────────────────────────────────────
drop trigger if exists sheet_ingest_configs_touch on public.sheet_ingest_configs;
create trigger sheet_ingest_configs_touch before update on public.sheet_ingest_configs
for each row execute function public.touch_updated_at();

drop trigger if exists daily_operation_facts_touch on public.daily_operation_facts;
create trigger daily_operation_facts_touch before update on public.daily_operation_facts
for each row execute function public.touch_updated_at();

-- ── RLS (read for org members; writes via service_role in workers) ────────────
alter table public.sheet_ingest_configs enable row level security;
alter table public.sheet_import_runs enable row level security;
alter table public.sheet_import_row_errors enable row level security;
alter table public.daily_operation_facts enable row level security;

create policy "sheet_ingest_configs_select_member"
on public.sheet_ingest_configs for select to authenticated
using (public.gam_current_user_is_org_member(organization_id));

create policy "sheet_ingest_configs_write_privileged"
on public.sheet_ingest_configs for all to authenticated
using (public.gam_current_user_is_org_privileged(organization_id))
with check (public.gam_current_user_is_org_privileged(organization_id));

create policy "sheet_import_runs_select_member"
on public.sheet_import_runs for select to authenticated
using (public.gam_current_user_is_org_member(organization_id));

create policy "sheet_import_row_errors_select_member"
on public.sheet_import_row_errors for select to authenticated
using (
  exists (
    select 1 from public.sheet_import_runs r
    where r.id = sheet_import_row_errors.run_id
      and public.gam_current_user_is_org_member(r.organization_id)
  )
);

create policy "daily_operation_facts_select_member"
on public.daily_operation_facts for select to authenticated
using (public.gam_current_user_is_org_member(organization_id));

create policy "daily_operation_facts_write_privileged"
on public.daily_operation_facts for all to authenticated
using (public.gam_current_user_is_org_privileged(organization_id))
with check (public.gam_current_user_is_org_privileged(organization_id));

-- Optional bootstrap: link placeholder org to a spreadsheet after you create the org.
-- Replace SPREADSHEET_ID, and use your real organization UUID (mnemonic "test-org-uuid-001"):
-- insert into public.sheet_ingest_configs (
--   organization_id, layout_kind, spreadsheet_id, sheet_name, data_range_a1, enabled
-- ) values (
--   'a0000001-0001-4001-8001-000000000001'::uuid,
--   'daily_operations_v1',
--   'SPREADSHEET_ID',
--   'Daily_Operations',
--   'Daily_Operations!A2:J10000',
--   true
-- ) on conflict (organization_id, spreadsheet_id, sheet_name) do nothing;
