import { RenderBlocks, type PageBlock } from '@/blocks/RenderBlocks'
import { HomeGatewayStrip } from '@/components/home/HomeGatewayStrip'
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
    return (
      <>
        <RenderBlocks blocks={page.layout} />
        <HomeGatewayStrip />
      </>
    )
  }

  // Build/runtime fallback when CMS is unreachable — keeps LCP/CLS stable vs empty shell.
  return (
    <>
      <RenderBlocks
        blocks={[
          {
            blockType: 'storyHero',
            heading: 'Engineering Intelligence. Transforming Business.',
            subheading:
              'Artificial Intelligence, Data Science, and IT Consulting—with Healthcare AI as a specialty.',
            ctaLabel: "Let's Talk",
            ctaHref: '/contact?intent=business',
            secondaryCtaLabel: 'Explore services',
            secondaryCtaHref: '/services',
            brand: 'Xelarvis',
          },
        ]}
      />
      <HomeGatewayStrip />
    </>
  )
}
