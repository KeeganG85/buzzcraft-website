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

## Not in this stage

Canonical host policy, page routes beyond the home shell, forms, Studio and the prompt libraries land in the following pull requests. Nothing here changes DNS, Hostinger, the CDN or production data.
