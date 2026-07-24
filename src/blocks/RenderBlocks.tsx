import { AboutPreview } from '@/blocks/AboutPreview'
import { CareerBanner, NewsletterBlock } from '@/blocks/CareerBanner'
import { CaseStudyFeature } from '@/blocks/CaseStudyFeature'
import { ClientLogos } from '@/blocks/ClientLogos'
import { CTABand } from '@/blocks/CTABand'
import { FAQAccordion } from '@/blocks/FAQAccordion'
import { FeatureSplit } from '@/blocks/FeatureSplit'
import { HeroBanner } from '@/blocks/HeroBanner'
import { IndustriesStrip } from '@/blocks/IndustriesStrip'
import { LatestBlogs } from '@/blocks/LatestBlogs'
import { MissionVision, ValuesGrid } from '@/blocks/MissionVision'
import { ProcessSteps } from '@/blocks/ProcessSteps'
import { RichTextBlock } from '@/blocks/RichTextBlock'
import { ServicesGrid } from '@/blocks/ServicesGrid'
import { StatsRow } from '@/blocks/StatsRow'
import { TeamGrid } from '@/blocks/TeamGrid'
import { TechnologyGrid } from '@/blocks/TechnologyGrid'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock'
import { TimelineBlock } from '@/blocks/TimelineBlock'
import { WhyChooseUs } from '@/blocks/WhyChooseUs'

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
                stats={block.stats as { label: string; value: string }[] | undefined}
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
          default:
            return null
        }
      })}
    </>
  )
}
