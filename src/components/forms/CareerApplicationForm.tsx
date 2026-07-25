'use client'

import { useActionState } from 'react'

import { submitCareerApplication, type CareerFormState } from '@/actions/career'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const initialState: CareerFormState = { ok: false, message: '' }

type CareerApplicationFormProps = {
  careerId: string
  jobTitle: string
}

export function CareerApplicationForm({ careerId, jobTitle }: CareerApplicationFormProps) {
  const [state, action, pending] = useActionState(submitCareerApplication, initialState)

  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="careerId" value={careerId} />
      <p className="text-secondary text-sm">
        Applying for <span className="text-primary font-semibold">{jobTitle}</span>
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="applicant-name">Full name</Label>
          <Input id="applicant-name" name="name" autoComplete="name" required />
          {state.fieldErrors?.name && (
            <p className="text-danger text-sm">{state.fieldErrors.name[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="applicant-email">Email</Label>
          <Input id="applicant-email" name="email" type="email" autoComplete="email" required />
          {state.fieldErrors?.email && (
            <p className="text-danger text-sm">{state.fieldErrors.email[0]}</p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="applicant-phone">Phone</Label>
          <Input id="applicant-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover letter (optional)</Label>
        <Textarea id="coverLetter" name="coverLetter" rows={5} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resume">Resume (PDF, max 5 MB)</Label>
        <Input id="resume" name="resume" type="file" accept="application/pdf,.pdf" required />
        {state.fieldErrors?.resume && (
          <p className="text-danger text-sm">{state.fieldErrors.resume[0]}</p>
        )}
      </div>
      {state.message && (
        <p className={`text-sm ${state.ok ? 'text-success' : 'text-danger'}`} role="status">
          {state.message}
        </p>
      )}
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? 'Submitting…' : 'Submit application'}
      </Button>
    </form>
  )
}
