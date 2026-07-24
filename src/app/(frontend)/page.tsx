import { AboutPreview } from '@/blocks/AboutPreview'
import { CareerBanner } from '@/blocks/CareerBanner'
import { CaseStudyFeature } from '@/blocks/CaseStudyFeature'
import { CTABand } from '@/blocks/CTABand'
import { HeroBannerFallback } from '@/blocks/HeroBanner'
import { IndustriesStrip } from '@/blocks/IndustriesStrip'
import { LatestBlogs } from '@/blocks/LatestBlogs'
import { ProcessSteps } from '@/blocks/ProcessSteps'
import { RenderBlocks, type PageBlock } from '@/blocks/RenderBlocks'
import { ServicesGrid } from '@/blocks/ServicesGrid'
import { StatsRow } from '@/blocks/StatsRow'
import { TechnologyGrid } from '@/blocks/TechnologyGrid'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock'
import { WhyChooseUs } from '@/blocks/WhyChooseUs'
import { safePayload } from '@/lib/cms'
import { FALLBACK_STATS } from '@/lib/fallback-data'

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

const DEFAULT_PROCESS = [
  { title: 'Discovery', description: 'Clarify goals, constraints, and success metrics.' },
  { title: 'Planning', description: 'Architecture, roadmap, and delivery plan.' },
  { title: 'UI/UX', description: 'Research-led interfaces that convert and clarify.' },
  { title: 'Development', description: 'Production-grade engineering with code review.' },
  { title: 'Testing', description: 'Quality gates across functional and non-functional needs.' },
  { title: 'Deployment', description: 'Safe releases with observability and rollback.' },
  { title: 'Support', description: 'Continuous improvement and enterprise support.' },
]

function FallbackHome() {
  return (
    <>
      <HeroBannerFallback />
      <StatsRow heading="Trust indicators" stats={FALLBACK_STATS} />
      <AboutPreview
        heading="A technology partner built for durable outcomes."
        body="We help startups, enterprises, and institutions modernize products and platforms — with senior ownership, transparent process, and engineering that lasts."
        cta={{ label: 'Learn more', href: '/about' }}
      />
      <ServicesGrid
        heading="Capabilities for modern enterprises"
        subheading="From platform engineering to AI-enabled products, we deliver with precision and pace."
      />
      <IndustriesStrip
        heading="Industries we serve"
        subheading="Domain-aware teams for complex operating environments."
      />
      <WhyChooseUs heading="Why choose us" />
      <CaseStudyFeature heading="Featured projects" />
      <TechnologyGrid
        heading="Technology expertise"
        subheading="Modern stacks selected for maintainability, security, and scale."
      />
      <ProcessSteps heading="How we deliver" steps={DEFAULT_PROCESS} />
      <TestimonialsBlock heading="What clients say" />
      <LatestBlogs heading="Insights" subheading="Perspective from our engineering and delivery practice." />
      <CareerBanner
        heading="Join our team"
        subheading="Build enterprise systems with people who care about craft."
        cta={{ label: 'Open positions', href: '/careers' }}
      />
      <CTABand
        heading="Ready to build your next digital product?"
        subheading="Tell us about your product, platform, or transformation goals."
        ctaLabel="Schedule a Consultation"
        ctaHref="/contact?intent=project"
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
