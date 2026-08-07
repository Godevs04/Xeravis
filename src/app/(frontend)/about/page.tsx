import { RenderBlocks, type PageBlock } from '@/blocks/RenderBlocks'
import { AboutExploreStrip } from '@/components/about/AboutExploreStrip'
import { AboutPageHero } from '@/components/marketing/PageHeroes'
import { safePayload } from '@/lib/cms'
import { FALLBACK_ABOUT_BLOCKS } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type AboutPageDoc = {
  title?: string
  layout?: PageBlock[]
  meta?: { title?: string; description?: string; image?: unknown }
  _status?: string | null
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

    let doc = result.docs[0] as AboutPageDoc | undefined

    if (!doc?.layout?.length) {
      const draftResult = await payload.find({
        collection: 'pages',
        where: { slug: { equals: 'about' } },
        limit: 1,
        depth: 2,
        draft: true,
        overrideAccess: true,
      })
      doc = draftResult.docs[0] as AboutPageDoc | undefined
    }

    if (!doc?.layout?.length) return null
    if (doc._status && doc._status !== 'published' && process.env.NODE_ENV === 'production') {
      return null
    }
    return doc
  })
}

function withoutHeroBlocks(blocks: PageBlock[]) {
  return blocks.filter((b) => b.blockType !== 'hero' && b.blockType !== 'storyHero')
}

export async function generateMetadata() {
  const page = await loadAboutPage()
  return buildMetadata({
    title: page?.meta?.title || page?.title || 'About',
    description:
      page?.meta?.description ||
      'Learn about Xelarvis—a global AI research, IT consulting, data science, and healthcare AI company.',
    image: page?.meta?.image,
    path: '/about',
  })
}

export default async function AboutPage() {
  const page = await loadAboutPage()
  const raw = page?.layout?.length ? page.layout : (FALLBACK_ABOUT_BLOCKS as unknown as PageBlock[])

  return (
    <>
      <AboutPageHero
        title="Global AI Research, IT Consulting, Data Science & Healthcare AI"
        subtitle="XELARVIS PRIVATE LIMITED is positioned closer to enterprise consulting and applied research organizations than to a typical software agency—helping organisations transform data into measurable business value."
      />
      <AboutExploreStrip />
      <RenderBlocks blocks={withoutHeroBlocks(raw)} />
    </>
  )
}
