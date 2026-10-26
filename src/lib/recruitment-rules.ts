import {
  formatInterviewTime,
  ROUND_LABELS,
  STATUS_LABELS,
  type ApplicationStatusValue,
  type InterviewRound,
} from '@/lib/recruitment-emails'

export type FieldError = { path: string; message: string }
type Id = string | number

export type ApplicationSnapshot = {
  id: Id
  status?: string | null
  careerId?: Id | null
  careerTitle?: string | null
  phone?: string | null
}

export type InterviewSnapshot = {
  id?: Id
  title?: string | null
  applicationId?: Id | null
  jobId?: Id | null
  round?: InterviewRound | null
  interviewerIds: Id[]
  scheduledAt?: string | null
  durationMinutes?: number | null
  mode?: string | null
  location?: string | null
  outcome?: string | null
}

export type Person = { id: Id; name: string }

/** Candidates in these stages can't be booked for new interviews. */
export const CLOSED_STATUSES = ['rejected', 'withdrawn', 'hired'] as const
/** Outcomes that mean the interview took place (or was meant to) and is now settled. */
const SETTLED_OUTCOMES = ['completed', 'no-show', 'advance', 'reject']
const HELD_OUTCOMES = ['completed', 'advance']
/** Small grace window so saving a slot that just started isn't rejected. */
const PAST_GRACE_MS = 5 * 60_000

const OUTCOME_LABELS: Record<string, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  'no-show': 'No-show',
  cancelled: 'Cancelled',
  advance: 'Advance',
  reject: 'Reject',
}

const same = (a?: Id | null, b?: Id | null) => a != null && b != null && String(a) === String(b)
const statusLabel = (status?: string | null) =>
  STATUS_LABELS[(status || 'new') as ApplicationStatusValue] || status || 'New'
const roundLabel = (round?: InterviewRound | null) => ROUND_LABELS[round || 'screening']
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

function slot(interview: InterviewSnapshot) {
  const start = new Date(interview.scheduledAt || 0).getTime()
  return { start, end: start + (interview.durationMinutes || 45) * 60_000 }
}

function overlaps(a: InterviewSnapshot, b: InterviewSnapshot) {
  const x = slot(a)
  const y = slot(b)
  return x.start < y.end && y.start < x.end
}

function describeInterview(interview: InterviewSnapshot) {
  const when = interview.scheduledAt
    ? formatInterviewTime(interview.scheduledAt)
    : 'an unknown time'
  return `"${interview.title || roundLabel(interview.round)}" on ${when}`
}

function schedulingChanged(next: InterviewSnapshot, previous?: InterviewSnapshot) {
  if (!previous) return true
  if (previous.outcome !== next.outcome) return true
  if (previous.scheduledAt !== next.scheduledAt) return true
  if (previous.durationMinutes !== next.durationMinutes) return true
  if (previous.round !== next.round || previous.mode !== next.mode) return true
  const before = new Set(previous.interviewerIds.map(String))
  return (
    before.size !== next.interviewerIds.length ||
    next.interviewerIds.some((id) => !before.has(String(id)))
  )
}

/**
 * Cross-checks an interview against its candidate and every other booked interview.
 * `others` should hold scheduled interviews that share the candidate or an interviewer.
 */
