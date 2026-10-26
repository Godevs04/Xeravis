import { after } from 'next/server'
import {
  APIError,
  ValidationError,
  type CollectionAfterChangeHook,
  type CollectionBeforeChangeHook,
  type CollectionBeforeDeleteHook,
  type Payload,
  type PayloadRequest,
  type Where,
} from 'payload'

import { applicationStatusUrl } from '@/lib/application-status'
import { sendEmail } from '@/lib/email'
import {
  candidateStatusEmail,
  interviewEmail,
  ROUND_LABELS,
  ROUND_STATUS,
  statusAdvancesTo,
  teamStatusEmail,
  type ApplicationStatusValue,
  type Email,
  type InterviewEmailKind,
  type InterviewMode,
  type InterviewRound,
} from '@/lib/recruitment-emails'
import {
  applicationRuleErrors,
  interviewRuleErrors,
  type FieldError,
  type InterviewSnapshot,
} from '@/lib/recruitment-rules'
import { absoluteUrl } from '@/lib/utils'

/** Set on internal status writes (e.g. an interview advancing the pipeline) to skip status mail. */
export const SKIP_STATUS_EMAIL = 'skipStatusEmail'

type Person = { id: string | number; email: string; name: string }
type Relation = string | number | Record<string, unknown> | null | undefined

type ApplicationDoc = {
  id: string | number
  name?: string
  firstName?: string | null
  email?: string
  phone?: string | null
  status?: string | null
  applicationId?: string | null
  statusToken?: string | null
  sendStatusEmails?: boolean | null
  career?: Relation
  resume?: Relation
}

type InterviewDoc = {
  id: string | number
  title?: string | null
  application?: Relation
  job?: Relation
  interviewers?: Relation[] | null
  round?: InterviewRound | null
  scheduledAt?: string | null
  durationMinutes?: number | null
  mode?: InterviewMode | null
  meetingLink?: string | null
  location?: string | null
  outcome?: string | null
  sendInvites?: boolean | null
}

const relationId = (value: Relation) =>
  value && typeof value === 'object' ? (value.id as string | number) : value

const teamInbox = () =>
  process.env.CAREERS_NOTIFY_EMAIL || process.env.CONTACT_NOTIFY_EMAIL || process.env.EMAIL_TO

const adminApplicationUrl = (id: string | number) =>
  absoluteUrl(`/admin/collections/job-applications/${id}`)

/** Runs mail after the response (and after the DB transaction commits) when inside a request. */
function inBackground(payload: Payload, label: string, task: () => Promise<unknown>) {
  const run = () => task().catch((err) => payload.logger.error({ err, msg: `${label} failed` }))
  try {
    after(run)
  } catch {
    void run()
  }
}

async function send(payload: Payload, to: string | undefined, email: Email, replyTo?: string) {
  if (!to) return
  const ok = await sendEmail({ to, replyTo, ...email })
  if (!ok) payload.logger.warn({ msg: 'Recruitment email not sent', subject: email.subject })
}

async function loadApplication(payload: Payload, id: string | number) {
  return (await payload.findByID({
    collection: 'job-applications',
    id,
    depth: 1,
    overrideAccess: true,
  })) as unknown as ApplicationDoc
}

function careerTitle(application: ApplicationDoc) {
  const career = application.career
  return (career && typeof career === 'object' && (career.title as string)) || 'the role'
}

function resumeUrl(application: ApplicationDoc) {
  const resume = application.resume
  const url = resume && typeof resume === 'object' ? (resume.url as string | undefined) : undefined
  if (!url) return undefined
  return url.startsWith('http') ? url : absoluteUrl(url)
}

async function loadPeople(payload: Payload, ids: Array<string | number>): Promise<Person[]> {
  if (!ids.length) return []
  const users = await payload.find({
    collection: 'users',
    where: { id: { in: ids } },
    depth: 0,
    limit: ids.length,
    overrideAccess: true,
  })
  return users.docs
    .filter((user) => Boolean(user.email))
    .map((user) => ({
      id: user.id,
      email: user.email,
      name: (user as { name?: string | null }).name || user.email.split('@')[0],
    }))
}

