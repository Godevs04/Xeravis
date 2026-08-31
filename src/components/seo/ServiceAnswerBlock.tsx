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
  whoFor = 'CTOs, CIOs, data and analytics leaders, enterprise buyers—and teams in specialized domains including Healthcare & Life Sciences',
  whyChoose = 'Xelarvis combines Artificial Intelligence, Data Science, and IT Consulting for production systems operators can trust.',
  howDeliver = 'Discover → Strategize → Design → Build → Deploy → Optimize',
  industries = 'Technology, banking & financial services, manufacturing, retail, logistics, and Healthcare & Life Sciences as a specialty',
  outcomes = 'Governed delivery, clearer decisions, scalable platforms, and measurable operational outcomes',
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
            { q: 'Where we apply this', a: industries },
            { q: 'Expected outcomes', a: outcomes },
            {
              q: 'What technologies are involved?',
              a: 'AI/ML stacks, data platforms, cloud, DevOps, analytics, and secure enterprise software—plus clinical standards only where Healthcare specialty programs require them.',
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
