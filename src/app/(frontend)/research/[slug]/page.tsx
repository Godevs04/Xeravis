import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABand } from '@/blocks/CTABand'
import { RelatedContent } from '@/components/content/RelatedContent'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/RichText'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { buildRelatedGroups } from '@/lib/related-content'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type ResearchDoc = {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: unknown
  publishedAt?: string | null
  relatedServices?: unknown
  relatedSolutions?: unknown
  relatedIndustries?: unknown
  meta?: { title?: string; description?: string; image?: unknown }
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const docs = await listPublished<ResearchDoc>('research')
  return docs.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const doc = await getPublishedBySlug<ResearchDoc>('research', slug)

  return buildMetadata({
    title: doc?.meta?.title || doc?.title || 'Research',
    description: doc?.meta?.description || doc?.excerpt,
    image: doc?.meta?.image,
    path: `/research/${slug}`,
    type: 'article',
  })
}

export default async function ResearchDetailPage({ params }: Props) {
  const { slug } = await params
  const doc = await getPublishedBySlug<ResearchDoc>('research', slug)

  if (!doc) notFound()

  const relatedGroups = buildRelatedGroups(doc as unknown as Record<string, unknown>)

  return (
    <>
      <PageHero eyebrow="Research" title={doc.title} subtitle={doc.excerpt} size="compact" />
      <Section>
        <Container className="max-w-3xl">
          {doc.publishedAt ? (
            <time dateTime={doc.publishedAt} className="text-muted mb-8 block text-sm">
              {new Date(doc.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          ) : null}
          <RichText content={doc.content as Parameters<typeof RichText>[0]['content']} />
        </Container>
      </Section>

      <RelatedContent heading="Related practice areas" groups={relatedGroups} />

      <CTABand
        heading="Discuss research collaboration"
        subheading="Connect with the XELARVIS research and delivery practice."
        ctaLabel="Contact research"
        ctaHref="/contact?intent=research"
      />
      <div className="container-x pb-12">
        <Link href="/ai-research-lab" className="text-accent text-sm font-semibold hover:underline">
          ← Research & Innovation
        </Link>
      </div>
    </>
  )
}
