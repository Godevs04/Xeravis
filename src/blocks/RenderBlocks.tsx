import dynamic from 'next/dynamic'

import { CareerBanner, NewsletterBlock } from '@/blocks/CareerBanner'
import { CaseStudyFeature } from '@/blocks/CaseStudyFeature'
import { ClientLogos } from '@/blocks/ClientLogos'
import { FAQAccordion } from '@/blocks/FAQAccordion'
import { FeatureSplit } from '@/blocks/FeatureSplit'
import { HeroBanner } from '@/blocks/HeroBanner'
import { IndustriesStrip } from '@/blocks/IndustriesStrip'
import { LatestBlogs } from '@/blocks/LatestBlogs'
import { MissionVision, ValuesGrid } from '@/blocks/MissionVision'
import { RichTextBlock } from '@/blocks/RichTextBlock'
import { ServicesGrid } from '@/blocks/ServicesGrid'
import { StoryCapabilitiesBlock } from '@/blocks/story/StoryCapabilitiesBlock'
import { StoryCasesBlock } from '@/blocks/story/StoryCasesBlock'
import { StoryHero } from '@/blocks/story/StoryHero'
import { StoryPresenceBlock } from '@/blocks/story/StoryPresenceBlock'
import { StorySolutionsBlock } from '@/blocks/story/StorySolutionsBlock'
import { StoryTechOrbitBlock } from '@/blocks/story/StoryTechOrbitBlock'
import { TeamGrid } from '@/blocks/TeamGrid'
import { TechnologyGrid } from '@/blocks/TechnologyGrid'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock'
import { TimelineBlock } from '@/blocks/TimelineBlock'
import { WhyChooseUs } from '@/blocks/WhyChooseUs'

// Client blocks are code-split so a page only downloads the blocks it renders (still SSR'd).
const AboutPreview = dynamic(() => import('@/blocks/AboutPreview').then((m) => m.AboutPreview))
const CTABand = dynamic(() => import('@/blocks/CTABand').then((m) => m.CTABand))
const ProcessSteps = dynamic(() => import('@/blocks/ProcessSteps').then((m) => m.ProcessSteps))
const StatsRow = dynamic(() => import('@/blocks/StatsRow').then((m) => m.StatsRow))
const StoryChallenge = dynamic(() =>
  import('@/blocks/story/StoryChallenge').then((m) => m.StoryChallenge),
)
const StoryCta = dynamic(() => import('@/blocks/story/StoryCta').then((m) => m.StoryCta))
const StoryProcess = dynamic(() =>
  import('@/blocks/story/StoryProcess').then((m) => m.StoryProcess),
)
const StoryProof = dynamic(() => import('@/blocks/story/StoryProof').then((m) => m.StoryProof))
const StorySolution = dynamic(() =>
  import('@/blocks/story/StorySolution').then((m) => m.StorySolution),
)

export type PageBlock = {
  blockType: string
  id?: string | null
  [key: string]: unknown
}

type RenderBlocksProps = {
  blocks: PageBlock[]
}

