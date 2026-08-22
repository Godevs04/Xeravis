'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { sendEmail } from '@/lib/email'
import { clientKeyFromHeaders, rateLimit } from '@/lib/rate-limit'
import { getPayload } from '@/lib/payload'

const INTENT_VALUES = [
  'business',
  'data-science',
  'it-consulting',
  'digital-transformation',
  'data-engineering',
  'healthcare',
  'research',
  'partnership',
  'career',
  'general',
  'project',
] as const

type Intent = (typeof INTENT_VALUES)[number]

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  email: z.string().email('Valid email is required').max(200),
  company: z.string().max(160).optional(),
  jobTitle: z.string().max(120).optional(),
  country: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  message: z.string().min(10, 'Please provide a brief message').max(5000),
  intent: z.string().max(40).optional(),
  website: z.string().optional(),
})

export type ContactFormState = {
  ok: boolean
  message: string
  fieldErrors?: Record<string, string[]>
}

function mapIntent(raw?: string): Intent {
  const legacy: Record<string, Intent> = {
    project: 'business',
    careers: 'career',
    ai: 'business',
  }
  const value = legacy[raw || ''] || (raw as Intent) || 'general'
  return INTENT_VALUES.includes(value) ? value : 'general'
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
    jobTitle: formData.get('jobTitle') || undefined,
    country: formData.get('country') || undefined,
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

  const intent = mapIntent(parsed.data.intent)

  try {
    const payload = await getPayload()
    await payload.create({
      collection: 'contact-messages',
      overrideAccess: true,
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company,
        jobTitle: parsed.data.jobTitle,
        country: parsed.data.country,
        phone: parsed.data.phone,
        message: parsed.data.message,
        intent,
        subject: intent || 'Website enquiry',
        status: 'new',
      },
    })

    await payload.create({
      collection: 'analytics-events',
      overrideAccess: true,
      data: {
        type: 'lead',
        path: '/contact',
        meta: { email: parsed.data.email, intent },
      },
    })

    await sendEmail({
      to: process.env.CONTACT_NOTIFY_EMAIL || process.env.EMAIL_TO,
      replyTo: parsed.data.email,
      subject: `New contact enquiry from ${parsed.data.name}`,
      text: [
        `Name: ${parsed.data.name}`,
        `Email: ${parsed.data.email}`,
        parsed.data.company ? `Company: ${parsed.data.company}` : '',
        parsed.data.jobTitle ? `Job title: ${parsed.data.jobTitle}` : '',
        parsed.data.country ? `Country: ${parsed.data.country}` : '',
        parsed.data.phone ? `Phone: ${parsed.data.phone}` : '',
        `Area of interest: ${intent}`,
        '',
        parsed.data.message,
      ]
        .filter(Boolean)
        .join('\n'),
    })

    return { ok: true, message: 'Thank you. Our team will respond within one business day.' }
  } catch {
    return {
      ok: false,
      message: 'Unable to submit right now. Please email hello@xelarvis.in directly.',
    }
  }
}
