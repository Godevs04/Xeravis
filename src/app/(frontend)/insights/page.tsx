import Link from 'next/link'

import { BlogCard } from '@/components/domain/BlogCard'
import { InsightsIndexSection } from '@/components/insights/InsightsIndexSection'
import { InsightsPageHero } from '@/components/marketing/PageHeroes'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_BLOG_POSTS } from '@/lib/fallback-data'
import { INSIGHTS_MEGA } from '@/lib/site-ia'
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
  description:
    'Blogs, white papers, news, and resources from XELARVIS on AI, healthcare, and digital transformation.',
  path: '/insights',
})

export default async function InsightsPage() {
  const posts = await listPublished<BlogDoc>('blogs', { sort: '-publishedAt', limit: 6 })
  const featured = posts.length ? posts : FALLBACK_BLOG_POSTS

  return (
    <>
      <InsightsPageHero
        title="Knowledge for intelligent organizations."
        subtitle="Perspective on AI research, clinical data science, analytics, and enterprise technology."
      />
      <InsightsIndexSection items={INSIGHTS_MEGA} />
      <Section>
        <Container>
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-[color:var(--color-primary)]">
              Latest articles
            </h2>
            <Link
              href="/insights/blogs"
              className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
            >
              View all blogs
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
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
