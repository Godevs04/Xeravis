import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABand } from '@/blocks/CTABand'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/RichText'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { FALLBACK_INDUSTRIES } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type IndustryDoc = {
  id: string
  title: string
  slug: string
  summary: string
  challenges?: string | null
  approach?: unknown
  meta?: { title?: string; description?: string; image?: unknown }
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const industries = await listPublished<IndustryDoc>('industries')
  const slugs = industries.length ? industries : FALLBACK_INDUSTRIES
  return slugs.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const industry = await getPublishedBySlug<IndustryDoc>('industries', slug)
  const fallback = FALLBACK_INDUSTRIES.find((i) => i.slug === slug)

  return buildMetadata({
    title: industry?.meta?.title || industry?.title || fallback?.title,
    description: industry?.meta?.description || industry?.summary || fallback?.summary,
    image: industry?.meta?.image,
    path: `/industries/${slug}`,
  })
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params
  const industry = await getPublishedBySlug<IndustryDoc>('industries', slug)
  const fallback = FALLBACK_INDUSTRIES.find((i) => i.slug === slug)

  if (!industry && !fallback) notFound()

  const doc = industry || fallback!
  const challenges = industry?.challenges
  const approach = industry?.approach

  return (
    <>
      <PageHero
        eyebrow="Industry"
        title={doc.title}
        subtitle={doc.summary}
        size="compact"
        ctas={[{ label: 'Discuss your sector', href: '/contact', variant: 'accent' }]}
      />
      {challenges && (
        <Section>
          <Container className="max-w-3xl">
            <h2 className="text-2xl font-bold">Industry challenges</h2>
            <p className="mt-4 text-secondary leading-relaxed">{challenges}</p>
          </Container>
        </Section>
      )}
      {approach && (
        <Section surface>
          <Container className="max-w-3xl">
            <h2 className="text-2xl font-bold">Our approach</h2>
            <div className="mt-6">
              <RichText content={approach as Parameters<typeof RichText>[0]['content']} />
            </div>
          </Container>
        </Section>
      )}
      {!industry && (
        <Section surface>
          <Container className="max-w-3xl">
            <p className="text-secondary leading-relaxed">{doc.summary}</p>
          </Container>
        </Section>
      )}
      <CTABand
        heading="See services for this industry"
        subheading="Explore capabilities aligned to your operating model."
        ctaLabel="View services"
        ctaHref="/services"
      />
      <div className="container-x pb-12">
        <Link href="/industries" className="text-sm font-semibold text-accent hover:underline">
          ← All industries
        </Link>
      </div>
    </>
  )
}
