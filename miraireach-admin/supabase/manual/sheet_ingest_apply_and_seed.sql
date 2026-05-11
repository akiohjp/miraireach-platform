-- GAM HQ — ONE-SHOT for Supabase SQL Editor (Dashboard).
-- 1) Run this entire file once.
-- 2) Replace ORG and spreadsheet placeholder if needed before running:
--    - :ORG_UUID → your organizations.id (must already exist)
--    - spreadsheet_id stays placeholder until you paste the real Google Sheets ID.

-- === Part A: same as migrations/20260207120000_sheet_ingest_daily_operations.sql ===

-- GAM HQ — Google Sheets ingest: Daily_Operations hub + import audit + non-P&L facts.

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

create table if not exists public.sheet_import_row_errors (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.sheet_import_runs (id) on delete cascade,
  row_number int not null,
  raw_cells jsonb not null default '[]',
  error_code text not null,
  error_message text not null,
  created_at timestamptz not null default now()
);

create index if not exists sheet_import_row_errors_run_idx
  on public.sheet_import_row_errors (run_id);

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
  external_ref text not null,
  sheet_row int check (sheet_row is null or sheet_row >= 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_operation_facts_org_ref_unique unique (organization_id, external_ref)
);

create index if not exists daily_operation_facts_org_date_idx
  on public.daily_operation_facts (organization_id, ops_date desc);

comment on table public.daily_operation_facts is 'Daily ops metrics not modeled as ledger amounts (customers, impressions, etc.).';

create unique index if not exists ledger_entries_daily_ops_external_uidx
  on public.ledger_entries (organization_id, external_ref)
  where source_system = 'daily_operations_sheet' and external_ref is not null;

drop trigger if exists sheet_ingest_configs_touch on public.sheet_ingest_configs;
create trigger sheet_ingest_configs_touch before update on public.sheet_ingest_configs
for each row execute function public.touch_updated_at();

drop trigger if exists daily_operation_facts_touch on public.daily_operation_facts;
create trigger daily_operation_facts_touch before update on public.daily_operation_facts
for each row execute function public.touch_updated_at();

alter table public.sheet_ingest_configs enable row level security;
alter table public.sheet_import_runs enable row level security;
alter table public.sheet_import_row_errors enable row level security;
alter table public.daily_operation_facts enable row level security;

drop policy if exists "sheet_ingest_configs_select_member" on public.sheet_ingest_configs;
create policy "sheet_ingest_configs_select_member"
on public.sheet_ingest_configs for select to authenticated
using (public.gam_current_user_is_org_member(organization_id));

drop policy if exists "sheet_ingest_configs_write_privileged" on public.sheet_ingest_configs;
create policy "sheet_ingest_configs_write_privileged"
on public.sheet_ingest_configs for all to authenticated
using (public.gam_current_user_is_org_privileged(organization_id))
with check (public.gam_current_user_is_org_privileged(organization_id));

drop policy if exists "sheet_import_runs_select_member" on public.sheet_import_runs;
create policy "sheet_import_runs_select_member"
on public.sheet_import_runs for select to authenticated
using (public.gam_current_user_is_org_member(organization_id));

drop policy if exists "sheet_import_row_errors_select_member" on public.sheet_import_row_errors;
create policy "sheet_import_row_errors_select_member"
on public.sheet_import_row_errors for select to authenticated
using (
  exists (
    select 1 from public.sheet_import_runs r
    where r.id = sheet_import_row_errors.run_id
      and public.gam_current_user_is_org_member(r.organization_id)
  )
);

drop policy if exists "daily_operation_facts_select_member" on public.daily_operation_facts;
create policy "daily_operation_facts_select_member"
on public.daily_operation_facts for select to authenticated
using (public.gam_current_user_is_org_member(organization_id));

drop policy if exists "daily_operation_facts_write_privileged" on public.daily_operation_facts;
create policy "daily_operation_facts_write_privileged"
on public.daily_operation_facts for all to authenticated
using (public.gam_current_user_is_org_privileged(organization_id))
with check (public.gam_current_user_is_org_privileged(organization_id));

-- === Part B: initial sheet_ingest_configs (replace org UUID if different) ===
-- Current project .env example: NEXT_PUBLIC_GAM_ORGANIZATION_ID=7a970ba6-c47e-43b7-9400-d5b0555fdce4

insert into public.sheet_ingest_configs (
  organization_id,
  layout_kind,
  spreadsheet_id,
  sheet_name,
  data_range_a1,
  enabled
) values (
  '7a970ba6-c47e-43b7-9400-d5b0555fdce4'::uuid,
  'daily_operations_v1',
  'PLACEHOLDER_REPLACE_WITH_REAL_SPREADSHEET_ID',
  'Daily_Operations',
  'Daily_Operations!A2:J10000',
  true
)
on conflict (organization_id, spreadsheet_id, sheet_name)
do update set
  data_range_a1 = excluded.data_range_a1,
  enabled = excluded.enabled,
  updated_at = now();
