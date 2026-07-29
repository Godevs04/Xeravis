import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { countCollection, listRecent } from './lib'
import { WorkspacePanel, WorkspaceShell, WorkspaceTable } from './WorkspaceShell'

export async function CrmView(props: AdminViewServerProps) {
  const { payload } = props

  const [total, newCount, inProgress, closed, messages] = await Promise.all([
    countCollection(payload, 'contact-messages'),
    countCollection(payload, 'contact-messages', { status: { equals: 'new' } }),
    countCollection(payload, 'contact-messages', { status: { equals: 'in-progress' } }),
    countCollection(payload, 'contact-messages', { status: { equals: 'closed' } }),
    listRecent(payload, 'contact-messages', {
      titleField: 'name',
      sort: '-createdAt',
      limit: 12,
    }),
  ])

  return (
    <WorkspaceShell
      active="crm"
      title="CRM Inbox"
      subtitle="Triage website inquiries, qualify intent, and keep follow-ups inside your CMS of record."
      stats={[
        { label: 'Total inquiries', value: total, href: '/admin/collections/contact-messages' },
        { label: 'New', value: newCount, tone: 'warn', meta: 'Awaiting response' },
        { label: 'In progress', value: inProgress, tone: 'accent' },
        { label: 'Closed', value: closed, meta: 'Resolved' },
      ]}
      actions={[
        { label: 'Open inbox', href: '/admin/collections/contact-messages', primary: true },
        { label: 'Form submissions', href: '/admin/collections/form-submissions' },
      ]}
    >
      <WorkspacePanel title="Recent inquiries" href="/admin/collections/contact-messages">
        <WorkspaceTable rows={messages} empty="No contact messages yet." />
      </WorkspacePanel>
    </WorkspaceShell>
  )
}

export default CrmView
