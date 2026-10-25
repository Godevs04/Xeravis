import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'

export function AssessmentPromo() {
  return (
    <Section surface>
      <Container>
        <div className="flex flex-col gap-6 rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-6 shadow-[var(--shadow-medium)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[color:var(--color-accent)] uppercase">
              Free assessment
            </p>
            <h2 className="text-primary mt-2 text-2xl font-bold tracking-tight">
              Not sure where to start?
            </h2>
            <p className="text-secondary mt-2 max-w-xl text-sm">
              Score your AI readiness across data, platform, skills and governance in two minutes,
              and get recommended next steps.
            </p>
          </div>
          <Button asChild variant="primary" className="shrink-0 rounded-full">
            <Link href="/ai-readiness">Take the assessment</Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
