import { getPayload } from '@/lib/payload'
import { isWellFormedToken } from '@/lib/tokens'
import { absoluteUrl } from '@/lib/utils'

export function applicationStatusUrl(token: string) {
  return absoluteUrl(`/careers/application/${encodeURIComponent(token)}`)
}

/** Candidate-facing stages; internal pipeline names and notes are never shown. */
export const CANDIDATE_STAGES = [
  { key: 'received', label: 'Application received' },
  { key: 'review', label: 'Under review' },
  { key: 'interview', label: 'Interviews' },
  { key: 'decision', label: 'Decision' },
] as const

type StageKey = (typeof CANDIDATE_STAGES)[number]['key']

const STATUS_TO_STAGE: Record<string, { stage: StageKey; message: string }> = {
  new: { stage: 'received', message: 'We have your application and will review it shortly.' },
  'under-review': { stage: 'review', message: 'Our recruiting team is reviewing your profile.' },
  shortlisted: { stage: 'review', message: 'Your profile has been shortlisted.' },
  'interview-scheduled': { stage: 'interview', message: 'Interviews are being scheduled.' },
  'technical-assessment': { stage: 'interview', message: 'You are in the assessment stage.' },
  'final-interview': { stage: 'interview', message: 'You are in the final interview stage.' },
  offered: { stage: 'decision', message: 'An offer has been made. Check your email for details.' },
  hired: { stage: 'decision', message: 'Welcome aboard!' },
  rejected: {
    stage: 'decision',
    message:
      'This application is closed. Thank you for your interest; we encourage you to apply for future roles.',
  },
  withdrawn: { stage: 'decision', message: 'This application was withdrawn.' },
}

export type ApplicationStatus = {
  applicationId: string
  jobTitle: string
  submittedAt: string
  stage: StageKey
  message: string
}

export async function getApplicationStatus(token: string): Promise<ApplicationStatus | null> {
  if (!isWellFormedToken(token)) return null
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'job-applications',
    where: { statusToken: { equals: token } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
    select: { applicationId: true, career: true, status: true, createdAt: true },
  })
  const doc = result.docs[0]
  if (!doc) return null
  const career = typeof doc.career === 'object' && doc.career ? doc.career : null
  const mapped = STATUS_TO_STAGE[doc.status || 'new'] ?? STATUS_TO_STAGE.new
  return {
    applicationId: doc.applicationId || '',
    jobTitle: career?.title || 'Your application',
    submittedAt: doc.createdAt,
    stage: mapped.stage,
    message: mapped.message,
  }
}
