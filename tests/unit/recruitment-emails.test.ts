import { describe, expect, it } from 'vitest'

import {
  candidateStatusEmail,
  googleCalendarUrl,
  interviewEmail,
  statusAdvancesTo,
  teamStatusEmail,
} from '@/lib/recruitment-emails'

const candidate = {
  firstName: 'Asha',
  jobTitle: 'AI Engineer',
  applicationId: 'XEL-0001',
  statusUrl: 'https://example.com/careers/application/token',
}

const interview = {
  kind: 'scheduled' as const,
  candidateName: 'Asha Rao',
  jobTitle: 'AI Engineer',
  applicationId: 'XEL-0001',
  round: 'technical' as const,
  mode: 'video' as const,
  scheduledAt: '2026-11-02T05:30:00.000Z',
  durationMinutes: 45,
  meetingLink: 'https://meet.example.com/abc-defg-hij',
  interviewerNames: ['Ravi', 'Meera'],
  adminUrl: 'https://example.com/admin/collections/job-applications/1',
}

describe('candidateStatusEmail', () => {
  it('uses stage-specific wording', () => {
    expect(candidateStatusEmail({ ...candidate, status: 'shortlisted' })?.subject).toContain(
      'shortlisted',
    )
    expect(candidateStatusEmail({ ...candidate, status: 'offered' })?.subject).toContain('Offer')
    const rejected = candidateStatusEmail({ ...candidate, status: 'rejected' })
    expect(rejected?.text).toContain('not to move forward')
    expect(rejected?.html).toContain('/careers#open-roles')
  })

  it('sends nothing for the initial stage', () => {
    expect(candidateStatusEmail({ ...candidate, status: 'new' })).toBeNull()
  })

  it('escapes candidate-supplied values', () => {
    const email = candidateStatusEmail({
      ...candidate,
      status: 'under-review',
      firstName: '<script>x</script>',
    })
    expect(email?.html).not.toContain('<script>')
    expect(email?.html).toContain('&lt;script&gt;')
  })
})

describe('interviewEmail', () => {
  it('gives the candidate the meeting link, time and calendar link', () => {
    const email = interviewEmail({ ...interview, audience: 'candidate', recipientName: 'Asha' })
    expect(email.subject).toContain('Invitation: Technical interview')
    expect(email.html).toContain(interview.meetingLink)
    expect(email.html).toContain('Join meeting')
    expect(email.html).toContain('calendar.google.com')
    expect(email.text).toContain(interview.meetingLink)
    expect(email.html).toContain('Ravi, Meera')
  })

  it('tells interviewers who the candidate is', () => {
    const email = interviewEmail({ ...interview, audience: 'interviewer', recipientName: 'Ravi' })
    expect(email.subject).toContain('Asha Rao')
    expect(email.html).toContain('You are on the panel')
  })

  it('words reschedules and cancellations differently', () => {
    const updated = interviewEmail({
      ...interview,
      kind: 'updated',
      audience: 'candidate',
      recipientName: 'Asha',
    })
    expect(updated.subject.startsWith('Updated:')).toBe(true)
    const cancelled = interviewEmail({
      ...interview,
      kind: 'cancelled',
      audience: 'interviewer',
      recipientName: 'Ravi',
    })
    expect(cancelled.subject.startsWith('Cancelled:')).toBe(true)
    expect(cancelled.html).not.toContain('Join meeting')
  })
})

describe('googleCalendarUrl', () => {
  it('encodes start and end in UTC', () => {
    const url = new URL(
      googleCalendarUrl({
        title: 'Interview',
        startIso: '2026-11-02T05:30:00.000Z',
        durationMinutes: 45,
        details: 'x',
      }),
    )
    expect(url.searchParams.get('dates')).toBe('20261102T053000Z/20261102T061500Z')
  })
})

describe('statusAdvancesTo', () => {
  it('only moves candidates forward in the pipeline', () => {
    expect(statusAdvancesTo('shortlisted', 'interview-scheduled')).toBe(true)
    expect(statusAdvancesTo('final-interview', 'interview-scheduled')).toBe(false)
    expect(statusAdvancesTo('rejected', 'final-interview')).toBe(false)
    expect(statusAdvancesTo(undefined, 'interview-scheduled')).toBe(true)
  })
})

describe('teamStatusEmail', () => {
  it('summarises the stage change', () => {
    const email = teamStatusEmail({
      status: 'shortlisted',
      previousStatus: 'under-review',
      candidateName: 'Asha Rao',
      jobTitle: 'AI Engineer',
      applicationId: 'XEL-0001',
      adminUrl: 'https://example.com/admin',
      changedBy: 'admin@example.com',
    })
    expect(email.subject).toBe('Asha Rao moved to Shortlisted · AI Engineer')
    expect(email.text).toContain('Under review')
  })
})
