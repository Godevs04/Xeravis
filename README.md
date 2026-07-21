# Xelarvis Technologies Website

Enterprise corporate website for **Xelarvis Technologies** — Engineering Digital Excellence.

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Payload CMS 3 · MongoDB Atlas · Vercel · Cloudinary (production media)

## Quick start

1. Copy environment file and fill required values:

```bash
cp .env.example .env
```

Required:

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | MongoDB Atlas connection string |
| `PAYLOAD_SECRET` | `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally |

Optional: Cloudinary, Resend, GA/GTM — see [`.env.example`](.env.example).

2. Install and run:

```bash
npm install --legacy-peer-deps
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

3. Seed CMS content (requires MongoDB):

```bash
npm run seed
```

Creates admin user (from `PAYLOAD_ADMIN_EMAIL` / `PAYLOAD_ADMIN_PASSWORD`), globals, services, industries, solutions, home/legal pages, sample career and blog.

4. After changing Payload components:

```bash
npm run generate:importmap
npm run generate:types
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run seed` | Seed MongoDB via Payload Local API |
| `npm run generate:types` | Regenerate `payload-types.ts` |
| `npm run generate:importmap` | Regenerate admin import map |

## Architecture

- `src/app/(frontend)` — marketing site (RSC, ISR)
- `src/app/(payload)` — Payload admin + API
- `src/collections` / `src/globals` — CMS schema
- `src/blocks` — page block renderer
- `src/actions` — contact, career, newsletter server actions
- `src/seed` — content seed script

The frontend renders CMS content when MongoDB is available and falls back to curated static content when it is not — so builds and previews remain stable.

## Deploy (Vercel)

1. Push repo and import the project in Vercel.
2. Set all production env vars from `.env.example` (`DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL=https://xelarvis.in`, Cloudinary, Resend).
3. Use `npm install --legacy-peer-deps` as the install command (or set in Project Settings).
4. Point `xelarvis.in` DNS to Vercel.
5. Run `npm run seed` once against production DB (locally with production `DATABASE_URI`, or via a one-off job).

## Brand system

Logo slot is a text wordmark today. Replace via **Site Settings** global (`logo` upload) and header/footer components — layout does not hard-code logo dimensions beyond the wordmark.

Colors and typography live in CSS variables (`src/app/(frontend)/globals.css`).
