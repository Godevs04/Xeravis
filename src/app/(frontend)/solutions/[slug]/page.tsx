import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABand } from '@/blocks/CTABand'
import { TechnologyCard } from '@/components/domain/TechnologyCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/RichText'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { FALLBACK_SOLUTIONS } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type RelatedTech = {
  id: string
  title?: string
  name?: string
  slug?: string
  category?: string | null
  description?: string | null
}

type SolutionDoc = {
  id: string
  title: string
  slug: string
  summary: string
  body?: unknown
  technologies?: RelatedTech[] | (string | number)[]
  meta?: { title?: string; description?: string; image?: unknown }
}

type Props = { params: Promise<{ slug: string }> }

function asRelatedTechs(value: SolutionDoc['technologies']): RelatedTech[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is RelatedTech => typeof item === 'object' && item !== null)
}

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
        children: [{ type: 'paragraph', children: [{ type: 'text', text: fallback!.summary }] }],
      },
    },
  }

  const technologies = asRelatedTechs(doc.technologies)

  return (
    <>
      <PageHero eyebrow="Solution" title={doc.title} subtitle={doc.summary} size="compact" />
      <Section>
        <Container className="max-w-3xl">
          <RichText content={doc.body as Parameters<typeof RichText>[0]['content']} />
        </Container>
      </Section>
      {technologies.length > 0 ? (
        <Section surface>
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">
                  Technology Stack
                </p>
                <h2 className="text-primary mt-2 text-2xl font-bold">Built for this solution</h2>
                <p className="text-secondary mt-2 max-w-2xl text-sm">
                  Tools and platforms we use specifically for {doc.title}. See our full capability
                  set on the Technologies page.
                </p>
              </div>
              <Link
                href="/technologies"
                className="text-accent text-sm font-semibold hover:underline"
              >
                All technologies →
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {technologies.map((tech) => (
                <TechnologyCard
                  key={tech.id}
                  name={tech.title || tech.name || 'Technology'}
                  category={tech.category}
                  description={tech.description}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
      <CTABand
        heading="Start a solution assessment"
        subheading="We will map capabilities, timeline, and team structure for your context."
        ctaLabel="Contact us"
        ctaHref="/contact"
      />
      <div className="container-x pb-12">
        <Link href="/solutions" className="text-accent text-sm font-semibold hover:underline">
          ← All solutions
        </Link>
      </div>
    </>
  )
}
