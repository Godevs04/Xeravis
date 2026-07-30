'use server'

import { z } from 'zod'

import { getPayload } from '@/lib/payload'

const schema = z.object({
  email: z.string().email('Valid email is required'),
  website: z.string().optional(),
})

export type NewsletterFormState = {
  ok: boolean
  message: string
}

export async function submitNewsletter(
  _prev: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    website: formData.get('website') || undefined,
  })

  if (!parsed.success) {
    return { ok: false, message: 'Please enter a valid email address.' }
  }

  if (parsed.data.website) {
    return { ok: true, message: 'You are subscribed.' }
  }

  try {
    const payload = await getPayload()
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: parsed.data.email } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'newsletter-subscribers',
        overrideAccess: true,
        data: {
          email: parsed.data.email,
          status: 'active',
        },
      })
    }

    await payload.create({
      collection: 'analytics-events',
      overrideAccess: true,
      data: {
        type: 'newsletter',
        path: '/newsletter',
        meta: { email: parsed.data.email },
      },
    })

    return { ok: true, message: 'Thanks for subscribing.' }
  } catch {
    return { ok: false, message: 'Unable to subscribe right now. Please try again later.' }
  }
}
