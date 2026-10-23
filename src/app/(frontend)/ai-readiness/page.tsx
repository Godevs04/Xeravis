import { AiReadinessAssessment } from '@/components/assessment/AiReadinessAssessment'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'AI Readiness Assessment',
  description:
    'Take the free 2-minute Xelarvis AI readiness assessment. Score your data, platform, skills and governance maturity and get recommended next steps for adopting AI.',
  path: '/ai-readiness',
})

export default function AiReadinessPage() {
  return (
    <>
      <PageHero
        brand="Xelarvis"
        eyebrow="Free assessment"
        title="How ready is your organisation for AI?"
        subtitle="Answer eight quick questions to score your data, platform, skills and governance maturity. You get instant results and practical next steps."
        size="compact"
      />
      <Section>
        <Container className="max-w-3xl">
          <AiReadinessAssessment />
        </Container>
      </Section>
    </>
  )
}
