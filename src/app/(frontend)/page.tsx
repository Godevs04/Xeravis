import { RenderBlocks, type PageBlock } from '@/blocks/RenderBlocks'
import { safePayload } from '@/lib/cms'

export const revalidate = 60

/** Sections folded into others (capabilities → "What we do") or retired for unverifiable claims. */
const RETIRED_HOME_BLOCKS = new Set(['storyCapabilities', 'storyProof', 'storyPresence'])

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
  const blocks = page?.layout?.filter((block) => !RETIRED_HOME_BLOCKS.has(block.blockType))

  if (blocks?.length) {
    return <RenderBlocks blocks={blocks} />
  }

  // Build/runtime fallback when CMS is unreachable — keeps LCP/CLS stable vs empty shell.
  return (
    <RenderBlocks
      blocks={[
        {
          blockType: 'storyHero',
          heading: 'Engineering Intelligence. Transforming Business.',
          subheading:
            'XELARVIS combines Artificial Intelligence, Data Science and IT Consulting to help organizations turn complex data and technology challenges into measurable business outcomes.',
          ctaLabel: 'Explore Our Capabilities',
          ctaHref: '/services',
          secondaryCtaLabel: 'Talk to XELARVIS',
          secondaryCtaHref: '/contact?intent=business',
          brand: 'Xelarvis',
        },
        {
          blockType: 'storyCta',
          heading: "Let's solve your next data, AI or technology challenge.",
          ctaLabel: 'Talk to XELARVIS',
          ctaHref: '/contact?intent=business',
        },
      ]}
    />
  )
}
