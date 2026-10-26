'use client'

import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { track } from '@/lib/analytics-client'

import { submitCareerApplication, type CareerFormState } from '@/actions/career'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AttributionFields } from '@/components/forms/AttributionFields'
import { Turnstile } from '@/components/forms/Turnstile'
import { submitKeepingValues } from '@/lib/form-submit'
import { cn } from '@/lib/utils'

const initialState: CareerFormState = { ok: false, message: '' }

const HR_EMAIL = 'hr@xelarvis.in'

const STEPS = [
  {
    title: 'About you',
    fields: ['firstName', 'lastName', 'email', 'phone', 'country', 'city'],
  },
  {
    title: 'Experience',
    fields: [
      'linkedin',
      'portfolio',
      'totalExperience',
      'relevantExperience',
      'currentCompany',
      'currentDesignation',
      'currentSalary',
      'expectedSalary',
      'noticePeriod',
      'workAuthorization',
    ],
  },
  {
    title: 'Education & skills',
    fields: ['highestQualification', 'university', 'graduationYear', 'skills'],
  },
  {
    title: 'Resume & submit',
    fields: [
      'resume',
      'coverLetter',
      'whyJoin',
      'willingToRelocate',
      'healthcareExperience',
      'earliestJoinDate',
      'consent',
    ],
  },
] as const

const LAST_STEP = STEPS.length - 1

type FieldControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const selectClass = cn(
  'flex h-11 w-full rounded-[14px] border border-[color:var(--glass-border-soft)]',
  'bg-[color:var(--glass-bg)] px-3 text-sm text-[color:var(--color-primary)]',
  'shadow-[var(--shadow-light)] backdrop-blur-md',
  'focus-visible:border-accent/40 focus-visible:ring-accent/30 focus-visible:ring-2 focus-visible:outline-none',
)

const fileClass = cn(
  'h-auto cursor-pointer py-2.5 text-[color:var(--color-secondary)]',
  'file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:px-3 file:py-1.5',
  'file:bg-[color:var(--color-accent-soft)] file:text-xs file:font-semibold file:text-[color:var(--color-accent)]',
)

function validationMessage(el: FieldControl) {
  const { validity } = el
  if (validity.valueMissing) {
    if (el.type === 'checkbox') return 'Please accept to continue'
    if (el.type === 'file') return 'Please attach your resume'
    return 'This field is required'
  }
  if (validity.typeMismatch) {
    return el.type === 'email' ? 'Enter a valid email address' : 'Enter a full URL (https://…)'
  }
  if (validity.tooShort) return 'Please enter a valid number'
  return el.validationMessage
}

function stepOfField(name: string) {
  return STEPS.findIndex((step) => (step.fields as readonly string[]).includes(name))
}