/** Emails the candidate, the recruiting inbox and assigned interviewers when the stage changes. */
export const notifyApplicationStatus: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  operation,
  req,
  context,
}) => {
  const application = doc as ApplicationDoc
  const previous = previousDoc as ApplicationDoc | undefined
  if (operation !== 'update' || context?.[SKIP_STATUS_EMAIL]) return doc
  if (!application.status || application.status === previous?.status) return doc

  const { payload } = req
  const status = application.status
  const changedBy = req.user?.email
  inBackground(payload, 'Application status email', async () => {
    const fresh = await loadApplication(payload, application.id)
    const jobTitle = careerTitle(fresh)
    const candidateName = fresh.name || fresh.email || 'Candidate'
    const reference = fresh.applicationId || ''

    const interviews = await payload.find({
      collection: 'interviews',
      where: {
        and: [
          { application: { equals: application.id } },
          { outcome: { not_equals: 'cancelled' } },
        ],
      },
      depth: 0,
      limit: 20,
      overrideAccess: true,
    })
    const interviewerIds = [
      ...new Set(
        interviews.docs.flatMap((interview) =>
          ((interview.interviewers as Relation[] | null) ?? []).map(relationId),
        ),
      ),
    ].filter((id): id is string | number => id != null)
    const interviewers = await loadPeople(payload, interviewerIds)

    const tasks: Promise<unknown>[] = []
    const candidateMail =
      fresh.sendStatusEmails !== false && fresh.email
        ? candidateStatusEmail({
            status,
            firstName: fresh.firstName || candidateName.split(' ')[0],
            jobTitle,
            applicationId: reference,
            statusUrl: fresh.statusToken ? applicationStatusUrl(fresh.statusToken) : undefined,
          })
        : null
    if (candidateMail) tasks.push(send(payload, fresh.email, candidateMail, teamInbox()))

    const teamInput = {
      status,
      previousStatus: previous?.status,
      candidateName,
      jobTitle,
      applicationId: reference,
      adminUrl: adminApplicationUrl(application.id),
      changedBy,
    }
    tasks.push(send(payload, teamInbox(), teamStatusEmail(teamInput)))
    for (const person of interviewers) {
      tasks.push(
        send(payload, person.email, teamStatusEmail({ ...teamInput, recipientName: person.name })),
      )
    }
    await Promise.allSettled(tasks)
  })
  return doc
}

function randomRoom() {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Fills title, job and a meeting room so a recruiter only has to pick the candidate and time. */
export const prepareInterview: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const next = { ...originalDoc, ...data } as InterviewDoc
  const applicationId = relationId(next.application)
  if (applicationId && (!next.title || !next.job)) {
    const application = await req.payload
      .findByID({
        collection: 'job-applications',
        id: applicationId,
        depth: 1,
        overrideAccess: true,
        req,
      })
      .catch(() => null)
    if (application) {
      const doc = application as unknown as ApplicationDoc
      if (!next.job && doc.career) data.job = relationId(doc.career)
      if (!next.title) {
        const round = ROUND_LABELS[next.round || 'screening']
        data.title = `${round} · ${doc.name || doc.email} · ${careerTitle(doc)}`
      }
    }
  }
  if (next.mode === 'video' && !next.meetingLink?.trim()) {
    data.meetingLink = `https://meet.jit.si/xelarvis-interview-${randomRoom()}`
  }
  return data
}

function interviewSnapshot(doc: InterviewDoc | Partial<InterviewDoc>): InterviewSnapshot {
  return {
    id: doc.id,
    title: doc.title,
    applicationId: relationId(doc.application),
    jobId: relationId(doc.job),
    round: doc.round,
    interviewerIds: (doc.interviewers ?? [])
      .map(relationId)
      .filter((id): id is string | number => id != null),
    scheduledAt: doc.scheduledAt,
    durationMinutes: doc.durationMinutes,
    mode: doc.mode,
    location: doc.location,
    outcome: doc.outcome || 'scheduled',
  }
}

