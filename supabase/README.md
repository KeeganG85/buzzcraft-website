# Supabase schema

These SQL files have been applied to the existing Supabase project `buzzcraft-website` (ref `rchnpuffemxfqlpxrurp`, region eu-central-1). No second project was created. This repository does not store keys.

## Environment

Never expose a service-role key to the browser, and never commit it.

- `SUPABASE_URL` is set on Vercel Preview and Production.
- `SUPABASE_SERVICE_ROLE_KEY` is still for Keegan to set on those same targets. The tools used here only return publishable keys, so this name was left unset.

When the service-role key is missing, the Scorecard form still opens WhatsApp and tells the person the request was not stored.

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

Row level security is enabled. `anon` and `authenticated` have no table grants. A later migration adds a restrictive deny policy (`using (false)`) for those roles. That policy is not a public read or write grant. Inserts use the service role from `app/api/scorecard/route.ts`.

## prompt_os_registrations

Migration: `migrations/20261116100000_prompt_os_registrations.sql`

Stores the registration that unlocks The 120 Prompt OS. Columns: first name, email (unique), business name, what the business does, privacy consent and timestamp, separate marketing opt-in, and `token_hash` (SHA-256 of the httpOnly cookie). Prompt instructions are not stored in this table. They stay in `content/prompt-os/bodies.server.ts`, which is imported only on the server. If these env vars are missing, registration returns an error and the library stays locked.

## studio_articles and case_studies

Migration: `migrations/20261116110000_studio.sql`. Applied with the other files.

`studio_articles` holds the private article builder. A row is public only when `status` is `published` and `published_version_id` points at an approved row in `article_versions`. Draft, in review, approved, scheduled and archived rows stay private. The checklist in `lib/studio.ts` blocks publish when the title, H1, slug, excerpt, author, body, alt text, SEO title, meta description, canonical, source note or claims check is missing. Duplicate slugs are rejected. There is no external writing model.

Migration `migrations/20261124183000_studio_article_versions.sql` adds `article_versions` and copies each existing article into version 1. It widens `status` and does not drop columns or delete rows. The flat article columns stay until a later phase edits through versions. `content_html` in that backfill is the plain-text body.

Migration `migrations/20261124200000_studio_generation.sql` adds `ai_generation_logs` and `article_sources`. Logs keep the model name, status, token counts and an error class. They do not store prompts, keys or client notes. Source rows stay `verified = false` until a person checks them.

`case_studies` holds studies added later in Studio. The two approved studies also live in `content/case-studies.ts`.

Studio login uses `STUDIO_EMAIL`, `STUDIO_PASSWORD_HASH` and `STUDIO_SESSION_SECRET`. The session cookie is httpOnly and signed. `/studio` is disallowed in robots and is not in the sitemap.

`STUDIO_SESSION_SECRET` is set on Vercel Preview and Production. Do not set `STUDIO_EMAIL` or `STUDIO_PASSWORD_HASH` from this repository. Keegan generates the hash locally and sets both names himself:

```bash
npm run studio:hash -- "your password"
```

The script prints one `scrypt$16384$8$1$...` line and does not write the password or the hash to disk. Paste that line into `STUDIO_PASSWORD_HASH` on Vercel Preview and Production, next to `STUDIO_EMAIL`.
