import { CTABand } from '@/blocks/CTABand'
import { CaseStudyFeature } from '@/blocks/CaseStudyFeature'
import { HeroBannerFallback } from '@/blocks/HeroBanner'
import { IndustriesStrip } from '@/blocks/IndustriesStrip'
import { RenderBlocks, type PageBlock } from '@/blocks/RenderBlocks'
import { ServicesGrid } from '@/blocks/ServicesGrid'
import { StatsRow } from '@/blocks/StatsRow'
import { safePayload } from '@/lib/cms'

export const revalidate = 60

type HomePageDoc = {
  layout?: PageBlock[]
}

async function loadHomePage() {
  return safePayload(async (payload) => {
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' },
        _status: { equals: 'published' },
      },
      limit: 1,
      depth: 2,
    })
    return (result.docs[0] as HomePageDoc) ?? null
  })
}

function FallbackHome() {
  return (
    <>
      <HeroBannerFallback />
      <StatsRow heading="Xelarvis at a glance" />
      <ServicesGrid
        heading="Capabilities for modern enterprises"
        subheading="From platform engineering to AI-enabled products, we deliver with precision and pace."
      />
      <IndustriesStrip
        heading="Industries we serve"
        subheading="Deep domain context across regulated and high-scale environments."
      />
      <CaseStudyFeature heading="Proof of delivery" />
      <CTABand
        heading="Ready to accelerate your next initiative?"
        subheading="Speak with our consultants about architecture, delivery, or managed platforms."
        ctaLabel="Talk to us"
        ctaHref="/contact"
      />
    </>
  )
}

export default async function HomePage() {
  const page = await loadHomePage()

  if (page?.layout?.length) {
    return <RenderBlocks blocks={page.layout} />
  }

  return <FallbackHome />
}