function rejectWith(req: PayloadRequest, collection: string, errors: FieldError[]) {
  if (errors.length) throw new ValidationError({ collection, errors, req }, req.t)
}

/** Longest allowed interview, used to widen the overlap query window. */
const MAX_DURATION_MS = 8 * 60 * 60_000

/** Validates an interview against its candidate, its panel and other booked interviews. */
export const validateInterview: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const next = interviewSnapshot({ ...originalDoc, ...data } as InterviewDoc)
  const previous = originalDoc ? interviewSnapshot(originalDoc as InterviewDoc) : undefined
  const { payload } = req

  const application = next.applicationId
    ? await payload
        .findByID({
          collection: 'job-applications',
          id: next.applicationId,
          depth: 1,
          overrideAccess: true,
          req,
        })
        .catch(() => null)
    : null
  const applicationDoc = application as unknown as ApplicationDoc | null

  let others: InterviewSnapshot[] = []
  if (next.outcome === 'scheduled' && next.scheduledAt) {
    const start = new Date(next.scheduledAt).getTime()
    const end = start + (next.durationMinutes || 45) * 60_000
    const sharing: Where[] = [{ application: { equals: next.applicationId } }]
    if (next.interviewerIds.length) sharing.push({ interviewers: { in: next.interviewerIds } })
    const found = await payload.find({
      collection: 'interviews',
      where: {
        and: [
          { outcome: { equals: 'scheduled' } },
          { scheduledAt: { greater_than: new Date(start - MAX_DURATION_MS).toISOString() } },
          { scheduledAt: { less_than: new Date(end).toISOString() } },
          ...(next.id != null ? [{ id: { not_equals: next.id } }] : []),
          { or: sharing },
        ],
      },
      depth: 0,
      limit: 100,
      overrideAccess: true,
      req,
    })
    others = found.docs.map((doc) => interviewSnapshot(doc as unknown as InterviewDoc))
  }

  rejectWith(
    req,
    'interviews',
    interviewRuleErrors({
      next,
      previous,
      application: applicationDoc
        ? {
            id: applicationDoc.id,
            status: applicationDoc.status,
            careerId: relationId(applicationDoc.career),
            careerTitle: careerTitle(applicationDoc),
            phone: applicationDoc.phone,
          }
        : null,
      interviewers: await loadPeople(payload, next.interviewerIds),
      others,
    }),
  )
  return data
}

async function interviewsFor(req: PayloadRequest, applicationId: string | number) {
  const found = await req.payload.find({
    collection: 'interviews',
    where: { application: { equals: applicationId } },
    depth: 0,
    limit: 200,
    overrideAccess: true,
    req,
  })
  return found.docs.map((doc) => interviewSnapshot(doc as unknown as InterviewDoc))
}

/** Blocks stage or job changes that would contradict the candidate's interviews. */
export const validateApplication: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  if (operation !== 'update' || !originalDoc) return data
  const before = originalDoc as ApplicationDoc
  const after = { ...before, ...data } as ApplicationDoc
  const careerChanged = String(relationId(after.career)) !== String(relationId(before.career))
  if (after.status === before.status && !careerChanged) return data

  let previousCareerTitle: string | undefined
  if (careerChanged && before.career != null) {
    const career = await req.payload
      .findByID({
        collection: 'careers',
        id: relationId(before.career)!,
        depth: 0,
        overrideAccess: true,
        req,
      })
      .catch(() => null)
    previousCareerTitle = career?.title
  }

  rejectWith(
    req,
    'job-applications',
    applicationRuleErrors({
      next: { id: after.id, status: after.status, careerId: relationId(after.career) },
      previous: {
        id: before.id,
        status: before.status,
        careerId: relationId(before.career),
        careerTitle: previousCareerTitle,
      },
      interviews: await interviewsFor(req, before.id),
    }),
  )
  return data
}

/** Interviews keep feedback history, so a candidate with interviews can't be deleted. */
export const preventApplicationDelete: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const { totalDocs } = await req.payload.count({
    collection: 'interviews',
    where: { application: { equals: id } },
    overrideAccess: true,
    req,
  })
  if (totalDocs) {
    throw new APIError(
      `This candidate has ${totalDocs} interview${totalDocs === 1 ? '' : 's'}. Delete or reassign those interviews first, or set the stage to Rejected/Withdrawn instead of deleting.`,
      400,
      undefined,
      true,
    )
  }
}

