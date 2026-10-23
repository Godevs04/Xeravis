'use client'

import { useActionState, useId, useRef } from 'react'
import { track } from '@/lib/analytics-client'

import { submitNewsletter, type NewsletterFormState } from '@/actions/newsletter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AttributionFields } from '@/components/forms/AttributionFields'
import { Turnstile } from '@/components/forms/Turnstile'
import { submitKeepingValues } from '@/lib/form-submit'
import { cn } from '@/lib/utils'

const initialState: NewsletterFormState = { ok: false, message: '' }

type NewsletterFormProps = {
  variant?: 'default' | 'dark'
  topic?: 'insights' | 'careers'
  submitLabel?: string
}

export function NewsletterForm({
  variant = 'default',
  topic = 'insights',
  submitLabel = 'Subscribe',
}: NewsletterFormProps) {
  const inputId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, pending] = useActionState(
    async (previousState: NewsletterFormState, formData: FormData) => {
      const result = await submitNewsletter(previousState, formData)

      if (result.ok) {
        formRef.current?.reset()
        track(topic === 'careers' ? 'job_alerts_subscribed' : 'newsletter_subscribed')
      }

      return result
    },
    initialState,
  )
  const dark = variant === 'dark'

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={submitKeepingValues(action)}
      className="space-y-3"
      noValidate
    >
      <Label htmlFor={inputId} className={cn(dark && 'text-white/80')}>
        Email address
      </Label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id={inputId}
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
          className={cn(dark && 'border-white/20 bg-white/5 text-white placeholder:text-white/40')}
        />
        <input type="hidden" name="topic" value={topic} />
        {/* Honeypot */}
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
        <Button
          type="submit"
          variant={dark ? 'outline' : 'primary'}
          disabled={pending}
          loading={pending}
          className={cn(dark && 'border-white/30 text-white hover:bg-white/10')}
        >
          {submitLabel}
        </Button>
      </div>
      {state.message && (
        <p
          className={cn(
            'text-sm',
            state.ok ? (dark ? 'text-green-300' : 'text-success') : 'text-danger',
          )}
          role="status"
        >
          {state.message}
        </p>
      )}
    </form>
  )
}
