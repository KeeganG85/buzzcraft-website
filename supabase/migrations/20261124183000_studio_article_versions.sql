-- Additive Studio versions. Does not drop columns, delete rows, or publish drafts.
-- Safe to re-run: new columns, the versions table, and the backfill are guarded.
-- content_html copied here is the existing plain-text body, not sanitised HTML.

alter table public.studio_articles
  add column if not exists subtitle text not null default '',
  add column if not exists published_version_id uuid,
  add column if not exists scheduled_at timestamptz,
  add column if not exists published_at timestamptz;

do $$
declare
  status_check record;
begin
  for status_check in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'studio_articles'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ~* 'status'
  loop
    execute format('alter table public.studio_articles drop constraint %I', status_check.conname);
  end loop;
end $$;

alter table public.studio_articles
  drop constraint if exists studio_articles_status_check;

alter table public.studio_articles
  add constraint studio_articles_status_check
  check (status in ('draft', 'in_review', 'approved', 'scheduled', 'published', 'archived'));

create table if not exists public.article_versions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.studio_articles (id) on delete cascade,
  version_number integer not null check (version_number > 0),
  content_json jsonb not null default '{}'::jsonb,
  content_html text not null default '',
  metadata_json jsonb not null default '{}'::jsonb,
  created_by text not null default '',
  created_at timestamptz not null default now(),
  revision_notes text not null default '',
  approval_status text not null default 'draft' check (approval_status in ('draft', 'approved')),
  approved_by text,
  approved_at timestamptz,
  unique (article_id, version_number)
);

create index if not exists article_versions_article_id_idx
  on public.article_versions (article_id);

create index if not exists studio_articles_status_idx
  on public.studio_articles (status);

insert into public.article_versions (
  article_id,
  version_number,
  content_json,
  content_html,
  metadata_json,
  created_by,
  created_at,
  revision_notes,
  approval_status,
  approved_by,
  approved_at
)
select
  article.id,
  1,
  jsonb_build_object(
    'title', article.title,
    'h1', article.h1,
    'excerpt', article.excerpt,
    'author', article.author,
    'category', article.category,
    'tags', to_jsonb(article.tags),
    'body', article.body,
    'hero_image', article.hero_image,
    'hero_alt', article.hero_alt,
    'seo_title', article.seo_title,
    'meta_description', article.meta_description,
    'canonical', article.canonical,
    'og_title', article.og_title,
    'og_description', article.og_description,
    'focus_phrase', article.focus_phrase,
    'source_note', article.source_note,
    'claims_checked', article.claims_checked
  ),
  article.body,
  jsonb_build_object(
    'slug', article.slug,
    'publish_date', article.publish_date,
    'status', article.status
  ),
  coalesce(nullif(article.author, ''), 'studio'),
  coalesce(article.created_at, now()),
  'Backfill from studio_articles',
  case when article.status = 'published' then 'approved' else 'draft' end,
  case when article.status = 'published' then coalesce(nullif(article.author, ''), 'studio') else null end,
  case when article.status = 'published' then coalesce(article.updated_at, article.created_at) else null end
from public.studio_articles article
where not exists (
  select 1
  from public.article_versions existing
  where existing.article_id = article.id
    and existing.version_number = 1
);

update public.studio_articles article
set
  published_version_id = version.id,
  published_at = coalesce(article.published_at, article.publish_date::timestamptz, article.updated_at)
from public.article_versions version
where version.article_id = article.id
  and version.version_number = 1
  and version.approval_status = 'approved'
  and article.status = 'published'
  and article.published_version_id is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'studio_articles_published_version_id_fkey'
  ) then
    alter table public.studio_articles
      add constraint studio_articles_published_version_id_fkey
      foreign key (published_version_id)
      references public.article_versions (id)
      on delete set null
      deferrable initially deferred;
  end if;
end $$;

alter table public.article_versions enable row level security;

revoke all privileges on table public.article_versions from anon, authenticated;

grant all privileges on table public.article_versions to service_role;

drop policy if exists deny_api_roles on public.article_versions;

create policy deny_api_roles on public.article_versions
  as restrictive for all to anon, authenticated
  using (false) with check (false);

comment on table public.article_versions is
  'Snapshots of studio_articles. Public pages read only the approved version named by published_version_id.';
