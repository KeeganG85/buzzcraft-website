# Supabase schema

These SQL files are in the repo only. They have not been applied. Do not apply them, and do not set server env vars, until Keegan explicitly approves that after pull request review. This repository does not create or modify a Supabase project.

## Environment

These names are documented for a later approval. They are not set by this repository. Never expose a service-role key to the browser.

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

## prompt_os_registrations

Migration: `migrations/20261116100000_prompt_os_registrations.sql`

Stores the registration that unlocks The 120 Prompt OS. Columns: first name, email (unique), business name, what the business does, privacy consent and timestamp, separate marketing opt-in, and `token_hash` (SHA-256 of the httpOnly cookie). Prompt instructions are not stored in this table. They stay in `content/prompt-os/bodies.server.ts`, which is imported only on the server. If these env vars are missing, registration returns an error and the library stays locked.

## studio_articles and case_studies

Migration: `migrations/20261116110000_studio.sql`. This file has not been applied.

`studio_articles` holds the private article builder. A row is public only when `status` is `published`. The checklist in `lib/studio.ts` blocks publish when the title, H1, slug, excerpt, author, body, alt text, SEO title, meta description, canonical, source note or claims check is missing. Duplicate slugs are rejected. There is no external writing model.

`case_studies` holds studies added later in Studio. The two approved studies also live in `content/case-studies.ts`.

Studio login uses `STUDIO_EMAIL`, `STUDIO_PASSWORD_HASH` (create it with `npm run studio:hash`) and `STUDIO_SESSION_SECRET`. The session cookie is httpOnly and signed. `/studio` is disallowed in robots and is not in the sitemap.
