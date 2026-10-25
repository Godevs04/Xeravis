import { notFound } from 'next/navigation'

import { BlogCard } from '@/components/domain/BlogCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { JsonLd } from '@/components/seo/JsonLd'
import { authorSlug, findAuthorBySlug, listAuthors } from '@/lib/authors'
import { listPublished } from '@/lib/cms'
import { breadcrumbJsonLd, buildMetadata, graphJsonLd, personJsonLd } from '@/lib/seo'

export const revalidate = 60

type PostDoc = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt?: string | null
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const authors = await listAuthors()
  return authors.map((author) => ({ slug: authorSlug(author) })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const author = await findAuthorBySlug(slug)
  if (!author) return buildMetadata({ title: 'Author not found', path: `/authors/${slug}` })
  return buildMetadata({
    title: `${author.name}${author.role ? `, ${author.role}` : ''}`,
    description:
      author.bio?.trim() ||
      `Articles and insights by ${author.name} at Xelarvis on AI, data science, data engineering and digital transformation.`,
    path: `/authors/${slug}`,
  })
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params
  const author = await findAuthorBySlug(slug)
  if (!author) notFound()

  const posts = await listPublished<PostDoc>('blogs', {
    where: { author: { equals: author.id } },
    sort: '-publishedAt',
    limit: 48,
    depth: 0,
  })

  const path = `/authors/${slug}`
  const jsonLd = graphJsonLd(
    personJsonLd({
      name: author.name,
      jobTitle: author.role || undefined,
      path,
      sameAs: author.linkedIn ? [author.linkedIn] : undefined,
    }),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Insights', path: '/insights' },
      { name: author.name, path },
    ]),
  )

  return (
    <>
      <JsonLd id="author-jsonld" data={jsonLd} />
      <PageHero
        eyebrow={author.role || 'Author'}
        title={author.name}
        subtitle={author.bio || undefined}
        size="compact"
      />
      <Section>
        <Container>
          <h2 className="font-display text-primary mb-6 text-2xl font-semibold tracking-tight">
            Articles by {author.name}
          </h2>
          {posts.length === 0 ? (
            <p className="text-secondary">No published articles yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  href={`/blog/${post.slug}`}
                  publishedAt={post.publishedAt}
                />
              ))}
            </div>
          )}
          {author.linkedIn ? (
            <a
              href={author.linkedIn}
              target="_blank"
              rel="noreferrer"
              className="text-accent mt-8 inline-block text-sm font-semibold hover:underline"
            >
              {author.name} on LinkedIn
            </a>
          ) : null}
        </Container>
      </Section>
    </>
  )
}
