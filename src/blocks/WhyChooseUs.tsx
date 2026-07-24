import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'

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
        <AnimateIn className="max-w-2xl">
          <h2 className="text-balance">{heading}</h2>
          {subheading ? <p className="mt-4 text-lg text-secondary">{subheading}</p> : null}
        </AnimateIn>
        <ol className="mt-14 space-y-0 border-t border-border">
          {list.map((item, index) => (
            <AnimateIn key={item.title} delay={index * 0.04}>
              <li className="grid gap-4 border-b border-border py-8 md:grid-cols-12 md:gap-8">
                <span className="font-mono text-sm text-muted md:col-span-2">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-semibold md:col-span-3">{item.title}</h3>
                <p className="text-secondary md:col-span-7">{item.description}</p>
              </li>
            </AnimateIn>
          ))}
        </ol>
        <div className="mt-10">
          <Button asChild variant="ghost">
            <Link href="/about">Learn more about us</Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
