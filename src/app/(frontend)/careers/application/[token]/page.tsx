import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { CANDIDATE_STAGES, getApplicationStatus } from '@/lib/application-status'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Application status',
  description: 'Check the status of your Xelarvis job application.',
  robots: { index: false, follow: false },
}

type Props = { params: Promise<{ token: string }> }

export default async function ApplicationStatusPage({ params }: Props) {
  const { token } = await params
  const status = await getApplicationStatus(decodeURIComponent(token)).catch(() => null)

  if (!status) {
    return (
      <StatusMessage
        eyebrow="Application status"
        title="We couldn't find this application."
        description="The link may be incomplete. Use the link from your confirmation email, or contact hr@xelarvis.in with your reference ID."
        primary={{ href: '/careers', label: 'View open roles' }}
      />
    )
  }

  const current = CANDIDATE_STAGES.findIndex((s) => s.key === status.stage)

  return (
    <Section>
      <Container className="max-w-2xl py-12">
        <p className="text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-accent)] uppercase">
          Application status
        </p>
        <h1 className="font-display text-primary mt-3 text-3xl font-bold tracking-tight">
          {status.jobTitle}
        </h1>
        <p className="text-secondary mt-2 text-sm">
          Reference {status.applicationId} · submitted{' '}
          {new Date(status.submittedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>

        <ol className="mt-10 space-y-4">
          {CANDIDATE_STAGES.map((stage, index) => {
            const done = index < current
            const active = index === current
            return (
              <li key={stage.key} className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                    done || active
                      ? 'border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-[color:var(--color-on-accent)]'
                      : 'text-muted border-[color:var(--glass-border-soft)]',
                  )}
                  aria-hidden
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    'text-sm',
                    active ? 'text-primary font-semibold' : 'text-secondary',
                  )}
                >
                  {stage.label}
                  {active ? <span className="sr-only"> (current stage)</span> : null}
                </span>
              </li>
            )
          })}
        </ol>

        <p className="text-primary mt-8 rounded-2xl border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-5 text-sm">
          {status.message}
        </p>
        <p className="text-muted mt-6 text-xs">
          Questions? Email{' '}
          <a href="mailto:hr@xelarvis.in" className="text-accent underline">
            hr@xelarvis.in
          </a>{' '}
          with your reference ID.
        </p>
      </Container>
    </Section>
  )
}
