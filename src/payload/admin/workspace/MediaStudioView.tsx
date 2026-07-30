import type { AdminViewServerProps, Payload } from 'payload'
import React from 'react'

import { countCollection, listRecent } from './lib'
import { WorkspacePanel, WorkspaceShell, WorkspaceTable } from './WorkspaceShell'

const FOLDERS = [
  'general',
  'hero',
  'blogs',
  'services',
  'industries',
  'team',
  'clients',
  'logos',
  'icons',
  'documents',
  'videos',
  'og',
] as const

async function unusedEstimate(payload: Payload) {
  try {
    const media = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 200,
      overrideAccess: true,
      sort: '-updatedAt',
    })

    // Heuristic: assets older than 90 days with no alt reuse signal — report count of docs
    // without tags as "needs tagging" rather than claiming unused falsely.
    const untagged = media.docs.filter((doc) => {
      const tags = (doc as { tags?: unknown[] }).tags
      return !Array.isArray(tags) || tags.length === 0
    }).length

    return { scanned: media.docs.length, untagged }
  } catch {
    return { scanned: 0, untagged: 0 }
  }
}

export async function MediaStudioView(props: AdminViewServerProps) {
  const { payload } = props

  const [total, recent, folderCounts, usage] = await Promise.all([
    countCollection(payload, 'media'),
    listRecent(payload, 'media', {
      titleField: 'filename',
      sort: '-updatedAt',
      limit: 16,
    }),
    Promise.all(
      FOLDERS.map(async (folder) => ({
        folder,
        count: await countCollection(payload, 'media', { folder: { equals: folder } }),
      })),
    ),
    unusedEstimate(payload),
  ])

  const activeFolders = folderCounts.filter((f) => f.count > 0)

  return (
    <WorkspaceShell
      active="media"
      title="Media Studio 2.0"
      subtitle="Folders, tags, and library health — still the same Payload media collection."
      stats={[
        { label: 'Assets', value: total, href: '/admin/collections/media', tone: 'accent' },
        {
          label: 'Untagged',
          value: usage.untagged,
          meta: `of ${usage.scanned} scanned`,
          tone: usage.untagged ? 'warn' : 'accent',
        },
        {
          label: 'Folders in use',
          value: activeFolders.length,
          meta: `${FOLDERS.length} available`,
        },
      ]}
      actions={[
        { label: 'Open library', href: '/admin/collections/media', primary: true },
        { label: 'Upload', href: '/admin/collections/media/create' },
      ]}
    >
      <div className="xe-ws-grid xe-ws-grid--pipeline">
        {activeFolders.map((col) => (
          <div key={col.folder} className="xe-ws-pipe">
            <div className="xe-ws-pipe__head">
              <span>{col.folder}</span>
              <strong>{col.count}</strong>
            </div>
            <a
              className="xe-ws-pipe__link"
              href={`/admin/collections/media?where[folder][equals]=${encodeURIComponent(col.folder)}`}
            >
              Browse
            </a>
          </div>
        ))}
      </div>

      <WorkspacePanel title="Recently updated assets" href="/admin/collections/media">
        <WorkspaceTable rows={recent} empty="No media uploaded yet." />
      </WorkspacePanel>
    </WorkspaceShell>
  )
}

export default MediaStudioView
