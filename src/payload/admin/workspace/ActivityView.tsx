import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { listRecent, type WorkspaceRow } from './lib'
import { WorkspacePanel, WorkspaceShell, WorkspaceTable } from './WorkspaceShell'

const TRACKED = [
  { collection: 'pages', label: 'Page' },
  { collection: 'blogs', label: 'Insight' },
  { collection: 'services', label: 'Service' },
  { collection: 'careers', label: 'Career' },
  { collection: 'job-applications', label: 'Application', titleField: 'name' },
  { collection: 'contact-messages', label: 'Inquiry', titleField: 'name' },
  { collection: 'solutions', label: 'Solution' },
  { collection: 'industries', label: 'Industry' },
] as const

export async function ActivityView(props: AdminViewServerProps) {
  const { payload } = props

  const batches = await Promise.all(
    TRACKED.map(async (item) => {
      const rows = await listRecent(payload, item.collection, {
        titleField: 'titleField' in item ? item.titleField : 'title',
        limit: 5,
        sort: '-updatedAt',
      })
      return rows.map((row) => ({
        ...row,
        subtitle: `${item.label}${row.subtitle ? ` · ${row.subtitle}` : ''}`,
      }))
    }),
  )

  const merged: WorkspaceRow[] = batches
    .flat()
    .sort((a, b) => {
      const at = a.subtitle?.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)?.[0] || ''
      const bt = b.subtitle?.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)?.[0] || ''
      return bt.localeCompare(at)
    })
    .slice(0, 24)

  return (
    <WorkspaceShell
      active="activity"
      title="Activity Timeline"
      subtitle="Recent changes across content, careers, CRM, and recruitment — one audit surface."
      actions={[{ label: 'Dashboard', href: '/admin', primary: true }]}
    >
      <WorkspacePanel title="Latest updates">
        <WorkspaceTable rows={merged} empty="No recent activity." />
      </WorkspacePanel>
    </WorkspaceShell>
  )
}

export default ActivityView
