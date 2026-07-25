import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import type { TimelineItem } from '@/components/ui/timeline'

type TimelineBlockProps = {
  heading: string
  subheading?: string | null
  items?: TimelineItem[] | null
}

export function TimelineBlock({ heading, subheading, items }: TimelineBlockProps) {
  const list = items ?? []

  return (
    <Section>
      <Container>
        <SectionHeader eyebrow="Journey" title={heading} description={subheading || undefined} />
        {list.length ? (
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((item, i) => (
              <li key={`${item.date}-${item.title}`} className="list-none">
                <AnimateIn delay={0.05 * i}>
                  <SpotlightCard className="h-full p-5">
                    <p className="font-display text-accent text-lg font-bold tracking-[-0.02em]">
                      {item.date}
                    </p>
                    <h3 className="text-primary mt-3 text-base font-semibold">{item.title}</h3>
                    {item.description ? (
                      <p className="text-secondary mt-2 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    ) : null}
                  </SpotlightCard>
                </AnimateIn>
              </li>
            ))}
          </ol>
        ) : null}
      </Container>
    </Section>
  )
}
