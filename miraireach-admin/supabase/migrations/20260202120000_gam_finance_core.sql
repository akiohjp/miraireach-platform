-- GAM HQ — financial core (P&L, cost control, projects / engagements)
-- Run in Supabase SQL Editor or via `supabase db push` after linking the project.
-- Amounts: store values in ISO 4217 minor units (e.g. USD cents, AED fils, JPY = whole yen with minor_units = 0).
--
-- Bootstrap (first tenant): after policies exist, from the app: insert `organizations`,
-- then insert `organization_members` with your `auth.uid()` and role `owner`.
-- Or run once in SQL Editor as postgres if you prefer a manual tenant setup.

-- ── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Reference: currencies ───────────────────────────────────────────────────
create table if not exists public.currencies (
  code char(3) primary key,
  name_english text not null,
  minor_units smallint not null default 2,
  constraint currencies_minor_units_check check (minor_units in (0, 2, 3))
);

comment on table public.currencies is 'ISO 4217 currency codes; minor_units used to interpret amount_minor.';

-- Seed core reporting currencies (extend as needed)
insert into public.currencies (code, name_english, minor_units) values
  ('JPY', 'Japanese yen', 0),
  ('USD', 'United States dollar', 2),
  ('AED', 'UAE dirham', 2),
  ('EUR', 'Euro', 2),
  ('SAR', 'Saudi riyal', 2),
  ('GBP', 'British pound', 2)
on conflict (code) do nothing;

-- ── Multi-tenant org (consulting firm operating GAM) ───────────────────────
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  functional_currency char(3) not null references public.currencies (code),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.organizations.functional_currency is 'Headline reporting currency; ledger lines also store functional snapshot in amount_functional_minor.';

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'viewer'
    check (role in ('owner', 'director', 'finance', 'consultant', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create index if not exists organization_members_user_id_idx on public.organization_members (user_id);

-- ── Clients & projects (consulting engagements) ───────────────────────────
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  legal_name text,
  display_name text not null,
  country_code char(2),
  default_currency char(3) not null references public.currencies (code),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_organization_id_idx on public.clients (organization_id);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  client_id uuid references public.clients (id) on delete set null,
  code text not null,
  name text not null,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'on_hold', 'closed')),
  start_date date,
  end_date date,
  billing_currency char(3) not null references public.currencies (code),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_org_code_unique unique (organization_id, code)
);

create index if not exists projects_organization_id_idx on public.projects (organization_id);
create index if not exists projects_client_id_idx on public.projects (client_id);
create index if not exists projects_status_idx on public.projects (organization_id, status);

-- ── Cost buckets (cost control UI ↔ DB) ────────────────────────────────────
create table if not exists public.cost_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  slug text not null,
  label text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  constraint cost_categories_org_slug_unique unique (organization_id, slug)
);

create index if not exists cost_categories_organization_id_idx on public.cost_categories (organization_id);

-- ── FX (optional; for audit trail of conversion at booking time) ───────────
create table if not exists public.fx_rates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  base_currency char(3) not null references public.currencies (code),
  quote_currency char(3) not null references public.currencies (code),
  valid_on date not null,
  -- quote per 1 base unit, expressed as decimal (e.g. 1 USD = 3.67 AED → rate 3.67 when base=USD quote=AED)
  rate numeric(28, 14) not null,
  source text,
  created_at timestamptz not null default now(),
  constraint fx_rates_base_quote_different check (base_currency <> quote_currency),
  constraint fx_rates_org_day_unique unique nulls not distinct (organization_id, base_currency, quote_currency, valid_on)
);

create index if not exists fx_rates_lookup_idx on public.fx_rates (organization_id, base_currency, quote_currency, valid_on desc);

-- ── Budget vs actual (cost control) ────────────────────────────────────────
create table if not exists public.budget_periods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid references public.projects (id) on delete cascade,
  cost_category_id uuid references public.cost_categories (id) on delete cascade,
  period_start date not null,
  period_end date not null,
  budget_amount_functional_minor bigint not null,
  constraint budget_periods_range_check check (period_start <= period_end),
  constraint budget_periods_org_scope unique nulls not distinct (
    organization_id, project_id, cost_category_id, period_start, period_end
  )
);

create index if not exists budget_periods_org_dates_idx on public.budget_periods (organization_id, period_start, period_end);

comment on column public.budget_periods.budget_amount_functional_minor is 'Budget cap in organization functional currency minor units.';

-- ── Ledger: revenue & expense lines driving P&L ─────────────────────────────
create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  cost_category_id uuid references public.cost_categories (id) on delete set null,
  entry_type text not null check (entry_type in ('revenue', 'expense', 'adjustment')),
  transaction_date date not null,
  recognition_date date,
  amount_minor bigint not null,
  currency_code char(3) not null references public.currencies (code),
  amount_functional_minor bigint not null,
  fx_rate_applied numeric(28, 14),
  memo text,
  source_system text,
  external_ref text,
  metadata jsonb not null default '{}',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ledger_entries_amount_sign_check check (
    (entry_type = 'revenue' and amount_minor > 0)
    or (entry_type = 'expense' and amount_minor < 0)
    or (entry_type = 'adjustment')
  )
);

create index if not exists ledger_entries_org_date_idx on public.ledger_entries (organization_id, transaction_date);
create index if not exists ledger_entries_project_idx on public.ledger_entries (project_id);
create index if not exists ledger_entries_category_idx on public.ledger_entries (cost_category_id);
create index if not exists ledger_entries_type_date_idx on public.ledger_entries (organization_id, entry_type, transaction_date);

