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
  title: 'Blog',
  description: 'Articles and updates from the Xelarvis engineering team.',
  path: '/blog',
})

export default async function BlogPage() {
  const posts = await listPublished<BlogDoc>('blogs', { sort: '-publishedAt' })
  const items = posts.length ? posts : FALLBACK_BLOG_POSTS

  return (
    <>
      <PageHero eyebrow="Blog" title="Engineering notes and industry commentary." size="compact" />
      <Section>
        <Container>
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
        </Container>
      </Section>
    </>
  )
}
