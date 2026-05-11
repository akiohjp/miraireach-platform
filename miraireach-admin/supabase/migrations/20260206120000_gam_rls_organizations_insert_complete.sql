-- Completes org RLS after 20260205120000: ensure authenticated bootstrap INSERT on organizations.
-- The recursion fix dropped/recreates select & update policies only; insert must remain for new tenants.
-- Idempotent: safe to re-run.

drop policy if exists "organizations_insert_authenticated" on public.organizations;

create policy "organizations_insert_authenticated" on public.organizations
for insert to authenticated
with check (true);
