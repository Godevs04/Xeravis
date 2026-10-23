import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import type { Payload, Where } from 'payload'

import { sendEmail, type SendEmailInput } from '@/lib/email'
import { emailLayout } from '@/lib/email-templates'
import { createLogger } from '@/lib/logger'
import { unsubscribeFooterHtml, unsubscribeHeaders, unsubscribeUrl } from '@/lib/newsletter'
import { createToken } from '@/lib/tokens'

const log = createLogger({ scope: 'campaigns' })

const PAGE_SIZE = 100
const CONCURRENCY = 5

export type CampaignAudience = 'active' | 'all' | 'insights' | 'careers'

type CampaignDoc = {
  id: string | number
  title: string
  subject: string
  body?: unknown
  audienceFilter?: CampaignAudience | null
}

type Subscriber = { id: string | number; email: string; token?: string | null }

/** Only confirmed subscribers are ever mailed, whatever the audience filter says. */
export function audienceWhere(audience: CampaignAudience | null | undefined): Where {
  const active: Where = { status: { equals: 'active' } }
  if (audience === 'careers') return { and: [active, { topics: { in: ['careers'] } }] }
  if (audience === 'insights') {
    return {
      and: [active, { or: [{ topics: { in: ['insights'] } }, { topics: { exists: false } }] }],
    }
  }
  return active
}

export function renderCampaign(campaign: Pick<CampaignDoc, 'subject' | 'body'>) {
  const data = campaign.body as SerializedEditorState | undefined
  const html = data?.root ? convertLexicalToHTML({ data, disableContainer: true }) : ''
  const text = data?.root ? convertLexicalToPlaintext({ data }) : ''
  return { html, text }
}

async function ensureToken(payload: Payload, subscriber: Subscriber) {
  if (subscriber.token) return subscriber.token
  const token = createToken()
  await payload.update({
    collection: 'newsletter-subscribers',
    id: subscriber.id,
    overrideAccess: true,
    data: { token },
  })
  return token
}

/**
 * Emails every subscriber matching `where`, in pages with limited concurrency. `build` gets the
 * subscriber's unsubscribe token; List-Unsubscribe headers are added automatically.
 */
export async function mailAudience(
  payload: Payload,
  where: Where,
  build: (token: string) => Omit<SendEmailInput, 'to' | 'headers'>,
) {
  let sent = 0
  let failed = 0
  let page = 1
  let hasNext = true

  while (hasNext) {
    const batch = await payload.find({
      collection: 'newsletter-subscribers',
      where,
      page,
      limit: PAGE_SIZE,
      depth: 0,
      sort: 'createdAt',
      overrideAccess: true,
    })
    const subscribers = batch.docs as unknown as Subscriber[]
    for (let i = 0; i < subscribers.length; i += CONCURRENCY) {
      const results = await Promise.allSettled(
        subscribers.slice(i, i + CONCURRENCY).map(async (subscriber) => {
          const token = await ensureToken(payload, subscriber)
          return sendEmail({
            ...build(token),
            to: subscriber.email,
            headers: unsubscribeHeaders(token),
          })
        }),
      )
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value) sent += 1
        else failed += 1
      }
    }
    hasNext = batch.hasNextPage
    page += 1
  }
  return { sent, failed }
}

export async function sendTestCampaign(campaign: CampaignDoc, to: string) {
  const rendered = renderCampaign(campaign)
  return sendEmail({
    to,
    subject: `[Test] ${campaign.subject}`,
    text: rendered.text,
    html: emailLayout({
      heading: campaign.subject,
      bodyHtml: rendered.html,
      footerHtml: 'Test send. Recipients get a personal unsubscribe link here.',
    }),
  })
}

/**
 * Claims the campaign (draft -> sending) so it can never go out twice, then mails every
 * matching subscriber.
 */
export async function sendCampaign(payload: Payload, id: string | number) {
  const claimed = await payload.update({
    collection: 'newsletter-campaigns',
    where: { and: [{ id: { equals: id } }, { status: { not_in: ['sending', 'sent'] } }] },
    overrideAccess: true,
    data: { status: 'sending' },
  })
  const campaign = claimed.docs[0] as CampaignDoc | undefined
  if (!campaign) return { ok: false as const, error: 'Campaign was already sent or is sending.' }

  const rendered = renderCampaign(campaign)
  if (!rendered.text.trim()) {
    await payload.update({
      collection: 'newsletter-campaigns',
      id,
      overrideAccess: true,
      data: { status: 'draft' },
    })
    return { ok: false as const, error: 'Add some body content before sending.' }
  }

  const { sent, failed } = await mailAudience(
    payload,
    audienceWhere(campaign.audienceFilter),
    (token) => ({
      subject: campaign.subject,
      text: `${rendered.text}\n\n--\nUnsubscribe: ${unsubscribeUrl(token)}`,
      html: emailLayout({
        heading: campaign.subject,
        bodyHtml: rendered.html,
        footerHtml: unsubscribeFooterHtml(token),
      }),
    }),
  )

  await payload.update({
    collection: 'newsletter-campaigns',
    id,
    overrideAccess: true,
    data: {
      status: 'sent',
      sentAt: new Date().toISOString(),
      sentCount: sent,
      failedCount: failed,
    },
  })
  log.info(`Campaign ${id} sent`, { sent, failed })
  return { ok: true as const, sent, failed }
}
