import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_SOLUTIONS, UNSPLASH } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type SolutionDoc = {
  id: string
  title: string
  slug: string
  summary: string
}

export const metadata = buildMetadata({
  title: 'Solutions',
  description: 'Solution themes for cloud modernization, AI operations, and enterprise transformation.',
  path: '/solutions',
})

export default async function SolutionsPage() {
  const solutions = await listPublished<SolutionDoc>('solutions')
  const items = solutions.length ? solutions : FALLBACK_SOLUTIONS

  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Outcome-oriented solution themes."
        subtitle="Packaged approaches that combine services, accelerators, and delivery playbooks."
        image={UNSPLASH.servers}
        size="compact"
      />
      <Section>
        <Container>
          <div className="divide-y divide-border border-t border-border">
            {items.map((solution, index) => (
              <AnimateIn key={solution.id} delay={index * 0.03}>
                <Link href={`/solutions/${solution.slug}`} className="group block py-10">
                  <h2 className="text-2xl font-semibold text-primary transition-colors group-hover:text-accent">
                    {solution.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-secondary">{solution.summary}</p>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
