import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABand } from '@/blocks/CTABand'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/RichText'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { FALLBACK_SERVICES } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type ServiceDoc = {
  id: string
  title: string
  slug: string
  summary: string
  body?: unknown
  benefits?: { title: string; description: string }[]
  meta?: { title?: string; description?: string; image?: unknown }
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const services = await listPublished<ServiceDoc>('services')
  const slugs = services.length ? services : FALLBACK_SERVICES
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const service = await getPublishedBySlug<ServiceDoc>('services', slug)
  const fallback = FALLBACK_SERVICES.find((s) => s.slug === slug)

  if (!service && !fallback) return buildMetadata({ title: 'Service', path: `/services/${slug}` })

  return buildMetadata({
    title: service?.meta?.title || service?.title || fallback?.title,
    description: service?.meta?.description || service?.summary || fallback?.summary,
    image: service?.meta?.image,
    path: `/services/${slug}`,
  })
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getPublishedBySlug<ServiceDoc>('services', slug)
  const fallback = FALLBACK_SERVICES.find((s) => s.slug === slug)

  if (!service && !fallback) notFound()

  const doc = service || {
    ...fallback!,
    body: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: fallback!.summary }],
          },
        ],
      },
    },
    benefits: [],
  }

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={doc.title}
        subtitle={doc.summary}
        size="compact"
        ctas={[{ label: 'Discuss this service', href: '/contact', variant: 'accent' }]}
      />
      <Section>
        <Container className="max-w-3xl">
          <RichText content={doc.body as Parameters<typeof RichText>[0]['content']} />
        </Container>
      </Section>
      {doc.benefits && doc.benefits.length > 0 && (
        <Section surface>
          <Container>
            <h2 className="text-2xl font-bold">Key benefits</h2>
            <ul className="mt-8 space-y-6">
              {doc.benefits.map((benefit) => (
                <li key={benefit.title} className="border-b border-border pb-6">
                  <h3 className="font-semibold text-primary">{benefit.title}</h3>
                  <p className="mt-2 text-secondary">{benefit.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
      <CTABand
        heading="Plan your next initiative"
        subheading="Our architects can assess fit, scope, and delivery approach in an introductory session."
        ctaLabel="Talk to us"
        ctaHref="/contact"
      />
      <div className="container-x pb-12">
        <Link href="/services" className="text-sm font-semibold text-accent hover:underline">
          ← All services
        </Link>
      </div>
    </>
  )
}