function Field({
  id,
  label,
  required,
  error,
  className,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string | null
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      <Label htmlFor={id} className="leading-snug">
        {label}
        {required ? <span className="text-[color:var(--color-accent)]"> *</span> : null}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function CareerApplicationForm({
  careerId,
  jobTitle,
}: {
  careerId: string
  jobTitle: string
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const stepRefs = useRef<Array<HTMLDivElement | null>>([])
  const focusPending = useRef(false)
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [furthest, setFurthest] = useState(0)
  /** Client-side messages; `null` hides a server error the applicant has since edited. */
  const [clientErrors, setClientErrors] = useState<Record<string, string | null>>({})

  const [state, action, pending] = useActionState(
    async (previousState: CareerFormState, formData: FormData) => {
      const result = await submitCareerApplication(previousState, formData)
      if (result.ok) track('career_application_submitted', { career_id: careerId })
      return result
    },
    initialState,
  )

  const [seenState, setSeenState] = useState(state)
  if (seenState !== state) {
    setSeenState(state)
    setClientErrors({})
    const errorStep = Math.min(
      ...Object.keys(state.fieldErrors ?? {})
        .map(stepOfField)
        .filter((index) => index >= 0),
    )
    if (Number.isFinite(errorStep) && errorStep !== step) {
      setDirection(errorStep < step ? -1 : 1)
      setStep(errorStep)
    }
  }

  useEffect(() => {
    if (!focusPending.current) return
    focusPending.current = false
    const form = formRef.current
    if (form && form.getBoundingClientRect().top < 0) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      form.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' })
    }
    stepRefs.current[step]
      ?.querySelector<FieldControl>('input:not([type=hidden]), select, textarea')
      ?.focus({ preventScroll: true })
  }, [step])

  function errorFor(name: string) {
    if (name in clientErrors) return clientErrors[name]
    return state.fieldErrors?.[name]?.[0] ?? null
  }

  function invalidProps(name: string) {
    const error = errorFor(name)
    return error ? { 'aria-invalid': true, 'aria-describedby': `${name}-error` } : {}
  }

  function validateStep(index: number) {
    const controls = Array.from(
      stepRefs.current[index]?.querySelectorAll<FieldControl>(
        'input[name], select[name], textarea[name]',
      ) ?? [],
    )
    const invalid = controls.filter((el) => !el.checkValidity())
    if (!invalid.length) return true
    setClientErrors((prev) => ({
      ...prev,
      ...Object.fromEntries(invalid.map((el) => [el.name, validationMessage(el)])),
    }))
    invalid[0].focus()
    return false
  }

  function goTo(index: number) {
    if (index === step) return
    if (index > step && !validateStep(step)) return
    setDirection(index > step ? 1 : -1)
    setStep(index)
    setFurthest((value) => Math.max(value, index))
    focusPending.current = true
  }

  function clearError(event: FormEvent<HTMLFormElement>) {
    const { name } = event.target as FieldControl
    if (name && errorFor(name)) setClientErrors((prev) => ({ ...prev, [name]: null }))
  }

  const submit = submitKeepingValues(action)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (step < LAST_STEP) {
      event.preventDefault()
      goTo(step + 1)
      return
    }
    if (!validateStep(LAST_STEP)) {
      event.preventDefault()
      return
    }
    submit(event)
  }

  if (state.ok) {
    return (
      <div className="step-in-next space-y-4 rounded-[24px] border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/10 p-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-[color:var(--color-on-accent)]">
          <Check className="h-5 w-5" aria-hidden />
        </span>
        <p className="font-display text-lg font-semibold text-[color:var(--color-primary)]">
          Application received
        </p>
        <p className="text-sm leading-relaxed text-[color:var(--color-secondary)]">
          {state.message}
        </p>
        {state.applicationId ? (
          <p className="text-sm text-[color:var(--color-primary)]">
            Reference:{' '}
            <span className="font-display font-semibold text-[color:var(--color-accent)]">
              {state.applicationId}
            </span>
          </p>
        ) : null}
        <p className="text-xs text-[color:var(--color-muted)]">
          Save this reference ID for your records. Questions? Email{' '}
          <a href={`mailto:${HR_EMAIL}`} className="text-[color:var(--color-accent)] underline">
            {HR_EMAIL}
          </a>
          .
        </p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/careers#open-roles">View other open roles</Link>
        </Button>
      </div>
    )
  }

  const stepClass = (index: number) =>
    cn('@container', index === step ? (direction > 0 ? 'step-in-next' : 'step-in-prev') : 'hidden')

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={handleSubmit}
      onInput={clearError}
      onChange={clearError}
      className="scroll-mt-28 space-y-6"
      noValidate
    >
      <input type="hidden" name="careerId" value={careerId} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <AttributionFields />
      <Turnstile action="career" resetKey={state} />
      <p className="text-sm text-[color:var(--color-secondary)]">
        Applying for{' '}
        <span className="font-semibold text-[color:var(--color-primary)]">{jobTitle}</span>
      </p>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-3" aria-live="polite">
          <p className="font-display text-base font-semibold text-[color:var(--color-primary)]">
            {STEPS[step].title}
          </p>
          <p className="shrink-0 text-xs font-semibold text-[color:var(--color-muted)]">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>
        <ol className="grid grid-cols-4 gap-1.5">
          {STEPS.map((item, index) => {
            const reachable = index <= furthest
            return (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  disabled={!reachable}
                  aria-label={`Step ${index + 1}: ${item.title}`}
                  aria-current={index === step ? 'step' : undefined}
                  className="group block w-full py-1.5 disabled:cursor-default"
                >
                  <span className="block h-1.5 overflow-hidden rounded-full bg-[color:var(--color-hover)]">
                    <span
                      className={cn(
                        'block h-full rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-cyan)]',
                        'transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        reachable && index !== step && 'group-hover:opacity-80',
                      )}
                      style={{ width: index <= step ? '100%' : '0%' }}
                    />
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div
        ref={(el) => {
          stepRefs.current[0] = el
        }}
        className={stepClass(0)}
      >
        <div className="grid gap-4 @xs:grid-cols-2">
          <Field id="firstName" label="First name" required error={errorFor('firstName')}>
            <Input
              id="firstName"
              name="firstName"
              required
              autoComplete="given-name"
              {...invalidProps('firstName')}
            />
          </Field>
          <Field id="lastName" label="Last name" required error={errorFor('lastName')}>
            <Input
              id="lastName"
              name="lastName"
              required
              autoComplete="family-name"
              {...invalidProps('lastName')}
            />
          </Field>
          <Field
            id="email"
            label="Email address"
            required
            error={errorFor('email')}
            className="@xs:col-span-2"
          >
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              {...invalidProps('email')}
            />
          </Field>
          <Field
            id="phone"
            label="Mobile number"
            required
            error={errorFor('phone')}
            className="@xs:col-span-2"
          >
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              minLength={7}
              autoComplete="tel"
              {...invalidProps('phone')}
            />
          </Field>
          <Field id="country" label="Country" required error={errorFor('country')}>
            <Input
              id="country"
              name="country"
              required
              autoComplete="country-name"
              {...invalidProps('country')}
            />
          </Field>
          <Field id="city" label="Current city" required error={errorFor('city')}>
            <Input
              id="city"
              name="city"
              required
              autoComplete="address-level2"
              {...invalidProps('city')}
            />
          </Field>
        </div>
      </div>

      <div
        ref={(el) => {
          stepRefs.current[1] = el
        }}
        className={stepClass(1)}
      >
        <div className="grid gap-4 @xs:grid-cols-2">
          <Field
            id="linkedin"
            label="LinkedIn profile"
            error={errorFor('linkedin')}
            className="@xs:col-span-2"
          >
            <Input
              id="linkedin"
              name="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/…"
              {...invalidProps('linkedin')}
            />
          </Field>
          <Field
            id="portfolio"
            label="GitHub / Portfolio"
            error={errorFor('portfolio')}
            className="@xs:col-span-2"
          >
            <Input
              id="portfolio"
              name="portfolio"
              type="url"
              placeholder="https://github.com/…"
              {...invalidProps('portfolio')}
            />
          </Field>
          <Field
            id="totalExperience"
            label="Total experience"
            required
            error={errorFor('totalExperience')}
          >
            <Input
              id="totalExperience"
              name="totalExperience"
              required
              placeholder="e.g. 3 years"
              {...invalidProps('totalExperience')}
            />
          </Field>
          <Field id="relevantExperience" label="Relevant experience">
            <Input
              id="relevantExperience"
              name="relevantExperience"
              placeholder="e.g. 2 years ML"
            />
          </Field>
          <Field id="currentCompany" label="Current company">
            <Input id="currentCompany" name="currentCompany" autoComplete="organization" />
          </Field>
          <Field id="currentDesignation" label="Designation">
            <Input
              id="currentDesignation"
              name="currentDesignation"
              autoComplete="organization-title"
            />
          </Field>
          <Field id="currentSalary" label="Current salary">
            <Input id="currentSalary" name="currentSalary" />
          </Field>
          <Field id="expectedSalary" label="Expected salary">
            <Input id="expectedSalary" name="expectedSalary" />
          </Field>
          <Field id="noticePeriod" label="Notice period">
            <Input id="noticePeriod" name="noticePeriod" placeholder="e.g. 30 days" />
          </Field>
          <Field id="workAuthorization" label="Work authorization">
            <Input id="workAuthorization" name="workAuthorization" placeholder="e.g. Citizen" />
          </Field>
        </div>
      </div>

      <div
        ref={(el) => {
          stepRefs.current[2] = el
        }}
        className={stepClass(2)}
      >
        <div className="grid gap-4 @xs:grid-cols-2">
          <Field id="highestQualification" label="Highest qualification" className="@xs:col-span-2">
            <Input
              id="highestQualification"
              name="highestQualification"
              placeholder="e.g. M.Sc. Data Science"
            />
          </Field>
          <Field id="university" label="University">
            <Input id="university" name="university" />
          </Field>
          <Field id="graduationYear" label="Graduation year">
            <Input
              id="graduationYear"
              name="graduationYear"
              inputMode="numeric"
              placeholder="e.g. 2022"
            />
          </Field>
          <Field id="skills" label="Skills (comma-separated)" className="@xs:col-span-2">
            <Input id="skills" name="skills" placeholder="Python, Machine Learning, SQL, Azure" />
          </Field>
        </div>
      </div>

      <div
        ref={(el) => {
          stepRefs.current[3] = el
        }}
        className={stepClass(3)}
      >
        <div className="grid gap-4 @xs:grid-cols-2">
          <Field
            id="resume"
            label="Resume (PDF, DOC, DOCX · max 10 MB)"
            required
            error={errorFor('resume')}
            className="@xs:col-span-2"
          >
            <Input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              required
              className={fileClass}
              {...invalidProps('resume')}
            />
          </Field>
          <Field id="coverLetter" label="Cover letter" className="@xs:col-span-2">
            <Textarea id="coverLetter" name="coverLetter" rows={4} />
          </Field>
          <Field id="whyJoin" label="Why do you want to join XELARVIS?" className="@xs:col-span-2">
            <Textarea id="whyJoin" name="whyJoin" rows={3} />
          </Field>
          <Field id="willingToRelocate" label="Willing to relocate?">
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
          </Field>
          <Field id="healthcareExperience" label="Healthcare experience?">
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
          </Field>
          <Field id="earliestJoinDate" label="Earliest joining date" className="@xs:col-span-2">
            <Input id="earliestJoinDate" name="earliestJoinDate" placeholder="e.g. 30 days" />
          </Field>
          <div className="space-y-2 @xs:col-span-2">
            <label className="flex items-start gap-3 text-sm text-[color:var(--color-secondary)]">
              <input
                type="checkbox"
                name="consent"
                className="mt-1 accent-teal-500"
                required
                {...invalidProps('consent')}
              />
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
            {errorFor('consent') ? (
              <p id="consent-error" className="text-xs font-medium text-red-500">
                {errorFor('consent')}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {state.message ? (
        <p className="text-sm text-red-500" role="status">
          {state.message}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-[color:var(--glass-border-soft)] pt-5">
        <Button
          type="button"
          variant="ghost"
          onClick={() => goTo(step - 1)}
          className={cn('rounded-full px-4', step === 0 && 'invisible')}
          tabIndex={step === 0 ? -1 : undefined}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Button>
        {step < LAST_STEP ? (
          <Button
            key="next"
            type="button"
            onClick={() => goTo(step + 1)}
            className="group rounded-full px-6"
          >
            Next: {STEPS[step + 1].title}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Button>
        ) : (
          <Button
            key="submit"
            type="submit"
            disabled={pending}
            loading={pending}
            className="rounded-full px-6"
          >
            {pending ? 'Submitting…' : 'Submit application'}
          </Button>
        )}
      </div>
    </form>
  )
}
