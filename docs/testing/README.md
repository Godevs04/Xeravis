# Admin panel end-to-end testing

End-to-end test pack for the Xelarvis admin panel (Payload CMS) and the website flows it drives.
Every record created while testing is marked as TEST data so it can be removed once the client
has verified the build, without touching real content.

## What is in this folder

| File                            | Purpose                                                                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `test-cases.csv`                | The final test sheet: one row per test case with steps, data, expected/actual result, status and severity. Open in Excel / Google Sheets. |
| `test-report.md`                | Summary of the run: scope, environment, results per module, defects, observations.                                                        |
| `defects.md`                    | Every defect found, its root cause, the fix and how it was re-tested.                                                                     |
| `test-data-inventory.md`        | What TEST data exists, how it is marked, and how to remove it.                                                                            |
| `results/*.json`                | Raw results per phase (`core`, `pipelines`, `roles`, `manual`) that `test-cases.csv` is built from.                                       |
| `results/*-inventory.json`      | Records each automated phase left in place for the client to review.                                                                      |
| `snapshots/globals-latest.json` | Snapshot of all 10 Settings globals taken before testing; used to restore them.                                                           |

## TEST data markers

| Kind              | Marker                                                 | Example                               |
| ----------------- | ------------------------------------------------------ | ------------------------------------- |
| Titles / names    | starts with `[TEST] `                                  | `[TEST] QA Job`                       |
| Slugs / filenames | starts with `test-qa-`                                 | `test-qa-careers`, `test-qa-hero.png` |
| Emails            | `qa.test+<module>-<n>@xelarvis.test`                   | `qa.test+career-1@xelarvis.test`      |
| Role users        | `test-qa-<role>@xelarvis.test`, password `TestQa!2026` | `test-qa-recruiter@xelarvis.test`     |
| Free text         | contains `TEST-QA`                                     | `TEST-QA Corp`                        |

`.test` is a reserved domain, so no real inbox ever receives the test emails.

## Scripts

All scripts read `.env.local` (database, secrets). Run them from the project root.

| Command                                 | What it does                                                                                                   |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm run test:snapshot`                 | Saves all 10 Settings globals to `snapshots/` (run before editing globals).                                    |
| `npm run test:restore`                  | Restores the globals from `snapshots/globals-latest.json`.                                                     |
| `npm run test:users`                    | Creates or resets the six `test-qa-<role>` users with their single role.                                       |
| `npm run test:e2e -- --phase=core`      | Content, taxonomies, media, downloads, endpoints, globals, every admin page.                                   |
| `npm run test:e2e -- --phase=pipelines` | Application / lead / newsletter pipelines and workspaces (needs the manual website submissions first).         |
| `npm run test:e2e -- --phase=roles`     | Role x collection access matrix, publish rules, privilege checks.                                              |
| `npm run test:sheet`                    | Rebuilds `test-cases.csv` from `results/*.json` and prints the per-module summary.                             |
| `npm run test:cleanup`                  | Dry run: lists every TEST record per collection.                                                               |
| `npm run test:cleanup -- --apply`       | Deletes every TEST record (after client sign-off).                                                             |
| `npm run backfill:resumes`              | One-off: moves media referenced by job applications into the private `resumes` folder (`-- --apply` to write). |

## How to run the suite

1. Use a production build. `next dev` recompiles whenever the run writes files (uploads,
   results) and Payload's import map can then fail every admin page until a restart, which
   produces false failures. A production build does not have this problem.

   ```bash
   NEXT_PUBLIC_SITE_URL=http://localhost:3001 npm run build
   NEXT_PUBLIC_SITE_URL=http://localhost:3001 npx next start -p 3001
   ```

   `NEXT_PUBLIC_SITE_URL` must match the URL you test against: Payload only trusts the session
   cookie (and server actions only see the user) for that origin.

2. `npm run test:snapshot` and `npm run test:users`.
3. Submit the website forms by hand as listed in `results/manual.json`
   (apply to `/careers/test-qa-careers`, contact form, footer newsletter).
4. Run the three phases against the server:

   ```bash
   E2E_BASE_URL=http://localhost:3001 npm run test:e2e -- --phase=core
   E2E_BASE_URL=http://localhost:3001 npm run test:e2e -- --phase=pipelines
   E2E_BASE_URL=http://localhost:3001 npm run test:e2e -- --phase=roles
   ```

5. `npm run test:restore`, then `npm run test:sheet`.

The phases are re-runnable: each one removes its own previous TEST records before creating new
ones and restores any global it edits.

## Removing TEST data after client verification

```bash
npm run test:cleanup            # review the counts
npm run test:cleanup -- --apply # delete
npm run test:restore            # only if globals were edited again after the run
```

See `test-data-inventory.md` for exactly what will be removed.
