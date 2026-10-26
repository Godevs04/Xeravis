'use client'

import Link from 'next/link'
import { useActionState, useId, useMemo, useState } from 'react'

import { submitAssessment, type AssessmentFormState } from '@/actions/assessment'
import { BookCallButton } from '@/components/booking/BookCallButton'
import { AttributionFields } from '@/components/forms/AttributionFields'
import { Turnstile } from '@/components/forms/Turnstile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DIMENSIONS, QUESTIONS, scoreAssessment, type Answers } from '@/lib/ai-readiness'
import { track } from '@/lib/analytics-client'
import { submitKeepingValues } from '@/lib/form-submit'
import { cn } from '@/lib/utils'

const initialState: AssessmentFormState = { ok: false, message: '' }

function ReportForm({ answers }: { answers: Answers }) {
  const emailId = useId()
  const nameId = useId()
  const companyId = useId()
  const [state, action, pending] = useActionState(submitAssessment, initialState)

  if (state.ok) {
    return (
      <p role="status" className="text-success text-sm font-medium">
        {state.message}
      </p>
    )
  }

  return (
    <form action={action} onSubmit={submitKeepingValues(action)} className="space-y-4" noValidate>
      <input type="hidden" name="answers" value={JSON.stringify(answers)} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <AttributionFields />
      <Turnstile action="assessment" resetKey={state} />
      <div className="space-y-2">
        <Label htmlFor={emailId}>Work email</Label>
        <Input id={emailId} name="email" type="email" autoComplete="email" required />
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
      <Button type="submit" className="rounded-full" loading={pending} disabled={pending}>
        Email me the report
      </Button>
      {state.message ? (
        <p role="status" className="text-danger text-sm">
          {state.message}
        </p>
      ) : null}
    </form>
  )
}

export function AiReadinessAssessment() {
  const [answers, setAnswers] = useState<Answers>({})
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const done = step >= QUESTIONS.length
  const result = useMemo(() => (done ? scoreAssessment(answers) : null), [done, answers])
  const question = QUESTIONS[Math.min(step, QUESTIONS.length - 1)]

  function choose(value: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  function next() {
    const nextStep = step + 1
    setDirection(1)
    setStep(nextStep)
    if (nextStep === QUESTIONS.length) track('assessment_completed')
  }

  if (result) {
    return (
      <div className="space-y-10">
        <div className="rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-6 shadow-[var(--shadow-medium)] sm:p-8">
          <p className="text-accent text-[11px] font-bold tracking-[0.2em] uppercase">
            Your result
          </p>
          <p className="font-display text-primary mt-3 text-4xl font-bold tracking-tight">
            {result.overall}% <span className="text-2xl">· {result.level.label}</span>
          </p>
          <p className="text-secondary mt-3 max-w-2xl">{result.level.summary}</p>
          <ul className="mt-8 space-y-4">
            {result.dimensions.map((d) => (
              <li key={d.key}>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-primary">{d.label}</span>
                  <span className="text-secondary">{d.score}%</span>
                </div>
                <div
                  className="mt-2 h-2 overflow-hidden rounded-full bg-[color:var(--color-hover)]"
                  role="progressbar"
                  aria-label={d.label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={d.score}
                >
                  <div
                    className="h-full rounded-full bg-[color:var(--color-accent)]"
                    style={{ width: `${d.score}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-primary text-xl font-semibold">Where to focus next</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {result.focus.map((key) => (
              <li
                key={key}
                className="rounded-[24px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-5"
              >
                <p className="text-primary font-semibold">{DIMENSIONS[key].label}</p>
                <p className="text-secondary mt-2 text-sm">{DIMENSIONS[key].advice}</p>
                <Link
                  href={`/services/${DIMENSIONS[key].serviceSlug}`}
                  className="text-accent mt-3 inline-block text-sm font-semibold hover:underline"
                >
                  How we help →
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-6 sm:p-8">
          <h2 className="font-display text-primary text-xl font-semibold">Get the full report</h2>
          <p className="text-secondary mt-2 mb-6 text-sm">
            We&apos;ll email your scores and recommendations so you can share them with your team.
          </p>
          <ReportForm answers={answers} />
        </div>

        <div className="flex flex-wrap gap-3">
          <BookCallButton label="Discuss your results" variant="primary" className="rounded-full" />
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setAnswers({})
              setStep(0)
            }}
          >
            Start again
          </Button>
        </div>
      </div>
    )
  }

  const selected = answers[question.id]

  return (
    <div className="rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-6 shadow-[var(--shadow-medium)] sm:p-8">
      <div className="text-muted flex items-center justify-between text-xs font-semibold">
        <span>
          Question {step + 1} of {QUESTIONS.length}
        </span>
        <span>{DIMENSIONS[question.dimension].label}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[color:var(--color-hover)]">
        <div
          className="h-full rounded-full bg-[color:var(--color-accent)] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
        />
      </div>
      <fieldset
        key={question.id}
        className={cn('mt-6', direction > 0 ? 'step-in-next' : 'step-in-prev')}
      >
        <legend className="font-display text-primary text-xl font-semibold">
          {question.prompt}
        </legend>
        <div className="mt-5 grid gap-3">
          {question.options.map((option, value) => (
            <label
              key={option}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors',
                selected === value
                  ? 'border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)]'
                  : 'border-[color:var(--glass-border-soft)] hover:border-[color:var(--color-accent)]',
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={value}
                checked={selected === value}
                onChange={() => choose(value)}
                className="mt-0.5 accent-[color:var(--color-accent)]"
              />
              <span className="text-primary">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 flex justify-between gap-3">
        <Button
          variant="ghost"
          disabled={step === 0}
          onClick={() => {
            setDirection(-1)
            setStep((s) => Math.max(0, s - 1))
          }}
        >
          Back
        </Button>
        <Button className="rounded-full" disabled={selected === undefined} onClick={next}>
          {step === QUESTIONS.length - 1 ? 'See my results' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
