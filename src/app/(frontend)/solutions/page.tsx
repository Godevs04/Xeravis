import Link from 'next/link'

import { SolutionsPageHero } from '@/components/marketing/PageHeroes'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_SOLUTIONS } from '@/lib/fallback-data'
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
  description:
    'Solution themes for cloud modernization, AI operations, and enterprise transformation.',
  path: '/solutions',
})

export default async function SolutionsPage() {
  const solutions = await listPublished<SolutionDoc>('solutions')
  const items = solutions.length ? solutions : FALLBACK_SOLUTIONS

  return (
    <>
      <SolutionsPageHero
        title="Outcome-oriented solution themes."
        subtitle="Packaged approaches that combine services, accelerators, and delivery playbooks."
      />
      <Section>
        <Container>
          <div className="divide-y divide-[color:var(--color-navy)]/15 border-t border-[color:var(--color-navy)]/15">
            {items.map((solution, index) => (
              <AnimateIn key={solution.id} delay={index * 0.03}>
                <Link href={`/solutions/${solution.slug}`} className="group block py-12">
                  <p className="font-display text-xs tracking-[0.16em] text-teal-600">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="font-display mt-3 text-[clamp(1.6rem,3vw,2.6rem)] font-semibold tracking-[-0.035em] text-[color:var(--color-navy)] transition-colors group-hover:text-teal-700">
                    {solution.title}
                  </h2>
                  <p className="text-secondary mt-4 max-w-2xl">{solution.summary}</p>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
