'use client'

import { useActionState } from 'react'

import { submitNewsletter, type NewsletterFormState } from '@/actions/newsletter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const initialState: NewsletterFormState = { ok: false, message: '' }

type NewsletterFormProps = {
  variant?: 'default' | 'dark'
}

export function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const [state, action, pending] = useActionState(submitNewsletter, initialState)
  const dark = variant === 'dark'

  return (
    <form action={action} className="space-y-3" noValidate>
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
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
        <Button type="submit" variant={dark ? 'outline' : 'accent'} disabled={pending} className={cn(dark && 'border-white/30 text-white hover:bg-white/10')}>
          {pending ? '…' : 'Subscribe'}
        </Button>
      </div>
      {state.fieldErrors?.email && <p className="text-sm text-danger">{state.fieldErrors.email[0]}</p>}
      {state.message && (
        <p className={cn('text-sm', state.ok ? (dark ? 'text-green-300' : 'text-success') : 'text-danger')} role="status">
          {state.message}
        </p>
      )}
    </form>
  )
}
