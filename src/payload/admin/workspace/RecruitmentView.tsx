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

  const [openJobs, applications, pipelineCounts, recentApps, recentJobs] = await Promise.all([
    countCollection(payload, 'careers', { active: { equals: true } }),
    countCollection(payload, 'job-applications'),
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
  ])

  const activePipeline = pipelineCounts.filter(
    (p) => p.count > 0 || ['new', 'shortlisted', 'hired'].includes(p.status),
  )

  return (
    <WorkspaceShell
      active="recruitment"
      title="Recruitment"
      subtitle="Manage open roles and move candidates through a clear hiring pipeline — all inside Payload."
      stats={[
        {
          label: 'Active jobs',
          value: openJobs,
          meta: 'Published openings',
          href: '/admin/collections/careers',
          tone: 'accent',
        },
        {
          label: 'Applications',
          value: applications,
          meta: 'All time inbox',
          href: '/admin/collections/job-applications',
        },
        {
          label: 'New',
          value: pipelineCounts.find((p) => p.status === 'new')?.count ?? 0,
          meta: 'Needs review',
          tone: 'warn',
        },
        {
          label: 'Hired',
          value: pipelineCounts.find((p) => p.status === 'hired')?.count ?? 0,
          meta: 'Closed won',
          tone: 'accent',
        },
      ]}
      actions={[
        { label: 'Create job', href: '/admin/collections/careers/create', primary: true },
        { label: 'All applications', href: '/admin/collections/job-applications' },
      ]}
    >
      <div className="xe-ws-grid xe-ws-grid--pipeline">
        {activePipeline.map((col) => (
          <div key={col.status} className="xe-ws-pipe">
            <div className="xe-ws-pipe__head">
              <span>{col.status.replace(/-/g, ' ')}</span>
              <strong>{col.count}</strong>
            </div>
            <Linkish status={col.status} />
          </div>
        ))}
      </div>

      <div className="xe-ws-grid xe-ws-grid--2">
        <WorkspacePanel
          title="Latest applications"
          href="/admin/collections/job-applications"
          linkLabel="Inbox"
        >
          <WorkspaceTable rows={recentApps} empty="No applications yet." />
        </WorkspacePanel>
        <WorkspacePanel title="Open roles" href="/admin/collections/careers" linkLabel="Jobs">
          <WorkspaceTable rows={recentJobs} empty="No careers published." />
        </WorkspacePanel>
      </div>
    </WorkspaceShell>
  )
}

function Linkish({ status }: { status: string }) {
  return (
    <a
      className="xe-ws-pipe__link"
      href={`/admin/collections/job-applications?where[status][equals]=${encodeURIComponent(status)}`}
    >
      View board
    </a>
  )
}

export default RecruitmentView
