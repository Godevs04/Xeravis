import { describe, expect, it } from 'vitest'

import {
  applicationRuleErrors,
  interviewRuleErrors,
  type ApplicationSnapshot,
  type InterviewSnapshot,
} from '@/lib/recruitment-rules'

const NOW = Date.parse('2026-11-01T06:00:00.000Z')
const inHours = (hours: number) => new Date(NOW + hours * 3_600_000).toISOString()

const application: ApplicationSnapshot = {
  id: 'app-1',
  status: 'shortlisted',
  careerId: 'job-1',
  careerTitle: 'AI Engineer',
  phone: '+91 90000 00000',
}

const interview: InterviewSnapshot = {
  applicationId: 'app-1',
  jobId: 'job-1',
  round: 'technical',
  interviewerIds: ['u1'],
  scheduledAt: inHours(24),
  durationMinutes: 45,
  mode: 'video',
  outcome: 'scheduled',
}

const panel = [{ id: 'u1', name: 'Ravi' }]

function check(
  overrides: Partial<InterviewSnapshot> = {},
  extra: Partial<Parameters<typeof interviewRuleErrors>[0]> = {},
) {
  return interviewRuleErrors({
    next: { ...interview, ...overrides },
    application,
    interviewers: panel,
    others: [],
    now: NOW,
    ...extra,
  })
}

const paths = (errors: { path: string }[]) => errors.map((error) => error.path)

describe('interviewRuleErrors', () => {
  it('accepts a valid booking', () => {
    expect(check()).toEqual([])
  })

  it('requires an existing candidate', () => {
    expect(paths(check({}, { application: null }))).toEqual(['application'])
  })

  it('rejects closed candidates', () => {
    const errors = check({}, { application: { ...application, status: 'rejected' } })
    expect(paths(errors)).toEqual(['application'])
    expect(errors[0].message).toContain('Not progressing')
  })

  it('rejects a job the candidate did not apply for', () => {
    expect(paths(check({ jobId: 'job-2' }))).toEqual(['job'])
  })

  it('blocks moving an interview to another candidate', () => {
    const errors = check({ applicationId: 'app-2' }, { previous: { ...interview, id: 'i1' } })
    expect(paths(errors)).toContain('application')
  })

  it('rejects past slots, missing panel, onsite without address, phone without number', () => {
    expect(paths(check({ scheduledAt: inHours(-2) }))).toEqual(['scheduledAt'])
    expect(paths(check({ interviewerIds: [] }))).toEqual(['interviewers'])
    expect(paths(check({}, { interviewers: [] }))).toEqual(['interviewers'])
    expect(paths(check({ mode: 'onsite', location: ' ' }))).toEqual(['location'])
    expect(
      paths(check({ mode: 'phone' }, { application: { ...application, phone: null } })),
    ).toEqual(['mode'])
  })

  it('rejects a duplicate active round for the same candidate', () => {
    const other = { ...interview, id: 'i2', scheduledAt: inHours(72) }
    expect(paths(check({}, { others: [other] }))).toEqual(['round'])
  })

  it('rejects overlapping slots for the candidate and the panel', () => {
    const candidateClash = {
      ...interview,
      id: 'i2',
      round: 'screening' as const,
      scheduledAt: inHours(24.25),
    }
    expect(paths(check({}, { others: [candidateClash] }))).toEqual(['scheduledAt'])

    const panelClash = {
      ...interview,
      id: 'i3',
      applicationId: 'app-9',
      title: 'Screening · Someone else',
      scheduledAt: inHours(24.5),
    }
    const errors = check({}, { others: [panelClash] })
    expect(paths(errors)).toEqual(['interviewers'])
    expect(errors[0].message).toContain('Ravi is already booked')
  })

  it('allows back-to-back slots and ignores cancelled interviews', () => {
    const backToBack = {
      ...interview,
      id: 'i2',
      applicationId: 'app-9',
      scheduledAt: inHours(24.75),
    }
    const cancelled = { ...interview, id: 'i3', outcome: 'cancelled' }
    expect(check({}, { others: [backToBack, cancelled] })).toEqual([])
  })

  it('does not re-run scheduling checks for note-only edits', () => {
    const previous = { ...interview, id: 'i1' }
    const errors = check(
      { id: 'i1' },
      { previous, application: { ...application, status: 'hired' }, now: NOW + 48 * 3_600_000 },
    )
    expect(errors).toEqual([])
  })

  it('keeps outcomes consistent with time', () => {
    expect(paths(check({ outcome: 'completed' }))).toEqual(['outcome'])
    const previous = { ...interview, id: 'i1', scheduledAt: inHours(-3), outcome: 'completed' }
    expect(
      paths(check({ id: 'i1', scheduledAt: inHours(5), outcome: 'completed' }, { previous })),
    ).toContain('scheduledAt')
  })
})

describe('applicationRuleErrors', () => {
  const upcoming: InterviewSnapshot = { ...interview, id: 'i1', title: 'Technical · Asha' }
  const held: InterviewSnapshot = {
    ...interview,
    id: 'i2',
    scheduledAt: inHours(-24),
    outcome: 'completed',
  }

  function move(from: string, to: string, interviews: InterviewSnapshot[] = []) {
    return applicationRuleErrors({
      previous: { ...application, status: from },
      next: { ...application, status: to },
      interviews,
      now: NOW,
    })
  }

  it('requires cancelling upcoming interviews before closing', () => {
    const errors = move('shortlisted', 'rejected', [upcoming])
    expect(paths(errors)).toEqual(['status'])
    expect(errors[0].message).toContain('1 upcoming interview')
    expect(move('shortlisted', 'rejected', [held])).toEqual([])
  })

  it('requires a held interview before an offer and an offer before hiring', () => {
    expect(paths(move('final-interview', 'offered'))).toEqual(['status'])
    expect(move('final-interview', 'offered', [held])).toEqual([])
    expect(paths(move('final-interview', 'hired', [held]))).toEqual(['status'])
    expect(move('offered', 'hired', [held])).toEqual([])
  })

  it('locks hired candidates', () => {
    expect(paths(move('hired', 'rejected'))).toEqual(['status'])
  })

  it('blocks changing the job once interviews exist', () => {
    const errors = applicationRuleErrors({
      previous: application,
      next: { ...application, careerId: 'job-2' },
      interviews: [held],
      now: NOW,
    })
    expect(paths(errors)).toEqual(['career'])
  })

  it('allows normal forward and backward moves', () => {
    expect(move('new', 'shortlisted')).toEqual([])
    expect(move('rejected', 'under-review')).toEqual([])
  })
})
