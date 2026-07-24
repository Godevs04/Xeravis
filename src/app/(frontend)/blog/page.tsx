import Link from 'next/link'

import { BlogCard } from '@/components/domain/BlogCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { SearchBar } from '@/components/ui/search-bar'
import { listDocs, listPublished } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type CategoryDoc = {
  id: string
  title: string
  slug: string
}

type BlogDoc = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt?: string | null
  categories?: (CategoryDoc | string)[] | null
}

type Props = {
  searchParams: Promise<{ category?: string }>
}

export const metadata = buildMetadata({
  title: 'Blog',
  description: 'Articles and updates from the Xelarvis engineering team.',
  path: '/blog',
})

export default async function BlogPage({ searchParams }: Props) {
  const { category: categorySlug } = await searchParams
  const [categories, allPosts] = await Promise.all([
    listDocs<CategoryDoc>('categories', { sort: 'title' }),
    listPublished<BlogDoc>('blogs', { sort: '-publishedAt' }),
  ])

  const activeCategory = categorySlug
    ? categories.find((cat) => cat.slug === categorySlug)
    : undefined

  const posts = activeCategory
    ? allPosts.filter((post) =>
        (post.categories || []).some((cat) =>
          typeof cat === 'object'
            ? cat.id === activeCategory.id || cat.slug === activeCategory.slug
            : cat === activeCategory.id,
        ),
      )
    : allPosts

  return (
    <>
      <PageHero
        brand="Xelarvis"
        eyebrow="Blog"
        title="Engineering notes and industry commentary."
        subtitle="Essays on product, platforms, and shipping at enterprise scale."
        size="compact"
      />
      <Section>
        <Container>
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-2" role="navigation" aria-label="Blog categories">
              <Link href="/blog">
                <Badge variant={!activeCategory ? 'accent' : 'outline'}>All</Badge>
              </Link>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/blog?category=${cat.slug}`}>
                  <Badge variant={activeCategory?.slug === cat.slug ? 'accent' : 'outline'}>
                    {cat.title}
                  </Badge>
                </Link>
              ))}
            </div>
            <SearchBar
              name="q"
              placeholder="Search articles…"
              aria-label="Search articles"
              className="max-w-sm"
              containerClassName="w-full max-w-sm"
            />
          </div>

          {!posts.length ? (
            <EmptyState
              title={
                activeCategory ? `No posts in ${activeCategory.title}` : 'No articles published'
              }
              description="Publish blog posts in Payload Admin to populate this list."
              actionLabel="Browse all"
              href="/blog"
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <AnimateIn key={post.id} delay={index * 0.04}>
                  <BlogCard
                    title={post.title}
                    excerpt={post.excerpt}
                    href={`/blog/${post.slug}`}
                    publishedAt={post.publishedAt}
                    featured={index === 0}
                    className="h-full"
                  />
                </AnimateIn>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
