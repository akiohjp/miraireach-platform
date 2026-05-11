-- Fix infinite recursion on organization_members RLS: policies must not query
-- organization_members in a way that re-triggers the same table's policies.
-- Use SECURITY DEFINER helpers (RLS bypassed inside) for membership checks.

-- ── Helper functions (run as owner; stable for policy evaluation) ───────────
create or replace function public.gam_org_has_any_member(_org uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.organization_members om
    where om.organization_id = _org
  );
$$;

create or replace function public.gam_user_is_org_member(_org uuid, _uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.organization_members om
    where om.organization_id = _org
      and om.user_id = _uid
  );
$$;

create or replace function public.gam_current_user_is_org_member(_org uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.gam_user_is_org_member(_org, auth.uid());
$$;

create or replace function public.gam_current_user_org_role_in(_org uuid, _roles text[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.organization_members om
    where om.organization_id = _org
      and om.user_id = auth.uid()
      and om.role = any (_roles)
  );
$$;

create or replace function public.gam_current_user_is_org_privileged(_org uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.gam_current_user_org_role_in(
    _org,
    array['owner', 'director', 'finance']::text[]
  );
$$;

create or replace function public.gam_current_user_is_org_owner_or_director(_org uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.gam_current_user_org_role_in(
    _org,
    array['owner', 'director']::text[]
  );
$$;

create or replace function public.gam_current_user_is_org_owner(_org uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.gam_current_user_org_role_in(_org, array['owner']::text[]);
$$;

revoke all on function public.gam_org_has_any_member(uuid) from public;
revoke all on function public.gam_user_is_org_member(uuid, uuid) from public;
revoke all on function public.gam_current_user_is_org_member(uuid) from public;
revoke all on function public.gam_current_user_org_role_in(uuid, text[]) from public;
revoke all on function public.gam_current_user_is_org_privileged(uuid) from public;
revoke all on function public.gam_current_user_is_org_owner_or_director(uuid) from public;
revoke all on function public.gam_current_user_is_org_owner(uuid) from public;

grant execute on function public.gam_org_has_any_member(uuid) to authenticated;
grant execute on function public.gam_current_user_is_org_member(uuid) to authenticated;
grant execute on function public.gam_current_user_org_role_in(uuid, text[]) to authenticated;
grant execute on function public.gam_current_user_is_org_privileged(uuid) to authenticated;
grant execute on function public.gam_current_user_is_org_owner_or_director(uuid) to authenticated;
grant execute on function public.gam_current_user_is_org_owner(uuid) to authenticated;

-- service_role / postgres already bypass RLS; optional explicit grant for CLI tools:
grant execute on function public.gam_org_has_any_member(uuid) to service_role;
grant execute on function public.gam_user_is_org_member(uuid, uuid) to service_role;

-- ── Drop policies that recurse ───────────────────────────────────────────────
drop policy if exists "organizations_select_member" on public.organizations;
drop policy if exists "organizations_update_privileged" on public.organizations;

drop policy if exists "organization_members_select_self" on public.organization_members;
drop policy if exists "organization_members_insert_bootstrap_or_invite" on public.organization_members;
drop policy if exists "organization_members_delete_self_or_admin" on public.organization_members;

drop policy if exists "clients_org_access" on public.clients;
drop policy if exists "projects_org_access" on public.projects;
drop policy if exists "cost_categories_org_access" on public.cost_categories;
drop policy if exists "fx_rates_org_access" on public.fx_rates;
drop policy if exists "budget_periods_org_access" on public.budget_periods;
drop policy if exists "ledger_entries_org_access" on public.ledger_entries;

drop policy if exists "receipts_insert_org_member_own_folder" on storage.objects;
drop policy if exists "receipts_select_org_member_own_folder" on storage.objects;
drop policy if exists "receipts_update_org_member_own_folder" on storage.objects;
drop policy if exists "receipts_delete_org_member_own_folder" on storage.objects;

-- ── organizations ────────────────────────────────────────────────────────────
create policy "organizations_select_member" on public.organizations
for select to authenticated using (
  public.gam_current_user_is_org_member(id)
);

create policy "organizations_update_privileged" on public.organizations
for update to authenticated using (
  public.gam_current_user_is_org_privileged(id)
) with check (
  public.gam_current_user_is_org_privileged(id)
);

-- ── organization_members ───────────────────────────────────────────────────
create policy "organization_members_select_visible" on public.organization_members
for select to authenticated using (
  user_id = auth.uid()
  or public.gam_current_user_is_org_member(organization_id)
);

create policy "organization_members_insert_bootstrap_or_invite" on public.organization_members
for insert to authenticated with check (
  (
    user_id = auth.uid()
    and not public.gam_org_has_any_member(organization_id)
  )
  or public.gam_current_user_is_org_owner_or_director(organization_id)
);

create policy "organization_members_delete_self_or_owner" on public.organization_members
for delete to authenticated using (
  user_id = auth.uid()
  or public.gam_current_user_is_org_owner(organization_id)
);

-- ── Scoped tables ───────────────────────────────────────────────────────────
create policy "clients_org_access" on public.clients
for all to authenticated using (
  public.gam_current_user_is_org_member(organization_id)
) with check (
  public.gam_current_user_is_org_member(organization_id)
);

create policy "projects_org_access" on public.projects
for all to authenticated using (
  public.gam_current_user_is_org_member(organization_id)
) with check (
  public.gam_current_user_is_org_member(organization_id)
);

create policy "cost_categories_org_access" on public.cost_categories
for all to authenticated using (
  public.gam_current_user_is_org_member(organization_id)
) with check (
  public.gam_current_user_is_org_member(organization_id)
);

create policy "fx_rates_org_access" on public.fx_rates
for all to authenticated using (
  organization_id is null
  or public.gam_current_user_is_org_member(organization_id)
) with check (
  organization_id is null
  or public.gam_current_user_is_org_member(organization_id)
);

create policy "budget_periods_org_access" on public.budget_periods
for all to authenticated using (
  public.gam_current_user_is_org_member(organization_id)
) with check (
  public.gam_current_user_is_org_member(organization_id)
);

create policy "ledger_entries_org_access" on public.ledger_entries
for all to authenticated using (
  public.gam_current_user_is_org_member(organization_id)
) with check (
  public.gam_current_user_is_org_member(organization_id)
);

-- ── Storage: receipts (same pattern, no subselect on organization_members) ──
create policy "receipts_insert_org_member_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) ~ '^[0-9a-f-]{36}$'
  and public.gam_current_user_is_org_member(split_part(name, '/', 1)::uuid)
  and split_part(name, '/', 2) = auth.uid()::text
);

create policy "receipts_select_org_member_own_folder"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) ~ '^[0-9a-f-]{36}$'
  and public.gam_current_user_is_org_member(split_part(name, '/', 1)::uuid)
  and split_part(name, '/', 2) = auth.uid()::text
);

create policy "receipts_update_org_member_own_folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) ~ '^[0-9a-f-]{36}$'
  and public.gam_current_user_is_org_member(split_part(name, '/', 1)::uuid)
  and split_part(name, '/', 2) = auth.uid()::text
)
with check (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) ~ '^[0-9a-f-]{36}$'
  and public.gam_current_user_is_org_member(split_part(name, '/', 1)::uuid)
  and split_part(name, '/', 2) = auth.uid()::text
);

create policy "receipts_delete_org_member_own_folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) ~ '^[0-9a-f-]{36}$'
  and public.gam_current_user_is_org_member(split_part(name, '/', 1)::uuid)
  and split_part(name, '/', 2) = auth.uid()::text
);
