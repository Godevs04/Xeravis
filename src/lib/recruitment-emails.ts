import { ctaButton, detailsTable, emailLayout, escapeHtml, noteBox } from '@/lib/email-templates'
import { absoluteUrl } from '@/lib/utils'

export type ApplicationStatusValue =
  | 'new'
  | 'under-review'
  | 'shortlisted'
  | 'interview-scheduled'
  | 'technical-assessment'
  | 'final-interview'
  | 'offered'
  | 'hired'
  | 'rejected'
  | 'withdrawn'

export const STATUS_LABELS: Record<ApplicationStatusValue, string> = {
  new: 'New',
  'under-review': 'Under review',
  shortlisted: 'Shortlisted',
  'interview-scheduled': 'Interview scheduled',
  'technical-assessment': 'Technical assessment',
  'final-interview': 'Final interview',
  offered: 'Offered',
  hired: 'Hired',
  rejected: 'Not progressing',
  withdrawn: 'Withdrawn',
}

/** Forward order of the pipeline; closed states sit outside it. */
export const PIPELINE_ORDER: ApplicationStatusValue[] = [
  'new',
  'under-review',
  'shortlisted',
  'interview-scheduled',
  'technical-assessment',
  'final-interview',
  'offered',
  'hired',
]

export type InterviewRound = 'screening' | 'technical' | 'final' | 'hr'
export type InterviewMode = 'video' | 'onsite' | 'phone'

export const ROUND_LABELS: Record<InterviewRound, string> = {
  screening: 'Screening call',
  technical: 'Technical interview',
  final: 'Final interview',
  hr: 'HR discussion',
}

/** Application status an interview round moves the candidate to (never backwards). */
export const ROUND_STATUS: Record<InterviewRound, ApplicationStatusValue> = {
  screening: 'interview-scheduled',
  technical: 'interview-scheduled',
  hr: 'final-interview',
  final: 'final-interview',
}

export function statusAdvancesTo(
  current: string | null | undefined,
  target: ApplicationStatusValue,
) {
  const from = PIPELINE_ORDER.indexOf((current || 'new') as ApplicationStatusValue)
  return from >= 0 && PIPELINE_ORDER.indexOf(target) > from
}

export type Email = { subject: string; text: string; html: string }

const SIGN_OFF = 'XELARVIS Talent Acquisition'
const HR_EMAIL = 'hr@xelarvis.in'
const TIME_ZONE = process.env.RECRUITING_TIMEZONE || 'Asia/Kolkata'

const p = (html: string) => `<p style="margin:0 0 14px">${html}</p>`
const strong = (value: string) => `<strong>${escapeHtml(value)}</strong>`

function htmlToText(html: string) {
  return html
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/(p|div|tr|h1)>/g, '\n\n')
    .replace(/<\/td><td[^>]*>/g, ': ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function compose(input: {
  subject: string
  heading: string
  bodyHtml: string
  cta?: { label: string; href: string }
  secondary?: { label: string; href: string }
}): Email {
  const secondaryHtml = input.secondary
    ? p(
        `<a href="${escapeHtml(input.secondary.href)}" style="color:#0f766e;font-weight:600">${escapeHtml(input.secondary.label)}</a>`,
      )
    : ''
  const links = [input.cta, input.secondary]
    .filter((link): link is { label: string; href: string } => Boolean(link))
    .map((link) => `${link.label}: ${link.href}`)
  return {
    subject: input.subject,
    html: emailLayout({
      heading: input.heading,
      bodyHtml: `${input.bodyHtml}${input.cta ? ctaButton(input.cta) : ''}${secondaryHtml}${p(`Regards,<br />${SIGN_OFF}`)}`,
    }),
    text: [htmlToText(input.bodyHtml), ...links, `Regards,\n${SIGN_OFF}`].join('\n\n'),
  }
}

export function formatInterviewTime(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TIME_ZONE,
    timeZoneName: 'short',
  }).format(new Date(iso))
}

function calendarStamp(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

export function googleCalendarUrl(input: {
  title: string
  startIso: string
  durationMinutes: number
  details: string
  location?: string
}) {
  const start = new Date(input.startIso)
  const end = new Date(start.getTime() + input.durationMinutes * 60_000)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: input.title,
    dates: `${calendarStamp(start)}/${calendarStamp(end)}`,
    details: input.details,
  })
  if (input.location) params.set('location', input.location)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

