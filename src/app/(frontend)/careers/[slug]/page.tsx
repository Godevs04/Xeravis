import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/RichText'
import { CareerApplicationForm } from '@/components/forms/CareerApplicationForm'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { FALLBACK_JOBS } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type CareerDoc = {
  id: string
  title: string
  slug: string
  department: string
  location: string
  type: string
  description?: unknown
  requirements?: unknown
  active?: boolean | null
  meta?: { title?: string; description?: string; image?: unknown }
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const careers = await listPublished<CareerDoc>('careers')
  const slugs = careers.length ? careers : FALLBACK_JOBS
  return slugs.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const job = await getPublishedBySlug<CareerDoc>('careers', slug)
  const fallback = FALLBACK_JOBS.find((j) => j.slug === slug)

  return buildMetadata({
    title: job?.meta?.title || job?.title || fallback?.title,
    description: job?.meta?.description || `Apply for ${job?.title || fallback?.title} at Xelarvis Technologies.`,
    path: `/careers/${slug}`,
  })
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params
  const job = await getPublishedBySlug<CareerDoc>('careers', slug)
  const fallback = FALLBACK_JOBS.find((j) => j.slug === slug)

  if (!job && !fallback) notFound()

  const doc = job || {
    ...fallback!,
    description: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Join our team to build enterprise-grade software with measurable impact.' }],
          },
        ],
      },
    },
    requirements: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Relevant experience, strong communication, and commitment to engineering excellence.' }],
          },
        ],
      },
    },
  }

  return (
    <>
      <PageHero
        eyebrow={doc.department}
        title={doc.title}
        subtitle={`${doc.location} · ${doc.type.replace('-', ' ')}`}
        size="compact"
      />
      <Section>
        <Container className="grid gap-16 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold">About the role</h2>
              <div className="mt-4">
                <RichText content={doc.description as Parameters<typeof RichText>[0]['content']} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Requirements</h2>
              <div className="mt-4">
                <RichText content={doc.requirements as Parameters<typeof RichText>[0]['content']} />
              </div>
            </div>
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border p-6">
              <h2 className="text-lg font-semibold">Apply</h2>
              <div className="mt-6">
                <CareerApplicationForm careerId={String(doc.id)} jobTitle={doc.title} />
              </div>
            </div>
          </aside>
        </Container>
      </Section>
      <div className="container-x pb-12">
        <Link href="/careers" className="text-sm font-semibold text-accent hover:underline">
          ← All openings
        </Link>
      </div>
    </>
  )
}
