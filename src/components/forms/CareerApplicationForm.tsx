'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import posthog from 'posthog-js'

import { submitCareerApplication, type CareerFormState } from '@/actions/career'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const initialState: CareerFormState = { ok: false, message: '' }

type CareerApplicationFormProps = {
  careerId: string
  jobTitle: string
}

const selectClass = cn(
  'flex h-11 w-full rounded-[14px] border border-[color:var(--glass-border-soft)]',
  'bg-[color:var(--glass-bg)] px-3 text-sm text-[color:var(--color-primary)]',
  'shadow-[var(--shadow-light)] backdrop-blur-md',
  'focus-visible:border-accent/40 focus-visible:ring-accent/30 focus-visible:ring-2 focus-visible:outline-none',
)

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null
  return <p className="text-sm text-red-500">{errors[0]}</p>
}

export function CareerApplicationForm({ careerId, jobTitle }: CareerApplicationFormProps) {
  const [state, action, pending] = useActionState(
    async (previousState: CareerFormState, formData: FormData) => {
      const result = await submitCareerApplication(previousState, formData)

      if (result.ok) {
        posthog.capture('career_application_submitted', {
          career_id: careerId,
        })
      }

      return result
    },
    initialState,
  )

  if (state.ok) {
    return (
      <div className="space-y-4 rounded-[24px] border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/10 p-6">
        <p className="text-sm leading-relaxed text-[color:var(--color-primary)]">{state.message}</p>
        {state.applicationId ? (
          <p className="font-display text-lg font-semibold text-[color:var(--color-accent)]">
            Application ID: {state.applicationId}
          </p>
        ) : null}
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/careers">Back to careers</Link>
        </Button>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-8" noValidate>
      <input type="hidden" name="careerId" value={careerId} />
      <p className="text-sm text-[color:var(--color-secondary)]">
        Applying for{' '}
        <span className="font-semibold text-[color:var(--color-primary)]">{jobTitle}</span>
      </p>

      <fieldset className="space-y-4">
        <legend className="font-display text-base font-semibold text-[color:var(--color-primary)]">
          Personal information
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name *</Label>
            <Input id="firstName" name="firstName" required autoComplete="given-name" />
            <FieldError errors={state.fieldErrors?.firstName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name *</Label>
            <Input id="lastName" name="lastName" required autoComplete="family-name" />
            <FieldError errors={state.fieldErrors?.lastName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address *</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
            <FieldError errors={state.fieldErrors?.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile number *</Label>
            <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
            <FieldError errors={state.fieldErrors?.phone} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input id="country" name="country" required autoComplete="country-name" />
            <FieldError errors={state.fieldErrors?.country} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Current city *</Label>
            <Input id="city" name="city" required autoComplete="address-level2" />
            <FieldError errors={state.fieldErrors?.city} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-base font-semibold text-[color:var(--color-primary)]">
          Professional information
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn profile</Label>
            <Input id="linkedin" name="linkedin" placeholder="https://" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio / GitHub</Label>
            <Input id="portfolio" name="portfolio" placeholder="https://" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentCompany">Current company</Label>
            <Input id="currentCompany" name="currentCompany" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentDesignation">Current designation</Label>
            <Input id="currentDesignation" name="currentDesignation" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalExperience">Total experience</Label>
            <Input id="totalExperience" name="totalExperience" placeholder="e.g. 4 years" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relevantExperience">Relevant experience</Label>
            <Input id="relevantExperience" name="relevantExperience" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentSalary">Current salary</Label>
            <Input id="currentSalary" name="currentSalary" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedSalary">Expected salary</Label>
            <Input id="expectedSalary" name="expectedSalary" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="noticePeriod">Notice period</Label>
            <Input id="noticePeriod" name="noticePeriod" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workAuthorization">Work authorization / visa status</Label>
            <Input id="workAuthorization" name="workAuthorization" />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-base font-semibold text-[color:var(--color-primary)]">
          Education
        </legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="highestQualification">Highest qualification</Label>
            <Input id="highestQualification" name="highestQualification" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Input id="university" name="university" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="graduationYear">Graduation year</Label>
            <Input id="graduationYear" name="graduationYear" />
          </div>
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input id="skills" name="skills" placeholder="Python, Machine Learning, SQL, Azure" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume">Resume (PDF, DOC, DOCX · max 10 MB) *</Label>
        <Input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          required
        />
        <FieldError errors={state.fieldErrors?.resume} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover letter</Label>
        <Textarea id="coverLetter" name="coverLetter" rows={4} />
      </div>

      <fieldset className="space-y-4">
        <legend className="font-display text-base font-semibold text-[color:var(--color-primary)]">
          Additional questions
        </legend>
        <div className="space-y-2">
          <Label htmlFor="whyJoin">Why do you want to join XELARVIS?</Label>
          <Textarea id="whyJoin" name="whyJoin" rows={3} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="willingToRelocate">Willing to relocate?</Label>
            <select
              id="willingToRelocate"
              name="willingToRelocate"
              className={selectClass}
              defaultValue=""
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="maybe">Maybe</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="earliestJoinDate">Earliest joining date</Label>
            <Input id="earliestJoinDate" name="earliestJoinDate" placeholder="e.g. 30 days" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="healthcareExperience">Healthcare / clinical experience?</Label>
            <select
              id="healthcareExperience"
              name="healthcareExperience"
              className={selectClass}
              defaultValue=""
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </fieldset>

      <label className="flex items-start gap-3 text-sm text-[color:var(--color-secondary)]">
        <input type="checkbox" name="consent" className="mt-1 accent-teal-500" required />
        <span>
          I agree to the processing of my application data according to the{' '}
          <Link
            href="/privacy-policy"
            className="font-semibold text-[color:var(--color-accent)] hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      <FieldError errors={state.fieldErrors?.consent} />

      {state.message ? (
        <p className="text-sm text-red-500" role="status">
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[color:var(--color-accent)] px-6 font-semibold text-white shadow-[var(--shadow-hover)] hover:bg-[color:var(--color-accent-hover)] sm:w-auto"
      >
        {pending ? 'Submitting…' : 'Submit Application'}
      </Button>
    </form>
  )
}
