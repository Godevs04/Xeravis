'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { z } from 'zod'

import { clientKeyFromHeaders, rateLimit } from '@/lib/rate-limit'
import { getPayload } from '@/lib/payload'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  email: z.string().email('Valid email is required').max(200),
  company: z.string().max(160).optional(),
  phone: z.string().max(40).optional(),
  message: z.string().min(10, 'Please provide a brief message').max(5000),
  intent: z.string().max(40).optional(),
  website: z.string().optional(), // honeypot
})

export type ContactFormState = {
  ok: boolean
  message: string
  fieldErrors?: Record<string, string[]>
}

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const headerList = await headers()
  const limited = rateLimit(clientKeyFromHeaders(headerList, 'contact'), {
    limit: 8,
    windowMs: 15 * 60_000,
  })
  if (!limited.ok) {
    return {
      ok: false,
      message: 'Too many messages from this network. Please try again later.',
    }
  }

  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company') || undefined,
    phone: formData.get('phone') || undefined,
    message: formData.get('message'),
    intent: formData.get('intent') || undefined,
    website: formData.get('website') || undefined,
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please correct the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  if (parsed.data.website) {
    return { ok: true, message: 'Thank you. Our team will respond within one business day.' }
  }

  try {
    const payload = await getPayload()
    await payload.create({
      collection: 'contact-messages',
      overrideAccess: true,
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company,
        phone: parsed.data.phone,
        message: parsed.data.message,
        intent: (() => {
          type Intent = 'business' | 'research' | 'career' | 'general' | 'project' | 'partnership'
          const raw = parsed.data.intent || 'general'
          const legacy: Record<string, Intent> = {
            project: 'business',
            partnership: 'research',
            careers: 'career',
          }
          const mapped = legacy[raw] || raw
          const allowed: Intent[] = [
            'business',
            'research',
            'career',
            'general',
            'project',
            'partnership',
          ]
          return (allowed.includes(mapped as Intent) ? mapped : 'general') as Intent
        })(),
        subject: parsed.data.intent || 'Website enquiry',
        status: 'new',
      },
    })

    await payload.create({
      collection: 'analytics-events',
      overrideAccess: true,
      data: {
        type: 'lead',
        path: '/contact',
        meta: { email: parsed.data.email },
      },
    })

    const resendKey = process.env.RESEND_API_KEY
    const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL || process.env.EMAIL_TO
    if (resendKey && notifyEmail) {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ||
          process.env.EMAIL_FROM ||
          'Xelarvis <onboarding@resend.dev>',
        to: notifyEmail,
        subject: `New contact enquiry from ${parsed.data.name}`,
        text: [
          `Name: ${parsed.data.name}`,
          `Email: ${parsed.data.email}`,
          parsed.data.company ? `Company: ${parsed.data.company}` : '',
          parsed.data.phone ? `Phone: ${parsed.data.phone}` : '',
          parsed.data.intent ? `Intent: ${parsed.data.intent}` : '',
          '',
          parsed.data.message,
        ]
          .filter(Boolean)
          .join('\n'),
      })
    }

    return { ok: true, message: 'Thank you. Our team will respond within one business day.' }
  } catch {
    return {
      ok: false,
      message: 'Unable to submit right now. Please email hello@xelarvis.in directly.',
    }
  }
}
