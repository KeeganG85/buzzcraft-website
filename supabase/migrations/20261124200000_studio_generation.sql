-- Generation logs and unverified sources. Does not drop columns or delete rows.
-- Logs store the model name, status, token counts and an error class. No prompts and no keys.

create table if not exists public.ai_generation_logs (
  id uuid primary key default gen_random_uuid(),
  model text not null,
  action text not null,
  status text not null check (status in ('ok', 'error')),
  prompt_tokens integer,
  completion_tokens integer,
  error_class text,
  created_at timestamptz not null default now()
);

create table if not exists public.article_sources (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.studio_articles (id) on delete cascade,
  title text not null default '',
  url text not null,
  published_on date,
  claim text not null default '',
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists article_sources_article_id_idx on public.article_sources (article_id);

alter table public.ai_generation_logs enable row level security;
alter table public.article_sources enable row level security;

revoke all privileges on table public.ai_generation_logs from anon, authenticated;
revoke all privileges on table public.article_sources from anon, authenticated;

grant all privileges on table public.ai_generation_logs to service_role;
grant all privileges on table public.article_sources to service_role;

drop policy if exists deny_api_roles on public.ai_generation_logs;
drop policy if exists deny_api_roles on public.article_sources;

create policy deny_api_roles on public.ai_generation_logs
  as restrictive for all to anon, authenticated
  using (false) with check (false);

create policy deny_api_roles on public.article_sources
  as restrictive for all to anon, authenticated
  using (false) with check (false);

comment on table public.ai_generation_logs is
  'Model name, status, token counts and error class. Do not store prompts, keys or client notes.';
comment on table public.article_sources is
  'Sources attached to a draft. verified stays false until a person checks the claim.';
