-- Registration gate for The 120 Prompt OS.
-- Applied to the existing project buzzcraft-website after Keegan approved it.
-- Full prompt text is not stored here. It stays in the server module.

create table if not exists public.prompt_os_registrations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text not null unique,
  business_name text not null,
  business_does text not null,
  privacy_consent boolean not null,
  privacy_consent_at timestamptz not null,
  marketing_opt_in boolean not null default false,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint prompt_os_consent_check check (privacy_consent = true)
);

comment on table public.prompt_os_registrations is
  'People registered for The 120 Prompt OS. token_hash is a SHA-256 of the httpOnly cookie. Marketing consent is separate.';

alter table public.prompt_os_registrations enable row level security;
