import Link from 'next/link'

import { IndustriesPageHero } from '@/components/marketing/PageHeroes'
import { IndustriesIndexSection } from '@/components/industries/IndustriesIndexSection'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { listPublished } from '@/lib/cms'
import { FALLBACK_INDUSTRIES } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type IndustryDoc = {
  id: string
  title: string
  slug: string
  summary: string
  tier?: string | null
  order?: number | null
}

export const metadata = buildMetadata({
  title: 'Industries — AI, Data Science & IT Consulting',
  description:
    'Sector programs across Healthcare & Life Sciences, Technology, Banking & Financial Services, Manufacturing, Retail, and Logistics—plus additional areas we can support.',
  path: '/industries',
})

export default async function IndustriesPage() {
  const industries = await listPublished<IndustryDoc>('industries', { sort: 'order' })
  const all = industries.length
    ? industries
    : FALLBACK_INDUSTRIES.map((i) => ({ ...i, tier: '1' as const }))

  const primary = all.filter((i) => !i.tier || i.tier === '1' || i.tier === '2')
  const emerging = all.filter((i) => i.tier === '3')

  return (
    <>
      <IndustriesPageHero
        title="Domain expertise where regulation, scale, and reliability intersect."
        subtitle="We adapt AI, data science, and IT consulting patterns to the realities of your sector."
      />
      <IndustriesIndexSection industries={primary} />
      {emerging.length > 0 ? (
        <Section surface>
          <Container>
            <p className="text-xs font-semibold tracking-[0.14em] text-[color:var(--color-accent)] uppercase">
              Areas we can support
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[color:var(--color-primary)]">
              Additional sectors
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[color:var(--color-secondary)]">
              These industries are available for discussion when your initiative needs specialized
              context. Content deepens as real programs land.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {emerging.map((industry) => (
                <li key={industry.id}>
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="block rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--glass-bg)] px-4 py-4 transition hover:border-[color:var(--color-accent)]"
                  >
                    <span className="font-semibold text-[color:var(--color-primary)]">
                      {industry.title}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm text-[color:var(--color-secondary)]">
                      {industry.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
