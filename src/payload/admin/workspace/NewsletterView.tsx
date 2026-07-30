import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { countCollection, listRecent } from './lib'
import { WorkspacePanel, WorkspaceShell, WorkspaceTable } from './WorkspaceShell'

export async function NewsletterView(props: AdminViewServerProps) {
  const { payload } = props

  const [total, active, unsubscribed, recent, campaigns] = await Promise.all([
    countCollection(payload, 'newsletter-subscribers'),
    countCollection(payload, 'newsletter-subscribers', { status: { equals: 'active' } }),
    countCollection(payload, 'newsletter-subscribers', { status: { equals: 'unsubscribed' } }),
    listRecent(payload, 'newsletter-subscribers', {
      titleField: 'email',
      sort: '-createdAt',
      limit: 12,
    }),
    listRecent(payload, 'newsletter-campaigns', {
      titleField: 'title',
      sort: '-sentAt',
      limit: 8,
    }),
  ])

  return (
    <WorkspaceShell
      active="newsletter"
      title="Newsletter"
      subtitle="Subscribers, CSV export, and campaign history — managed inside Payload."
      stats={[
        { label: 'Subscribers', value: total, href: '/admin/collections/newsletter-subscribers' },
        { label: 'Active', value: active, tone: 'accent' },
        { label: 'Unsubscribed', value: unsubscribed, tone: 'muted' },
        {
          label: 'Retention',
          value: total ? `${Math.round((active / total) * 100)}%` : '—',
          meta: 'Active share',
        },
      ]}
      actions={[
        {
          label: 'Manage subscribers',
          href: '/admin/collections/newsletter-subscribers',
          primary: true,
        },
        { label: 'Export CSV', href: '/api/admin/newsletter/export' },
        { label: 'Campaigns', href: '/admin/collections/newsletter-campaigns' },
      ]}
    >
      <div className="xe-ws-grid xe-ws-grid--2">
        <WorkspacePanel title="Recent subscribers" href="/admin/collections/newsletter-subscribers">
          <WorkspaceTable rows={recent} empty="No subscribers yet." />
        </WorkspacePanel>
        <WorkspacePanel title="Campaign history" href="/admin/collections/newsletter-campaigns">
          <WorkspaceTable rows={campaigns} empty="No campaigns logged yet." />
        </WorkspacePanel>
      </div>
    </WorkspaceShell>
  )
}

export default NewsletterView
