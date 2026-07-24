import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'
import { listDocs } from '@/lib/cms'

type TechDoc = {
  id: string
  title: string
  category: string
  description?: string | null
}

const FALLBACK: TechDoc[] = [
  { id: '1', title: 'Next.js', category: 'frontend', description: 'App Router, RSC, edge-ready delivery.' },
  { id: '2', title: 'Node.js', category: 'backend', description: 'APIs and services with TypeScript.' },
  { id: '3', title: 'AWS / Azure / GCP', category: 'cloud', description: 'Secure, scalable cloud foundations.' },
  { id: '4', title: 'CI/CD & IaC', category: 'devops', description: 'Reliable releases and observability.' },
  { id: '5', title: 'Applied AI', category: 'ai', description: 'LLM systems grounded in real workflows.' },
  { id: '6', title: 'PostgreSQL / MongoDB', category: 'database', description: 'Data models that endure.' },
  { id: '7', title: 'Payload CMS', category: 'cms', description: 'Editor-first content platforms.' },
]

type TechnologyGridProps = {
  heading: string
  subheading?: string | null
}

export async function TechnologyGrid({ heading, subheading }: TechnologyGridProps) {
  const docs = await listDocs<TechDoc>('technologies', { limit: 12, sort: 'order' })
  const items = docs.length ? docs : FALLBACK

  const categories = [...new Set(items.map((i) => i.category))]

  return (
    <Section>
      <Container>
        <AnimateIn className="max-w-2xl">
          <h2 className="text-balance">{heading}</h2>
          {subheading ? <p className="mt-4 text-lg text-secondary">{subheading}</p> : null}
        </AnimateIn>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <AnimateIn key={item.id} delay={index * 0.03}>
              <article className="h-full rounded-[var(--radius-card)] border border-border bg-background p-6 shadow-[var(--shadow-medium)] transition-shadow duration-300 hover:shadow-[var(--shadow-hover)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">{item.category}</p>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                {item.description ? <p className="mt-3 text-sm text-secondary">{item.description}</p> : null}
              </article>
            </AnimateIn>
          ))}
        </div>
        {categories.length ? (
          <div className="mt-10">
            <Button asChild variant="outline">
              <Link href="/solutions">Explore solutions</Link>
            </Button>
          </div>
        ) : null}
      </Container>
    </Section>
  )
}
