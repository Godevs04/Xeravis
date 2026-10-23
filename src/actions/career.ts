'use server'

import { headers } from 'next/headers'
import { after } from 'next/server'
import { z } from 'zod'

import { isPastDeadline } from '@/lib/date'
import { sendEmail } from '@/lib/email'
import { notifyLead } from '@/lib/notify'
import { attributionFromFormData } from '@/lib/attribution'
import { clientIpFromHeaders, clientKeyFromHeaders, rateLimit } from '@/lib/rate-limit'
import { applicationStatusUrl } from '@/lib/application-status'
import { emailLayout, escapeHtml } from '@/lib/email-templates'
import { createToken } from '@/lib/tokens'
import { TURNSTILE_FIELD, verifyTurnstile } from '@/lib/turnstile'
import { getPayload } from '@/lib/payload'
import { RESUME_FOLDER } from '@/payload/access'

const optionalUrl = z
  .string()
  .max(300)
  .optional()
  .transform((v) => (v?.trim() ? v.trim() : undefined))
  .refine((v) => !v || /^https?:\/\//i.test(v), 'Enter a full URL starting with https://')

const careerSchema = z.object({
  careerId: z.string().min(1, 'Job reference is required').max(80),
  firstName: z.string().min(1, 'First name is required').max(80),
  lastName: z.string().min(1, 'Last name is required').max(80),
  email: z.string().email('Valid email is required').max(200),
  phone: z.string().min(7, 'Mobile number is required').max(40),
  country: z.string().min(1, 'Country is required').max(80),
  city: z.string().min(1, 'Current city is required').max(80),
  linkedin: optionalUrl,
  portfolio: optionalUrl,
  currentCompany: z.string().max(160).optional(),
  currentDesignation: z.string().max(160).optional(),
  totalExperience: z.string().min(1, 'Years of experience is required').max(40),
  relevantExperience: z.string().max(40).optional(),
  currentSalary: z.string().max(40).optional(),
  expectedSalary: z.string().max(40).optional(),
  noticePeriod: z.string().max(40).optional(),
  workAuthorization: z.string().max(80).optional(),
  highestQualification: z.string().max(120).optional(),
  university: z.string().max(160).optional(),
  graduationYear: z.string().max(10).optional(),
  skills: z.string().max(1000).optional(),
  coverLetter: z.string().max(5000).optional(),
  whyJoin: z.string().max(2000).optional(),
  willingToRelocate: z.enum(['yes', 'no', 'maybe']).optional(),
  earliestJoinDate: z.string().max(40).optional(),
  healthcareExperience: z.enum(['yes', 'no']).optional(),
  consent: z
    .string({ required_error: 'Consent is required' })
    .refine((v) => v === 'on' || v === 'true', 'Consent is required'),
})

export type CareerFormState = {
  ok: boolean
  message: string
  applicationId?: string
  fieldErrors?: Record<string, string[]>
}

const ALLOWED_RESUME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const APPLICATION_RECEIVED =
  'Thank you for applying to XELARVIS. Your application has been received. Our recruitment team will review your profile and contact you if there is a match.'

function nextApplicationId() {
  const year = new Date().getFullYear()
  const rand = crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
  return `XEL-${year}-${rand}`
}

export async function submitCareerApplication(
  _prev: CareerFormState,
  formData: FormData,
): Promise<CareerFormState> {
  const headerList = await headers()
  const limited = await rateLimit(clientKeyFromHeaders(headerList, 'career'), {
    limit: 5,
    windowMs: 30 * 60_000,
  })
  if (!limited.ok) {
    return {
      ok: false,
      message: 'Too many applications from this network. Please try again later.',
    }
  }

  // Honeypot: bots fill the hidden `website` field; pretend success without storing anything.
  if (String(formData.get('website') ?? '').trim()) {
    return { ok: true, applicationId: nextApplicationId(), message: APPLICATION_RECEIVED }
  }

  if (!(await verifyTurnstile(formData.get(TURNSTILE_FIELD), clientIpFromHeaders(headerList)))) {
    return { ok: false, message: 'Please complete the security check and try again.' }
  }

  const resume = formData.get('resume')
  const parsed = careerSchema.safeParse({
    careerId: formData.get('careerId'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    country: formData.get('country'),
    city: formData.get('city'),
    linkedin: formData.get('linkedin') || undefined,
    portfolio: formData.get('portfolio') || undefined,
    currentCompany: formData.get('currentCompany') || undefined,
    currentDesignation: formData.get('currentDesignation') || undefined,
    totalExperience: formData.get('totalExperience') || undefined,
    relevantExperience: formData.get('relevantExperience') || undefined,
    currentSalary: formData.get('currentSalary') || undefined,
    expectedSalary: formData.get('expectedSalary') || undefined,
    noticePeriod: formData.get('noticePeriod') || undefined,
    workAuthorization: formData.get('workAuthorization') || undefined,
    highestQualification: formData.get('highestQualification') || undefined,
    university: formData.get('university') || undefined,
    graduationYear: formData.get('graduationYear') || undefined,
    skills: formData.get('skills') || undefined,
    coverLetter: formData.get('coverLetter') || undefined,
    whyJoin: formData.get('whyJoin') || undefined,
    willingToRelocate: formData.get('willingToRelocate') || undefined,
    earliestJoinDate: formData.get('earliestJoinDate') || undefined,
    healthcareExperience: formData.get('healthcareExperience') || undefined,
    consent: formData.get('consent'),
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please correct the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  if (!(resume instanceof File) || resume.size === 0) {
    return {
      ok: false,
      message: 'Please attach your resume (PDF, DOC, or DOCX).',
      fieldErrors: { resume: ['Resume is required'] },
    }
  }

  if (resume.size > 10 * 1024 * 1024) {
    return {
      ok: false,
      message: 'Resume must be under 10 MB.',
      fieldErrors: { resume: ['File too large'] },
    }
  }

  const mime = resume.type || 'application/pdf'
  if (mime && !ALLOWED_RESUME.has(mime) && !/\.(pdf|doc|docx)$/i.test(resume.name)) {
    return {
      ok: false,
      message: 'Resume must be PDF, DOC, or DOCX.',
      fieldErrors: { resume: ['Invalid file type'] },
    }
  }

  try {
    const payload = await getPayload()

    const career = await payload
      .findByID({
        collection: 'careers',
        id: parsed.data.careerId,
        depth: 0,
        overrideAccess: true,
      })
      .catch(() => null)

    if (
      !career ||
      career.active === false ||
      career._status === 'draft' ||
      isPastDeadline(career.applicationDeadline)
    ) {
      return {
        ok: false,
        message:
          'This role is no longer accepting applications. Please choose another open position or email hr@xelarvis.in.',
      }
    }

    const buffer = Buffer.from(await resume.arrayBuffer())
    const fullName = `${parsed.data.firstName} ${parsed.data.lastName}`.trim()
    const applicationId = nextApplicationId()

    const media = await payload.create({
      collection: 'media',
      overrideAccess: true,
      data: { alt: `${fullName} resume`, folder: RESUME_FOLDER },
      file: {
        data: buffer,
        mimetype: mime,
        name: resume.name.replace(/[^\w.\-()+ ]+/g, '_').slice(0, 120),
        size: resume.size,
      },
    })

    const skills = (parsed.data.skills || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 40)
      .map((item) => ({ item }))

    const statusToken = createToken()
    await payload.create({
      collection: 'job-applications',
      overrideAccess: true,
      data: {
        applicationId,
        statusToken,
        career: parsed.data.careerId,
        name: fullName,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        country: parsed.data.country,
        city: parsed.data.city,
        linkedin: parsed.data.linkedin,
        portfolio: parsed.data.portfolio,
        currentCompany: parsed.data.currentCompany,
        currentDesignation: parsed.data.currentDesignation,
        totalExperience: parsed.data.totalExperience,
        relevantExperience: parsed.data.relevantExperience,
        currentSalary: parsed.data.currentSalary,
        expectedSalary: parsed.data.expectedSalary,
        noticePeriod: parsed.data.noticePeriod,
        workAuthorization: parsed.data.workAuthorization,
        education: {
          highestQualification: parsed.data.highestQualification,
          university: parsed.data.university,
          graduationYear: parsed.data.graduationYear,
        },
        skills,
        coverLetter: parsed.data.coverLetter,
        whyJoin: parsed.data.whyJoin,
        willingToRelocate: parsed.data.willingToRelocate,
        earliestJoinDate: parsed.data.earliestJoinDate,
        healthcareExperience: parsed.data.healthcareExperience,
        consent: true,
        resume: media.id,
        status: 'new',
        attribution: attributionFromFormData(formData),
      },
    })

    await payload.create({
      collection: 'analytics-events',
      overrideAccess: true,
      data: {
        type: 'application',
        path: `/careers/${career.slug || ''}`,
        meta: {
          applicationId,
          email: parsed.data.email,
          jobTitle: career.title,
          careerId: parsed.data.careerId,
        },
      },
    })

    after(async () => {
      await Promise.allSettled([
        sendEmail({
          to:
            process.env.CAREERS_NOTIFY_EMAIL ||
            process.env.CONTACT_NOTIFY_EMAIL ||
            process.env.EMAIL_TO,
          replyTo: parsed.data.email,
          subject: `New application · ${career.title} · ${applicationId}`,
          text: [
            `Application ID: ${applicationId}`,
            `Role: ${career.title}`,
            `Name: ${fullName}`,
            `Email: ${parsed.data.email}`,
            `Phone: ${parsed.data.phone}`,
            `Location: ${parsed.data.city}, ${parsed.data.country}`,
            parsed.data.totalExperience ? `Experience: ${parsed.data.totalExperience}` : '',
            parsed.data.linkedin ? `LinkedIn: ${parsed.data.linkedin}` : '',
            parsed.data.portfolio ? `Portfolio: ${parsed.data.portfolio}` : '',
            parsed.data.currentCompany ? `Current company: ${parsed.data.currentCompany}` : '',
            '',
            'Review in Payload Admin → Job Applications.',
          ]
            .filter(Boolean)
            .join('\n'),
        }),
        sendEmail({
          to: parsed.data.email,
          subject: `We received your application: ${career.title}`,
          text: `Hi ${parsed.data.firstName},\n\nThanks for applying for ${career.title} at Xelarvis. Your reference is ${applicationId}.\n\nTrack your application status: ${applicationStatusUrl(statusToken)}\n\nXelarvis Recruiting`,
          html: emailLayout({
            heading: 'Application received',
            bodyHtml: `<p style="margin:0 0 14px">Hi ${escapeHtml(parsed.data.firstName)},</p><p style="margin:0 0 14px">Thanks for applying for <strong>${escapeHtml(career.title)}</strong> at Xelarvis. Your reference is <strong>${escapeHtml(applicationId)}</strong>.</p><p style="margin:0">You can check where your application is at any time.</p>`,
            cta: { label: 'Track application status', href: applicationStatusUrl(statusToken) },
          }),
        }),
        notifyLead({
          type: 'application',
          title: `${fullName} for ${career.title}`,
          fields: [
            ['Application ID', applicationId],
            ['Email', parsed.data.email],
            ['Location', `${parsed.data.city}, ${parsed.data.country}`],
            ['Experience', parsed.data.totalExperience],
          ],
          adminPath: '/admin/collections/job-applications',
        }),
      ])
    })

    return { ok: true, applicationId, message: APPLICATION_RECEIVED }
  } catch {
    return {
      ok: false,
      message: 'Unable to submit application right now. Please email hr@xelarvis.in.',
    }
  }
}
