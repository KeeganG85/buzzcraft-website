-- Private Studio: articles and extra case studies.
-- Applied to the existing project buzzcraft-website after Keegan approved it.
-- Human publish only. No public read or write policies.

create table if not exists public.studio_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  h1 text not null,
  excerpt text not null default '',
  author text not null default '',
  category text not null default '',
  tags text[] not null default '{}',
  body text not null default '',
  hero_image text not null default '',
  hero_alt text not null default '',
  publish_date date,
  seo_title text not null default '',
  meta_description text not null default '',
  canonical text not null default '',
  og_title text not null default '',
  og_description text not null default '',
  focus_phrase text not null default '',
  source_note text not null default '',
  claims_checked boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  client_name text not null,
  url text not null,
  location text not null default '',
  summary text not null default '',
  observed text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.studio_articles enable row level security;
alter table public.case_studies enable row level security;

comment on table public.studio_articles is
  'Human-published insights. status=published is the only public state. There is no auto-publish.';
comment on table public.case_studies is
  'Additional case studies added in Studio. The two approved studies also live in the repository.';
