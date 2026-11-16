-- Applied to the existing project buzzcraft-website.
-- Restrictive deny policies for anon and authenticated. These are not public access policies.
-- The service role bypasses row level security and remains the only writer.

revoke all privileges on table public.scorecard_requests from anon, authenticated;
revoke all privileges on table public.prompt_os_registrations from anon, authenticated;
revoke all privileges on table public.studio_articles from anon, authenticated;
revoke all privileges on table public.case_studies from anon, authenticated;

create policy deny_api_roles on public.scorecard_requests
  as restrictive for all to anon, authenticated
  using (false) with check (false);

create policy deny_api_roles on public.prompt_os_registrations
  as restrictive for all to anon, authenticated
  using (false) with check (false);

create policy deny_api_roles on public.studio_articles
  as restrictive for all to anon, authenticated
  using (false) with check (false);

create policy deny_api_roles on public.case_studies
  as restrictive for all to anon, authenticated
  using (false) with check (false);
