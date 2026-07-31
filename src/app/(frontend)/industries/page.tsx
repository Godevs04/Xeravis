import Link from 'next/link'

import { IndustriesPageHero } from '@/components/marketing/PageHeroes'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_INDUSTRIES } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type IndustryDoc = {
  id: string
  title: string
  slug: string
  summary: string
}

export const metadata = buildMetadata({
  title: 'Industries',
  description: 'Industry-specific engineering solutions from Xelarvis Technologies.',
  path: '/industries',
})

export default async function IndustriesPage() {
  const industries = await listPublished<IndustryDoc>('industries')
  const items = industries.length ? industries : FALLBACK_INDUSTRIES

  return (
    <>
      <IndustriesPageHero
        title="Domain expertise where regulation, scale, and reliability intersect."
        subtitle="We adapt platform patterns to the realities of your sector."
      />
      <Section>
        <Container>
          <ul className="space-y-0">
            {items.map((industry, index) => (
              <AnimateIn key={industry.id} delay={index * 0.03}>
                <li className="border-t border-[color:var(--color-navy)]/10 last:border-b">
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="group flex flex-col gap-3 py-10 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                  >
                    <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[color:var(--color-navy)] group-hover:text-teal-700 sm:text-3xl">
                      {industry.title}
                    </h2>
                    <p className="max-w-md text-sm leading-relaxed text-slate-600 sm:text-right">
                      {industry.summary}
                    </p>
                  </Link>
                </li>
              </AnimateIn>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  )
}
