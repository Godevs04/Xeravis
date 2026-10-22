# Admin panel end-to-end test report

**Result: 562 of 562 test cases pass** after 17 defects were found and 16 fixed (1 left as a
known limitation). Type check, lint and production build are clean.

|                 |                                                                                        |
| --------------- | -------------------------------------------------------------------------------------- |
| Application     | Xelarvis website + admin (Payload CMS 3.86, Next.js 15.4, React 19)                    |
| Database        | MongoDB Atlas (shared with the live content; all test records are marked TEST)         |
| Final run       | 22 Oct 2026, production build (`next build` + `next start`) on `http://localhost:3001` |
| Signed-in roles | super-admin (`.env.local` admin) and six `test-qa-<role>` users                        |
| Test sheet      | `test-cases.csv` (562 rows)                                                            |
| Defects         | `defects.md`                                                                           |
| TEST data       | `test-data-inventory.md`                                                               |

## Scope

Every module in the admin sidebar, every admin list / create / edit view, every Settings global,
the custom workspaces, and the website flows that feed the admin:

- **Website:** pages, services, solutions, industries, case studies, technologies, clients,
  testimonials, FAQs, team members. CRUD, required-field validation, drafts and versions,
  publish -> public URL, unpublish/delete -> gone, slug rules, relationships.
- **Insights:** blogs, research, categories, tags, authors, downloads (gated download flow).
- **Recruitment:** careers (draft/publish, deadline, active flag), departments, public apply
  form, application pipeline (new -> under review -> shortlisted -> interview scheduled ->
  technical assessment -> final interview -> offered, plus the terminal statuses),
  interviews, Hiring Pipeline workspace, staff notifications.
- **Sales CRM / Marketing:** contact form -> lead pipeline, form submissions, newsletter signup
  (duplicate handling), unsubscribe, CSV export, campaigns, CRM and Newsletter workspaces.
- **Media:** uploads (images with generated sizes, PDFs), alt-text and type validation,
  folders, private resumes, Media Studio.
- **Settings:** all 10 globals edited with TEST values, verified on the website, restored
  from snapshot.
- **System:** login, users, roles, notifications bell, activity logs, analytics events,
  Insights Dashboard, SEO Center, AI Assistant, Quick Create, command palette, theme toggle,
  PWA install/offline, responsive layout.
- **Roles:** six roles x every collection (create / read / update / delete), publish rules,
  privilege escalation, data visibility (applications, resumes, notifications, search, export).

## Results by module

| Module                                                         | Cases   | Pass    | Fail  |
| -------------------------------------------------------------- | ------- | ------- | ----- |
| Roles (access matrix)                                          | 206     | 206     | 0     |
| Admin UI (every list / create / edit view, workspaces, header) | 104     | 104     | 0     |
| Insights                                                       | 78      | 78      | 0     |
| Website                                                        | 55      | 55      | 0     |
| Settings (globals)                                             | 40      | 40      | 0     |
| Recruitment                                                    | 36      | 36      | 0     |
| Marketing (newsletter)                                         | 10      | 10      | 0     |
| Sales CRM                                                      | 9       | 9       | 0     |
| Media                                                          | 7       | 7       | 0     |
| Workspace                                                      | 6       | 6       | 0     |
| Admin header                                                   | 5       | 5       | 0     |
| System                                                         | 3       | 3       | 0     |
| Developer (API docs)                                           | 2       | 2       | 0     |
| Analytics                                                      | 1       | 1       | 0     |
| **Total**                                                      | **562** | **562** | **0** |

539 cases are automated (`scripts/testing/run-admin-e2e.ts`: REST calls plus checks on the
rendered admin and website HTML) and 23 were run by hand in the browser (website forms, Quick
Create, command palette, notifications bell, theme, PWA, responsive layout, AI workspace).

## Defects

| Severity | Found | Fixed | Open |
| -------- | ----- | ----- | ---- |
| Critical | 3     | 3     | 0    |
| High     | 7     | 7     | 0    |
| Medium   | 5     | 5     | 0    |
| Low      | 2     | 1     | 1    |

The most important fixes:

- **Security:** administrators could promote themselves to super-admin (DEF-016); candidate
  resumes were public (DEF-006); admin search, AI write-back, notifications and subscriber
  export ignored role permissions (DEF-010 to DEF-013).
- **Data integrity:** editing a title changed live URLs (DEF-001); the download route clashed
  with the Downloads API (DEF-002).
- **Candidate / lead experience:** forms lost all input after an error (DEF-004);
  expired or closed jobs still accepted applications (DEF-005).
- **Admin usability:** workspaces missing from navigation, Quick Create offering forbidden
  items, menu not closing (DEF-007 to DEF-009); recruiters could not publish jobs (DEF-014).
- **Settings:** several globals did nothing on the site, and two did not refresh the cached
  production pages (DEF-003, DEF-017).

Open: DEF-015, unknown URLs return HTTP 200 with the 404 page (soft 404). Details and the
trade-off are in `defects.md`.

## Observations (not defects, for review)

- Services and Solutions listings are curated (a published TEST service does not appear in the
  public list automatically). This is by design.
- SEO Center shows "N gaps" next to a document count; the wording is ambiguous.
- Drafts without a title appear as "Item <id>" in workspaces.
- The dashboard "Total Visitors" figure counts unique paths, not visitors.
- `canPublish` (access) and `trackActivityDelete` (hook) are defined but unused, so deletions are
  not written to the activity log.
- The AI Assistant prompt form also clears after an error (same React 19 behaviour as DEF-004).
- "Mark all as read" in the bell was not exercised, because it would change real admins'
  notifications in the shared database. Per-notification ownership is covered by the roles cases.

## Emails

As agreed, email sending was left on. Test submissions sent:

- **Application and contact alerts** to the configured staff inbox (`CAREERS_NOTIFY_EMAIL` /
  `CONTACT_NOTIFY_EMAIL` / `EMAIL_TO`), with `[TEST]` in the subject. These can be deleted from
  the inbox.
- **Candidate and subscriber emails** to `qa.test+...@xelarvis.test` addresses. `.test` is
  reserved, so these were never delivered.

The admin has no "send campaign" action, so the TEST campaign was only created and edited.

## Changes to real data

- `npm run backfill:resumes -- --apply` moved two real resumes (`Abdullah.pdf`, `Roshan2.pdf`)
  into the private `resumes` folder. This is intended (DEF-006); the files and applications are
  unchanged.
- Settings globals were edited during the run and restored from
  `snapshots/globals-latest.json`; a final check found no TEST markers in any global.
- Every other record created is TEST data and is listed in `test-data-inventory.md`.

## Sign-off checklist

1. Client reviews the TEST records in the admin (filter by `[TEST]` / `test-qa-`).
2. `npm run test:cleanup` (dry run) and check the counts match `test-data-inventory.md`.
3. `npm run test:cleanup -- --apply`.
4. Delete the `[TEST]` alert emails from the staff inbox.
