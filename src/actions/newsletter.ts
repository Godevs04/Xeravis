'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { sendConfirmationEmail } from '@/lib/newsletter'
import { clientIpFromHeaders, clientKeyFromHeaders, rateLimit } from '@/lib/rate-limit'
import { TURNSTILE_FIELD, verifyTurnstile } from '@/lib/turnstile'
import { getPayload } from '@/lib/payload'
import { createToken } from '@/lib/tokens'

const schema = z.object({
  email: z.string().email('Valid email is required').max(200),
  website: z.string().optional(),
  topic: z.enum(['insights', 'careers']).default('insights'),
})

type Topic = z.infer<typeof schema>['topic']

export type NewsletterFormState = {
  ok: boolean
  message: string
}

export async function submitNewsletter(
  _prev: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const headerList = await headers()
  const limited = await rateLimit(clientKeyFromHeaders(headerList, 'newsletter'), {
    limit: 10,
    windowMs: 15 * 60_000,
  })
  if (!limited.ok) {
    return { ok: false, message: 'Too many subscription attempts. Please try again later.' }
  }

  const parsed = schema.safeParse({
    email: formData.get('email'),
    website: formData.get('website') || undefined,
    topic: formData.get('topic') || undefined,
  })

  if (!parsed.success) {
    return { ok: false, message: 'Please enter a valid email address.' }
  }

  const pendingMessage = 'Almost done. Please check your inbox to confirm your subscription.'
  if (parsed.data.website) {
    return { ok: true, message: pendingMessage }
  }

  if (
    !(await verifyTurnstile(formData.get(TURNSTILE_FIELD), {
      action: 'newsletter',
      ip: clientIpFromHeaders(headerList),
    }))
  ) {
    return { ok: false, message: 'Please complete the security check and try again.' }
  }

  const { email, topic } = parsed.data

  try {
    const payload = await getPayload()
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const current = existing.docs[0]
    let message = pendingMessage

    if (!current) {
      const token = createToken()
      await payload.create({
        collection: 'newsletter-subscribers',
        overrideAccess: true,
        data: { email, status: 'pending', topics: [topic], token, source: topic },
      })
      await sendConfirmationEmail(email, token)
    } else {
      const topics = Array.from(new Set<Topic>([...((current.topics as Topic[]) || []), topic]))
      const token = (current as { token?: string }).token || createToken()
      const needsConfirm = current.status !== 'active'
      await payload.update({
        collection: 'newsletter-subscribers',
        id: current.id,
        overrideAccess: true,
        data: { topics, token, ...(needsConfirm ? { status: 'pending' as const } : {}) },
      })
      if (needsConfirm) await sendConfirmationEmail(email, token)
      else message = 'You are already subscribed. Preferences updated.'
    }

    await payload.create({
      collection: 'analytics-events',
      overrideAccess: true,
      data: {
        type: 'newsletter',
        path: topic === 'careers' ? '/careers' : '/newsletter',
        meta: { email, topic },
      },
    })

    return { ok: true, message }
  } catch {
    return { ok: false, message: 'Unable to subscribe right now. Please try again later.' }
  }
}
