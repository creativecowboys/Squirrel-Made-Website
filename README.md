# Squirrel Made Products — squirrelmadeproducts.com

Next.js (App Router) storefront for Squirrel Made Products. Products, collections and the cart come from Shopify's Storefront API; checkout is Shopify's hosted checkout. Deployed on Vercel (project `squirrel-made-website`, team Creative Cowboys). Push to `main` = production.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

## Environment variables

Set these in **Vercel → squirrel-made-website → Settings → Environment Variables** (Production + Preview). Locally they go in `.env.local`, which is git-ignored — never commit them.

| Variable | Required | What it is |
|---|---|---|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | yes | `<store>.myshopify.com` |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | yes | Shopify **Storefront** API access token (public token — safe in the browser) |
| `RESEND_API_KEY` | yes | Resend API key for the newsletter form (`/api/subscribe`) |
| `RESEND_AUDIENCE_ID` | yes | Resend audience the signups go into |
| `NEXT_PUBLIC_GA4_ID` | no | GA4 Measurement ID (`G-XXXXXXXXXX`). Unset = GA4 off |
| `NEXT_PUBLIC_GSC_TOKEN` | no | Google Search Console HTML-tag verification value. Unset = no tag |

Fallback: if the `NEXT_PUBLIC_SHOPIFY_*` vars are missing, `next.config.ts` reads the old `VITE_SHOPIFY_STORE_DOMAIN` / `VITE_SHOPIFY_STOREFRONT_TOKEN` names (still set in Vercel from the Vite build).

## Route map

| URL | Source | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Hero + product grid (server-fetched from Shopify, revalidates hourly) |
| `/our-story` | `app/our-story/page.tsx` | |
| `/our-promise` | `app/our-promise/page.tsx` | |
| `/find-a-retailer` | `app/find-a-retailer/page.tsx` → `components/FindARetailerPage.tsx` | Retailer list lives in the component |
| `/wholesale` | `app/wholesale/page.tsx` | Links to Faire |
| `/contact` | `app/contact/page.tsx` → `components/ContactPage.tsx` | mailto form |
| `/privacy`, `/terms` | `app/privacy/page.tsx`, `app/terms/page.tsx` | |
| `/products/<handle>` | `app/products/[handle]/page.tsx` | One page per Shopify product; Product + Offer JSON-LD; ViewContent pixel event |
| `/collections/<handle>` | `app/collections/[handle]/page.tsx` | `olive-oils`, `balsamic`, `spice-blends` |
| `/robots.txt`, `/sitemap.xml` | `app/robots.ts`, `app/sitemap.ts` | Sitemap lists every page, collection and product |
| `/api/subscribe` | `app/api/subscribe/route.ts` | Newsletter → Resend |
| anything else | `app/not-found.tsx` | Real 404 |

301 redirects for old Square-era URLs (`/contact-us` → `/contact`, etc.) are in `next.config.ts`.

## Where things live

- `components/` — page sections and UI. Client components (`'use client'`) are the interactive ones: Navbar, cart drawer, product cards, forms.
- `lib/shopify.ts` — Storefront API queries (catalog reads are cached/revalidated; cart calls are not).
- `lib/cart-context.tsx` — cart state shared across every route.
- `lib/tracking.ts` — Meta Pixel events (PageView, ViewContent, AddToCart, InitiateCheckout). `Purchase` must be enabled in Shopify admin — checkout is on Shopify's domain.
- `lib/site.ts` — site URL, name, default title/description, contact facts used in JSON-LD.
- `public/` — images and the favicon.
- `newsletter/` — the monthly email template (not part of the site build).

## Tailwind

Tailwind v3 is bundled at build time (`tailwind.config.ts`, `app/globals.css`). The site uses arbitrary colour values (`bg-[#f5f2ed]` etc.) rather than a theme palette — keep doing that so the look stays identical.
