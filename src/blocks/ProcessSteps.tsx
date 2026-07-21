import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'

type Step = { title: string; description: string }

type ProcessStepsProps = {
  heading: string
  steps?: Step[] | null
}

export function ProcessSteps({ heading, steps }: ProcessStepsProps) {
  const items = steps ?? []

  return (
    <Section surface>
      <Container>
        <AnimateIn className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
        </AnimateIn>
        {items.length === 0 ? (
          <p className="mt-8 text-secondary">Process steps will appear here when configured.</p>
        ) : (
          <ol className="mt-12 space-y-0">
            {items.map((step, index) => (
              <AnimateIn key={step.title} delay={index * 0.05}>
                <li className="grid gap-4 border-t border-border py-8 lg:grid-cols-[4rem_1fr] lg:gap-8">
                  <span className="text-sm font-semibold text-muted">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-primary">{step.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary">{step.description}</p>
                  </div>
                </li>
              </AnimateIn>
            ))}
          </ol>
        )}
      </Container>
    </Section>
  )
}