type CandidateStatusInput = {
  status: string
  firstName: string
  jobTitle: string
  applicationId: string
  statusUrl?: string
}

/** Candidate email for a pipeline change; `null` when the stage has no candidate message. */
export function candidateStatusEmail(input: CandidateStatusInput): Email | null {
  const name = escapeHtml(input.firstName || 'there')
  const role = strong(input.jobTitle)
  const ref = input.applicationId ? ` (reference ${strong(input.applicationId)})` : ''
  const track = input.statusUrl
    ? { label: 'Track your application', href: input.statusUrl }
    : undefined
  const greeting = p(`Hi ${name},`)

  switch (input.status as ApplicationStatusValue) {
    case 'under-review':
      return compose({
        subject: `Your application for ${input.jobTitle} is under review`,
        heading: 'Your application is under review',
        bodyHtml: `${greeting}${p(`Thank you for applying for ${role}${ref}. Our recruiting team is now reviewing your profile against the role requirements.`)}${p('There is nothing you need to do right now. We will contact you by email as soon as there is an update on next steps.')}`,
        cta: track,
      })
    case 'shortlisted':
      return compose({
        subject: `You have been shortlisted: ${input.jobTitle}`,
        heading: 'You have been shortlisted',
        bodyHtml: `${greeting}${p(`Good news: after reviewing your application for ${role}${ref}, we would like to take your candidacy forward.`)}${p('Our team will reach out shortly to arrange the next conversation. Please keep an eye on your inbox, including your spam folder.')}`,
        cta: track,
      })
    case 'interview-scheduled':
      return compose({
        subject: `Next step: interview for ${input.jobTitle}`,
        heading: 'You are moving to the interview stage',
        bodyHtml: `${greeting}${p(`We are pleased to invite you to interview for ${role}${ref}.`)}${p('You will receive a separate invitation with the date, time, interview panel and meeting link. If you have any scheduling constraints, simply reply to this email.')}`,
        cta: track,
      })
    case 'technical-assessment':
      return compose({
        subject: `Next step: technical assessment for ${input.jobTitle}`,
        heading: 'Your technical assessment',
        bodyHtml: `${greeting}${p(`Thank you for your time so far. As the next step for ${role}${ref}, we would like you to complete a technical assessment.`)}${p('The assessment details, format and timeline will follow from our team. It is designed to reflect the real work of the role, so approach it the way you would on the job.')}`,
        cta: track,
      })
    case 'final-interview':
      return compose({
        subject: `Final interview: ${input.jobTitle}`,
        heading: 'You have reached the final round',
        bodyHtml: `${greeting}${p(`Congratulations on progressing to the final interview for ${role}${ref}.`)}${p('This conversation is with our leadership team and focuses on how you approach problems, collaborate and deliver outcomes. You will receive the invitation with the date, time and meeting link separately.')}`,
        cta: track,
      })
    case 'offered':
      return compose({
        subject: `Offer from XELARVIS: ${input.jobTitle}`,
        heading: 'Congratulations, we would like to make you an offer',
        bodyHtml: `${greeting}${p(`We are delighted to let you know that we would like to offer you the role of ${role}${ref}.`)}${p('Our team will share the formal offer letter and next steps with you shortly. If you have any questions in the meantime, reply to this email and we will be happy to help.')}`,
        cta: track,
      })
    case 'hired':
      return compose({
        subject: 'Welcome to XELARVIS',
        heading: 'Welcome to XELARVIS',
        bodyHtml: `${greeting}${p(`We are thrilled that you are joining us as ${role}.`)}${p('Our people team will be in touch with your onboarding plan, joining formalities and first-day details. We look forward to working with you.')}`,
      })
    case 'rejected':
      return compose({
        subject: `Update on your application: ${input.jobTitle}`,
        heading: 'An update on your application',
        bodyHtml: `${greeting}${p(`Thank you for your interest in ${role}${ref} and for the time you invested in the process.`)}${p('After careful consideration, we have decided not to move forward with your application for this role. This decision reflects the specific needs of this position and is not a judgement of your potential.')}${p('We would be glad to see your application for future openings that match your experience.')}`,
        cta: { label: 'View open roles', href: absoluteUrl('/careers#open-roles') },
      })
    case 'withdrawn':
      return compose({
        subject: `Your application for ${input.jobTitle} has been withdrawn`,
        heading: 'Application withdrawn',
        bodyHtml: `${greeting}${p(`This confirms that your application for ${role}${ref} has been withdrawn and no further action is needed.`)}${p(`If this was a mistake, reply to this email or write to ${escapeHtml(HR_EMAIL)} and we will help.`)}`,
      })
    default:
      return null
  }
}

