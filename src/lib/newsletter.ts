import { sendEmail } from '@/lib/email'
import { emailLayout, escapeHtml } from '@/lib/email-templates'
import { getPayload } from '@/lib/payload'
import { isWellFormedToken } from '@/lib/tokens'
import { absoluteUrl } from '@/lib/utils'

export function confirmUrl(token: string) {
  return absoluteUrl(`/newsletter/confirm?token=${encodeURIComponent(token)}`)
}

export function unsubscribeUrl(token: string) {
  return absoluteUrl(`/newsletter/unsubscribe?token=${encodeURIComponent(token)}`)
}

export function oneClickUnsubscribeUrl(token: string) {
  return absoluteUrl(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`)
}

/** RFC 2369 / RFC 8058 headers so mail clients can show a native unsubscribe button. */
export function unsubscribeHeaders(token: string): Record<string, string> {
  return {
    'List-Unsubscribe': `<${oneClickUnsubscribeUrl(token)}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}

export function unsubscribeFooterHtml(token: string) {
  return `You are receiving this because you subscribed to Xelarvis updates. <a href="${escapeHtml(unsubscribeUrl(token))}" style="color:#0f766e">Unsubscribe</a>.`
}

export async function sendConfirmationEmail(email: string, token: string) {
  return sendEmail({
    to: email,
    subject: 'Confirm your Xelarvis subscription',
    text: `Please confirm your subscription to Xelarvis updates:\n\n${confirmUrl(token)}\n\nIf you did not request this, you can ignore this email.`,
    html: emailLayout({
      heading: 'Confirm your subscription',
      bodyHtml:
        '<p style="margin:0 0 14px">Thanks for your interest in Xelarvis insights on AI, data and digital transformation. Please confirm your email address to start receiving updates.</p><p style="margin:0">If you did not request this, you can ignore this email.</p>',
      cta: { label: 'Confirm subscription', href: confirmUrl(token) },
    }),
  })
}

type TokenResult = 'ok' | 'invalid'

async function findByToken(token: string) {
  if (!isWellFormedToken(token)) return null
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'newsletter-subscribers',
    where: { token: { equals: token } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return result.docs[0] ? { payload, doc: result.docs[0] } : null
}

export async function confirmSubscription(token: string): Promise<TokenResult> {
  const found = await findByToken(token)
  if (!found) return 'invalid'
  if (found.doc.status !== 'active') {
    await found.payload.update({
      collection: 'newsletter-subscribers',
      id: found.doc.id,
      overrideAccess: true,
      data: { status: 'active', confirmedAt: new Date().toISOString() },
    })
  }
  return 'ok'
}

export async function unsubscribe(token: string): Promise<TokenResult> {
  const found = await findByToken(token)
  if (!found) return 'invalid'
  if (found.doc.status !== 'unsubscribed') {
    await found.payload.update({
      collection: 'newsletter-subscribers',
      id: found.doc.id,
      overrideAccess: true,
      data: { status: 'unsubscribed', unsubscribedAt: new Date().toISOString() },
    })
  }
  return 'ok'
}
