import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { listRecent, type WorkspaceRow } from './lib'
import { WorkspacePanel, WorkspaceShell, WorkspaceTable } from './WorkspaceShell'

export async function ActivityView(props: AdminViewServerProps) {
  const { payload } = props

  let rows: WorkspaceRow[] = []
  try {
    const result = await payload.find({
      collection: 'activity-logs',
      depth: 0,
      limit: 40,
      sort: '-createdAt',
      overrideAccess: true,
    })

    rows = result.docs.map((doc) => {
      const record = doc as unknown as Record<string, unknown>
      const summary = typeof record.summary === 'string' ? record.summary : 'Activity'
      const collection =
        typeof record.collectionSlug === 'string'
          ? record.collectionSlug
          : typeof record.collection === 'string'
            ? record.collection
            : ''
      const documentId = typeof record.documentId === 'string' ? record.documentId : ''
      const createdAt =
        typeof record.createdAt === 'string' ? new Date(record.createdAt).toLocaleString() : ''
      const action = typeof record.action === 'string' ? record.action : undefined

      return {
        id: String(record.id),
        title: summary,
        subtitle: createdAt,
        href:
          collection && documentId
            ? `/admin/collections/${collection}/${documentId}`
            : '/admin/collections/activity-logs',
        badge: action,
        badgeTone:
          action === 'published' || action === 'created'
            ? 'open'
            : action === 'deleted'
              ? 'warn'
              : 'default',
      }
    })
  } catch {
    rows = []
  }

  // Fallback if activity log is empty: show recent collection edits
  if (rows.length === 0) {
    const fallback = await Promise.all([
      listRecent(payload, 'blogs', { limit: 5 }),
      listRecent(payload, 'careers', { limit: 5 }),
      listRecent(payload, 'contact-messages', { titleField: 'name', limit: 5 }),
      listRecent(payload, 'media', { titleField: 'filename', limit: 5 }),
    ])
    rows = fallback.flat().slice(0, 20)
  }

  return (
    <WorkspaceShell
      active="activity"
      title="Activity Timeline"
      subtitle="Append-only enterprise feed: publishes, leads, jobs, media, and SEO edits."
      actions={[
        { label: 'Activity log', href: '/admin/collections/activity-logs', primary: true },
        { label: 'Dashboard', href: '/admin' },
      ]}
    >
      <WorkspacePanel title="Latest updates">
        <WorkspaceTable rows={rows} empty="No activity recorded yet." />
      </WorkspacePanel>
    </WorkspaceShell>
  )
}

export default ActivityView
