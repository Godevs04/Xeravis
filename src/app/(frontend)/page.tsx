import { RenderBlocks, type PageBlock } from '@/blocks/RenderBlocks'
import { Container } from '@/components/layout/Container'
import { EmptyState } from '@/components/ui/empty-state'
import { safePayload } from '@/lib/cms'

export const revalidate = 60

type HomePageDoc = {
  layout?: PageBlock[]
  _status?: string | null
}

async function loadHomePage() {
  return safePayload(async (payload) => {
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' },
      },
      limit: 1,
      depth: 2,
      draft: false,
      overrideAccess: true,
    })

    let doc = result.docs[0] as HomePageDoc | undefined

    // Fallback: latest version (covers unpublished drafts while editing)
    if (!doc?.layout?.length) {
      const draftResult = await payload.find({
        collection: 'pages',
        where: { slug: { equals: 'home' } },
        limit: 1,
        depth: 2,
        draft: true,
        overrideAccess: true,
      })
      doc = draftResult.docs[0] as HomePageDoc | undefined
    }

    if (!doc?.layout?.length) return null
    if (doc._status && doc._status !== 'published' && process.env.NODE_ENV === 'production') {
      return null
    }
    return doc
  })
}

export default async function HomePage() {
  const page = await loadHomePage()

  if (page?.layout?.length) {
    return <RenderBlocks blocks={page.layout} />
  }

  return (
    <Container className="py-24 lg:py-32">
      <EmptyState
        title="Homepage content is not published"
        description="Publish a Pages document with slug “home” and layout blocks in Payload Admin."
        actionLabel="Open admin"
        href="/admin"
      />
    </Container>
  )
}