type TeamStatusInput = {
  status: string
  previousStatus?: string | null
  candidateName: string
  jobTitle: string
  applicationId: string
  adminUrl: string
  changedBy?: string
  recipientName?: string
}

/** Internal email to recruiters and assigned interviewers when a candidate moves stage. */
export function teamStatusEmail(input: TeamStatusInput): Email {
  const label = STATUS_LABELS[input.status as ApplicationStatusValue] || input.status
  const previous = input.previousStatus
    ? STATUS_LABELS[input.previousStatus as ApplicationStatusValue] || input.previousStatus
    : undefined
  return compose({
    subject: `${input.candidateName} moved to ${label} · ${input.jobTitle}`,
    heading: `Candidate update: ${label}`,
    bodyHtml: `${p(`Hi ${escapeHtml(input.recipientName || 'team')},`)}${p(`${strong(input.candidateName)} has moved to ${strong(label)} for ${strong(input.jobTitle)}.`)}${detailsTable(
      [
        ['Candidate', input.candidateName],
        ['Role', input.jobTitle],
        ['Reference', input.applicationId],
        ['Previous stage', previous],
        ['New stage', label],
        ['Updated by', input.changedBy],
      ],
    )}`,
    cta: { label: 'Open candidate profile', href: input.adminUrl },
  })
}

export type InterviewEmailKind = 'scheduled' | 'updated' | 'cancelled'

type InterviewEmailInput = {
  kind: InterviewEmailKind
  audience: 'candidate' | 'interviewer'
  recipientName: string
  candidateName: string
  jobTitle: string
  applicationId: string
  round: InterviewRound
  mode: InterviewMode
  scheduledAt: string
  durationMinutes: number
  meetingLink?: string | null
  location?: string | null
  candidatePhone?: string | null
  interviewerNames: string[]
  adminUrl?: string
  resumeUrl?: string
}

function whereHtml(input: InterviewEmailInput) {
  if (input.mode === 'video' && input.meetingLink) {
    return `<a href="${escapeHtml(input.meetingLink)}" style="color:#0f766e;font-weight:600">${escapeHtml(input.meetingLink)}</a>`
  }
  if (input.mode === 'onsite')
    return escapeHtml(input.location || 'XELARVIS office (details to follow)')
  if (input.mode === 'phone') {
    return input.audience === 'candidate'
      ? 'We will call you on the phone number you shared'
      : escapeHtml(
          input.candidatePhone ? `Call the candidate on ${input.candidatePhone}` : 'Phone call',
        )
  }
  return 'Details to follow'
}

