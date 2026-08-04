import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { countCollection, listRecent } from './lib'
import { WorkspacePanel, WorkspaceShell, WorkspaceTable } from './WorkspaceShell'

const PIPELINE = [
  'new',
  'under-review',
  'shortlisted',
  'interview-scheduled',
  'technical-assessment',
  'final-interview',
  'offered',
  'hired',
  'rejected',
  'withdrawn',
] as const

export async function RecruitmentView(props: AdminViewServerProps) {
  const { payload } = props
  const now = new Date().toISOString()

  const [
    openJobs,
    applications,
    shortlisted,
    rejected,
    interviewsUpcoming,
    pipelineCounts,
    recentApps,
    recentJobs,
    upcomingInterviews,
  ] = await Promise.all([
    countCollection(payload, 'careers', { active: { equals: true } }),
    countCollection(payload, 'job-applications'),
    countCollection(payload, 'job-applications', { status: { equals: 'shortlisted' } }),
    countCollection(payload, 'job-applications', { status: { equals: 'rejected' } }),
    countCollection(payload, 'interviews', {
      and: [{ scheduledAt: { greater_than_equal: now } }, { outcome: { equals: 'scheduled' } }],
    }),
    Promise.all(
      PIPELINE.map(async (status) => ({
        status,
        count: await countCollection(payload, 'job-applications', { status: { equals: status } }),
      })),
    ),
    listRecent(payload, 'job-applications', {
      titleField: 'name',
      sort: '-createdAt',
      limit: 10,
    }),
    listRecent(payload, 'careers', { limit: 6, sort: '-updatedAt' }),
    listRecent(payload, 'interviews', {
      titleField: 'title',
      sort: 'scheduledAt',
      limit: 8,
      where: {
        and: [{ scheduledAt: { greater_than_equal: now } }, { outcome: { equals: 'scheduled' } }],
      },
    }),
  ])

  const funnel = pipelineCounts.filter(
    (p) =>
      p.count > 0 ||
      ['new', 'shortlisted', 'interview-scheduled', 'hired', 'rejected'].includes(p.status),
  )

  return (
    <WorkspaceShell
      active="recruitment"
      title="HR · Recruitment"
      subtitle="Candidates, jobs, interviews, and hiring funnel — managed in Payload collections."
      stats={[
        {
          label: 'Active jobs',
          value: openJobs,
          meta: 'Open roles',
          href: '/admin/collections/careers',
          tone: 'accent',
        },
        {
          label: 'Candidates',
          value: applications,
          href: '/admin/collections/job-applications',
        },
        {
          label: 'Shortlisted',
          value: shortlisted,
          tone: 'accent',
          href: '/admin/collections/job-applications?where[status][equals]=shortlisted',
        },
        {
          label: 'Upcoming interviews',
          value: interviewsUpcoming,
          tone: 'warn',
          href: '/admin/collections/interviews',
        },
        {
          label: 'Rejected',
          value: rejected,
          href: '/admin/collections/job-applications?where[status][equals]=rejected',
        },
      ]}
      actions={[
        { label: 'Create job', href: '/admin/collections/careers/create', primary: true },
        { label: 'Schedule interview', href: '/admin/collections/interviews/create' },
        { label: 'All candidates', href: '/admin/collections/job-applications' },
      ]}
    >
      <div className="xe-ws-grid xe-ws-grid--pipeline">
        {funnel.map((col) => (
          <div key={col.status} className="xe-ws-pipe">
            <div className="xe-ws-pipe__head">
              <span>{col.status.replace(/-/g, ' ')}</span>
              <strong>{col.count}</strong>
            </div>
            <a
              className="xe-ws-pipe__link"
              href={`/admin/collections/job-applications?where[status][equals]=${encodeURIComponent(col.status)}`}
            >
              View board
            </a>
          </div>
        ))}
      </div>

      <div className="xe-ws-grid xe-ws-grid--2">
        <WorkspacePanel
          title="Latest candidates"
          href="/admin/collections/job-applications"
          linkLabel="Inbox"
        >
          <WorkspaceTable rows={recentApps} empty="No applications yet." />
        </WorkspacePanel>
        <WorkspacePanel title="Upcoming interviews" href="/admin/collections/interviews">
          <WorkspaceTable rows={upcomingInterviews} empty="No interviews scheduled." />
        </WorkspacePanel>
      </div>

      <WorkspacePanel title="Open roles" href="/admin/collections/careers" linkLabel="Jobs">
        <WorkspaceTable rows={recentJobs} empty="No careers published." />
      </WorkspacePanel>
    </WorkspaceShell>
  )
}

export default RecruitmentView
