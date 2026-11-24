# BuzzCraft website

Fresh Next.js app for the BuzzCraft website revamp. It replaces the 7 July 2026 draft in this repository. It is not deployed from this work.

## Stack

Next.js 15, React 19, TypeScript, Tailwind CSS 4. DM Sans is self-hosted in `app/fonts`.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

## Logos

Only the two supplied files are used as logos, trimmed and exported to WebP and AVIF in `public/brand`. Mascot poses are character art, not logos. The mascot video is a motion reference and is not shipped.

## Public facts

Phone `+27 67 952 1325`, email `info@buzzcraft.co.za`, Johannesburg, Gauteng, South Africa. No street address. The registered legal name is Buzzcraft (Pty) Ltd, registration number 2025/576404/07. VAT number and Information Officer stay as placeholders in `lib/site-config.ts`.

## Canonical policy

Preferred host: `https://www.buzzcraft.co.za`. Directory routes use a trailing slash, the same shape as the live sitemap. `trailingSlash: true` in `next.config.ts` makes that the only public form. File URLs such as `/sitemap.xml` do not gain a slash.

## Routes

Public pages include home, services (websites, search visibility, lead systems), pricing, the Sprint, work, insights, tools, FOUND, the 120 Prompt OS, about, contact, the Scorecard and privacy. `/promptlibrary` returns 301 to `/120promptos`. Studio is private and is not in the sitemap.

## Scorecard and Studio

The SQL in `supabase/migrations` has been applied to the existing Supabase project `buzzcraft-website`. This repository does not store keys. `SUPABASE_URL` and `STUDIO_SESSION_SECRET` are set on the Vercel project `buzzcraft-website` for Preview and Production only. `SUPABASE_SERVICE_ROLE_KEY` is still unset, because that value is not available from the project tools used here. Until Keegan sets it on Preview and Production, the Scorecard opens WhatsApp only, Prompt OS registration stays locked, and Studio cannot store articles. Do not prefix that key with `NEXT_PUBLIC_`.

Do not set `STUDIO_EMAIL` or `STUDIO_PASSWORD_HASH` in this repository. Keegan sets both on the Vercel project, Preview and Production, after choosing the Studio login.

Generate the password hash on your own machine. The script prints the hash and does not write it to disk:

```bash
npm run studio:hash -- "your password"
```

Copy the printed `scrypt$...` line into `STUDIO_PASSWORD_HASH`. Put the Studio login email in `STUDIO_EMAIL`. Do not commit either value.

The Studio login limiter is an in-memory cap of five attempts per ten minutes **per application instance**, not a global cap. Login ignores `X-Forwarded-For` until the actual ingress is verified, so requests share one unknown-address bucket per instance. This code does not claim active production protection while the public route is unverified.

Nothing in this repository deploys the site, promotes a deployment, or changes DNS, Hostinger or the CDN.

## Administrator notes

Set these on the Vercel project for Preview and Production. Leave them blank in git. None of them use a `NEXT_PUBLIC_` prefix. If a value is missing, that feature stays off and the rest of the site still serves.

| Name | What it does when set | What happens when it is missing |
| --- | --- | --- |
| `STUDIO_EMAIL` | The one Studio login address | Studio login returns 503 |
| `STUDIO_PASSWORD_HASH` | The scrypt hash for that login | Studio login returns 503 |
| `STUDIO_SESSION_SECRET` | Signs the `studio_session` cookie | Studio login returns 503 |
| `SUPABASE_URL` | Project URL for server reads and writes | Scorecard, Prompt OS registration and Studio storage stay off |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for those writes | The same storage features stay off. Article editing in the browser can still be opened, and a save says storage is not configured |
| `XAI_API_KEY` | Lets Studio call xAI | Generation returns 503. The editor can still save |
| `XAI_MODEL` | Names the model. The code does not choose one | Generation returns 503. The editor can still save |
| `CRON_SECRET` | Authorises `GET /api/studio/cron/publish/` | A saved schedule is stored and the screen says it will not run. The route returns 503 |

`STUDIO_EMAIL`, `STUDIO_PASSWORD_HASH` and `STUDIO_SESSION_SECRET` are all required together. Generate the password hash on your own machine. The script prints the hash and does not write it to disk:

```bash
npm run studio:hash -- "your password"
```

Copy the printed `scrypt$...` line into `STUDIO_PASSWORD_HASH`. Put the Studio login email in `STUDIO_EMAIL`. Do not commit either value.

The session cookie is `httpOnly` and `SameSite=Lax`. Studio writes are same-origin JSON posts. That is the cross-site control. There is no separate CSRF token.

`CRON_SECRET` is unset. This repository does not register a Vercel cron, because a `crons` entry in `vercel.json` stopped a preview before the build started. When Keegan is ready, set `CRON_SECRET` on Vercel and add a cron there for `GET /api/studio/cron/publish/` with `Authorization: Bearer <CRON_SECRET>`. Until then, scheduled articles stay scheduled.

Generation never publishes an article. The July drafts in `content/insights.ts` stay `published: false`.

Core Web Vitals were not measured in this pass. Do not treat a successful build as a Core Web Vitals result.
