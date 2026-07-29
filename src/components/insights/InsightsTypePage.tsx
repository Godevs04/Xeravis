import Link from 'next/link'

import { BlogCard } from '@/components/domain/BlogCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_BLOG_POSTS } from '@/lib/fallback-data'
import { INSIGHTS_MEGA } from '@/lib/site-ia'

type BlogDoc = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt?: string | null
  insightType?: string | null
}

type InsightsTypePageProps = {
  type: 'blog' | 'white-paper' | 'news' | 'resource'
  title: string
  subtitle: string
}

export async function InsightsTypePage({ type, title, subtitle }: InsightsTypePageProps) {
  const posts = await listPublished<BlogDoc>('blogs', {
    sort: '-publishedAt',
    limit: 24,
    where: { insightType: { equals: type } },
  })
  const items = posts.length > 0 ? posts : type === 'blog' ? FALLBACK_BLOG_POSTS : []

  return (
    <>
      <PageHero
        brand="Xelarvis"
        eyebrow="Insights"
        title={title}
        subtitle={subtitle}
        size="compact"
        variant="default"
      />
      <Section>
        <Container>
          <div className="mb-8 flex flex-wrap gap-3">
            {INSIGHTS_MEGA.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:border-[#0D9488] hover:text-[#0D9488]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          {items.length === 0 ? (
            <p className="text-secondary">Content for this section will appear here soon.</p>
          ) : (
            <div>
              {items.map((post, index) => (
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
          )}
        </Container>
      </Section>
    </>
  )
}
