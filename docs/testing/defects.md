# Defect log

All defects found during the admin end-to-end run. Every fixed defect was re-tested; the
regression case is listed so it can be found in `test-cases.csv`. After the fixes,
`npx tsc --noEmit` and `npx eslint .` both exit with zero errors and warnings, and `next build`
completes cleanly.

| ID      | Severity | Status           | Area                 | Summary                                                                                    |
| ------- | -------- | ---------------- | -------------------- | ------------------------------------------------------------------------------------------ |
| DEF-001 | High     | Fixed            | All slug collections | Editing a title without sending the slug silently changed the slug (broke live URLs)       |
| DEF-002 | Critical | Fixed            | Downloads            | Custom gated-download route clashed with Payload's `/api/downloads` REST API               |
| DEF-003 | Medium   | Fixed            | Settings globals     | Several globals had no effect on the website                                               |
| DEF-004 | High     | Fixed            | Website forms        | Apply / contact / newsletter forms wiped every field after a server-side error             |
| DEF-005 | High     | Fixed            | Careers              | Application deadline was not enforced; closed roles showed misleading copy                 |
| DEF-006 | Critical | Fixed            | Media / Recruitment  | Candidate resumes were publicly listable and downloadable                                  |
| DEF-007 | Medium   | Fixed            | Admin navigation     | Seven workspaces were unreachable from the sidebar                                         |
| DEF-008 | Medium   | Fixed            | Quick Create         | Quick Create offered items the user cannot create (e.g. Notification -> Unauthorized page) |
| DEF-009 | Low      | Fixed            | Admin header         | Header "Create" menu did not close on outside click or Escape                              |
| DEF-010 | High     | Fixed            | Command palette      | Admin search bypassed access control and showed raw collection slugs as group labels       |
| DEF-011 | High     | Fixed            | AI workspace         | AI write-back to careers/blogs bypassed access control                                     |
| DEF-012 | High     | Fixed            | Notifications        | Any logged-in user could read and modify other users' notifications                        |
| DEF-013 | High     | Fixed            | Newsletter           | Subscriber CSV export was open to every logged-in role                                     |
| DEF-014 | Medium   | Fixed            | Careers / Roles      | Recruiters could not publish jobs (publish silently downgraded to draft)                   |
| DEF-015 | Low      | Known, not fixed | Website              | Unknown URLs return HTTP 200 with the 404 page (soft 404)                                  |
| DEF-016 | Critical | Fixed            | Users / Roles        | An administrator could grant themselves (or anyone) the super-admin role                   |
| DEF-017 | Medium   | Fixed            | Settings globals     | Site Settings and Office Locations edits did not reach the cached production site          |

---

## DEF-001 — Slug re-derived from title on partial updates

- **Steps:** Edit a published blog/page title through the API or a partial save that does not include `slug`.
- **Actual:** `autoSlugFromTitle` regenerated the slug from the new title, so the public URL changed and old links 404'd.
- **Fix:** `src/payload/hooks/autoSlug.ts` keeps the stored slug on updates that omit `slug`.
- **Re-test:** "Editing only the title keeps the existing slug (URL stays stable)" in all 8 slug collections (e.g. PAGES-005), Pass.

## DEF-002 — Download route clash

- **Steps:** `GET /api/downloads/<slug>` for a gated download.
- **Actual:** The custom Next route at `/api/downloads/[slug]` shadowed Payload's `/api/downloads/:id` REST endpoints for the Downloads collection, so admin CRUD and gated downloads interfered.
- **Fix:** Route moved to `/api/download/[slug]`; `src/middleware.ts` rate limiting and `src/lib/openapi.ts` updated.
- **Re-test:** DWNL-001 to DWNL-005 (admin CRUD) and DWNL-006 to DWNL-008 (public, gated and unknown downloads), Pass.

## DEF-003 — Globals with no effect on the site

- **Actual:** Cookie Banner, Analytics, SEO Defaults and Announcement Bar could be edited but nothing changed on the website (no component rendered them, env vars only for tracking, static metadata).
- **Fix:** New `AnnouncementBar` and `CookieBanner` components; `TrackingScripts` reads the Analytics global (IDs validated before being placed in inline scripts); root layout uses SEO Defaults in `generateMetadata`; `revalidateSiteWide` hook added to those globals.
- **Re-test:** `G*` "Saved value is reflected on the website" cases, all Pass.

## DEF-004 — Forms reset after a server error

- **Steps:** Submit the careers apply form with an invalid resume (or trigger any server-side validation error).
- **Actual:** React 19 `<form action>` resets uncontrolled inputs after every action, so the candidate lost everything they typed.
- **Fix:** `src/lib/form-submit.ts` (`submitKeepingValues`) submits through `onSubmit` + `startTransition`; Contact and Newsletter clear the form only on success.
- **Re-test:** WEB-APPLY-004, WEB-CONTACT-001, WEB-CONTACT-002, WEB-NEWS-001 (manual), Pass.

## DEF-005 — Deadline and closed jobs

- **Actual:** Applications were accepted after `applicationDeadline`, for inactive roles and for drafts; expired roles stayed listed; a closed role said "Online applications for this listing will open once the role is published".
- **Fix:** `isPastDeadline` (`src/lib/date.ts`, end of the UTC day); enforced in `src/actions/career.ts`, the careers list and job page; `JobDetailView` shows "This role is no longer accepting applications."
- **Re-test:** WEB-APPLY-005/006 and careers closed/expired cases, Pass.

## DEF-006 — Public candidate resumes

