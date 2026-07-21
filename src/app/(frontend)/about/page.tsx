import Link from 'next/link'

import { ClientLogos } from '@/blocks/ClientLogos'
import { CTABand } from '@/blocks/CTABand'
import { FeatureSplit } from '@/blocks/FeatureSplit'
import { StatsRow } from '@/blocks/StatsRow'
import { TeamGrid } from '@/blocks/TeamGrid'
import { PageHero } from '@/components/layout/PageHero'
import { buildMetadata } from '@/lib/seo'
import { UNSPLASH } from '@/lib/fallback-data'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'About',
  description: 'Learn about Xelarvis Technologies — our mission, leadership, and approach to enterprise engineering.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Built for enterprises that demand precision."
        subtitle="Xelarvis Technologies partners with organizations to engineer platforms, products, and data systems with long-term maintainability."
        image={UNSPLASH.team}
        ctas={[{ label: 'Talk to us', href: '/contact', variant: 'accent' }]}
      />
      <StatsRow heading="Company metrics" />
      <FeatureSplit
        heading="Our approach"
        body={{
          root: {
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'We combine product thinking, platform engineering, and operational discipline. Every engagement is structured for measurable outcomes — not slide decks.',
                  },
                ],
              },
            ],
          },
        }}
        image={UNSPLASH.office}
      />
      <TeamGrid heading="Leadership" />
      <ClientLogos heading="Trusted by forward-looking teams" />
      <CTABand
        heading="Explore how we work with your industry"
        subheading="See tailored solutions across financial services, healthcare, manufacturing, and more."
        ctaLabel="View industries"
        ctaHref="/industries"
      />
      <section className="py-12">
        <div className="container-x">
          <Link href="/careers" className="text-sm font-semibold text-accent hover:underline">
            Join our team →
          </Link>
        </div>
      </section>
    </>
  )
}
