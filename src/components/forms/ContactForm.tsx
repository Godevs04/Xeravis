'use client'

import { useActionState, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

import { submitContact, type ContactFormState } from '@/actions/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CONTACT_INTENTS } from '@/lib/site-ia'

const initialState: ContactFormState = { ok: false, message: '' }

const LEGACY_INTENT_MAP: Record<string, string> = {
  project: 'business',
  careers: 'career',
  ai: 'business',
}

export function ContactForm() {
  const [state, action, pending] = useActionState(
    async (previousState: ContactFormState, formData: FormData) => {
      const result = await submitContact(previousState, formData)

      if (result.ok) {
        posthog.capture('contact_form_submitted', {
          enquiry_intent: String(formData.get('intent') || 'general'),
        })
      }

      return result
    },
    initialState,
  )
  const searchParams = useSearchParams()
  const rawIntent = searchParams.get('intent') || 'business'
  const mapped = LEGACY_INTENT_MAP[rawIntent] || rawIntent
  const defaultIntent = CONTACT_INTENTS.some((i) => i.value === mapped) ? mapped : 'business'
  const [intent, setIntent] = useState(defaultIntent)

  useEffect(() => {
    setIntent(defaultIntent)
  }, [defaultIntent])

  return (
    <form action={action} className="space-y-6" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="space-y-2">
        <Label htmlFor="intent">What can we help with?</Label>
        <select
          id="intent"
          name="intent"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          className="border-border bg-background text-primary focus-visible:ring-accent w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus-visible:ring-2"
        >
          {CONTACT_INTENTS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <p className="text-muted text-xs">
          {CONTACT_INTENTS.find((i) => i.value === intent)?.description}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(state.fieldErrors?.name)}
          />
          {state.fieldErrors?.name && (
            <p className="text-danger text-sm">{state.fieldErrors.name[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Business email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(state.fieldErrors?.email)}
          />
          {state.fieldErrors?.email && (
            <p className="text-danger text-sm">{state.fieldErrors.email[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" autoComplete="organization" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job title</Label>
          <Input id="jobTitle" name="jobTitle" autoComplete="organization-title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" autoComplete="country-name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Tell us about your challenge</Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          required
          aria-invalid={Boolean(state.fieldErrors?.message)}
        />
        {state.fieldErrors?.message && (
          <p className="text-danger text-sm">{state.fieldErrors.message[0]}</p>
        )}
      </div>
      {state.message && (
        <p className={`text-sm ${state.ok ? 'text-success' : 'text-danger'}`} role="status">
          {state.message}
        </p>
      )}
      <Button type="submit" variant="primary" disabled={pending} loading={pending}>
        Submit
      </Button>
    </form>
  )
}
