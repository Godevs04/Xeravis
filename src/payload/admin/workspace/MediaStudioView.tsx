import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { countCollection, listRecent } from './lib'
import { WorkspacePanel, WorkspaceShell, WorkspaceTable } from './WorkspaceShell'

export async function MediaStudioView(props: AdminViewServerProps) {
  const { payload } = props

  const [total, recent] = await Promise.all([
    countCollection(payload, 'media'),
    listRecent(payload, 'media', {
      titleField: 'filename',
      sort: '-updatedAt',
      limit: 16,
    }),
  ])

  // Prefer alt/filename display
  const rows = recent.map((row) => ({
    ...row,
    title: row.title || 'Asset',
  }))

  return (
    <WorkspaceShell
      active="media"
      title="Media Studio"
      subtitle="Central asset library for marketing, careers, and research — managed as Payload media."
      stats={[
        { label: 'Assets', value: total, href: '/admin/collections/media', tone: 'accent' },
        {
          label: 'Upload',
          value: 'Open',
          meta: 'Images, PDF, video',
          href: '/admin/collections/media/create',
        },
      ]}
      actions={[
        { label: 'Open media library', href: '/admin/collections/media', primary: true },
        { label: 'Upload asset', href: '/admin/collections/media/create' },
      ]}
    >
      <WorkspacePanel title="Recently updated assets" href="/admin/collections/media">
        <WorkspaceTable rows={rows} empty="No media uploaded yet." />
      </WorkspacePanel>
    </WorkspaceShell>
  )
}

export default MediaStudioView
