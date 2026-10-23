'use client'

import { useActionState, useRef } from 'react'
import { track } from '@/lib/analytics-client'

import { submitNewsletter, type NewsletterFormState } from '@/actions/newsletter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { submitKeepingValues } from '@/lib/form-submit'
import { cn } from '@/lib/utils'

const initialState: NewsletterFormState = { ok: false, message: '' }

type NewsletterFormProps = {
  variant?: 'default' | 'dark'
}

export function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, pending] = useActionState(
    async (previousState: NewsletterFormState, formData: FormData) => {
      const result = await submitNewsletter(previousState, formData)

      if (result.ok) {
        formRef.current?.reset()
        track('newsletter_subscribed')
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
      <Label htmlFor="newsletter-email" className={cn(dark && 'text-white/80')}>
        Email address
      </Label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
          className={cn(dark && 'border-white/20 bg-white/5 text-white placeholder:text-white/40')}
        />
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />
        <Button
          type="submit"
          variant={dark ? 'outline' : 'primary'}
          disabled={pending}
          loading={pending}
          className={cn(dark && 'border-white/30 text-white hover:bg-white/10')}
        >
          Subscribe
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
