import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

const DEFAULT_ITEMS = [
  {
    title: 'Enterprise Support',
    description: 'Dedicated engagement models with clear ownership and escalation paths.',
  },
  {
    title: 'Experienced Team',
    description: 'Senior engineers and architects who ship production systems.',
  },
  {
    title: 'Modern Technologies',
    description: 'Cloud-native stacks, secure defaults, and maintainable architecture.',
  },
  {
    title: 'Scalable Solutions',
    description: 'Design for growth without rewriting foundations every year.',
  },
  {
    title: 'Transparent Process',
    description: 'Visible milestones, measurable outcomes, and honest trade-offs.',
  },
  {
    title: 'Long-term Partnership',
    description: 'We stay for support, iteration, and continuous improvement.',
  },
]

type WhyChooseUsProps = {
  heading: string
  subheading?: string | null
  items?: { title: string; description: string }[] | null
}

export function WhyChooseUs({ heading, subheading, items }: WhyChooseUsProps) {
  const list = items?.length ? items : DEFAULT_ITEMS

  return (
    <Section surface>
      <Container>
        <SectionHeader
          eyebrow="Why Xelarvis"
          title={heading}
          description={subheading}
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/about">Learn more about us</Link>
            </Button>
          }
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((item, index) => (
            <AnimateIn key={item.title} delay={index * 0.04}>
              <SpotlightCard className="h-full p-6 sm:p-7">
                <p className="text-accent font-mono text-xs font-bold tracking-[0.16em]">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display text-primary mt-4 text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-secondary mt-3 text-sm leading-relaxed">{item.description}</p>
              </SpotlightCard>
            </AnimateIn>
          ))}
        </div>
      </Container>
    </Section>
  )
}
