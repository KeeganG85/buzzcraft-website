-- Media library and the Studio storage bucket. Does not drop columns or delete rows.

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  mime text not null,
  byte_size integer not null check (byte_size > 0),
  width integer,
  height integer,
  alt text not null,
  created_at timestamptz not null default now()
);

alter table public.media_assets enable row level security;

revoke all privileges on table public.media_assets from anon, authenticated;
grant all privileges on table public.media_assets to service_role;

drop policy if exists deny_api_roles on public.media_assets;
create policy deny_api_roles on public.media_assets
  as restrictive for all to anon, authenticated
  using (false) with check (false);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'studio-media',
  'studio-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'studio_media_public_read'
  ) then
    create policy studio_media_public_read on storage.objects
      for select to anon, authenticated
      using (bucket_id = 'studio-media');
  end if;
end $$;

comment on table public.media_assets is
  'Uploaded Studio images. Public pages should use a file only when the published article version points at it.';
