import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { AiAssistantForm } from './AiAssistantForm'
import { WorkspacePanel, WorkspaceShell } from './WorkspaceShell'

export async function AiAssistantView(_props: AdminViewServerProps) {
  return (
    <WorkspaceShell
      active="ai"
      title="AI Content Assistant"
      subtitle="Draft meta descriptions, service summaries, blog outlines, and job posts without leaving Payload."
      actions={[
        { label: 'Create blog', href: '/admin/collections/blogs/create', primary: true },
        { label: 'Create service', href: '/admin/collections/services/create' },
      ]}
    >
      <div className="xe-ws-grid xe-ws-grid--2">
        <WorkspacePanel title="Generate">
          <AiAssistantForm />
        </WorkspacePanel>
        <WorkspacePanel title="How it works">
          <ul className="xe-ws-bullets">
            <li>Runs inside the authenticated Payload admin — same users and permissions.</li>
            <li>
              Uses workspace templates by default. Configure <code>OPENAI_API_KEY</code> or{' '}
              <code>AI_GATEWAY_API_KEY</code> for live model output.
            </li>
            <li>Paste results into Lexical fields on pages, blogs, services, or careers.</li>
            <li>
              Does not create a second CMS or API surface — Payload remains the source of truth.
            </li>
          </ul>
        </WorkspacePanel>
      </div>
    </WorkspaceShell>
  )
}

export default AiAssistantView
