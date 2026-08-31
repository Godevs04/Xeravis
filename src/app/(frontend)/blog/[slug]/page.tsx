import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RelatedContent } from '@/components/content/RelatedContent'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { JsonLd } from '@/components/seo/JsonLd'
import { RichText } from '@/components/RichText'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { FALLBACK_BLOG_POSTS } from '@/lib/fallback-data'
import { buildRelatedGroups } from '@/lib/related-content'
import { articleJsonLd, breadcrumbJsonLd, buildMetadata, graphJsonLd } from '@/lib/seo'

export const revalidate = 60

type BlogDoc = {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: unknown
  publishedAt?: string | null
  updatedAt?: string | null
  relatedServices?: unknown
  relatedSolutions?: unknown
  relatedIndustries?: unknown
  meta?: { title?: string; description?: string; image?: unknown }
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await listPublished<BlogDoc>('blogs')
  const slugs = posts.length ? posts : FALLBACK_BLOG_POSTS
  return slugs.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedBySlug<BlogDoc>('blogs', slug)
  const fallback = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug)

  return buildMetadata({
    title: post?.meta?.title || post?.title || fallback?.title,
    description: post?.meta?.description || post?.excerpt || fallback?.excerpt,
    image: post?.meta?.image,
    path: `/blog/${slug}`,
    type: 'article',
    publishedTime: post?.publishedAt,
    modifiedTime: post?.updatedAt || post?.publishedAt,
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedBySlug<BlogDoc>('blogs', slug)
  const fallback = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug)

  if (!post && !fallback) notFound()

  const doc = post || {
    ...fallback!,
    content: {
      root: {
        children: [{ type: 'paragraph', children: [{ type: 'text', text: fallback!.excerpt }] }],
      },
    },
  }

  const relatedGroups = buildRelatedGroups(doc as unknown as Record<string, unknown>)

  const jsonLd = graphJsonLd(
    articleJsonLd({
      title: doc.title,
      description: doc.excerpt,
      path: `/blog/${slug}`,
      datePublished: doc.publishedAt || undefined,
      dateModified: doc.updatedAt || doc.publishedAt || undefined,
      image: post?.meta?.image,
    }),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Insights', path: '/insights' },
      { name: 'Blog', path: '/blog' },
      { name: doc.title, path: `/blog/${slug}` },
    ]),
  )

  return (
    <>
      <JsonLd id="article-jsonld" data={jsonLd} />
      <PageHero eyebrow="Article" title={doc.title} subtitle={doc.excerpt} size="compact" />
      <Section>
        <Container className="max-w-3xl">
          <article>
            {doc.publishedAt && (
              <time dateTime={doc.publishedAt} className="text-muted mb-8 block text-sm">
                Updated{' '}
                {new Date(doc.updatedAt || doc.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            )}
            <p className="text-muted mb-8 text-sm">
              Written by Xelarvis Technologies · Reviewed for technical accuracy
            </p>
            <RichText content={doc.content as Parameters<typeof RichText>[0]['content']} />
          </article>
        </Container>
      </Section>

      <RelatedContent heading="Continue exploring" groups={relatedGroups} />

      <div className="container-x pb-12">
        <Link href="/blog" className="text-accent text-sm font-semibold hover:underline">
          ← All articles
        </Link>
      </div>
    </>
  )
}
