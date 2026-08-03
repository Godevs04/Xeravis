import Link from 'next/link'

import { BlogCard } from '@/components/domain/BlogCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_BLOG_POSTS } from '@/lib/fallback-data'
import { INSIGHTS_MEGA } from '@/lib/site-ia'
import { cn } from '@/lib/utils'

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

const TYPE_PATH: Record<InsightsTypePageProps['type'], string> = {
  blog: '/insights/blogs',
  'white-paper': '/insights/white-papers',
  news: '/insights/news',
  resource: '/insights/resources',
}

const CTA_LABEL: Record<InsightsTypePageProps['type'], string> = {
  blog: 'Read article',
  'white-paper': 'Read white paper',
  news: 'Read update',
  resource: 'View resource',
}

export async function InsightsTypePage({ type, title, subtitle }: InsightsTypePageProps) {
  const posts = await listPublished<BlogDoc>('blogs', {
    sort: '-publishedAt',
    limit: 24,
    where: { insightType: { equals: type } },
  })
  const items = posts.length > 0 ? posts : type === 'blog' ? FALLBACK_BLOG_POSTS : []
  const activePath = TYPE_PATH[type]

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
          <nav aria-label="Insight categories" className="mb-10 flex flex-wrap gap-2">
            {INSIGHTS_MEGA.map((item) => {
              const active = item.href === activePath
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                    active
                      ? 'border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white'
                      : 'border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-[color:var(--color-primary)] hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {items.length === 0 ? (
            <div className="rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-6 py-12 text-center backdrop-blur-xl sm:px-10">
              <p className="font-display text-lg font-semibold text-[color:var(--color-primary)]">
                Nothing published here yet
              </p>
              <p className="mt-2 text-sm text-[color:var(--color-secondary)]">
                New {title.toLowerCase()} will appear in this section as they are published.
              </p>
              <Link
                href="/insights"
                className="mt-6 inline-flex text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
              >
                Browse all insights →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((post, index) => (
                <AnimateIn key={post.id} delay={index * 0.03}>
                  <BlogCard
                    title={post.title}
                    excerpt={post.excerpt}
                    href={`/blog/${post.slug}`}
                    publishedAt={post.publishedAt}
                    ctaLabel={CTA_LABEL[type]}
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
