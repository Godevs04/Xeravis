import { TechnologyEcosystem } from '@/blocks/TechnologyEcosystem'
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
    <TechnologyEcosystem
      heading={heading}
      subheading={subheading}
      items={items}
      categories={categories}
    />
  )
}
