import Link from 'next/link'

import { BlogCard } from '@/components/domain/BlogCard'
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
      <Section>
        <Container>
          <ul className="divide-y divide-slate-200 border-y border-slate-200">
            {INSIGHTS_MEGA.filter((i) => i.href !== '/insights').map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                >
                  <h2 className="font-display text-xl font-semibold text-[#0F172A] group-hover:text-teal-700">
                    {item.label}
                  </h2>
                  <p className="max-w-md text-sm text-slate-600 sm:text-right">
                    {item.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section surface>
        <Container>
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-[#0F172A]">Latest articles</h2>
            <Link
              href="/insights/blogs"
              className="text-sm font-semibold text-[#0D9488] hover:underline"
            >
              View all blogs
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
