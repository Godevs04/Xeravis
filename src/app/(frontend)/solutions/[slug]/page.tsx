import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABand } from '@/blocks/CTABand'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/RichText'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { FALLBACK_SOLUTIONS } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type SolutionDoc = {
  id: string
  title: string
  slug: string
  summary: string
  body?: unknown
  meta?: { title?: string; description?: string; image?: unknown }
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const solutions = await listPublished<SolutionDoc>('solutions')
  const slugs = solutions.length ? solutions : FALLBACK_SOLUTIONS
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const solution = await getPublishedBySlug<SolutionDoc>('solutions', slug)
  const fallback = FALLBACK_SOLUTIONS.find((s) => s.slug === slug)

  return buildMetadata({
    title: solution?.meta?.title || solution?.title || fallback?.title,
    description: solution?.meta?.description || solution?.summary || fallback?.summary,
    image: solution?.meta?.image,
    path: `/solutions/${slug}`,
  })
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params
  const solution = await getPublishedBySlug<SolutionDoc>('solutions', slug)
  const fallback = FALLBACK_SOLUTIONS.find((s) => s.slug === slug)

  if (!solution && !fallback) notFound()

  const doc = solution || {
    ...fallback!,
    body: {
      root: {
        children: [
          { type: 'paragraph', children: [{ type: 'text', text: fallback!.summary }] },
        ],
      },
    },
  }

  return (
    <>
      <PageHero eyebrow="Solution" title={doc.title} subtitle={doc.summary} size="compact" />
      <Section>
        <Container className="max-w-3xl">
          <RichText content={doc.body as Parameters<typeof RichText>[0]['content']} />
        </Container>
      </Section>
      <CTABand
        heading="Start a solution assessment"
        subheading="We will map capabilities, timeline, and team structure for your context."
        ctaLabel="Contact us"
        ctaHref="/contact"
      />
      <div className="container-x pb-12">
        <Link href="/solutions" className="text-sm font-semibold text-accent hover:underline">
          ← All solutions
        </Link>
      </div>
    </>
  )
}