export function RenderBlocks({ blocks }: RenderBlocksProps) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id || `${block.blockType}-${index}`

        switch (block.blockType) {
          case 'hero':
            return (
              <HeroBanner
                key={key}
                eyebrow={block.eyebrow as string | undefined}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
                ctaLabel={block.ctaLabel as string | undefined}
                ctaHref={block.ctaHref as string | undefined}
                secondaryCtaLabel={block.secondaryCtaLabel as string | undefined}
                secondaryCtaHref={block.secondaryCtaHref as string | undefined}
                image={block.image}
              />
            )
          case 'statistics':
          case 'statsRow':
            return (
              <StatsRow
                key={key}
                heading={(block.heading as string) || 'Trust indicators'}
                stats={
                  block.stats as
                    { label: string; value: string; suffix?: string | null }[] | undefined
                }
              />
            )
          case 'aboutPreview':
            return (
              <AboutPreview
                key={key}
                heading={block.heading as string}
                body={block.body as string}
                cta={block.cta as { label?: string; href?: string } | undefined}
              />
            )
          case 'richText':
            return <RichTextBlock key={key} content={block.content} />
          case 'servicesGrid':
            return (
              <ServicesGrid
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
              />
            )
          case 'industriesStrip':
            return (
              <IndustriesStrip
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
              />
            )
          case 'whyChooseUs':
            return (
              <WhyChooseUs
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
                items={block.items as { title: string; description: string }[] | undefined}
              />
            )
          case 'caseStudyFeature':
            return <CaseStudyFeature key={key} heading={block.heading as string} />
          case 'technologyGrid':
            return (
              <TechnologyGrid
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
              />
            )
          case 'testimonials':
            return <TestimonialsBlock key={key} heading={block.heading as string} />
          case 'latestBlogs':
            return (
              <LatestBlogs
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
              />
            )
          case 'careerBanner':
            return (
              <CareerBanner
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
                cta={block.cta as { label?: string; href?: string } | undefined}
              />
            )
          case 'newsletter':
            return (
              <NewsletterBlock
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
              />
            )
          case 'teamGrid':
            return <TeamGrid key={key} heading={block.heading as string} />
          case 'clientLogos':
            return <ClientLogos key={key} heading={block.heading as string} />
          case 'ctaBand':
            return (
              <CTABand
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
                ctaLabel={(block.ctaLabel as string) || 'Schedule a Consultation'}
                ctaHref={(block.ctaHref as string) || '/contact?intent=project'}
              />
            )
          case 'contactCta': {
            const cta = block.cta as { label?: string; href?: string } | undefined
            return (
              <CTABand
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
                ctaLabel={cta?.label || 'Contact us'}
                ctaHref={cta?.href || '/contact'}
              />
            )
          }
          case 'imageGallery':
            return (
              <FeatureSplit
                key={key}
                heading={(block.heading as string) || 'Gallery'}
                body={undefined}
                image={
                  Array.isArray(block.images) &&
                  block.images[0] &&
                  typeof block.images[0] === 'object'
                    ? (block.images[0] as { image?: unknown }).image
                    : undefined
                }
              />
            )
          case 'videoSection':
            return (
              <FeatureSplit
                key={key}
                heading={block.heading as string}
                body={
                  block.subheading
                    ? {
                        root: {
                          children: [
                            {
                              type: 'paragraph',
                              children: [{ type: 'text', text: String(block.subheading) }],
                            },
                          ],
                        },
                      }
                    : undefined
                }
                image={block.poster}
              />
            )
          case 'faqAccordion':
            return (
              <FAQAccordion
                key={key}
                heading={block.heading as string}
                group={block.group as string | undefined}
              />
            )
          case 'featureSplit':
            return (
              <FeatureSplit
                key={key}
                heading={block.heading as string}
                body={block.body}
                image={block.image}
                reverse={block.reverse as boolean | undefined}
              />
            )
          case 'processSteps':
            return (
              <ProcessSteps
                key={key}
                heading={block.heading as string}
                steps={block.steps as { title: string; description: string }[] | undefined}
              />
            )
          case 'timeline':
            return (
              <TimelineBlock
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
                items={
                  block.items as
                    | { title: string; description?: string | null; date?: string | null }[]
                    | undefined
                }
              />
            )
          case 'missionVision':
            return (
              <MissionVision
                key={key}
                heading={block.heading as string}
                missionTitle={block.missionTitle as string | undefined}
                missionBody={block.missionBody as string}
                visionTitle={block.visionTitle as string | undefined}
                visionBody={block.visionBody as string}
              />
            )
          case 'valuesGrid':
            return (
              <ValuesGrid
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
                values={block.values as { title: string; description: string }[] | undefined}
              />
            )
          case 'storyHero':
            return (
              <StoryHero
                key={key}
                brand={block.brand as string | undefined}
                eyebrow={block.eyebrow as string | undefined}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
                ctaLabel={block.ctaLabel as string | undefined}
                ctaHref={block.ctaHref as string | undefined}
                secondaryCtaLabel={block.secondaryCtaLabel as string | undefined}
                secondaryCtaHref={block.secondaryCtaHref as string | undefined}
              />
            )
          case 'storyChallenge':
            return (
              <StoryChallenge
                key={key}
                eyebrow={block.eyebrow as string | undefined}
                heading={block.heading as string}
                items={block.items as { title: string; body?: string | null }[] | undefined}
              />
            )
          case 'storySolution':
            return (
              <StorySolution
                key={key}
                eyebrow={block.eyebrow as string | undefined}
                heading={block.heading as string}
                chapters={block.chapters as { title: string; body: string }[] | undefined}
              />
            )
          case 'storyCapabilities':
            return (
              <StoryCapabilitiesBlock
                key={key}
                eyebrow={block.eyebrow as string | undefined}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
              />
            )
          case 'storySolutions':
            return (
              <StorySolutionsBlock
                key={key}
                eyebrow={block.eyebrow as string | undefined}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
              />
            )
          case 'storyTechOrbit':
            return (
              <StoryTechOrbitBlock
                key={key}
                eyebrow={block.eyebrow as string | undefined}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
              />
            )
          case 'storyProof':
            return (
              <StoryProof
                key={key}
                eyebrow={block.eyebrow as string | undefined}
                heading={block.heading as string}
                stats={
                  block.stats as
                    { label: string; value: string; suffix?: string | null }[] | undefined
                }
              />
            )
          case 'storyCases':
            return (
              <StoryCasesBlock
                key={key}
                eyebrow={block.eyebrow as string | undefined}
                heading={block.heading as string}
              />
            )
          case 'storyProcess':
            return (
              <StoryProcess
                key={key}
                eyebrow={block.eyebrow as string | undefined}
                heading={block.heading as string}
                steps={block.steps as { title: string; description: string }[] | undefined}
              />
            )
          case 'storyPresence':
            return (
              <StoryPresenceBlock
                key={key}
                eyebrow={block.eyebrow as string | undefined}
                heading={block.heading as string}
              />
            )
          case 'storyCta':
            return (
              <StoryCta
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
                ctaLabel={block.ctaLabel as string | undefined}
                ctaHref={block.ctaHref as string | undefined}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
