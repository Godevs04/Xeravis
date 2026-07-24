import { RenderBlocks, type PageBlock } from '@/blocks/RenderBlocks'
import { Container } from '@/components/layout/Container'
import { EmptyState } from '@/components/ui/empty-state'
import { safePayload } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type AboutPageDoc = {
  title?: string
  layout?: PageBlock[]
  meta?: { title?: string; description?: string; image?: unknown }
}

async function loadAboutPage() {
  return safePayload(async (payload) => {
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'about' },
      },
      limit: 1,
      depth: 2,
      draft: false,
      overrideAccess: true,
    })
    const doc = result.docs[0] as (AboutPageDoc & { _status?: string }) | undefined
    if (!doc) return null
    if (doc._status && doc._status !== 'published') return null
    return doc
  })
}

export async function generateMetadata() {
  const page = await loadAboutPage()
  return buildMetadata({
    title: page?.meta?.title || page?.title || 'About',
    description:
      page?.meta?.description ||
      'Learn about Xelarvis Technologies — our mission, leadership, and approach to enterprise engineering.',
    image: page?.meta?.image,
    path: '/about',
  })
}

export default async function AboutPage() {
  const page = await loadAboutPage()

  if (page?.layout?.length) {
    return <RenderBlocks blocks={page.layout} />
  }

  return (
    <Container className="py-24 lg:py-32">
      <EmptyState
        title="About page is not published"
        description="Publish a Pages document with slug “about” including mission, vision, values, timeline, and team blocks."
        actionLabel="Open admin"
        href="/admin"
      />
    </Container>
  )
}
