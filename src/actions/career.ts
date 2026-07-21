'use server'

import { z } from 'zod'

import { getPayload } from '@/lib/payload'

const careerSchema = z.object({
  careerId: z.string().min(1, 'Job reference is required'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  coverLetter: z.string().optional(),
})

export type CareerFormState = {
  ok: boolean
  message: string
  fieldErrors?: Record<string, string[]>
}

export async function submitCareerApplication(
  _prev: CareerFormState,
  formData: FormData,
): Promise<CareerFormState> {
  const resume = formData.get('resume')
  const parsed = careerSchema.safeParse({
    careerId: formData.get('careerId'),
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    coverLetter: formData.get('coverLetter') || undefined,
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please correct the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  if (!(resume instanceof File) || resume.size === 0) {
    return { ok: false, message: 'Please attach your resume (PDF).', fieldErrors: { resume: ['Resume is required'] } }
  }

  if (resume.size > 5 * 1024 * 1024) {
    return { ok: false, message: 'Resume must be under 5 MB.', fieldErrors: { resume: ['File too large'] } }
  }

  try {
    const payload = await getPayload()
    const buffer = Buffer.from(await resume.arrayBuffer())

    const media = await payload.create({
      collection: 'media',
      overrideAccess: true,
      data: { alt: `${parsed.data.name} resume` },
      file: {
        data: buffer,
        mimetype: resume.type || 'application/pdf',
        name: resume.name,
        size: resume.size,
      },
    })

    await payload.create({
      collection: 'job-applications',
      overrideAccess: true,
      data: {
        career: parsed.data.careerId,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        coverLetter: parsed.data.coverLetter,
        resume: media.id,
        status: 'new',
      },
    })

    return { ok: true, message: 'Application received. Our talent team will review your profile.' }
  } catch {
    return { ok: false, message: 'Unable to submit application right now. Please email careers@xelarvis.in.' }
  }
}
