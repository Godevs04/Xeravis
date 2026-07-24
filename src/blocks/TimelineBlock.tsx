import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Heading } from '@/components/ui/heading'
import { Timeline, type TimelineItem } from '@/components/ui/timeline'

type TimelineBlockProps = {
  heading: string
  subheading?: string | null
  items?: TimelineItem[] | null
}

export function TimelineBlock({ heading, subheading, items }: TimelineBlockProps) {
  return (
    <Section>
      <Container>
        <div className="mb-10 max-w-2xl">
          <Heading level="h2">{heading}</Heading>
          {subheading ? <p className="text-secondary mt-3">{subheading}</p> : null}
        </div>
        <Timeline items={items ?? []} />
      </Container>
    </Section>
  )
}