/** Interview invitation, reschedule or cancellation for the candidate or an interviewer. */
export function interviewEmail(input: InterviewEmailInput): Email {
  const round = ROUND_LABELS[input.round] || 'Interview'
  const when = formatInterviewTime(input.scheduledAt)
  const isCandidate = input.audience === 'candidate'
  const greeting = p(`Hi ${escapeHtml(input.recipientName || 'there')},`)
  const modeLabel = { video: 'Video call', onsite: 'In person', phone: 'Phone call' }[input.mode]
  const rows = detailsTable([
    ['Round', round],
    ['Role', input.jobTitle],
    isCandidate ? undefined : ['Candidate', input.candidateName],
    ['Date & time', when],
    ['Duration', `${input.durationMinutes} minutes`],
    ['Format', modeLabel],
    [input.mode === 'video' ? 'Meeting link' : 'Where', { html: whereHtml(input) }],
    input.interviewerNames.length
      ? [isCandidate ? 'You will meet' : 'Panel', input.interviewerNames.join(', ')]
      : undefined,
    ['Reference', input.applicationId],
  ])

  const joinCta =
    input.mode === 'video' && input.meetingLink
      ? { label: 'Join meeting', href: input.meetingLink }
      : undefined
  const calendar = {
    label: 'Add to Google Calendar',
    href: googleCalendarUrl({
      title: isCandidate
        ? `${round} · XELARVIS · ${input.jobTitle}`
        : `${round} · ${input.candidateName} · ${input.jobTitle}`,
      startIso: input.scheduledAt,
      durationMinutes: input.durationMinutes,
      details: [
        `${round} for ${input.jobTitle}`,
        input.meetingLink ? `Join: ${input.meetingLink}` : '',
        `Reference: ${input.applicationId}`,
      ]
        .filter(Boolean)
        .join('\n'),
      location:
        input.mode === 'video' ? input.meetingLink || undefined : input.location || undefined,
    }),
  }

  if (input.kind === 'cancelled') {
    return compose({
      subject: `Cancelled: ${round} · ${isCandidate ? input.jobTitle : input.candidateName}`,
      heading: `${round} cancelled`,
      bodyHtml: `${greeting}${p(
        isCandidate
          ? `Your ${escapeHtml(round.toLowerCase())} for ${strong(input.jobTitle)} scheduled for ${strong(when)} has been cancelled. We apologise for any inconvenience; our team will contact you about next steps.`
          : `The ${escapeHtml(round.toLowerCase())} with ${strong(input.candidateName)} on ${strong(when)} has been cancelled. Please remove it from your calendar.`,
      )}`,
      cta: isCandidate
        ? undefined
        : input.adminUrl
          ? { label: 'Open candidate profile', href: input.adminUrl }
          : undefined,
    })
  }

  const rescheduled = input.kind === 'updated'
  if (isCandidate) {
    const prep =
      input.round === 'technical'
        ? 'Expect a hands-on discussion of your technical depth; have your preferred development setup ready in case we ask you to walk through code or a solution.'
        : input.round === 'final' || input.round === 'hr'
          ? 'This conversation focuses on your experience, how you approach problems and what you are looking for next. It is also a good time to ask us anything about the team and role.'
          : 'This is an introductory conversation about your background, the role and what you are looking for.'
    return compose({
      subject: `${rescheduled ? 'Updated' : 'Invitation'}: ${round} with XELARVIS · ${when}`,
      heading: rescheduled
        ? `Your ${round.toLowerCase()} has been updated`
        : `Your ${round.toLowerCase()} is confirmed`,
      bodyHtml: `${greeting}${p(
        rescheduled
          ? `The details of your ${escapeHtml(round.toLowerCase())} for ${strong(input.jobTitle)} have changed. Please use the updated details below.`
          : `Thank you for your interest in ${strong(input.jobTitle)}. We are pleased to confirm your ${escapeHtml(round.toLowerCase())}.`,
      )}${rows}${noteBox(prep)}${p(
        input.mode === 'video'
          ? 'Please join a few minutes early from a quiet place with a stable connection, and keep your camera on.'
          : 'If you need to reschedule, reply to this email as early as possible.',
      )}`,
      cta: joinCta,
      secondary: calendar,
    })
  }

  return compose({
    subject: `${rescheduled ? 'Updated' : 'Interview'}: ${round} · ${input.candidateName} · ${when}`,
    heading: rescheduled
      ? `Interview updated: ${input.candidateName}`
      : `You are on the panel: ${input.candidateName}`,
    bodyHtml: `${greeting}${p(
      rescheduled
        ? `The ${escapeHtml(round.toLowerCase())} with ${strong(input.candidateName)} has been updated.`
        : `You have been added to the panel for a ${escapeHtml(round.toLowerCase())} with ${strong(input.candidateName)}.`,
    )}${rows}${p(
      input.resumeUrl
        ? `Please review the candidate's <a href="${escapeHtml(input.resumeUrl)}" style="color:#0f766e;font-weight:600">resume</a> and profile beforehand, and record your feedback in the interview notes afterwards.`
        : "Please review the candidate's profile beforehand, and record your feedback in the interview notes afterwards.",
    )}`,
    cta:
      joinCta ??
      (input.adminUrl ? { label: 'Open candidate profile', href: input.adminUrl } : undefined),
    secondary: calendar,
  })
}
