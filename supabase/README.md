# Supabase schema

This folder documents the database the site expects. Applying it is a manual step in a Supabase project Keegan controls. This repository does not create or modify the production project.

## Environment

Set these on the server only. Never expose the service-role key to the browser.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

When they are missing, the Scorecard form still opens WhatsApp and tells the person the request was not stored.

## scorecard_requests

Migration: `migrations/20261116090000_scorecard_requests.sql`

| Column | Notes |
| --- | --- |
| id | uuid, generated |
| full_name, email, business_name | required |
| website_url | optional, matching the live form |
| headache | optional |
| privacy_consent | must be true |
| privacy_consent_at | when consent was given |
| privacy_policy_version | the policy version shown at the time |
| marketing_opt_in | separate, optional, default false |
| source_path, referrer | optional attribution |
| status | defaults to `new` |
| created_at | defaults to now |

Row level security is enabled and there is no public policy. Inserts use the service role from `app/api/scorecard/route.ts`.
