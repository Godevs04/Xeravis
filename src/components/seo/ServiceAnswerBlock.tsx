import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

type ServiceAnswerBlockProps = {
  title: string
  summary: string
  whoFor?: string
  whyChoose?: string
  howDeliver?: string
  industries?: string
  outcomes?: string
}

/**
 * Answer-first GEO/AEO block. Uses existing typography/section patterns only.
 */
export function ServiceAnswerBlock({
  title,
  summary,
  whoFor = 'Healthcare executives, CTOs, CIOs, Healthcare IT leaders, enterprise buyers, and research organizations',
  whyChoose = 'Xelarvis combines data science, AI, and healthcare expertise for production systems operators can trust.',
  howDeliver = 'Discovery, solution architecture, implementation, validation, cloud deployment, and ongoing optimization.',
  industries = 'Healthcare, life sciences, finance, manufacturing, and regulated enterprises',
  outcomes = 'Faster decision cycles, audit-ready workflows, scalable platforms, and measurable operational lift',
}: ServiceAnswerBlockProps) {
  return (
    <Section>
      <Container className="max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Quick answer</h2>
        <p className="mt-4 text-base leading-relaxed text-[color:var(--color-secondary)] sm:text-lg">
          <strong className="text-[color:var(--color-primary)]">{title}.</strong> {summary}
        </p>
        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          {[
            { q: 'Who is this for?', a: whoFor },
            { q: 'Why choose Xelarvis?', a: whyChoose },
            { q: 'How do we deliver?', a: howDeliver },
            { q: 'Industries served', a: industries },
            { q: 'Expected outcomes', a: outcomes },
            {
              q: 'What technologies are involved?',
              a: 'AI/ML stacks, clinical data standards where applicable, cloud platforms, data pipelines, analytics, and secure enterprise software.',
            },
          ].map((item) => (
            <div key={item.q}>
              <dt className="text-sm font-semibold text-[color:var(--color-primary)]">{item.q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-[color:var(--color-secondary)]">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  )
}