comment on table public.ledger_entries is 'Signed amounts in transaction currency (amount_minor) + functional snapshot (amount_functional_minor) for consolidated P&L.';
comment on column public.ledger_entries.amount_minor is 'Minor units of currency_code; revenue positive, expense negative.';
comment on column public.ledger_entries.amount_functional_minor is 'Same instant magnitude converted to organizations.functional_currency minor units.';

-- ── Monthly P&L roll-up (functional currency) ────────────────────────────────
drop view if exists public.v_pl_monthly_functional;

create view public.v_pl_monthly_functional
with (security_invoker = true) as
select
  organization_id,
  date_trunc('month', transaction_date)::date as month,
  coalesce(sum(amount_functional_minor) filter (where entry_type = 'revenue'), 0)::bigint
    as revenue_functional_minor,
  coalesce(sum(amount_functional_minor) filter (where entry_type = 'expense'), 0)::bigint
    as expense_functional_minor,
  coalesce(sum(amount_functional_minor), 0)::bigint as net_functional_minor
from public.ledger_entries
group by organization_id, date_trunc('month', transaction_date);

comment on view public.v_pl_monthly_functional is
  'Monthly P&L in organization functional currency; security_invoker applies RLS from ledger_entries.';

-- ── updated_at touch ────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists organizations_touch on public.organizations;
create trigger organizations_touch before update on public.organizations
for each row execute function public.touch_updated_at();

drop trigger if exists clients_touch on public.clients;
create trigger clients_touch before update on public.clients
for each row execute function public.touch_updated_at();

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects
for each row execute function public.touch_updated_at();

drop trigger if exists ledger_entries_touch on public.ledger_entries;
create trigger ledger_entries_touch before update on public.ledger_entries
for each row execute function public.touch_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.currencies enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.cost_categories enable row level security;
alter table public.fx_rates enable row level security;
alter table public.budget_periods enable row level security;
alter table public.ledger_entries enable row level security;

-- Currencies: read-only directory for any authenticated user
create policy "currencies_select_authenticated" on public.currencies
for select to authenticated using (true);

-- Org: members can read their organizations
create policy "organizations_select_member" on public.organizations
for select to authenticated using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = organizations.id and m.user_id = auth.uid()
  )
);

create policy "organizations_insert_authenticated" on public.organizations
for insert to authenticated with check (true);

create policy "organizations_update_privileged" on public.organizations
for update to authenticated using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = organizations.id and m.user_id = auth.uid()
    and m.role in ('owner', 'director', 'finance')
  )
) with check (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = organizations.id and m.user_id = auth.uid()
    and m.role in ('owner', 'director', 'finance')
  )
);

-- Members can read membership rows for orgs they belong to
create policy "organization_members_select_self" on public.organization_members
for select to authenticated using (
  user_id = auth.uid()
  or exists (
    select 1 from public.organization_members m
    where m.organization_id = organization_members.organization_id and m.user_id = auth.uid()
  )
);

create policy "organization_members_insert_bootstrap_or_invite" on public.organization_members
for insert to authenticated with check (
  (
    user_id = auth.uid()
    and not exists (
      select 1 from public.organization_members e
      where e.organization_id = organization_members.organization_id
    )
  )
  or exists (
    select 1 from public.organization_members m
    where m.organization_id = organization_members.organization_id
      and m.user_id = auth.uid()
      and m.role in ('owner', 'director')
  )
);

create policy "organization_members_delete_self_or_admin" on public.organization_members
for delete to authenticated using (
  user_id = auth.uid()
  or exists (
    select 1 from public.organization_members m
    where m.organization_id = organization_members.organization_id
      and m.user_id = auth.uid()
      and m.role = 'owner'
  )
);

-- Scoped CRUD: same pattern for all org-scoped tables
create policy "clients_org_access" on public.clients
for all to authenticated using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = clients.organization_id and m.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = clients.organization_id and m.user_id = auth.uid()
  )
);

create policy "projects_org_access" on public.projects
for all to authenticated using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = projects.organization_id and m.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = projects.organization_id and m.user_id = auth.uid()
  )
);

create policy "cost_categories_org_access" on public.cost_categories
for all to authenticated using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = cost_categories.organization_id and m.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = cost_categories.organization_id and m.user_id = auth.uid()
  )
);

create policy "fx_rates_org_access" on public.fx_rates
for all to authenticated using (
  organization_id is null
  or exists (
    select 1 from public.organization_members m
    where m.organization_id = fx_rates.organization_id and m.user_id = auth.uid()
  )
) with check (
  organization_id is null
  or exists (
    select 1 from public.organization_members m
    where m.organization_id = fx_rates.organization_id and m.user_id = auth.uid()
  )
);

create policy "budget_periods_org_access" on public.budget_periods
for all to authenticated using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = budget_periods.organization_id and m.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = budget_periods.organization_id and m.user_id = auth.uid()
  )
);

create policy "ledger_entries_org_access" on public.ledger_entries
for all to authenticated using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = ledger_entries.organization_id and m.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = ledger_entries.organization_id and m.user_id = auth.uid()
  )
);

-- ── API grants (adjust if your project restricts Data API to specific schemas) ─
grant usage on schema public to anon, authenticated;
grant select on public.currencies to anon, authenticated;
grant select on public.organizations, public.organization_members, public.clients, public.projects,
  public.cost_categories, public.fx_rates, public.budget_periods, public.ledger_entries
  to authenticated;
grant insert, update, delete on public.organizations, public.organization_members, public.clients, public.projects,
  public.cost_categories, public.fx_rates, public.budget_periods, public.ledger_entries
  to authenticated;
grant select on public.v_pl_monthly_functional to authenticated;
