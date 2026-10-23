'use client'

import { Button, toast, useDocumentInfo, useFormFields, useFormModified } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type SendResult = { ok: boolean; error?: string; sent?: number; failed?: number; to?: string }

export function SendCampaignButton() {
  const { id } = useDocumentInfo()
  const router = useRouter()
  const modified = useFormModified()
  const status = useFormFields(([fields]) => fields.status?.value as string | undefined)
  const [busy, setBusy] = useState<'test' | 'send' | null>(null)

  if (!id) {
    return (
      <p style={{ fontSize: 13, opacity: 0.75, margin: '0 0 16px' }}>
        Save the campaign to enable sending.
      </p>
    )
  }

  const done = status === 'sent' || status === 'sending'

  async function call(test: boolean) {
    if (modified) {
      toast.warning('Save your changes before sending.')
      return
    }
    if (
      !test &&
      !window.confirm(
        'Send this campaign to every matching active subscriber? This cannot be undone.',
      )
    ) {
      return
    }
    setBusy(test ? 'test' : 'send')
    try {
      const res = await fetch(`/api/newsletter-campaigns/${id}/send`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test }),
      })
      const data = (await res.json()) as SendResult
      if (!data.ok) toast.error(data.error || 'Send failed')
      else if (test) toast.success(`Test email sent to ${data.to}`)
      else toast.success(`Campaign sent: ${data.sent} delivered, ${data.failed} failed`)
      router.refresh()
    } catch {
      toast.error('Send failed')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
      <Button buttonStyle="secondary" disabled={busy !== null} onClick={() => call(true)}>
        {busy === 'test' ? 'Sending test...' : 'Send test to me'}
      </Button>
      <Button disabled={busy !== null || done} onClick={() => call(false)}>
        {done ? 'Campaign sent' : busy === 'send' ? 'Sending...' : 'Send campaign'}
      </Button>
    </div>
  )
}
