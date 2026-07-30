import type { AdminViewServerProps, Payload, Where } from 'payload'
import Link from 'next/link'
import React from 'react'

import { countCollection } from './lib'
import { WorkspacePanel, WorkspaceShell } from './WorkspaceShell'

async function topPages(payload: Payload) {
  try {
    const result = await payload.find({
      collection: 'analytics-events',
      depth: 0,
      limit: 500,
      overrideAccess: true,
      where: { type: { equals: 'pageview' } } as Where,
      sort: '-createdAt',
    })

    const counts = new Map<string, number>()
    for (const doc of result.docs) {
      const path =
        typeof (doc as { path?: string }).path === 'string' ? (doc as { path: string }).path : '/'
      counts.set(path, (counts.get(path) || 0) + 1)
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }))
  } catch {
    return []
  }
}

export async function AnalyticsView(props: AdminViewServerProps) {
  const { payload } = props

  const [pageviews, leads, applications, downloads, newsletter, blogs, jobs, pages] =
    await Promise.all([
      countCollection(payload, 'analytics-events', { type: { equals: 'pageview' } }),
      countCollection(payload, 'analytics-events', { type: { equals: 'lead' } }),
      countCollection(payload, 'analytics-events', { type: { equals: 'application' } }),
      countCollection(payload, 'analytics-events', { type: { equals: 'download' } }),
      countCollection(payload, 'analytics-events', { type: { equals: 'newsletter' } }),
      countCollection(payload, 'blogs'),
      countCollection(payload, 'careers'),
      topPages(payload),
    ])

  return (
    <WorkspaceShell
      active="analytics"
      title="Analytics"
      subtitle="First-party traffic and conversion events stored in Payload — one database."
      stats={[
        {
          label: 'Page views',
          value: pageviews,
          tone: 'accent',
          href: '/admin/collections/analytics-events',
        },
        { label: 'Leads', value: leads, href: '/admin/workspace/crm' },
        { label: 'Applications', value: applications, href: '/admin/workspace/recruitment' },
        { label: 'Downloads', value: downloads, href: '/admin/collections/downloads' },
        { label: 'Newsletter', value: newsletter, href: '/admin/workspace/newsletter' },
        { label: 'Insights', value: blogs, href: '/admin/collections/blogs' },
      ]}
      actions={[
        { label: 'Event log', href: '/admin/collections/analytics-events', primary: true },
        { label: 'Tracking IDs', href: '/admin/globals/analytics' },
      ]}
    >
      <div className="xe-ws-grid xe-ws-grid--2">
        <WorkspacePanel title="Top pages">
          {pages.length === 0 ? (
            <p className="xe-ws-note">
              No pageviews yet. Browse the public site to start collecting.
            </p>
          ) : (
            <ul className="xe-ws-kv">
              {pages.map((item) => (
                <li key={item.path}>
                  <span>{item.path}</span>
                  <strong>{item.views}</strong>
                </li>
              ))}
            </ul>
          )}
        </WorkspacePanel>
        <WorkspacePanel title="Content footprint">
          <ul className="xe-ws-kv">
            <li>
              <Link href="/admin/collections/careers">
                <span>Jobs</span>
                <strong>{jobs}</strong>
              </Link>
            </li>
            <li>
              <Link href="/admin/collections/blogs">
                <span>Insights</span>
                <strong>{blogs}</strong>
              </Link>
            </li>
            <li>
              <Link href="/admin/collections/analytics-events">
                <span>All events</span>
                <strong>{pageviews + leads + applications + downloads + newsletter}</strong>
              </Link>
            </li>
          </ul>
        </WorkspacePanel>
      </div>
    </WorkspaceShell>
  )
}

export default AnalyticsView
