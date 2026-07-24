import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABand } from '@/blocks/CTABand'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/RichText'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { getMediaUrl } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type IndustryDoc = {
  id: string
  title: string
  slug: string
  summary: string
  challenges?: string | null
  problems?: { title: string; description: string }[] | null
  solutions?: { title: string; description: string }[] | null
  approach?: unknown
  heroImage?: unknown
  meta?: { title?: string; description?: string; image?: unknown }
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const industries = await listPublished<IndustryDoc>('industries')
  return industries.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const industry = await getPublishedBySlug<IndustryDoc>('industries', slug)

  return buildMetadata({
    title: industry?.meta?.title || industry?.title || 'Industry',
    description: industry?.meta?.description || industry?.summary,
    image: industry?.meta?.image || industry?.heroImage,
    path: `/industries/${slug}`,
  })
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params
  const industry = await getPublishedBySlug<IndustryDoc>('industries', slug)

  if (!industry) notFound()

  const heroUrl = getMediaUrl(industry.heroImage as Parameters<typeof getMediaUrl>[0])

  return (
    <>
      <PageHero
        eyebrow="Industry"
        title={industry.title}
        subtitle={industry.summary}
        image={heroUrl || undefined}
        size="compact"
        ctas={[{ label: 'Discuss your sector', href: '/contact', variant: 'accent' }]}
      />
      {industry.problems && industry.problems.length > 0 ? (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold">Problems</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {industry.problems.map((item) => (
                <li key={item.title} className="border-border border-b pb-6">
                  <h3 className="text-primary font-semibold">{item.title}</h3>
                  <p className="text-secondary mt-2 text-sm">{item.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : industry.challenges ? (
        <Section>
          <Container className="max-w-3xl">
            <h2 className="text-2xl font-bold">Industry challenges</h2>
            <p className="text-secondary mt-4 leading-relaxed">{industry.challenges}</p>
          </Container>
        </Section>
      ) : null}
      {industry.solutions && industry.solutions.length > 0 ? (
        <Section surface>
          <Container>
            <h2 className="text-2xl font-bold">How we help</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {industry.solutions.map((item) => (
                <li key={item.title} className="border-border border-b pb-6">
                  <h3 className="text-primary font-semibold">{item.title}</h3>
                  <p className="text-secondary mt-2 text-sm">{item.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
      {industry.approach ? (
        <Section surface={!industry.solutions?.length}>
          <Container className="max-w-3xl">
            <h2 className="text-2xl font-bold">Our approach</h2>
            <div className="mt-6">
              <RichText content={industry.approach as Parameters<typeof RichText>[0]['content']} />
            </div>
          </Container>
        </Section>
      ) : null}
      <CTABand
        heading="See services for this industry"
        subheading="Explore capabilities aligned to your operating model."
        ctaLabel="View services"
        ctaHref="/services"
      />
      <div className="container-x pb-12">
        <Link href="/industries" className="text-accent text-sm font-semibold hover:underline">
          ← All industries
        </Link>
      </div>
    </>
  )
}
