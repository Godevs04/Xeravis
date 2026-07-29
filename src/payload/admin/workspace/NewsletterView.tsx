import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { countCollection, listRecent } from './lib'
import { WorkspacePanel, WorkspaceShell, WorkspaceTable } from './WorkspaceShell'

export async function NewsletterView(props: AdminViewServerProps) {
  const { payload } = props

  const [total, active, unsubscribed, recent] = await Promise.all([
    countCollection(payload, 'newsletter-subscribers'),
    countCollection(payload, 'newsletter-subscribers', { status: { equals: 'active' } }),
    countCollection(payload, 'newsletter-subscribers', { status: { equals: 'unsubscribed' } }),
    listRecent(payload, 'newsletter-subscribers', {
      titleField: 'email',
      sort: '-createdAt',
      limit: 15,
    }),
  ])

  return (
    <WorkspaceShell
      active="newsletter"
      title="Newsletter"
      subtitle="Audience management for product notes and research updates — stored in Payload."
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
      ]}
    >
      <WorkspacePanel title="Recent subscribers" href="/admin/collections/newsletter-subscribers">
        <WorkspaceTable rows={recent} empty="No subscribers yet." />
      </WorkspacePanel>
    </WorkspaceShell>
  )
}

export default NewsletterView
