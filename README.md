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

Phone `+27 67 952 1325`, email `info@buzzcraft.co.za`, Johannesburg, Gauteng, South Africa. No street address. The registered legal name is Buzzcraft (Pty) Ltd. VAT number, company registration number and Information Officer stay as placeholders in `lib/site-config.ts`.

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

Nothing in this repository deploys the site, promotes a deployment, or changes DNS, Hostinger or the CDN.
