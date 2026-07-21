'use server'

import { z } from 'zod'

import { getPayload } from '@/lib/payload'

const newsletterSchema = z.object({
  email: z.string().email('Valid email is required'),
})

export type NewsletterFormState = {
  ok: boolean
  message: string
  fieldErrors?: Record<string, string[]>
}

export async function submitNewsletter(_prev: NewsletterFormState, formData: FormData): Promise<NewsletterFormState> {
  const parsed = newsletterSchema.safeParse({ email: formData.get('email') })

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please enter a valid email address.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const payload = await getPayload()
    await payload.create({
      collection: 'form-submissions',
      overrideAccess: true,
      data: {
        type: 'newsletter',
        status: 'new',
        data: parsed.data,
      },
    })

    return { ok: true, message: 'You are subscribed. We will share insights sparingly.' }
  } catch {
    return { ok: false, message: 'Unable to subscribe right now. Please try again later.' }
  }
}
