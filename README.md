# Xelarvis Technologies Website

Enterprise corporate website for **Xelarvis Technologies** — Data Science, AI & Healthcare.

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Payload CMS 3 · MongoDB Atlas · Vercel · Cloudinary (production media)

## Architecture (UX, Design, Software & CMS)

- [Phase 2 IA](docs/PHASE-2-UX-BLUEPRINT.md) · [Phase 3 Design System](docs/PHASE-3-DESIGN-SYSTEM.md) · [Phase 4 Architecture](docs/PHASE-4-SOFTWARE-ARCHITECTURE.md) · [Phase 5 GoDevs CMS](docs/PHASE-5-GODEVS-ENTERPRISE-CMS.md)

Engineering is in progress against these specs. Lint is skipped on build (`eslint.ignoreDuringBuilds`); TypeScript remains strict.

## Quick start

1. Copy environment file and fill required values:

```bash
cp .env.example .env
```

Required:

| Variable               | Purpose                         |
| ---------------------- | ------------------------------- |
| `DATABASE_URI`         | MongoDB Atlas connection string |
| `PAYLOAD_SECRET`       | `openssl rand -hex 32`          |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally |

Optional: Cloudinary, Resend, GA/GTM — see [`.env.example`](.env.example).

2. Install and run:

```bash
npm install --legacy-peer-deps
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)
- API docs (Swagger): [http://localhost:3000/docs/api](http://localhost:3000/docs/api)
- OpenAPI JSON: [http://localhost:3000/api/openapi](http://localhost:3000/api/openapi)
- GraphQL Playground: [http://localhost:3000/api/graphql-playground](http://localhost:3000/api/graphql-playground)

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

| Script                       | Description                        |
| ---------------------------- | ---------------------------------- |
| `npm run dev`                | Local development                  |
| `npm run build`              | Production build                   |
| `npm run start`              | Serve production build             |
| `npm run seed`               | Seed MongoDB via Payload Local API |
| `npm run generate:types`     | Regenerate `payload-types.ts`      |
| `npm run generate:importmap` | Regenerate admin import map        |

## Architecture

- `src/app/(frontend)` — marketing site (RSC, ISR)
- `src/app/(payload)` — Payload admin + API
- `src/collections` / `src/globals` — CMS schema
- `src/blocks` — page block renderer
- `src/actions` — contact, career, newsletter server actions
- `src/seed` — content seed script

The frontend renders CMS content when MongoDB is available. Publish Pages (`home`, `about`) and collections in Payload Admin (or run `npm run seed`).

## Deploy (Vercel)

1. Push repo and import the project in Vercel.
2. Set all production env vars from `.env.example` (`DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL=https://xelarvis.in`, optional Cloudinary/Resend/`SITE_NAME`).
3. Install command: `npm install --legacy-peer-deps` (already in `vercel.json`).
4. Ensure MongoDB Atlas allows Vercel IPs (or `0.0.0.0/0` for serverless).
5. Point `xelarvis.in` DNS to Vercel.
6. After first deploy, create the admin user via `/admin` first-user flow or run `npm run seed` against production `DATABASE_URI`.
7. Smoke-test: `/`, `/admin`, `/contact`, `/careers` apply, newsletter footer.

Git hooks: Husky + lint-staged run ESLint and Prettier on staged files (`prepare` script).

## Brand system

Logo slot is a text wordmark today. Replace via **Site Settings** global (`logo` upload) and header/footer components — layout does not hard-code logo dimensions beyond the wordmark.

Colors and typography live in CSS variables (`src/app/(frontend)/globals.css`).
