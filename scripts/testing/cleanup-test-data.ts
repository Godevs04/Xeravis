import type { CollectionSlug, Payload, Where } from 'payload'

import {
  bootPayload,
  hasTestMarker,
  SCANNED_COLLECTIONS,
  TEST_EMAIL_DOMAIN,
  TEST_MATCHERS,
} from './shared'

/**
 * Removes every QA record. Dry run by default: `npm run test:cleanup`.
 * Delete for real with `npm run test:cleanup -- --apply`.
 *
 * Order matters: dependants (interviews, applications, logs) go before the records they reference,
 * and users go last so notifications addressed to them are removed first.
 */
const ORDER: CollectionSlug[] = [
  'interviews',
  'job-applications',
  'contact-messages',
  'newsletter-subscribers',
  'newsletter-campaigns',
  'downloads',
  'case-studies',
  'blogs',
  'research',
  'services',
  'solutions',
  'industries',
  'technologies',
  'pages',
  'careers',
  'departments',
  'faqs',
  'testimonials',
  'team-members',
  'clients',
  'authors',
  'categories',
  'tags',
  'form-submissions',
  'analytics-events',
  'activity-logs',
  'notifications',
  'media',
  'users',
]

const DRAFT_COLLECTIONS = new Set<CollectionSlug>([
  'pages',
  'services',
  'industries',
  'solutions',
  'case-studies',
  'blogs',
  'research',
  'careers',
])

async function findIds(payload: Payload, collection: CollectionSlug): Promise<string[]> {
  const ids: string[] = []
  const scanned = SCANNED_COLLECTIONS.includes(collection)
  const where = TEST_MATCHERS[collection]
  if (!scanned && !where) return ids

  let page = 1
  for (;;) {
    const res = await payload.find({
      collection,
      where: scanned ? undefined : (where as Where),
      depth: 0,
      limit: 200,
      page,
      overrideAccess: true,
      draft: DRAFT_COLLECTIONS.has(collection) ? true : undefined,
      pagination: true,
    })
    for (const doc of res.docs) {
      if (!scanned || hasTestMarker(doc)) ids.push(String(doc.id))
    }
    if (!res.hasNextPage) break
    page += 1
  }
  return ids
}

async function notificationsForTestUsers(payload: Payload): Promise<string[]> {
  const users = await payload.find({
    collection: 'users',
    where: { email: { contains: TEST_EMAIL_DOMAIN } },
    depth: 0,
    limit: 100,
    overrideAccess: true,
  })
  if (!users.docs.length) return []
  const res = await payload.find({
    collection: 'notifications',
    where: { user: { in: users.docs.map((u) => u.id) } },
    depth: 0,
    limit: 5000,
    overrideAccess: true,
  })
  return res.docs.map((d) => String(d.id))
}

async function main() {
  const apply = process.argv.includes('--apply')
  const payload = await bootPayload()
  const summary: Array<[string, number]> = []

  for (const collection of ORDER) {
    const ids = new Set(await findIds(payload, collection))
    if (collection === 'notifications') {
      for (const id of await notificationsForTestUsers(payload)) ids.add(id)
    }
    summary.push([collection, ids.size])
    if (!apply || !ids.size) continue

    for (const id of ids) {
      try {
        await payload.delete({
          collection,
          id,
          overrideAccess: true,
          context: { disableRevalidate: false },
        })
      } catch (error) {
        process.stderr.write(
          `could not delete ${collection}/${id}: ${error instanceof Error ? error.message : String(error)}\n`,
        )
      }
    }
  }

  const total = summary.reduce((n, [, c]) => n + c, 0)
  process.stdout.write(`${apply ? 'DELETED' : 'DRY RUN (pass --apply to delete)'}\n`)
  for (const [collection, count] of summary) {
    if (count) process.stdout.write(`  ${collection.padEnd(24)} ${count}\n`)
  }
  process.stdout.write(`  ${'total'.padEnd(24)} ${total}\n`)
  process.exit(0)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
  process.exit(1)
})
