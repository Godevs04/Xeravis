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
  'under-review': {
    stage: 'review',
    message: 'Our recruiting team is reviewing your profile. We will email you with next steps.',
  },
  shortlisted: {
    stage: 'review',
    message: 'You have been shortlisted. We will be in touch to arrange the next conversation.',
  },
  'interview-scheduled': {
    stage: 'interview',
    message: 'You are in the interview stage. Your invitation email has the time and meeting link.',
  },
  'technical-assessment': {
    stage: 'interview',
    message: 'You are in the technical assessment stage. Details are sent by email.',
  },
  'final-interview': {
    stage: 'interview',
    message: 'You have reached the final interview round. Check your email for the invitation.',
  },
  offered: {
    stage: 'decision',
    message: 'Congratulations, we would like to make you an offer. Check your email for details.',
  },
  hired: { stage: 'decision', message: 'Welcome to XELARVIS! Onboarding details are on the way.' },
  rejected: {
    stage: 'decision',
    message:
      'This application is closed. Thank you for your time; we would be glad to see you apply for future roles.',
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
