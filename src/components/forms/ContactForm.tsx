'use client'

import { useActionState } from 'react'

import { submitContact, type ContactFormState } from '@/actions/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const initialState: ContactFormState = { ok: false, message: '' }

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState)

  return (
    <form action={action} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" autoComplete="name" required aria-invalid={Boolean(state.fieldErrors?.name)} />
          {state.fieldErrors?.name && <p className="text-sm text-danger">{state.fieldErrors.name[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(state.fieldErrors?.email)} />
          {state.fieldErrors?.email && <p className="text-sm text-danger">{state.fieldErrors.email[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" autoComplete="organization" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">How can we help?</Label>
        <Textarea id="message" name="message" rows={6} required aria-invalid={Boolean(state.fieldErrors?.message)} />
        {state.fieldErrors?.message && <p className="text-sm text-danger">{state.fieldErrors.message[0]}</p>}
      </div>
      {state.message && (
        <p className={`text-sm ${state.ok ? 'text-success' : 'text-danger'}`} role="status">
          {state.message}
        </p>
      )}
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
