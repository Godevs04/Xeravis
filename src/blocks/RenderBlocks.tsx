import { CaseStudyFeature } from '@/blocks/CaseStudyFeature'
import { ClientLogos } from '@/blocks/ClientLogos'
import { CTABand } from '@/blocks/CTABand'
import { FAQAccordion } from '@/blocks/FAQAccordion'
import { FeatureSplit } from '@/blocks/FeatureSplit'
import { HeroBanner } from '@/blocks/HeroBanner'
import { IndustriesStrip } from '@/blocks/IndustriesStrip'
import { ProcessSteps } from '@/blocks/ProcessSteps'
import { RichTextBlock } from '@/blocks/RichTextBlock'
import { ServicesGrid } from '@/blocks/ServicesGrid'
import { StatsRow } from '@/blocks/StatsRow'
import { TeamGrid } from '@/blocks/TeamGrid'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock'

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
                image={block.image}
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
          case 'caseStudyFeature':
            return <CaseStudyFeature key={key} heading={block.heading as string} />
          case 'testimonials':
            return <TestimonialsBlock key={key} heading={block.heading as string} />
          case 'teamGrid':
            return <TeamGrid key={key} heading={block.heading as string} />
          case 'clientLogos':
            return <ClientLogos key={key} heading={block.heading as string} />
          case 'statsRow':
            return (
              <StatsRow
                key={key}
                heading={block.heading as string}
                stats={block.stats as { label: string; value: string }[] | undefined}
              />
            )
          case 'ctaBand':
            return (
              <CTABand
                key={key}
                heading={block.heading as string}
                subheading={block.subheading as string | undefined}
                ctaLabel={block.ctaLabel as string}
                ctaHref={block.ctaHref as string}
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
          default:
            return null
        }
      })}
    </>
  )
}
