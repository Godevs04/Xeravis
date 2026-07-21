import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'Privacy policy for Xelarvis Technologies.',
  path: '/privacy-policy',
})

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" size="compact" />
      <Section>
        <Container className="max-w-3xl space-y-6 text-secondary leading-relaxed">
          <p>
            Xelarvis Technologies (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy describes how we
            collect, use, and protect personal information submitted through our website at xelarvis.in.
          </p>
          <h2 className="text-xl font-semibold text-primary">Information we collect</h2>
          <p>
            When you contact us, subscribe to updates, or apply for a role, we may collect your name, email address,
            phone number, company name, resume, and any message content you provide voluntarily.
          </p>
          <h2 className="text-xl font-semibold text-primary">How we use information</h2>
          <p>
            We use submitted information to respond to enquiries, process job applications, send requested communications,
            and improve our services. We do not sell personal data to third parties.
          </p>
          <h2 className="text-xl font-semibold text-primary">Data retention</h2>
          <p>
            We retain information only as long as necessary for the purposes described above or as required by applicable law.
          </p>
          <h2 className="text-xl font-semibold text-primary">Contact</h2>
          <p>
            For privacy-related questions, email{' '}
            <a href="mailto:hello@xelarvis.in" className="text-accent hover:underline">
              hello@xelarvis.in
            </a>
            .
          </p>
          <p className="text-sm text-muted">Last updated: July 2026</p>
        </Container>
      </Section>
    </>
  )
}
