import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { countCollection, listRecent } from './lib'
import { WorkspacePanel, WorkspaceShell, WorkspaceTable } from './WorkspaceShell'

const PIPELINE = [
  { status: 'new', label: 'New' },
  { status: 'assigned', label: 'Assigned' },
  { status: 'meeting', label: 'Meeting' },
  { status: 'proposal', label: 'Proposal' },
  { status: 'won', label: 'Won' },
  { status: 'lost', label: 'Lost' },
] as const

export async function CrmView(props: AdminViewServerProps) {
  const { payload } = props

  const [total, pipeline, messages, whitepapers, downloads] = await Promise.all([
    countCollection(payload, 'contact-messages'),
    Promise.all(
      PIPELINE.map(async (stage) => ({
        ...stage,
        count: await countCollection(payload, 'contact-messages', {
          status: { equals: stage.status },
        }),
      })),
    ),
    listRecent(payload, 'contact-messages', {
      titleField: 'name',
      sort: '-createdAt',
      limit: 12,
    }),
    countCollection(payload, 'blogs', { insightType: { equals: 'white-paper' } }),
    countCollection(payload, 'downloads'),
  ])

  return (
    <WorkspaceShell
      active="crm"
      title="Marketing · CRM"
      subtitle="Inquiry pipeline from Contact Us → assign → meeting → proposal → won/lost."
      stats={[
        { label: 'Total leads', value: total, href: '/admin/collections/contact-messages' },
        {
          label: 'New',
          value: pipeline.find((p) => p.status === 'new')?.count ?? 0,
          tone: 'warn',
          meta: 'Needs owner',
        },
        {
          label: 'In pipeline',
          value: pipeline
            .filter((p) => ['assigned', 'meeting', 'proposal'].includes(p.status))
            .reduce((sum, p) => sum + p.count, 0),
          tone: 'accent',
        },
        {
          label: 'Won',
          value: pipeline.find((p) => p.status === 'won')?.count ?? 0,
          tone: 'accent',
        },
        { label: 'Whitepapers', value: whitepapers, href: '/admin/collections/blogs' },
        { label: 'Downloads', value: downloads, href: '/admin/collections/downloads' },
      ]}
      actions={[
        { label: 'Open leads', href: '/admin/collections/contact-messages', primary: true },
        { label: 'Newsletter', href: '/admin/workspace/newsletter' },
        { label: 'Downloads', href: '/admin/collections/downloads' },
      ]}
    >
      <div className="xe-ws-grid xe-ws-grid--pipeline">
        {pipeline.map((col) => (
          <div key={col.status} className="xe-ws-pipe">
            <div className="xe-ws-pipe__head">
              <span>{col.label}</span>
              <strong>{col.count}</strong>
            </div>
            <a
              className="xe-ws-pipe__link"
              href={`/admin/collections/contact-messages?where[status][equals]=${encodeURIComponent(col.status)}`}
            >
              Open stage
            </a>
          </div>
        ))}
      </div>

      <WorkspacePanel title="Recent leads" href="/admin/collections/contact-messages">
        <WorkspaceTable rows={messages} empty="No leads yet." />
      </WorkspacePanel>
    </WorkspaceShell>
  )
}

export default CrmView
