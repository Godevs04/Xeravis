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
    <Section surface>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <AnimateIn className="max-w-2xl">
            <h2 className="text-balance">{heading}</h2>
            {subheading ? <p className="mt-4 text-lg text-secondary">{subheading}</p> : null}
          </AnimateIn>
          <Button asChild variant="outline">
            <Link href="/insights">View all insights</Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {items.map((post, index) => (
            <AnimateIn key={post.id || post.slug} delay={index * 0.05}>
              <BlogCard
                title={post.title}
                href={`/blog/${post.slug}`}
                excerpt={post.excerpt || ''}
                publishedAt={post.publishedAt}
              />
            </AnimateIn>
          ))}
        </div>
      </Container>
    </Section>
  )
}
