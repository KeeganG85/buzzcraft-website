-- Scorecard requests for BuzzCraft.
-- NOT APPLIED. Do not run this file until Keegan approves it after pull request review.
-- This repository does not create or change a Supabase project and does not set env vars.

create table if not exists public.scorecard_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  business_name text not null,
  website_url text,
  headache text,
  privacy_consent boolean not null,
  privacy_consent_at timestamptz not null,
  privacy_policy_version text not null,
  marketing_opt_in boolean not null default false,
  source_path text,
  referrer text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint scorecard_requests_consent_check check (privacy_consent = true)
);

comment on table public.scorecard_requests is
  'Search Visibility Scorecard requests. Marketing consent is a separate column and is never implied by privacy_consent.';

alter table public.scorecard_requests enable row level security;

-- No policies for anon or authenticated. The service role bypasses RLS.
-- Do not add a public insert policy.
