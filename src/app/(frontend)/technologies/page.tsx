import { TechnologyCard } from '@/components/domain/TechnologyCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type TechDoc = {
  id: string
  title: string
  slug: string
  category?: string | null
  description?: string | null
}

const FALLBACK_TECH: TechDoc[] = [
  {
    id: '1',
    title: 'Python',
    slug: 'python',
    category: 'ai',
    description: 'Core language for AI, analytics, and automation.',
  },
  {
    id: '2',
    title: 'TensorFlow',
    slug: 'tensorflow',
    category: 'ai',
    description: 'Deep learning model development and training.',
  },
  {
    id: '3',
    title: 'PyTorch',
    slug: 'pytorch',
    category: 'ai',
    description: 'Research-friendly neural network frameworks.',
  },
  {
    id: '4',
    title: 'SAS',
    slug: 'sas',
    category: 'clinical',
    description: 'Clinical statistical programming and analytics.',
  },
  {
    id: '5',
    title: 'CDISC Standards',
    slug: 'cdisc',
    category: 'clinical',
    description: 'SDTM and ADaM for regulatory submissions.',
  },
  {
    id: '6',
    title: 'AWS',
    slug: 'aws',
    category: 'cloud',
    description: 'Secure, scalable cloud foundations.',
  },
  {
    id: '7',
    title: 'Azure',
    slug: 'azure',
    category: 'cloud',
    description: 'Enterprise cloud and AI services.',
  },
  {
    id: '8',
    title: 'Apache Spark',
    slug: 'spark',
    category: 'data',
    description: 'Large-scale data processing.',
  },
  {
    id: '9',
    title: 'Power BI',
    slug: 'power-bi',
    category: 'bi',
    description: 'Executive dashboards and reporting.',
  },
  {
    id: '10',
    title: 'React',
    slug: 'react',
    category: 'frontend',
    description: 'Modern web application interfaces.',
  },
]

export const metadata = buildMetadata({
  title: 'Technologies',
  description:
    'AI, clinical, cloud, and data technologies used by XELARVIS to deliver intelligent solutions.',
  path: '/technologies',
})

export default async function TechnologiesPage() {
  const tech = await listPublished<TechDoc>('technologies', { sort: 'order', limit: 48 })
  const items = tech.length ? tech : FALLBACK_TECH

  return (
    <>
      <PageHero
        brand="Xelarvis"
        eyebrow="Technologies"
        title="Modern stacks for intelligent delivery."
        subtitle="We select technologies for maintainability, security, compliance, and scale — from clinical SAS to cloud-native AI."
        size="compact"
        variant="default"
      />
      <Section>
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <AnimateIn key={item.id} delay={index * 0.03}>
                <TechnologyCard
                  name={item.title}
                  category={item.category}
                  description={item.description}
                />
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
