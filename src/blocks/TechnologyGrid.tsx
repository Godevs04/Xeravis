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
  {
    id: '1',
    title: 'Next.js',
    category: 'frontend',
    description: 'App Router, RSC, edge-ready delivery.',
  },
  {
    id: '2',
    title: 'Node.js',
    category: 'backend',
    description: 'APIs and services with TypeScript.',
  },
  {
    id: '3',
    title: 'AWS / Azure / GCP',
    category: 'cloud',
    description: 'Secure, scalable cloud foundations.',
  },
  {
    id: '4',
    title: 'CI/CD & IaC',
    category: 'devops',
    description: 'Reliable releases and observability.',
  },
  {
    id: '5',
    title: 'Applied AI',
    category: 'ai',
    description: 'LLM systems grounded in real workflows.',
  },
  {
    id: '6',
    title: 'PostgreSQL / MongoDB',
    category: 'database',
    description: 'Data models that endure.',
  },
  {
    id: '7',
    title: 'Payload CMS',
    category: 'cms',
    description: 'Editor-first content platforms.',
  },
  {
    id: '8',
    title: 'Kubernetes',
    category: 'cloud',
    description: 'Orchestration at enterprise scale.',
  },
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
    <Section surface>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <AnimateIn>
            <p className="text-accent mb-3 text-sm font-semibold tracking-[0.16em] uppercase">
              Technology
            </p>
            <h2 className="font-display text-[length:var(--text-h2)] font-bold tracking-tight text-balance">
              {heading}
            </h2>
            {subheading ? <p className="text-secondary mt-4 text-lg">{subheading}</p> : null}
          </AnimateIn>
          <AnimateIn delay={0.1} className="flex flex-wrap gap-2 lg:justify-end">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-secondary rounded-full border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] px-3 py-1 text-xs font-medium capitalize backdrop-blur-md"
              >
                {cat}
              </span>
            ))}
          </AnimateIn>
        </div>

        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item, index) => (
            <AnimateIn key={item.id} delay={index * 0.04} className="mb-4 break-inside-avoid">
              <article className="group hover:border-accent/35 rounded-[24px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-5 shadow-[var(--shadow-light)] backdrop-blur-xl transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-medium)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-muted text-[11px] font-semibold tracking-[0.14em] uppercase">
                    {item.category}
                  </p>
                  <span className="bg-accent h-1.5 w-1.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <h3 className="font-display mt-3 text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                {item.description ? (
                  <p className="text-secondary mt-2 text-sm leading-relaxed">{item.description}</p>
                ) : null}
              </article>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn className="mt-12">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/solutions">Explore solutions</Link>
          </Button>
        </AnimateIn>
      </Container>
    </Section>
  )
}
