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

Phone `+27 67 952 1325`, email `info@buzzcraft.co.za`, Johannesburg, Gauteng, South Africa. No street address. The registered legal name and Information Officer are not published. See `lib/site-config.ts`.

## Canonical policy

Preferred host: `https://www.buzzcraft.co.za`. Directory routes use a trailing slash, the same shape as the live sitemap. `trailingSlash: true` in `next.config.ts` makes that the only public form. File URLs such as `/sitemap.xml` do not gain a slash.

## Routes

Public pages include home, services (websites, search visibility, lead systems), pricing, the Sprint, work, insights, tools, FOUND, the 120 Prompt OS, about, contact, the Scorecard and privacy. `/promptlibrary` returns 301 to `/120promptos`. Studio is private and is not in the sitemap.

## Scorecard and Studio

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` before a Scorecard request can be stored or a Prompt OS registration can unlock full instructions. The SQL migrations in `supabase/migrations` are documented only. They are not applied by this app.

Studio login also needs `STUDIO_EMAIL`, `STUDIO_PASSWORD_HASH` and `STUDIO_SESSION_SECRET`. Create the hash with `npm run studio:hash -- "password"`.

Nothing in this repository deploys the site or changes DNS, Hostinger, the CDN or production data.
