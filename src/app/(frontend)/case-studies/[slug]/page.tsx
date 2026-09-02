import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABand } from '@/blocks/CTABand'
import { RelatedContent } from '@/components/content/RelatedContent'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { JsonLd } from '@/components/seo/JsonLd'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { FALLBACK_CASE_STUDIES } from '@/lib/fallback-data'
import { buildRelatedGroups } from '@/lib/related-content'
import { breadcrumbJsonLd, buildMetadata, caseStudyJsonLd, graphJsonLd } from '@/lib/seo'

export const revalidate = 60

type CaseStudyDoc = {
  id: string
  title: string
  slug: string
  client: string
  challenge: string
  outcome: string
  metrics?: { label: string; value: string }[]
  services?: unknown
  relatedSolutions?: unknown
  technologies?: unknown
  industry?: unknown
  meta?: { title?: string; description?: string; image?: unknown }
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const studies = await listPublished<CaseStudyDoc>('case-studies')
  const slugs = studies.length ? studies : FALLBACK_CASE_STUDIES
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const study = await getPublishedBySlug<CaseStudyDoc>('case-studies', slug)
  const fallback = FALLBACK_CASE_STUDIES.find((s) => s.slug === slug)

  return buildMetadata({
    title: study?.meta?.title || study?.title || fallback?.title,
    description: study?.meta?.description || study?.outcome || fallback?.outcome,
    image: study?.meta?.image,
    path: `/case-studies/${slug}`,
    type: 'article',
  })
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params
  const study = await getPublishedBySlug<CaseStudyDoc>('case-studies', slug)
  const fallback = FALLBACK_CASE_STUDIES.find((s) => s.slug === slug)

  if (!study && !fallback) notFound()

  const doc = study || {
    ...fallback!,
    challenge: fallback!.challenge,
    metrics: [],
  }

  const relatedGroups = buildRelatedGroups(doc as unknown as Record<string, unknown>)

  const jsonLd = graphJsonLd(
    caseStudyJsonLd({
      title: doc.title,
      description: doc.outcome,
      path: `/case-studies/${slug}`,
      client: doc.client,
      image: study?.meta?.image,
    }),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Case studies', path: '/case-studies' },
      { name: doc.title, path: `/case-studies/${slug}` },
    ]),
  )

  return (
    <>
      <JsonLd id="case-study-jsonld" data={jsonLd} />
      <PageHero eyebrow={doc.client} title={doc.title} subtitle={doc.outcome} size="compact" />
      <Section>
        <Container className="max-w-3xl">
          <p className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-5 py-4 text-sm leading-relaxed text-amber-900 dark:text-amber-100">
            <strong className="font-semibold">Representative engagement.</strong> This case study
            illustrates a typical delivery pattern. Client details are anonymized and outcomes are
            illustrative — not verified metrics or named customer claims.
          </p>
        </Container>
      </Section>
      <Section>
        <Container className="max-w-3xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold">Challenge</h2>
            <p className="text-secondary mt-4 leading-relaxed">{doc.challenge}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Solution & outcome</h2>
            <p className="text-secondary mt-4 leading-relaxed">{doc.outcome}</p>
          </div>
          {doc.metrics && doc.metrics.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold">Results</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {doc.metrics.map((metric) => (
                  <div key={metric.label} className="border-accent border-l-2 pl-4">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-muted text-sm">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      <RelatedContent heading="Related capabilities & solutions" groups={relatedGroups} />

      <CTABand
        heading="Discuss a similar initiative"
        subheading="Our teams can share relevant patterns and delivery models."
        ctaLabel="Talk to us"
        ctaHref="/contact?intent=business"
      />
      <div className="container-x pb-12">
        <Link href="/case-studies" className="text-accent text-sm font-semibold hover:underline">
          ← All case studies
        </Link>
      </div>
    </>
  )
}
