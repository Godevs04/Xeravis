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
  title: 'AI, Data & Cloud Technology Stack',
  description:
    'Engineering technologies XELARVIS uses across AI, data platforms, cloud, DevOps, and application delivery.',
  path: '/technologies',
})

function isEngineeringStack(item: TechDoc) {
  const cat = (item.category || '').toLowerCase()
  return cat !== 'clinical' && !['sas', 'cdisc', 'sdtm', 'adam'].includes(item.slug)
}

export default async function TechnologiesPage() {
  const tech = await listPublished<TechDoc>('technologies', { sort: 'order', limit: 48 })
  const items = (tech.length ? tech : FALLBACK_TECH).filter(isEngineeringStack)

  return (
    <>
      <TechnologiesPageHero
        title="Engineering stack for intelligent delivery."
        subtitle="AI, data, cloud, and DevOps tools used in service and solution programs. Clinical standards remain capability content—not vanity technology entries."
      />
      <Section>
        <Container>
          <div className="flex flex-col gap-8">
            {items.map((item, index) => (
              <AnimateIn key={item.id} delay={index * 0.03}>
                <div
                  id={item.slug}
                  className="grid scroll-mt-28 items-start gap-4 border-t border-[color:var(--color-navy)]/10 pt-8 sm:grid-cols-[10rem_1fr]"
                >
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
