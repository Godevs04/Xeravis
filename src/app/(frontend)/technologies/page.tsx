import { TechnologyCard } from '@/components/domain/TechnologyCard'
import { TechnologiesPageHero } from '@/components/marketing/PageHeroes'
import { Container } from '@/components/layout/Container'
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
  title: 'AI Cloud & Clinical Tech Stack',
  description:
    'AI, clinical, cloud, and data technologies Xelarvis uses to deliver healthcare and enterprise production systems.',
  path: '/technologies',
})

export default async function TechnologiesPage() {
  const tech = await listPublished<TechDoc>('technologies', { sort: 'order', limit: 48 })
  const items = tech.length ? tech : FALLBACK_TECH

  return (
    <>
      <TechnologiesPageHero
        title="Modern stacks for intelligent delivery."
        subtitle="Our overall capability set across AI, clinical, cloud, and data. Each Solution page also lists the Technology Stack specific to that offering."
      />
      <Section>
        <Container>
          <div className="flex flex-col gap-8">
            {items.map((item, index) => (
              <AnimateIn key={item.id} delay={index * 0.03}>
                <div className="grid items-start gap-4 border-t border-[color:var(--color-navy)]/10 pt-8 sm:grid-cols-[10rem_1fr]">
                  <p className="text-xs font-semibold tracking-[0.14em] text-teal-700 uppercase">
                    {item.category || 'stack'}
                  </p>
                  <TechnologyCard
                    name={item.title}
                    category={item.category}
                    description={item.description}
                  />
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
