-- GAM HQ — private receipt images for OCR (path: {organization_id}/{auth.uid()}/…)
drop policy if exists "receipts_insert_org_member_own_folder" on storage.objects;
drop policy if exists "receipts_select_org_member_own_folder" on storage.objects;
drop policy if exists "receipts_update_org_member_own_folder" on storage.objects;
drop policy if exists "receipts_delete_org_member_own_folder" on storage.objects;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'receipts',
  'receipts',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Path layout: {organization_uuid}/{user_uuid}/{filename} (exactly three segments)
create policy "receipts_insert_org_member_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) in (
    select m.organization_id::text
    from public.organization_members m
    where m.user_id = auth.uid()
  )
  and split_part(name, '/', 2) = auth.uid()::text
);

create policy "receipts_select_org_member_own_folder"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) in (
    select m.organization_id::text
    from public.organization_members m
    where m.user_id = auth.uid()
  )
  and split_part(name, '/', 2) = auth.uid()::text
);

create policy "receipts_update_org_member_own_folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) in (
    select m.organization_id::text
    from public.organization_members m
    where m.user_id = auth.uid()
  )
  and split_part(name, '/', 2) = auth.uid()::text
)
with check (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) in (
    select m.organization_id::text
    from public.organization_members m
    where m.user_id = auth.uid()
  )
  and split_part(name, '/', 2) = auth.uid()::text
);

create policy "receipts_delete_org_member_own_folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) in (
    select m.organization_id::text
    from public.organization_members m
    where m.user_id = auth.uid()
  )
  and split_part(name, '/', 2) = auth.uid()::text
);