export function interviewRuleErrors(input: {
  next: InterviewSnapshot
  previous?: InterviewSnapshot
  application: ApplicationSnapshot | null
  interviewers: Person[]
  others: InterviewSnapshot[]
  now?: number
}): FieldError[] {
  const { next, previous, application, interviewers } = input
  const now = input.now ?? Date.now()
  const errors: FieldError[] = []

  if (!application) {
    return [{ path: 'application', message: 'The selected candidate no longer exists.' }]
  }
  if (previous && !same(previous.applicationId, next.applicationId)) {
    errors.push({
      path: 'application',
      message:
        'An interview cannot be moved to a different candidate. Cancel this one and schedule a new interview for the other candidate.',
    })
  }
  if (
    next.jobId != null &&
    application.careerId != null &&
    !same(next.jobId, application.careerId)
  ) {
    errors.push({
      path: 'job',
      message: `This candidate applied for "${application.careerTitle || 'another role'}". Select that job or leave it blank.`,
    })
  }

  const start = slot(next).start
  const settledBefore = previous?.outcome && SETTLED_OUTCOMES.includes(previous.outcome)
  if (
    settledBefore &&
    previous &&
    (previous.scheduledAt !== next.scheduledAt || previous.durationMinutes !== next.durationMinutes)
  ) {
    errors.push({
      path: 'scheduledAt',
      message: `This interview is already marked ${OUTCOME_LABELS[previous.outcome!]}; its time can't be changed. Schedule a new interview instead.`,
    })
  }

  if (next.outcome && SETTLED_OUTCOMES.includes(next.outcome) && start > now) {
    errors.push({
      path: 'outcome',
      message: `It can't be marked ${OUTCOME_LABELS[next.outcome]} before it starts (${formatInterviewTime(next.scheduledAt!)}). Keep it Scheduled or Cancel it.`,
    })
  }

  if (next.outcome !== 'scheduled' || !schedulingChanged(next, previous)) return errors

  if ((CLOSED_STATUSES as readonly string[]).includes(application.status || '')) {
    errors.push({
      path: 'application',
      message: `This candidate is ${statusLabel(application.status)}, so new interviews can't be scheduled. Move the application back to an active stage first.`,
    })
  }
  if (start < now - PAST_GRACE_MS) {
    errors.push({ path: 'scheduledAt', message: 'Choose a date and time in the future.' })
  }
  if (!next.interviewerIds.length) {
    errors.push({
      path: 'interviewers',
      message: 'Add at least one interviewer so the panel receives the invitation.',
    })
  } else if (interviewers.length < new Set(next.interviewerIds.map(String)).size) {
    errors.push({
      path: 'interviewers',
      message: 'One or more selected interviewers no longer exist. Remove them and try again.',
    })
  }
  if (next.mode === 'onsite' && !next.location?.trim()) {
    errors.push({
      path: 'location',
      message: 'Add the office address so the candidate knows where to go.',
    })
  }
  if (next.mode === 'phone' && !application.phone?.trim()) {
    errors.push({
      path: 'mode',
      message:
        'This candidate has no phone number on file. Use a video interview or add the phone number to the application.',
    })
  }

  const others = input.others.filter(
    (other) => other.outcome === 'scheduled' && !same(other.id, next.id),
  )
  const sameCandidate = others.filter((other) => same(other.applicationId, next.applicationId))
  const duplicateRound = sameCandidate.find(
    (other) => (other.round || 'screening') === (next.round || 'screening'),
  )
  if (duplicateRound) {
    errors.push({
      path: 'round',
      message: `A ${roundLabel(next.round).toLowerCase()} is already scheduled for this candidate (${describeInterview(duplicateRound)}). Reschedule or cancel that one instead.`,
    })
  }
  const candidateClash = sameCandidate.find((other) => overlaps(next, other))
  if (candidateClash && candidateClash !== duplicateRound) {
    errors.push({
      path: 'scheduledAt',
      message: `The candidate already has ${describeInterview(candidateClash)} at this time. Pick another slot.`,
    })
  }

  const names = new Map(interviewers.map((person) => [String(person.id), person.name]))
  const clashes = next.interviewerIds.flatMap((id) => {
    const clash = others.find(
      (other) =>
        !same(other.applicationId, next.applicationId) &&
        other.interviewerIds.some((otherId) => same(otherId, id)) &&
        overlaps(next, other),
    )
    return clash
      ? [
          `${names.get(String(id)) || 'An interviewer'} is already booked for ${describeInterview(clash)}`,
        ]
      : []
  })
  if (clashes.length) {
    errors.push({
      path: 'interviewers',
      message: `${clashes.join('; ')}. Choose another time or interviewer.`,
    })
  }

  return errors
}

/** Checks a candidate's stage or job change against the interviews linked to them. */
export function applicationRuleErrors(input: {
  next: ApplicationSnapshot
  previous: ApplicationSnapshot
  interviews: InterviewSnapshot[]
  now?: number
}): FieldError[] {
  const { next, previous, interviews } = input
  const now = input.now ?? Date.now()
  const errors: FieldError[] = []

  if (!same(next.careerId, previous.careerId) && interviews.length) {
    errors.push({
      path: 'career',
      message: `This candidate has ${plural(interviews.length, 'interview')} for "${previous.careerTitle || 'the original role'}". The job can't be changed; ask the candidate to apply for the other role instead.`,
    })
  }

  const from = previous.status || 'new'
  const to = next.status || 'new'
  if (from === to) return errors

  if (from === 'hired') {
    errors.push({
      path: 'status',
      message: 'This candidate is already Hired; the stage can no longer be changed.',
    })
    return errors
  }
  if (to === 'hired' && from !== 'offered') {
    errors.push({
      path: 'status',
      message: `Move the candidate to Offered before marking them Hired (current stage: ${statusLabel(from)}).`,
    })
  }
  if (to === 'offered' && !interviews.some((i) => HELD_OUTCOMES.includes(i.outcome || ''))) {
    errors.push({
      path: 'status',
      message: 'Record at least one interview as Completed or Advance before making an offer.',
    })
  }
  if ((CLOSED_STATUSES as readonly string[]).includes(to)) {
    const upcoming = interviews.filter(
      (i) => i.outcome === 'scheduled' && slot(i).start >= now - PAST_GRACE_MS,
    )
    if (upcoming.length) {
      errors.push({
        path: 'status',
        message: `Cancel or complete ${plural(upcoming.length, 'upcoming interview')} first (${upcoming.map(describeInterview).join('; ')}) before moving the candidate to ${statusLabel(to)}.`,
      })
    }
  }
  return errors
}
