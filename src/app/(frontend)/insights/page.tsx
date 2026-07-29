import Link from 'next/link'

import { BlogCard } from '@/components/domain/BlogCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
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
      <PageHero
        brand="Xelarvis"
        eyebrow="Insights"
        title="Knowledge for intelligent organizations."
        subtitle="Perspective on AI research, clinical data science, analytics, and enterprise technology."
        size="compact"
        variant="default"
      />
      <Section>
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INSIGHTS_MEGA.filter((i) => i.href !== '/insights').map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-[#0D9488]/40"
              >
                <h2 className="font-display text-lg font-semibold text-[#0F172A]">{item.label}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </Link>
            ))}
          </div>
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
