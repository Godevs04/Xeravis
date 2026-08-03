'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { clientKeyFromHeaders, rateLimit } from '@/lib/rate-limit'
import { getPayload } from '@/lib/payload'

const careerSchema = z.object({
  careerId: z.string().min(1, 'Job reference is required').max(80),
  firstName: z.string().min(1, 'First name is required').max(80),
  lastName: z.string().min(1, 'Last name is required').max(80),
  email: z.string().email('Valid email is required').max(200),
  phone: z.string().min(7, 'Mobile number is required').max(40),
  country: z.string().min(1, 'Country is required').max(80),
  city: z.string().min(1, 'Current city is required').max(80),
  linkedin: z.string().max(300).optional(),
  portfolio: z.string().max(300).optional(),
  currentCompany: z.string().max(160).optional(),
  currentDesignation: z.string().max(160).optional(),
  totalExperience: z.string().max(40).optional(),
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
  const limited = rateLimit(clientKeyFromHeaders(headerList, 'career'), {
    limit: 5,
    windowMs: 30 * 60_000,
  })
  if (!limited.ok) {
    return {
      ok: false,
      message: 'Too many applications from this network. Please try again later.',
    }
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
    const buffer = Buffer.from(await resume.arrayBuffer())
    const fullName = `${parsed.data.firstName} ${parsed.data.lastName}`.trim()
    const applicationId = nextApplicationId()

    const media = await payload.create({
      collection: 'media',
      overrideAccess: true,
      data: { alt: `${fullName} resume` },
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

    await payload.create({
      collection: 'job-applications',
      overrideAccess: true,
      data: {
        applicationId,
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
      },
    })

    await payload.create({
      collection: 'analytics-events',
      overrideAccess: true,
      data: {
        type: 'application',
        path: '/careers',
        meta: { applicationId, email: parsed.data.email },
      },
    })

    return {
      ok: true,
      applicationId,
      message:
        'Thank you for applying to XELARVIS. Your application has been received successfully. Our recruitment team will review your profile and contact you if your qualifications match our current requirements.',
    }
  } catch {
    return {
      ok: false,
      message: 'Unable to submit application right now. Please email careers@xelarvis.in.',
    }
  }
}
