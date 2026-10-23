'use server'

import { headers } from 'next/headers'
import { after } from 'next/server'
import { z } from 'zod'

import { DIMENSIONS, scoreAssessment } from '@/lib/ai-readiness'
import { attributionFromFormData } from '@/lib/attribution'
import { sendEmail } from '@/lib/email'
import { emailLayout, escapeHtml } from '@/lib/email-templates'
import { notifyLead } from '@/lib/notify'
import { getPayload } from '@/lib/payload'
import { clientIpFromHeaders, clientKeyFromHeaders, rateLimit } from '@/lib/rate-limit'
import { TURNSTILE_FIELD, verifyTurnstile } from '@/lib/turnstile'
import { absoluteUrl } from '@/lib/utils'

const schema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid work email').max(200),
  name: z.string().trim().max(120).optional(),
  company: z.string().trim().max(160).optional(),
  answers: z.record(z.string(), z.number().int().min(0).max(3)),
})

export type AssessmentFormState = { ok: boolean; message: string }

export async function submitAssessment(
  _prev: AssessmentFormState,
  formData: FormData,
): Promise<AssessmentFormState> {
  const headerList = await headers()
  const limited = await rateLimit(clientKeyFromHeaders(headerList, 'assessment'), {
    limit: 5,
    windowMs: 15 * 60_000,
  })
  if (!limited.ok) return { ok: false, message: 'Too many requests. Please try again later.' }

  let answers: unknown = {}
  try {
    answers = JSON.parse(String(formData.get('answers') || '{}'))
  } catch {
    answers = {}
  }
  const parsed = schema.safeParse({
    email: formData.get('email'),
    name: formData.get('name') || undefined,
    company: formData.get('company') || undefined,
    answers,
  })
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || 'Check the form and retry.' }
  }
  if (String(formData.get('website') ?? '').trim()) {
    return { ok: true, message: 'Your report is on its way.' }
  }
  if (!(await verifyTurnstile(formData.get(TURNSTILE_FIELD), clientIpFromHeaders(headerList)))) {
    return { ok: false, message: 'Please complete the security check and try again.' }
  }

  const { email, name, company } = parsed.data
  const result = scoreAssessment(parsed.data.answers)

  try {
    const payload = await getPayload()
    await payload.create({
      collection: 'form-submissions',
      overrideAccess: true,
      data: {
        type: 'assessment',
        status: 'new',
        data: {
          email,
          name,
          company,
          overall: result.overall,
          level: result.level.label,
          scores: Object.fromEntries(result.dimensions.map((d) => [d.key, d.score])),
          answers: parsed.data.answers,
        },
        attribution: attributionFromFormData(formData),
      },
    })

    const rows = result.dimensions
      .map((d) => `<li><strong>${escapeHtml(d.label)}:</strong> ${d.score}%</li>`)
      .join('')
    const focus = result.focus
      .map(
        (key) =>
          `<li><strong>${escapeHtml(DIMENSIONS[key].label)}</strong>: ${escapeHtml(DIMENSIONS[key].advice)}</li>`,
      )
      .join('')

    after(async () => {
      await Promise.allSettled([
        sendEmail({
          to: email,
          subject: `Your AI readiness score: ${result.overall}% (${result.level.label})`,
          text: [
            `Overall: ${result.overall}% (${result.level.label})`,
            result.level.summary,
            '',
            ...result.dimensions.map((d) => `${d.label}: ${d.score}%`),
            '',
            'Where to focus next:',
            ...result.focus.map((key) => `- ${DIMENSIONS[key].label}: ${DIMENSIONS[key].advice}`),
            '',
            `Talk to us: ${absoluteUrl('/contact?intent=business')}`,
          ].join('\n'),
          html: emailLayout({
            heading: `AI readiness: ${result.overall}% (${result.level.label})`,
            bodyHtml: `<p style="margin:0 0 14px">${escapeHtml(result.level.summary)}</p><ul style="margin:0 0 14px;padding-left:18px">${rows}</ul><p style="margin:0 0 8px"><strong>Where to focus next</strong></p><ul style="margin:0;padding-left:18px">${focus}</ul>`,
            cta: { label: 'Discuss your roadmap', href: absoluteUrl('/contact?intent=business') },
          }),
        }),
        notifyLead({
          type: 'assessment',
          title: `${result.overall}% (${result.level.label})`,
          fields: [
            ['Email', email],
            ['Name', name],
            ['Company', company],
          ],
          adminPath: '/admin/collections/form-submissions',
        }),
      ])
    })

    return { ok: true, message: `Report sent to ${email}. Check your inbox in a minute.` }
  } catch {
    return { ok: false, message: 'Unable to send the report right now. Please try again.' }
  }
}
