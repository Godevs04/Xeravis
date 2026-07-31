import { RenderBlocks, type PageBlock } from '@/blocks/RenderBlocks'
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
      'Learn about Xelarvis Technologies — our mission, leadership, and approach to enterprise engineering.',
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
        title="Engineering Intelligent Solutions for Healthcare, AI, and Digital Transformation"
        subtitle="XELARVIS PRIVATE LIMITED specializes in Healthcare AI, Clinical Data Science, Machine Learning, Advanced Analytics, and Enterprise Software Solutions."
      />
      <RenderBlocks blocks={withoutHeroBlocks(raw)} />
    </>
  )
}