const DETAIL_FIELDS = ['scheduledAt', 'durationMinutes', 'mode', 'meetingLink', 'location'] as const

/**
 * Sends invitations, reschedules and cancellations to the candidate and panel, and moves the
 * application forward to the matching stage (without a duplicate status email).
 */
export const notifyInterview: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const interview = doc as InterviewDoc
  const previous = (previousDoc || {}) as InterviewDoc
  const applicationId = relationId(interview.application)
  if (!applicationId || !interview.scheduledAt) return doc
  const round = interview.round || 'screening'

  if (
    interview.outcome === 'scheduled' &&
    (operation === 'create' || interview.round !== previous.round)
  ) {
    await advanceApplication(req, applicationId, ROUND_STATUS[round])
  }

  const interviewerIds = (interview.interviewers ?? []).map(relationId)
  const previousIds = new Set((previous.interviewers ?? []).map(relationId))
  let kind: InterviewEmailKind | null = null
  let onlyNewInterviewers = false
  if (interview.outcome === 'cancelled' && previous.outcome !== 'cancelled') {
    kind = operation === 'create' ? null : 'cancelled'
  } else if (interview.outcome === 'scheduled') {
    if (operation === 'create' || previous.outcome !== 'scheduled') kind = 'scheduled'
    else if (DETAIL_FIELDS.some((field) => interview[field] !== previous[field])) kind = 'updated'
    else if (interviewerIds.some((id) => !previousIds.has(id))) {
      kind = 'scheduled'
      onlyNewInterviewers = true
    }
  }
  const startsAt = new Date(interview.scheduledAt).getTime()
  if (!kind || interview.sendInvites === false || startsAt < Date.now() - 60 * 60_000) return doc

  const { payload } = req
  const emailKind = kind
  inBackground(payload, 'Interview email', async () => {
    const application = await loadApplication(payload, applicationId)
    const panel = await loadPeople(
      payload,
      interviewerIds.filter((id): id is string | number => id != null),
    )
    const candidateName = application.name || application.email || 'Candidate'
    const base = {
      kind: emailKind,
      candidateName,
      jobTitle: careerTitle(application),
      applicationId: application.applicationId || '',
      round,
      mode: interview.mode || 'video',
      scheduledAt: interview.scheduledAt!,
      durationMinutes: interview.durationMinutes || 45,
      meetingLink: interview.meetingLink,
      location: interview.location,
      candidatePhone: application.phone,
      interviewerNames: panel.map((person) => person.name),
      adminUrl: adminApplicationUrl(application.id),
      resumeUrl: resumeUrl(application),
    }

    const tasks: Promise<unknown>[] = []
    if (!onlyNewInterviewers && application.email) {
      tasks.push(
        send(
          payload,
          application.email,
          interviewEmail({
            ...base,
            audience: 'candidate',
            recipientName: application.firstName || candidateName.split(' ')[0],
          }),
          teamInbox(),
        ),
      )
    }
    for (const person of panel) {
      if (onlyNewInterviewers && previousIds.has(person.id)) continue
      tasks.push(
        send(
          payload,
          person.email,
          interviewEmail({ ...base, audience: 'interviewer', recipientName: person.name }),
        ),
      )
    }
    await Promise.allSettled(tasks)
  })
  return doc
}

async function advanceApplication(
  req: PayloadRequest,
  applicationId: string | number,
  target: ApplicationStatusValue,
) {
  const application = await req.payload
    .findByID({
      collection: 'job-applications',
      id: applicationId,
      depth: 0,
      overrideAccess: true,
      req,
    })
    .catch(() => null)
  if (!application || !statusAdvancesTo(application.status, target)) return
  await req.payload.update({
    collection: 'job-applications',
    id: applicationId,
    data: { status: target },
    overrideAccess: true,
    req,
    context: { [SKIP_STATUS_EMAIL]: true },
  })
}
