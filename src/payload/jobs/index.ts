import type { CollectionSlug, JobsConfig, Payload, Where } from 'payload'

import { sendEmail } from '@/lib/email'
import { emailLayout, escapeHtml } from '@/lib/email-templates'
import { postToLeadWebhook } from '@/lib/notify'

const DAY_MS = 24 * 60 * 60 * 1000
const ANALYTICS_RETENTION_DAYS = 180
const PENDING_SUBSCRIBER_DAYS = 30

const daysAgo = (days: number) => new Date(Date.now() - days * DAY_MS).toISOString()

async function count(payload: Payload, collection: CollectionSlug, where: Where) {
  const { totalDocs } = await payload.count({ collection, where, overrideAccess: true })
  return totalDocs
}

async function deleteOlderThan(
  payload: Payload,
  collection: CollectionSlug,
  days: number,
  extra?: Where,
  field: 'createdAt' | 'updatedAt' = 'createdAt',
) {
  const where: Where = {
    and: [{ [field]: { less_than: daysAgo(days) } }, ...(extra ? [extra] : [])],
  }
  const removed = await count(payload, collection, where)
  if (removed > 0) await payload.db.deleteMany({ collection, where })
  return removed
}

/**
 * Background tasks run by `/api/payload-jobs/run` (called by the Vercel cron in `vercel.json`).
 * Scheduled publishing (`versions.drafts.schedulePublish`) uses the same runner.
 */
export const jobs: JobsConfig = {
  access: {
    run: ({ req }) => {
      if (req.user) return true
      const secret = process.env.CRON_SECRET
      return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`
    },
  },
  deleteJobOnComplete: true,
  tasks: [
    {
      slug: 'weeklyLeadDigest',
      label: 'Weekly lead digest',
      schedule: [{ cron: '0 8 * * 1', queue: 'maintenance' }],
      outputSchema: [{ name: 'total', type: 'number' }],
      handler: async ({ req: { payload } }) => {
        const since = { createdAt: { greater_than_equal: daysAgo(7) } }
        const rows: Array<[string, number]> = [
          ['Contact enquiries', await count(payload, 'contact-messages', since)],
          ['Job applications', await count(payload, 'job-applications', since)],
          [
            'Download leads',
            await count(payload, 'form-submissions', {
              and: [since, { type: { equals: 'download' } }],
            }),
          ],
          [
            'AI readiness assessments',
            await count(payload, 'form-submissions', {
              and: [since, { type: { equals: 'assessment' } }],
            }),
          ],
          [
            'New newsletter subscribers',
            await count(payload, 'newsletter-subscribers', {
              and: [
                { confirmedAt: { greater_than_equal: daysAgo(7) } },
                { status: { equals: 'active' } },
              ],
            }),
          ],
        ]
        const total = rows.reduce((sum, [, n]) => sum + n, 0)
        const text = `*Weekly lead digest* (last 7 days)\n${rows
          .map(([label, n]) => `*${label}:* ${n}`)
          .join('\n')}`

        await Promise.allSettled([
          postToLeadWebhook(text),
          sendEmail({
            to: process.env.CONTACT_NOTIFY_EMAIL || process.env.EMAIL_TO,
            subject: `Weekly lead digest: ${total} new lead${total === 1 ? '' : 's'}`,
            text: text.replace(/\*/g, ''),
            html: emailLayout({
              heading: 'Weekly lead digest',
              bodyHtml: `<p style="margin:0 0 14px">Activity in the last 7 days:</p><table style="border-collapse:collapse">${rows
                .map(
                  ([label, n]) =>
                    `<tr><td style="padding:4px 16px 4px 0">${escapeHtml(label)}</td><td style="padding:4px 0;font-weight:700">${n}</td></tr>`,
                )
                .join('')}</table>`,
            }),
          }),
        ])
        return { output: { total } }
      },
    },
    {
      slug: 'pruneAnalyticsEvents',
      label: 'Prune old analytics events',
      schedule: [{ cron: '0 3 * * *', queue: 'maintenance' }],
      outputSchema: [{ name: 'removed', type: 'number' }],
      handler: async ({ req: { payload } }) => ({
        output: {
          removed: await deleteOlderThan(payload, 'analytics-events', ANALYTICS_RETENTION_DAYS),
        },
      }),
    },
    {
      slug: 'cleanupPendingSubscribers',
      label: 'Remove unconfirmed newsletter sign-ups',
      schedule: [{ cron: '30 3 * * *', queue: 'maintenance' }],
      outputSchema: [{ name: 'removed', type: 'number' }],
      handler: async ({ req: { payload } }) => ({
        output: {
          removed: await deleteOlderThan(
            payload,
            'newsletter-subscribers',
            PENDING_SUBSCRIBER_DAYS,
            { status: { equals: 'pending' } },
            // Re-subscribing resets an old record to pending, so age is measured from then.
            'updatedAt',
          ),
        },
      }),
    },
  ],
}
