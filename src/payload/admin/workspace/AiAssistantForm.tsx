'use client'

import React, { useActionState } from 'react'

import { runAiAssist, type AiAssistState } from './ai-action'

const initial: AiAssistState = { ok: false, message: '' }

export function AiAssistantForm() {
  const [state, action, pending] = useActionState(runAiAssist, initial)

  return (
    <form action={action} className="xe-ai">
      <div className="xe-ai__grid">
        <label className="xe-ai__field">
          <span>Mode</span>
          <select name="mode" defaultValue="blog-outline">
            <option value="blog-outline">Blog outline</option>
            <option value="meta-description">Meta description</option>
            <option value="service-summary">Service summary</option>
            <option value="job-post">Job post draft</option>
          </select>
        </label>
        <label className="xe-ai__field">
          <span>Topic / title</span>
          <input name="topic" required placeholder="Clinical AI governance for CROs" />
        </label>
      </div>
      <label className="xe-ai__field">
        <span>Brief (optional)</span>
        <textarea name="brief" rows={4} placeholder="Audience, tone, must-include points…" />
      </label>
      <button type="submit" className="xe-ws-btn xe-ws-btn--primary" disabled={pending}>
        {pending ? 'Generating…' : 'Generate draft'}
      </button>
      {state.message ? (
        <p className={`xe-ai__status${state.ok ? 'is-ok' : 'is-err'}`}>{state.message}</p>
      ) : null}
      {state.output ? <pre className="xe-ai__output">{state.output}</pre> : null}
    </form>
  )
}
