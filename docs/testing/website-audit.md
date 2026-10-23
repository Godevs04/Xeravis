# Website audit

Complete audit of the public Xelarvis website: every page, the SEO and PWA files, the public
APIs and the website-facing code. The audit itself was report only; all 25 issues were fixed
afterwards (see [Fix status](#fix-status) for what changed and the re-measured results).

## Fix status

All issues are fixed in the working tree (not committed). Re-verified on a production build:
type check 0 errors, ESLint 0 problems, Prettier clean, unknown slugs return 404, GraphQL
answers queries, and Lighthouse re-run on the same 10 pages.

| Page                                        | Mobile perf (before) | Desktop perf (before) | Accessibility | CLS (desktop, before) |
| ------------------------------------------- | -------------------- | --------------------- | ------------- | --------------------- |
| `/`                                         | 86 (73)              | 99 (62)               | 100           | 0 (0.294)             |
| `/services`                                 | 77 (75)              | 95 (79)               | 100           | 0                     |
| `/services/data-science-advanced-analytics` | 77 (76)              | 90 (73)               | 100           | 0                     |
| `/insights/blogs`                           | 78 (75)              | 98 (93)               | 100           | 0                     |
| `/blog/clinical-data-standards-primer`      | 82 (75)              | 95 (86)               | 100           | 0                     |
| `/careers`                                  | 82 (75)              | 98 (76)               | 100           | 0                     |
| `/careers/ai-engineer`                      | 79 (74)              | 95 (72)               | 100           | 0                     |
| `/contact`                                  | 83 (75)              | 98 (75)               | 100           | 0                     |
| `/search`                                   | 79 (75)              | 89 (65)               | 100           | 0                     |
| `/about`                                    | 76 (74)              | 88 (71)               | 100 (87)      | 0                     |

Home page first-load JavaScript went from 410 kB to 315 kB, other pages from about 250 kB to
140–170 kB. Best practices and SEO are unchanged (100; `/search` stays `noindex`).

| Issue   | Fix                                                                                                                                                                                                                                                                                                        |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WEB-001 | Cloudinary storage adapter rewritten: files stored as private assets and streamed through `/api/media/file/*`, so Media access rules (private resumes) still apply. Enabled by the `CLOUDINARY_*` env vars (documented in `.env.example`); `npm run media:migrate -- --apply` copies existing local files. |
| WEB-002 | `PwaRegister` reloads only after the visitor clicks "Update"; registration waits for the `load` event.                                                                                                                                                                                                     |
| WEB-003 | Block `testimonials` has its own GraphQL name (`TestimonialsBlock`); GraphQL queries work again.                                                                                                                                                                                                           |
| WEB-004 | All internal-guideline strings rewritten as visitor copy (the five listed plus four more found: solutions FAQ, solution metrics heading, technologies and case-studies subtitles, industry CTA).                                                                                                           |
| WEB-005 | Every page falls back to a 1200x630 image at `/og-image.png`; Twitter card is `summary_large_image`.                                                                                                                                                                                                       |
| WEB-006 | Client blocks lazy-loaded with `next/dynamic`; `framer-motion` uses `LazyMotion` with features loaded in a separate chunk; `posthog-js` removed from the initial bundle.                                                                                                                                   |
| WEB-007 | `/about/leadership` revalidates every 60 s; Team Members hooks revalidate `/`, `/about`, `/about/leadership`.                                                                                                                                                                                              |
| WEB-008 | Sitemap lists only active, open careers; adds research articles and `/about/domain-expertise`; drops `/docs/api`; static pages no longer claim "modified now"; limits raised to 1000.                                                                                                                      |
| WEB-009 | Root `loading.tsx` removed, so `notFound()` returns HTTP 404.                                                                                                                                                                                                                                              |
| WEB-010 | Gated downloads store the email as a Form Submission (type "Gated download") and stream the file from the route; gated files move to a private `gated-downloads` media folder automatically.                                                                                                               |
| WEB-011 | PostHog (and GA/GTM/Clarity) load only after cookie consent when the cookie banner is enabled; form events and client errors go through `src/lib/analytics-client.ts`.                                                                                                                                     |
| WEB-012 | Light accent darkened to teal-700 (`#0f766e`); new `--color-on-accent` token for text on accent fills (dark text in dark mode); teal-500 and `--color-teal` fills replaced.                                                                                                                                |
| WEB-013 | `Host` removed; `/api/media/file/` allowed; `/search` and `/docs/` disallowed.                                                                                                                                                                                                                             |
| WEB-014 | Rate limiter uses Upstash Redis when `UPSTASH_REDIS_REST_URL`/`TOKEN` are set (memory fallback); client IP from platform headers or the last proxy hop.                                                                                                                                                    |
| WEB-015 | `poweredByHeader: false`; HSTS on https production; `'unsafe-eval'` only in development; `object-src 'none'`, `base-uri`, `form-action` added; Clarity allowed in the CSP. Nonce-based scripts remain a longer-term option.                                                                                |
| WEB-016 | CLS is 0 on all 20 runs (the shift most likely came from the WEB-002 reload; no footer change was needed).                                                                                                                                                                                                 |
| WEB-017 | Playground link shown only in development; OpenAPI text updated.                                                                                                                                                                                                                                           |
| WEB-018 | Hidden `h2` headings before card grids; footer column titles are `h2`.                                                                                                                                                                                                                                     |
| WEB-019 | Footer logo uses its visible text as the accessible name; `/about` list and definition-list markup fixed.                                                                                                                                                                                                  |
| WEB-020 | Short descriptions rewritten (and any under 70 characters get a brand line); titles "About Us", "Contact Us", shorter `/services` title.                                                                                                                                                                   |
| WEB-021 | `src/app/global-error.tsx` added.                                                                                                                                                                                                                                                                          |
| WEB-022 | Career slug renamed to `sr-developer-engineer` (`npm run audit:data-fixes`); `/careers/sr` redirects with 308.                                                                                                                                                                                             |
| WEB-023 | Careers form has the `website` honeypot.                                                                                                                                                                                                                                                                   |
| WEB-024 | Theme follows the system preference until the visitor picks one.                                                                                                                                                                                                                                           |
| WEB-025 | Website code formatted; `MobileMenu`, `MobileNav`, `Navbar`, `SectionWrapper` deleted.                                                                                                                                                                                                                     |

Still needs a person:

- Re-upload `Kavinkumar.webp` and `mysure_2.webp` in the admin (the original files are lost).
- Set the `CLOUDINARY_*` env vars in production and run `npm run media:migrate -- --apply`.
- Optional: set `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` for shared rate limits.
- Enable the cookie banner (Settings) if analytics should wait for consent; with it disabled,
  analytics loads for every visitor.

## Summary

The site is in good structural shape: all 74 crawled pages return 200, every page has a unique
title, description, canonical URL and valid structured data, no images are missing alt text,
SEO scores 100 on every indexable page, and type check and lint are clean.

The most important problems are:

1. **First-time visitors get a forced page reload** (WEB-002). The service worker takes control
   and the page reloads itself 1 to 5 seconds after landing. This is also the largest single
   cause of the slow mobile scores.
2. **Uploaded media is stored only on the server's disk** (WEB-001). Two of the four public
   media files are already missing, which breaks the leadership photo.
3. **Internal writing guidelines are published as page copy** on five pages (WEB-004), for
   example "Genuine leadership profiles only ... better than a decorative executive roster".
4. **Social previews have no image** on 71 of 74 pages (WEB-005).
5. **Mobile performance is 73 to 76** with a Largest Contentful Paint of 7 to 12 seconds
   (WEB-006).
6. **The GraphQL API fails on every request** (WEB-003), although the API docs advertise it.

| Severity | Issues |
| -------- | ------ |
| Critical | 0      |
| High     | 6      |
| Medium   | 11     |
| Low      | 8      |

### Lighthouse at a glance

| Page                                        | Mobile perf | Desktop perf | Accessibility | Best practices | SEO     |
| ------------------------------------------- | ----------- | ------------ | ------------- | -------------- | ------- |
| `/`                                         | 73          | 62           | 97            | 100            | 100     |
| `/services`                                 | 75          | 79           | 97            | 100            | 100     |
| `/services/data-science-advanced-analytics` | 76          | 73           | 97            | 100            | 100     |
| `/insights/blogs`                           | 75          | 93           | 95            | 100            | 100     |
| `/blog/clinical-data-standards-primer`      | 75          | 86           | 95            | 100            | 100     |
| `/careers`                                  | 75          | 76           | 97            | 100            | 100     |
| `/careers/ai-engineer`                      | 74          | 72           | 97            | 100            | 100     |
| `/contact`                                  | 75          | 75           | 97            | 100            | 100     |
| `/search`                                   | 75          | 65           | 95            | 100            | 69 (\*) |
| `/about`                                    | 74          | 71           | 87            | 100            | 100     |

(\*) `/search` is deliberately `noindex`, which is what lowers its SEO score. That is correct.

## Method and environment

- Production build (`next build` + `next start`) of the current working tree on
  `http://localhost:3001`, connected to the shared MongoDB Atlas database. Read-only: no
  records were created.
- **Crawl:** every URL in `/sitemap.xml` plus every internal link found on those pages (74 pages),
  checking status, redirects, title, description, canonical, Open Graph / Twitter tags,
  headings, image alt text, JSON-LD, form labels and linked assets.
- **Lighthouse 13.4** (mobile and desktop presets, headless Chrome) on 10 representative pages.
  Scores on a local machine are indicative; relative findings matter more than absolute numbers.
- **Behaviour and security probes:** unknown URLs, redirects, `robots.txt`, sitemap, response
  headers, anonymous API access, GraphQL, gated downloads, PWA files.
- **Code review** of `src/app/(frontend)`, `src/components`, `src/blocks`, `src/lib`,
  `src/actions`, `src/middleware.ts`, `next.config.ts`, `public/sw.js`.
- **Code hygiene:** `npx tsc --noEmit` (0 errors), `npx eslint .` (0 problems),
  `npx prettier --check` on the website code (28 files differ, see WEB-025).

TEST records from the admin end-to-end run were still in the database during the audit, so
they appear on some pages and in the sitemap. They are not counted as issues; they disappear
after `npm run test:cleanup -- --apply` (see `test-data-inventory.md`).

## Issues

Each issue lists where it is, the evidence, why it matters and a suggested fix.

### High

#### WEB-001 Uploaded media lives only on the server's local disk

- **Where:** `src/payload/collections/Media.ts` (`staticDir: 'media'`), `.gitignore` (`/media`).
- **Evidence:** there is no cloud storage adapter. Of the 4 publicly listed media records, 2
  have no file on disk (`Kavinkumar.webp`, `mysure_2.webp`). The leadership photo request
  returns 500 and `/_next/image` returns 400 "The requested resource isn't a valid image" on
  `/about` and `/about/leadership`.
- **Impact:** every redeploy to a fresh server (or a serverless host) loses all uploads. Broken
  images on the About pages today.
- **Fix:** add a Payload storage adapter (Cloudinary, S3 or Vercel Blob), migrate the existing
  files, and re-upload the two missing images. `next.config.ts` already allows
  `res.cloudinary.com`.

#### WEB-002 Service worker forces a reload on every first visit

- **Where:** `src/components/pwa/PwaRegister.tsx` (`onControllerChange` calls
  `window.location.reload()`), `public/sw.js` (`self.clients.claim()` on activate).
- **Evidence:** on a first visit the new worker claims the page, `controllerchange` fires and
  the page reloads. Lighthouse records this as a second navigation of the same URL on all 20
  runs: about 1 s lost on desktop and 3.6 to 4.8 s on mobile.
- **Impact:** visitors see the page flash and reload, lose scroll position and anything typed
  into a form in the first seconds; LCP and Performance scores are inflated.
- **Fix:** only reload when the user accepted an update. For example, remember whether
  `navigator.serviceWorker.controller` existed before registering and ignore the first
  `controllerchange` when it did not, or reload only from the "Update" button handler.

#### WEB-003 GraphQL API returns 500 for every query

- **Where:** `src/payload/blocks/index.ts` (block slug `testimonials`) and
  `src/payload/collections/Testimonials.ts` (collection slug `testimonials`).
- **Evidence:** `POST /api/graphql` returns 500; server log: "Schema must contain uniquely
  named types but contains multiple types named "Testimonials"". `/api/openapi` and
  `/docs/api` advertise the GraphQL endpoint.
- **Impact:** any integration using GraphQL fails; the published API docs are wrong.
- **Fix:** give the block its own GraphQL name, e.g. `interfaceName: 'TestimonialsBlock'` /
  `graphQL: { singularName: 'TestimonialsBlock' }`, or rename the block slug. If GraphQL is not
  needed, disable it in the Payload config and remove it from the docs.

#### WEB-004 Internal writing guidelines published as page copy

- **Evidence** (all visible on the live pages):

  | Page                           | Text                                                                                                                                                                       | Source                                                                 |
  | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
  | `/about/leadership`            | "Genuine leadership profiles only — name, title, biography, LinkedIn ... A small, credible team is better than a decorative executive roster." (also the meta description) | `src/lib/about-content.ts` (`LEADERSHIP.intro`)                        |
  | `/about`                       | "Only substantiated information — no placeholder counters or inflated claims."                                                                                             | `src/components/about/AboutPageContent.tsx`, `src/lib/site-ia.ts`      |
  | `/about/technology-innovation` | "... not as a logo wall on About."                                                                                                                                         | `src/lib/about-content.ts` (`TECHNOLOGY_BRIDGE`), `src/lib/site-ia.ts` |
  | `/about/domain-expertise`      | "Healthcare is a specialized practice within XELARVIS — not the lead identity of the brand."                                                                               | `src/lib/about-content.ts` (`HEALTHCARE_SPECIALTY.note`)               |
  | `/services`                    | "... shown in capability context, not as a vanity catalog."                                                                                                                | `src/app/(frontend)/services/page.tsx`                                 |

- **Impact:** reads as internal briefing notes to clients and search engines; undermines the
  brand voice.
- **Fix:** rewrite these strings as visitor-facing copy (what the visitor gets, not what the
  team avoids).

#### WEB-005 No social preview image on 71 of 74 pages

- **Where:** `src/lib/seo.ts` `buildMetadata` only adds `openGraph.images` /
  `twitter.images` when an `image` is passed; a page-level `openGraph` object replaces the
  root `opengraph-image` instead of merging with it.
- **Evidence:** `og:image` present only on `/` and one service; Twitter card falls back to the
  small `summary` card everywhere else.
- **Impact:** links shared on LinkedIn, X, Slack or WhatsApp show no image.
- **Fix:** default `imageUrl` in `buildMetadata` to the site Open Graph image (for example
  `absoluteUrl('/opengraph-image')` or a static 1200x630 brand image) and use the content's
  featured image when available.

#### WEB-006 Slow mobile loading (LCP 7 to 12 s) and heavy JavaScript

- **Evidence:** mobile Performance 73 to 76 on every tested page; LCP 7.2 s (service detail)
  to 11.8 s (job page). Lighthouse estimates 450 KiB of unused JavaScript per page and about
  1.2 MiB on `/`, `/contact` and `/search`. The home route loads 410 kB of first-load JS
  (146 kB of it page-specific) versus about 250 kB elsewhere.
- **Causes found in code:**
  - WEB-002's reload (largest single factor).
  - `framer-motion` is imported in 42 files, including server-rendered sections that only
    animate on entry.
  - `src/blocks/RenderBlocks.tsx` statically imports all 21 block components, so every block's
    code ships whether the page uses it or not.
  - `posthog-js` is bundled on every page through the footer newsletter form even though it is
    never initialised (WEB-011).
- **Fix:** fix WEB-002 first, then lazy-load blocks with `next/dynamic`, replace entry
  animations with CSS where possible (or `LazyMotion` + `m` components), and drop or lazy-load
  `posthog-js`. Re-measure after each step.

### Medium

#### WEB-007 Leadership page never updates after a deploy

- **Where:** `src/app/(frontend)/about/leadership/page.tsx` reads `team-members` but has no
  `revalidate`, so it is generated once at build time; `TeamMembers` has no revalidation hook.
- **Impact:** adding or editing a team member in the admin never reaches the site until the
  next deploy.
- **Fix:** `export const revalidate = 60` (matching `/about`) and an `afterChange` /
  `afterDelete` hook on Team Members revalidating `/about` and `/about/leadership`.

#### WEB-008 Sitemap content gaps

- **Where:** `src/app/sitemap.ts`.
- **Evidence:**
  - Lists every published career, including inactive and past-deadline roles (which return
    "no longer accepting applications").
  - Omits research articles (`/research/<slug>`) and `/about/domain-expertise`.
  - Static pages use `lastModified: new Date()`, so every sitemap request claims all pages
    changed now.
- **Fix:** filter careers with `active !== false` and `!isPastDeadline(...)`, add research and
  the missing about page, and use a fixed or content-derived date for static pages.

#### WEB-009 Unknown slugs return HTTP 200 (soft 404)

- **Evidence:** `/services/nope`, `/blog/nope`, `/careers/nope` render the 404 page with status
  200 (top-level unknown URLs correctly return 404). Same as DEF-015 in `defects.md`.
- **Cause:** the route-level `loading.tsx` starts streaming before the page calls
  `notFound()`.
- **Fix:** remove `loading.tsx` from dynamic `[slug]` segments (or move it below the data
  fetch) so `notFound()` can still set the status.

#### WEB-010 Gated downloads do not capture leads and can be bypassed

- **Where:** `src/app/(frontend)/api/download/[slug]/route.ts`.
- **Evidence:** any string shaped like an email unlocks the download; the email is not stored
  anywhere, and the response redirects to the public `/api/media/file/...` URL, which works
  without the gate.
- **Impact:** gated content generates no leads.
- **Fix:** record the email (contact message or subscriber with source "download"),
  rate-limit, and serve the file through the route (or a signed, expiring URL) instead of a
  public redirect.

#### WEB-011 Analytics and error reporting are silently disabled

- **Where:** `posthog.capture` in Contact, Career and Newsletter forms;
  `posthog.captureException` in `src/app/(frontend)/error.tsx`. `posthog.init` is never called.
- **Impact:** no form conversion events and no client error reports are recorded, while the
  library is still shipped to every visitor and allowed in the CSP.
- **Fix:** either initialise PostHog once (provider with `NEXT_PUBLIC_POSTHOG_KEY`, respecting
  the cookie banner) or remove it and use the existing first-party `/api/analytics/event`.

#### WEB-012 Colour contrast below WCAG AA

- **Evidence:** white text on the accent teal `#0d9488` is 3.74:1 (needs 4.5:1 for normal text):
  header "Contact" button, footer "Start a project", "Subscribe", "Start a Conversation",
  "Explore ..." links. Teal-300 step numbers on the home page are 3.57:1. Flagged on all 20
  Lighthouse runs.
- **Fix:** use a darker accent for filled buttons with white text (for example teal-700
  `#0f766e`, 5.5:1) and a darker step-number colour in light mode.

#### WEB-013 robots.txt problems

- **Evidence:** `Host: http://localhost:3001/` (the `Host` directive is non-standard and must be
  a bare host name); `Disallow: /api/` also blocks `/api/media/file/...`, the URL of every CMS
  image, so search engines cannot index those images.
- **Fix:** remove the `host` field from `src/app/robots.ts`; add `Allow: /api/media/file/`
  (and `/api/download/` if downloads should be discoverable).

#### WEB-014 Rate limiting is per process and trusts `X-Forwarded-For`

- **Where:** `src/lib/rate-limit.ts`.
- **Evidence:** buckets live in an in-memory `Map`, so limits reset on restart and are not
  shared between instances; the client key is the first `X-Forwarded-For` entry, which a client
  can set unless the proxy overwrites it.
- **Fix:** use a shared store (Upstash Redis / Vercel KV) and take the IP from the platform
  (`request.ip`, or the last trusted proxy hop).

#### WEB-015 Security headers can be tightened

- **Where:** `next.config.ts` `headers()`.
- **Evidence:** no `Strict-Transport-Security`; CSP `script-src` allows `'unsafe-eval'` and
  `'unsafe-inline'`; `X-Powered-By: Next.js, Payload` discloses the stack.
- **Fix:** add HSTS (`max-age=63072000; includeSubDomains; preload`) for production, drop
  `'unsafe-eval'` (verify the admin still works) and move to nonce-based scripts when feasible,
  and set `poweredByHeader: false`.

#### WEB-016 Layout shift from the footer on desktop

- **Evidence:** CLS 0.294 on 9 of 10 desktop runs ("good" is under 0.1); the shifting element is
  the site `footer`.
- **Fix:** reserve space for content that loads after first paint above the footer (fixed
  heights or skeletons for client-rendered sections), and check the newsletter form and
  animated sections for late size changes.

#### WEB-017 Broken link on the API docs page

- **Evidence:** `/docs/api` links to `/api/graphql-playground`, which returns 404 in production.
- **Fix:** remove the link (Payload only serves the playground in development) or point it to
  the GraphQL endpoint once WEB-003 is fixed.

### Low

#### WEB-018 Heading levels skip from H1 to H3

- `/case-studies`, `/insights/blogs`, `/insights/white-papers`, `/technologies`. Use H2 for the
  card-grid section titles (or for the card titles' parent heading).

#### WEB-019 Accessibility markup details

- Footer logo link has `aria-label="Xelarvis"` while its visible text is "Xelarvis
  Technologies" (accessible name should contain the visible text).
- `/about` uses a `<dl>` whose children are not `<dt>`/`<dd>` pairs and a `<ul>` with non-`<li>`
  children (Lighthouse "definition-list" and "list").

#### WEB-020 Metadata polish

- 25 meta descriptions are shorter than 70 characters (e.g. `/privacy-policy` 41,
  `/insights/news` 43, most solution pages 46 to 68). Aim for 120 to 160.
- `/services` title is 73 characters (truncated in search results).
- Brand casing is inconsistent: "About XELARVIS", "Contact XELARVIS" versus "... | Xelarvis".

#### WEB-021 No root `global-error.tsx`

- An error in the root layout falls back to Next.js's unbranded default page. Add
  `src/app/global-error.tsx` with the site's error UI.

#### WEB-022 Job URL `/careers/sr`

- "Sr Developer Engineer" has the slug `sr` (created before the slug fix, DEF-001). Rename to
  `sr-developer-engineer` and add a redirect from the old URL.

#### WEB-023 Careers apply form has no honeypot

- Contact and Newsletter discard bot submissions with a hidden `website` field;
  `src/actions/career.ts` does not. Add the same honeypot for consistency (rate limiting already
  applies).

#### WEB-024 Visitors' system dark-mode preference is ignored

- `src/providers/ThemeProvider.tsx` sets `enableSystem={false}` and `defaultTheme="light"`, so a
  visitor whose OS is in dark mode still lands on the light theme.

#### WEB-025 Code hygiene

- Type check and ESLint: 0 errors.
- Prettier: 28 website files are not formatted (pre-existing, not touched by recent work), e.g.
  `src/app/(frontend)/not-found.tsx`, `privacy-policy/page.tsx`, `terms/page.tsx`,
  `src/components/ui/*` (14 files), `src/blocks/CareerBanner.tsx`. Run `npm run format`.
- Unused components: `src/components/layout/MobileMenu.tsx`, `MobileNav.tsx`, `Navbar.tsx`,
  `SectionWrapper.tsx` are not imported anywhere.

## Crawl results

| Check                           | Result                                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| Pages crawled                   | 74 (71 from the sitemap + 3 found via links)                                                       |
| HTTP status                     | 74 x 200                                                                                           |
| Redirects                       | `/blog`, `/research`, `/approach` -> 308 to their new homes                                        |
| Duplicate titles / descriptions | None                                                                                               |
| Missing description / canonical | None                                                                                               |
| Canonical / `og:url` correct    | All                                                                                                |
| Exactly one H1                  | All pages                                                                                          |
| Images without `alt`            | None                                                                                               |
| JSON-LD                         | Valid on every page (Organization, WebSite, BreadcrumbList, FAQPage, Service, Article, JobPosting) |
| `lang` and viewport             | `en`, responsive viewport on all pages                                                             |
| `noindex`                       | `/search`, `/docs/api` (intended)                                                                  |
| Broken links / assets           | `/api/graphql-playground` (WEB-017), leadership photo (WEB-001)                                    |
| Server response                 | Cached pages served in under 20 ms; `/search` 0.14 s warm                                          |

## What is working well

- Clean information architecture with legacy redirects in place.
- Strong structured data (JobPosting for every role, FAQPage, Service, Article, breadcrumbs).
- Forms validate every field with length limits, honeypots (contact, newsletter), rate limits,
  and keep typed values after errors.
- Admin-only collections (users, applications, leads, subscribers) and drafts are not readable
  anonymously; candidate resumes are private.
- Sensible baseline headers (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy,
  CSP with `frame-ancestors`).
- Smooth scrolling respects reduced motion and is off on touch devices; offline page and
  installable PWA manifest work.

## Recommendations

### Quick wins (under a day)

1. Fix the first-visit reload (WEB-002).
2. Rewrite the five internal-guideline strings (WEB-004).
3. Default Open Graph image (WEB-005).
4. Rename the GraphQL type or disable GraphQL (WEB-003) and remove the playground link
   (WEB-017).
5. `revalidate` + hook for the leadership page (WEB-007).
6. robots.txt `host` removal and `/api/media/file/` allow (WEB-013).
7. `poweredByHeader: false` and HSTS (WEB-015, partial).
8. Darker accent for white-on-teal buttons (WEB-012).
9. Heading levels, footer logo label, `/about` list markup (WEB-018, WEB-019).
10. `npm run format` and delete unused layout components (WEB-025).

### Short term (1 to 2 weeks)

1. Move media to cloud storage and restore the missing files (WEB-001).
2. Performance pass: lazy-load blocks, trim `framer-motion`, drop or lazy-load PostHog
   (WEB-006, WEB-011), then fix the footer layout shift (WEB-016). Target mobile Performance 90+.
3. Sitemap fixes (WEB-008) and real 404 status for unknown slugs (WEB-009).
4. Gated downloads that store the lead and serve files privately (WEB-010).
5. Shared rate-limit store (WEB-014).
6. Longer meta descriptions and consistent title branding (WEB-020).

### Longer term

1. Decide on one analytics stack (PostHog with consent, or GA via the existing Analytics
   global) and add client error monitoring (Sentry or PostHog) (WEB-011, WEB-021).
2. Nonce-based CSP without `'unsafe-inline'` / `'unsafe-eval'` (WEB-015).
3. Follow the system colour-scheme preference (WEB-024).
4. Add automated checks in CI: Lighthouse CI budgets (the `lighthouse:ci` script already
   exists), a link checker on the sitemap, `prettier --check`, and an axe accessibility run.
5. Review the observations already listed in `test-report.md` (dashboard "Total Visitors"
   counts unique paths, ambiguous SEO Center gap counts, unused `canPublish` /
   `trackActivityDelete`).

## Appendix: URLs checked

Static: `/`, `/about`, `/about/company-overview`, `/about/domain-expertise`,
`/about/global-presence`, `/about/leadership`, `/about/our-approach`,
`/about/research-philosophy`, `/about/technology-innovation`, `/about/vision-mission`,
`/about/why-xelarvis`, `/ai-research-lab` (+ `research-areas`, `innovation-projects`,
`publications`, `collaborations`, `open-source`), `/services`, `/solutions`, `/industries`,
`/case-studies`, `/technologies`, `/insights` (+ `blogs`, `news`, `white-papers`,
`resources`, `reports`), `/careers`, `/contact`, `/search`, `/docs/api`, `/privacy-policy`,
`/terms`, `/offline`.

Dynamic: 6 services, 9 solutions, 12 industries, 1 case study, 3 blog posts, 1 research
article and 8 careers (including TEST records from the admin run).

Other: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/sw.js`, `/llms.txt`,
`/api/openapi`, `/api/graphql`, `/api/download/<slug>`, anonymous `/api/<collection>` reads.
