import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How Xelarvis Technologies collects, uses, stores and protects personal data from website visitors, clients and job applicants, and how to exercise your privacy rights.',
  path: '/privacy-policy',
})

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" size="compact" />
      <Section>
        <Container className="text-secondary max-w-3xl space-y-6 leading-relaxed">
          <p>
            Xelarvis Technologies (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This
            policy describes how we collect, use, and protect personal information submitted through
            our website at xelarvis.in.
          </p>
          <h2 className="text-primary text-xl font-semibold">Information we collect</h2>
          <p>
            When you contact us, subscribe to updates, or apply for a role, we may collect your
            name, email address, phone number, company name, resume, and any message content you
            provide voluntarily.
          </p>
          <h2 className="text-primary text-xl font-semibold">How we use information</h2>
          <p>
            We use submitted information to respond to enquiries, process job applications, send
            requested communications, and improve our services. We do not sell personal data to
            third parties.
          </p>
          <h2 className="text-primary text-xl font-semibold">Data retention</h2>
          <p>
            We retain information only as long as necessary for the purposes described above or as
            required by applicable law.
          </p>
          <h2 className="text-primary text-xl font-semibold">Contact</h2>
          <p>
            For privacy-related questions, email{' '}
            <a href="mailto:hello@xelarvis.in" className="text-accent hover:underline">
              hello@xelarvis.in
            </a>
            .
          </p>
          <p className="text-muted text-sm">Last updated: July 2026</p>
        </Container>
      </Section>
    </>
  )
}
