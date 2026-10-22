# TEST data inventory

Everything the test run left in the shared database, so the client can review it in the admin
and then remove it in one step. Nothing here is real content.

## How TEST data is marked

| Kind                      | Marker                                                           |
| ------------------------- | ---------------------------------------------------------------- |
| Titles / names            | start with `[TEST] `                                             |
| Slugs / filenames         | start with `test-qa-`                                            |
| Emails                    | end with `@xelarvis.test` (`qa.test+<module>-<n>@xelarvis.test`) |
| Role users                | `test-qa-<role>@xelarvis.test`, password `TestQa!2026`           |
| Free text / JSON payloads | contain `TEST-QA`                                                |

To see TEST records in any admin list, search for `[TEST]` or `test-qa`.

## Records left for review

Counts from `npm run test:cleanup` (dry run) after the final run.

| Collection               | Count    | Records                                                                                                                          |
| ------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Pages                    | 1        | `[TEST] QA Page` (`/test-qa-pages`)                                                                                              |
| Services                 | 1        | `[TEST] QA Service` (`test-qa-services`)                                                                                         |
| Solutions                | 1        | `[TEST] QA Solution` (`test-qa-solutions`)                                                                                       |
| Industries               | 1        | `[TEST] QA Industry` (`test-qa-industries`)                                                                                      |
| Case studies             | 1        | `[TEST] QA Case Study` (`test-qa-case-studies`)                                                                                  |
| Technologies             | 1        | `[TEST] QA Technologies` (`test-qa-technologies`)                                                                                |
| Blogs                    | 2        | `[TEST] QA Blog` (`test-qa-blogs`); `[TEST] QA AI Blog` (`test-qa-ai-blog`, draft written by the AI Assistant)                   |
| Research                 | 1        | `[TEST] QA Research` (`test-qa-research`)                                                                                        |
| Categories               | 1        | `[TEST] QA Categories`                                                                                                           |
| Tags                     | 1        | `[TEST] QA Tags`                                                                                                                 |
| Authors                  | 1        | `[TEST] QA Authors`                                                                                                              |
| Clients                  | 1        | `[TEST] QA Clients`                                                                                                              |
| Team members             | 1        | `[TEST] QA Team Members`                                                                                                         |
| FAQs                     | 1        | `[TEST] QA FAQs?`                                                                                                                |
| Testimonials             | 1        | `[TEST] QA Testimonials`                                                                                                         |
| Downloads                | 1        | `[TEST] QA Downloads` (`/api/download/test-qa-downloads`)                                                                        |
| Careers                  | 3        | `[TEST] QA Job` (`/careers/test-qa-careers`, open); `[TEST] QA Job closed` (inactive); `[TEST] QA Job expired` (deadline passed) |
| Departments              | 1        | `[TEST] QA Departments`                                                                                                          |
| Job applications         | 1        | `[TEST] QA Applicant`, `qa.test+career-1@xelarvis.test`, status Interview Scheduled                                              |
| Interviews               | 1        | `[TEST] QA Technical interview`                                                                                                  |
| Contact messages (leads) | 1        | `qa.test+lead-1@xelarvis.test`, status Won                                                                                       |
| Form submissions         | 6        | JSON payloads tagged `TEST-QA` / `@xelarvis.test`                                                                                |
| Newsletter subscribers   | 1        | `qa.test+newsletter-1@xelarvis.test`, Active                                                                                     |
| Newsletter campaigns     | 1        | `[TEST] QA Newsletter Campaigns` (never sent)                                                                                    |
| Media                    | 3        | `test-qa-hero` (image + generated sizes), `test-qa-brochure.pdf`, `test-qa-resume.pdf` (private `resumes` folder)                |
| Users                    | 6        | `test-qa-administrator`, `-editor`, `-content-manager`, `-marketing`, `-recruiter`, `-viewer` `@xelarvis.test`                   |
| Analytics events         | 30       | Page views / events with TEST paths or payloads                                                                                  |
| Activity logs            | 644      | Audit entries whose summary mentions a TEST record                                                                               |
| Notifications            | 732      | Bell entries about TEST records (sent to staff and TEST users)                                                                   |
| **Total**                | **1447** |                                                                                                                                  |

The notification and activity-log counts grow with every run, because each create, publish and
status change by the suite writes entries for every staff user.

## Not TEST data, but touched by testing

| What                                       | Change                                                                      | Action needed                                                                                               |
| ------------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Settings globals (all 10)                  | Edited with TEST values, then restored from `snapshots/globals-latest.json` | None. A final check found no TEST markers. Re-run `npm run test:restore` only if globals were edited again. |
| Real resumes `Abdullah.pdf`, `Roshan2.pdf` | Moved into the private `resumes` media folder (DEF-006)                     | None (intended privacy fix)                                                                                 |
| Staff inbox                                | Received `[TEST]` application and contact alert emails                      | Delete them from the inbox                                                                                  |

## Removing TEST data

```bash
npm run test:cleanup             # dry run: prints the counts above
npm run test:cleanup -- --apply  # deletes every TEST record
```

The script deletes in dependency order (interviews and applications before careers, users last)
and only touches records that carry a TEST marker. Uploaded files of deleted media are removed
with them.