- **Steps:** Logged out, `GET /api/media?where[filename][like]=.pdf` and `GET /api/media/file/<resume>.pdf`.
- **Actual:** Resumes were listed and downloadable by anyone.
- **Fix:** Resumes are stored in a private `resumes` media folder; `mediaRead` access hides that folder from everyone except super-admin, administrator, recruiter and editor (file serving honours it). `npm run backfill:resumes -- --apply` moved the 3 existing resumes (1 TEST, 2 real) into the folder.
- **Re-test:** "Candidate resumes are private to recruiting staff" (pipelines) and "<role>: candidate resume download" (roles, 6 cases), Pass.

## DEF-007 — Workspaces unreachable

- **Actual:** SEO Center, Newsletter Hub, CRM Pipeline, Hiring Pipeline, Media Studio, Insights Dashboard and Activity Timeline only opened by typing the URL.
- **Fix:** Added to the sidebar registry (`src/payload/admin/nav/registry.ts`) under their modules.
- **Re-test:** UI-NAV-001 (manual) and the admin workspace render cases, Pass.

## DEF-008 — Quick Create offered forbidden items

- **Actual:** "Notification" (system-generated) and, for limited roles, collections they cannot create, led to an Unauthorized page.
- **Fix:** Notification removed from Quick Create; Quick Create, the sidebar create menu and the command palette filter by the user's `create` permission (`quickCreateAllowed`).
- **Re-test:** UI-QC-001/002, UI-CMD-001 (manual), Pass.

## DEF-009 — Create menu stays open

- **Fix:** `QuickCreateAction` closes on outside mousedown and Escape.
- **Re-test:** UI-QC-002 (manual), Pass.

## DEF-010 — Admin search access leak

- **Actual:** `/api/admin/search` used `overrideAccess`, so a viewer could find job applications and draft content; groups were labelled `job-applications` etc.
- **Fix:** Queries run with `overrideAccess: false` and the user; readable group labels.
- **Re-test:** "<role>: command palette respects collection access" (6 cases), Pass.

## DEF-011 — AI write-back bypassed access

- **Fix:** `src/payload/admin/workspace/ai-action.ts` writes with the user's access and returns a friendly message on `Forbidden`.
- **Re-test:** UI-AI-001 (manual), Pass.

## DEF-012 — Notification tampering

- **Steps:** As a viewer, `PATCH /api/notifications/<someone else's id>`.
- **Actual:** HTTP 200; any user could mark or edit anyone's notifications.
- **Fix:** `ownNotifications` access (admins: all; others: only their own) for read and update.
- **Re-test:** "<role>: cannot modify another user's notification" (6 cases), Pass.

## DEF-013 — Newsletter export open to all roles

- **Fix:** `/api/admin/newsletter/export` returns 403 unless `canExportSubscribers` (super-admin, administrator, editor, marketing).
- **Re-test:** "<role>: newsletter CSV export" (6 cases) and "CSV export requires a session", Pass.

## DEF-014 — Recruiters could not publish jobs

- **Actual:** `enforcePublishRole` downgraded a recruiter's published career to draft, although hiring is their job.
- **Fix:** `enforcePublishRoleFor(['recruiter'])` on Careers; other collections unchanged.
- **Re-test:** "<role>: publishing careers results in ..." cases, Pass.

## DEF-015 — Soft 404 (not fixed)

- **Actual:** `notFound()` renders the 404 page but the response status is 200, because the route-level `loading.tsx` starts streaming before the page decides it is missing.
- **Impact:** Search engines may index missing URLs as thin pages. Fixing it means removing or restructuring `loading.tsx` for dynamic routes, which changes perceived loading UX, so it is left for a product decision.

## DEF-016 — Administrator could grant super-admin

- **Steps:** Log in as `test-qa-administrator`, `PATCH /api/users/<own id>` with `{"roles":["super-admin"]}`.
- **Actual:** HTTP 200 and the account became super-admin (could then delete users and edit everything reserved to super-admin).
- **Fix:** `roles` field `beforeChange` hook in `src/payload/collections/Users.ts`: only a super-admin (or the first-user bootstrap) may add or remove the super-admin role; anyone else gets 403.
- **Re-test:** "<role>: cannot grant themselves super-admin" (6 cases; administrator now gets 403, other roles have the field ignored) and "administrator: deleting users is reserved to super-admin", Pass. The TEST administrator was reset with `npm run test:users`.

## DEF-017 — Site Settings / Office Locations not revalidated

- **Steps:** On a production build, change the Site Settings tagline or add an office, reload `/` or `/contact`.
- **Actual:** The site kept the old value for up to the page's 60-second revalidation window (dev mode hides this because nothing is cached).
- **Fix:** `revalidateSiteWide` on Site Settings (footer on every page) and `revalidateGlobal(['/contact'])` on Office Locations.
- **Re-test:** GSITE and GOFF "reflected on the website" and "restore" cases on the production build, Pass.

---

## Test-environment issues (not product defects)

| Issue                                                                                            | Cause                                                                                                                                                                    | Handling                                                                                     |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Every admin page returned 500 "Element type is invalid ... got: undefined" partway through a run | `next dev` recompiles when the run writes files into the project (uploads, results); Payload's admin import map can then resolve components as `undefined` until restart | Suite runs against a production build (`next build` + `next start`); no occurrence there     |
| AI workspace said "Sign in to the CMS" on port 3001                                              | Payload CSRF / server actions trust only `NEXT_PUBLIC_SITE_URL`                                                                                                          | Start the test server with `NEXT_PUBLIC_SITE_URL` matching its URL                           |
| Cookie-authenticated requests silently got the login page                                        | Payload trusts the session cookie only on same-origin requests                                                                                                           | Runner sends `Sec-Fetch-Site: same-origin` and fails a case if it detects the login redirect |
