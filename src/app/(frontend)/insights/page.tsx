import Link from 'next/link'

import { BlogCard } from '@/components/domain/BlogCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_BLOG_POSTS } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type BlogDoc = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt?: string | null
}

export const metadata = buildMetadata({
  title: 'Insights',
  description: 'Thought leadership, engineering practices, and industry perspectives from Xelarvis.',
  path: '/insights',
})

export default async function InsightsPage() {
  const posts = await listPublished<BlogDoc>('blogs', { sort: '-publishedAt', limit: 3 })
  const featured = posts.length ? posts : FALLBACK_BLOG_POSTS

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Perspectives on building durable digital businesses."
        subtitle="Articles on architecture, delivery, and enterprise transformation."
        size="compact"
      />
      <Section>
        <Container>
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold">Latest articles</h2>
            <Link href="/blog" className="text-sm font-semibold text-accent hover:underline">
              View all posts
            </Link>
          </div>
          <div>
            {featured.map((post, index) => (
              <AnimateIn key={post.id} delay={index * 0.03}>
                <BlogCard
                  title={post.title}
                  excerpt={post.excerpt}
                  href={`/blog/${post.slug}`}
                  publishedAt={post.publishedAt}
                />
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
