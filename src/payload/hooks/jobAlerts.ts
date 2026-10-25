import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload'

import { audienceWhere, mailAudience } from '@/lib/campaigns'
import { emailLayout, escapeHtml } from '@/lib/email-templates'
import { unsubscribeFooterHtml, unsubscribeUrl } from '@/lib/newsletter'
import { absoluteUrl } from '@/lib/utils'

type CareerLike = {
  id?: string | number
  title?: string
  slug?: string
  location?: string
  active?: boolean | null
  _status?: string | null
  createdAt?: string
  jobAlertSentAt?: string | null
}

/** Roles created before job alerts existed never trigger an alert when edited later. */
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

const isLive = (career?: CareerLike | null) =>
  Boolean(career) &&
  career!.active !== false &&
  (!career!._status || career!._status === 'published')

/** Stamps `jobAlertSentAt` on the save that first makes a role live, so alerts go out once. */
export const markJobAlert: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const original = originalDoc as CareerLike | undefined
  const next = { ...original, ...data } as CareerLike
  if (!isLive(next) || original?.jobAlertSentAt) return data
  const created = original?.createdAt ? new Date(original.createdAt).getTime() : Date.now()
  if (Date.now() - created > MAX_AGE_MS) return data
  return { ...data, jobAlertSentAt: new Date().toISOString() }
}

/** Emails job-alert subscribers in the background after `markJobAlert` stamped the role. */
export const sendJobAlerts: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  const career = doc as CareerLike
  const before = previousDoc as CareerLike | undefined
  if (!career.jobAlertSentAt || before?.jobAlertSentAt || !career.slug) return doc

  const { payload } = req
  const href = absoluteUrl(`/careers/${career.slug}`)
  const title = career.title || 'New role'
  void mailAudience(payload, audienceWhere('careers'), (token) => ({
    subject: `New role at Xelarvis: ${title}`,
    text: `${title}${career.location ? ` (${career.location})` : ''}\n\nView and apply: ${href}\n\n--\nUnsubscribe: ${unsubscribeUrl(token)}`,
    html: emailLayout({
      heading: `New role: ${title}`,
      bodyHtml: `<p style="margin:0">A new position just opened at Xelarvis${career.location ? ` in <strong>${escapeHtml(career.location)}</strong>` : ''}.</p>`,
      cta: { label: 'View role and apply', href },
      footerHtml: unsubscribeFooterHtml(token),
    }),
  }))
    .then((result) => payload.logger.info({ msg: 'Job alert sent', career: career.id, ...result }))
    .catch((err) => payload.logger.error({ err, msg: 'Job alert failed' }))

  return doc
}
