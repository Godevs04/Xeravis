'use client'

import { Download, Lock } from 'lucide-react'
import { useActionState, useEffect, useId, useState } from 'react'

import { requestDownload, type DownloadFormState } from '@/actions/download'
import { AttributionFields } from '@/components/forms/AttributionFields'
import { Turnstile } from '@/components/forms/Turnstile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { track } from '@/lib/analytics-client'
import { submitKeepingValues } from '@/lib/form-submit'

export type DownloadItem = {
  id: string | number
  title: string
  slug: string
  description?: string | null
  gated?: boolean | null
}

const initialState: DownloadFormState = { ok: false, message: '' }

function GatedDownloadForm({ item }: { item: DownloadItem }) {
  const emailId = useId()
  const nameId = useId()
  const companyId = useId()
  const [state, action, pending] = useActionState(requestDownload, initialState)

  useEffect(() => {
    if (state.ok && state.url) {
      track('gated_download', { slug: item.slug })
      window.location.assign(state.url)
    }
  }, [state, item.slug])

  return (
    <form action={action} onSubmit={submitKeepingValues(action)} className="space-y-4" noValidate>
      <input type="hidden" name="slug" value={item.slug} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <AttributionFields />
      <Turnstile resetKey={state} />
      <div className="space-y-2">
        <Label htmlFor={emailId}>Work email</Label>
        <Input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={nameId}>Name (optional)</Label>
          <Input id={nameId} name="name" autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={companyId}>Company (optional)</Label>
          <Input id={companyId} name="company" autoComplete="organization" />
        </div>
      </div>
      <p className="text-muted text-xs">
        We&apos;ll use your email to share related insights. See our{' '}
        <a href="/privacy-policy" className="underline">
          privacy policy
        </a>
        .
      </p>
      <Button type="submit" className="w-full rounded-full" loading={pending} disabled={pending}>
        <Download className="h-4 w-4" aria-hidden />
        Get the download
      </Button>
      {state.message ? (
        <p role="status" className={state.ok ? 'text-success text-sm' : 'text-danger text-sm'}>
          {state.message}
        </p>
      ) : null}
    </form>
  )
}

export function DownloadCard({ item }: { item: DownloadItem }) {
  const [open, setOpen] = useState(false)
  const body = (
    <SpotlightCard className="flex h-full flex-col p-6 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-accent text-[10px] font-bold tracking-[0.16em] uppercase">
          {item.gated ? 'Free download · email required' : 'Free download'}
        </span>
        {item.gated ? (
          <Lock className="text-muted h-4 w-4" aria-hidden />
        ) : (
          <Download className="text-muted h-4 w-4" aria-hidden />
        )}
      </div>
      <h3 className="font-display text-primary text-xl font-semibold tracking-tight">
        {item.title}
      </h3>
      {item.description ? (
        <p className="text-secondary mt-3 flex-1 text-sm leading-relaxed">{item.description}</p>
      ) : (
        <div className="flex-1" />
      )}
      <span className="text-accent mt-6 text-sm font-semibold">Download</span>
    </SpotlightCard>
  )

  if (!item.gated) {
    return (
      <a
        href={`/api/download/${item.slug}`}
        className="block h-full"
        onClick={() => track('download', { slug: item.slug })}
      >
        {body}
      </a>
    )
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <button type="button" className="block h-full w-full text-left">
          {body}
        </button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{item.title}</ModalTitle>
          <ModalDescription>
            Tell us where to send updates and the download starts.
          </ModalDescription>
        </ModalHeader>
        <GatedDownloadForm item={item} />
      </ModalContent>
    </Modal>
  )
}
