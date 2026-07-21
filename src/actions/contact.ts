'use server'

import { Resend } from 'resend'
import { z } from 'zod'

import { getPayload } from '@/lib/payload'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, 'Please provide a brief message'),
})

export type ContactFormState = {
  ok: boolean
  message: string
  fieldErrors?: Record<string, string[]>
}

export async function submitContact(_prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company') || undefined,
    phone: formData.get('phone') || undefined,
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please correct the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const payload = await getPayload()
    await payload.create({
      collection: 'form-submissions',
      overrideAccess: true,
      data: {
        type: 'contact',
        status: 'new',
        data: parsed.data,
      },
    })

    const resendKey = process.env.RESEND_API_KEY
    const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL
    if (resendKey && notifyEmail) {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Xelarvis <onboarding@resend.dev>',
        to: notifyEmail,
        subject: `New contact enquiry from ${parsed.data.name}`,
        text: [
          `Name: ${parsed.data.name}`,
          `Email: ${parsed.data.email}`,
          parsed.data.company ? `Company: ${parsed.data.company}` : '',
          parsed.data.phone ? `Phone: ${parsed.data.phone}` : '',
          '',
          parsed.data.message,
        ]
          .filter(Boolean)
          .join('\n'),
      })
    }

    return { ok: true, message: 'Thank you. Our team will respond within one business day.' }
  } catch {
    return { ok: false, message: 'Unable to submit right now. Please email hello@xelarvis.in directly.' }
  }
}
