'use server'

import { headers } from 'next/headers'
import { after } from 'next/server'
import { z } from 'zod'

import { attributionFromFormData } from '@/lib/attribution'
import { createDownloadToken } from '@/lib/download-token'
import { sendEmail } from '@/lib/email'
import { notifyLead } from '@/lib/notify'
import { getPayload } from '@/lib/payload'
import { clientIpFromHeaders, clientKeyFromHeaders, rateLimit } from '@/lib/rate-limit'
import { TURNSTILE_FIELD, verifyTurnstile } from '@/lib/turnstile'

const schema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/i)
    .max(160),
  email: z.string().trim().toLowerCase().email('Enter a valid work email').max(200),
  name: z.string().trim().max(120).optional(),
  company: z.string().trim().max(160).optional(),
})

export type DownloadFormState = { ok: boolean; message: string; url?: string }

export async function requestDownload(
  _prev: DownloadFormState,
  formData: FormData,
): Promise<DownloadFormState> {
  const headerList = await headers()
  const limited = await rateLimit(clientKeyFromHeaders(headerList, 'download-lead'), {
    limit: 10,
    windowMs: 15 * 60_000,
  })
  if (!limited.ok) {
    return { ok: false, message: 'Too many requests. Please try again later.' }
  }

  const parsed = schema.safeParse({
    slug: formData.get('slug'),
    email: formData.get('email'),
    name: formData.get('name') || undefined,
    company: formData.get('company') || undefined,
  })
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || 'Check the form and retry.' }
  }
  if (String(formData.get('website') ?? '').trim()) {
    return { ok: true, message: 'Your download is ready.' }
  }
  if (
    !(await verifyTurnstile(formData.get(TURNSTILE_FIELD), {
      action: 'download',
      ip: clientIpFromHeaders(headerList),
    }))
  ) {
    return { ok: false, message: 'Please complete the security check and try again.' }
  }

  const { slug, email, name, company } = parsed.data
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'downloads',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const doc = result.docs[0]
    if (!doc) return { ok: false, message: 'This download is no longer available.' }

    await payload.create({
      collection: 'form-submissions',
      overrideAccess: true,
      data: {
        type: 'download',
        status: 'new',
        data: { email, name, company, download: doc.title, downloadId: String(doc.id), slug },
        attribution: attributionFromFormData(formData),
      },
    })

    after(async () => {
      await Promise.allSettled([
        sendEmail({
          to: process.env.CONTACT_NOTIFY_EMAIL || process.env.EMAIL_TO,
          replyTo: email,
          subject: `New download lead: ${doc.title}`,
          text: [
            `Email: ${email}`,
            name ? `Name: ${name}` : '',
            company ? `Company: ${company}` : '',
            `Download: ${doc.title}`,
            '',
            'Review in Payload Admin > Form Submissions.',
          ]
            .filter(Boolean)
            .join('\n'),
        }),
        notifyLead({
          type: 'download',
          title: doc.title,
          fields: [
            ['Email', email],
            ['Name', name],
            ['Company', company],
          ],
          adminPath: '/admin/collections/form-submissions',
        }),
      ])
    })

    const token = createDownloadToken(slug)
    return {
      ok: true,
      message: 'Thanks! Your download is starting.',
      url: `/api/download/${slug}?t=${encodeURIComponent(token)}`,
    }
  } catch {
    return { ok: false, message: 'Unable to prepare the download. Please try again.' }
  }
}
