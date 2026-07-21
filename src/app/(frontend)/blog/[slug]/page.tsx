import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/RichText'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { FALLBACK_BLOG_POSTS } from '@/lib/fallback-data'
import { articleJsonLd, buildMetadata } from '@/lib/seo'

export const revalidate = 60

type BlogDoc = {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: unknown
  publishedAt?: string | null
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
        children: [
          { type: 'paragraph', children: [{ type: 'text', text: fallback!.excerpt }] },
        ],
      },
    },
  }

  const jsonLd = articleJsonLd({
    title: doc.title,
    description: doc.excerpt,
    path: `/blog/${slug}`,
    datePublished: doc.publishedAt || undefined,
    image: post?.meta?.image,
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="Article" title={doc.title} subtitle={doc.excerpt} size="compact" />
      <Section>
        <Container className="max-w-3xl">
          {doc.publishedAt && (
            <time dateTime={doc.publishedAt} className="mb-8 block text-sm text-muted">
              {new Date(doc.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          )}
          <RichText content={doc.content as Parameters<typeof RichText>[0]['content']} />
        </Container>
      </Section>
      <div className="container-x pb-12">
        <Link href="/blog" className="text-sm font-semibold text-accent hover:underline">
          ← All articles
        </Link>
      </div>
    </>
  )
}
