import Link from 'next/link'

import { BlogCard } from '@/components/domain/BlogCard'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'
import { listPublished } from '@/lib/cms'
import { FALLBACK_BLOG_POSTS } from '@/lib/fallback-data'

type BlogDoc = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
}

type LatestBlogsProps = {
  heading: string
  subheading?: string | null
}

export async function LatestBlogs({ heading, subheading }: LatestBlogsProps) {
  const posts = await listPublished<BlogDoc>('blogs', { limit: 3, sort: '-publishedAt' })
  const items = posts.length ? posts : FALLBACK_BLOG_POSTS

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <AnimateIn className="max-w-2xl">
            <p className="text-accent mb-3 text-sm font-semibold tracking-[0.16em] uppercase">
              Insights
            </p>
            <h2 className="font-display text-[length:var(--text-h2)] font-bold tracking-tight text-balance">
              {heading}
            </h2>
            {subheading ? <p className="text-secondary mt-4 text-lg">{subheading}</p> : null}
          </AnimateIn>
          <Button asChild variant="outline" className="rounded-full border-white/12">
            <Link href="/insights">View all insights</Link>
          </Button>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((post, index) => (
            <AnimateIn key={post.id || post.slug} delay={index * 0.06}>
              <BlogCard
                title={post.title}
                href={`/blog/${post.slug}`}
                excerpt={post.excerpt || ''}
                publishedAt={post.publishedAt}
                featured={index === 0}
              />
            </AnimateIn>
          ))}
        </div>
      </Container>
    </Section>
  )
}
