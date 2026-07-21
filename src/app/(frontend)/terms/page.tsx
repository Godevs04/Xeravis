import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Terms of Use',
  description: 'Terms of use for the Xelarvis Technologies website.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" size="compact" />
      <Section>
        <Container className="max-w-3xl space-y-6 text-secondary leading-relaxed">
          <p>
            By accessing xelarvis.in, you agree to these Terms of Use. If you do not agree, please do not use this website.
          </p>
          <h2 className="text-xl font-semibold text-primary">Use of content</h2>
          <p>
            Content on this site is provided for general information about Xelarvis Technologies and our services. You may
            not reproduce, distribute, or create derivative works without prior written consent.
          </p>
          <h2 className="text-xl font-semibold text-primary">No professional advice</h2>
          <p>
            Materials on this website do not constitute legal, financial, or professional advice. Engagements are governed by
            separate agreements between Xelarvis and clients.
          </p>
          <h2 className="text-xl font-semibold text-primary">Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Xelarvis Technologies is not liable for damages arising from use of this
            website or reliance on its content.
          </p>
          <h2 className="text-xl font-semibold text-primary">Governing law</h2>
          <p>These terms are governed by the laws of India, without regard to conflict of law principles.</p>
          <p className="text-sm text-muted">Last updated: July 2026</p>
        </Container>
      </Section>
    </>
  )
}
