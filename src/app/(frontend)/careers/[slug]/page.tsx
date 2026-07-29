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
  department?: string | null
  location: string
  type: string
  workMode?: string | null
  experienceRequired?: string | null
  openings?: number | null
  aboutRole?: string | null
  description?: unknown
  requirements?: unknown
  responsibilities?: { item?: string }[] | null
  requiredSkills?: { item?: string }[] | null
  preferredSkills?: { item?: string }[] | null
  qualifications?: string | null
  benefits?: { item?: string }[] | null
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
    description:
      job?.meta?.description ||
      job?.aboutRole ||
      `Apply for ${job?.title || fallback?.title} at XELARVIS.`,
    path: `/careers/${slug}`,
  })
}

function BulletList({ title, items }: { title: string; items?: { item?: string }[] | null }) {
  const values = (items || []).map((i) => i.item).filter(Boolean) as string[]
  if (!values.length) return null
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-[#0F172A]">{title}</h2>
      <ul className="mt-4 space-y-2">
        {values.map((item) => (
          <li key={item} className="flex gap-3 text-slate-700">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0D9488]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params
  const job = await getPublishedBySlug<CareerDoc>('careers', slug)
  const fallback = FALLBACK_JOBS.find((j) => j.slug === slug)

  if (!job && !fallback) notFound()

  const doc = job || {
    ...fallback!,
    aboutRole:
      'Design AI models, develop APIs, train ML models, deploy solutions, and collaborate with clients.',
    description: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Join our team to build intelligent solutions across AI, healthcare, and enterprise technology.',
              },
            ],
          },
        ],
      },
    },
    requirements: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Relevant experience, strong communication, and commitment to engineering excellence.',
              },
            ],
          },
        ],
      },
    },
    responsibilities: [
      { item: 'Design AI models' },
      { item: 'Develop APIs' },
      { item: 'Train ML models' },
      { item: 'Deploy solutions' },
      { item: 'Collaborate with clients' },
    ],
    requiredSkills: [
      { item: 'Python' },
      { item: 'Machine Learning' },
      { item: 'SQL' },
      { item: 'Cloud Platforms' },
      { item: 'Git' },
    ],
    preferredSkills: [
      { item: 'TensorFlow' },
      { item: 'LangChain' },
      { item: 'Azure AI' },
      { item: 'Docker' },
    ],
    qualifications:
      "Bachelor's or Master's degree in Computer Science, Data Science, AI, Statistics, or related field.",
    benefits: [
      { item: 'Flexible work' },
      { item: 'Learning budget' },
      { item: 'Paid leave' },
      { item: 'Research opportunities' },
    ],
  }

  const metaLine = [doc.location, doc.type?.replace('-', ' '), doc.workMode, doc.experienceRequired]
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      <PageHero
        brand="Xelarvis"
        eyebrow={doc.department || 'Careers'}
        title={doc.title}
        subtitle={metaLine}
        size="compact"
        variant="default"
        ctas={[{ label: 'Apply for this Position', href: '#apply', variant: 'accent' }]}
      />
      <Section>
        <Container className="grid gap-16 lg:grid-cols-[1fr_26rem]">
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#0F172A]">About the Role</h2>
              {doc.aboutRole ? (
                <p className="mt-4 leading-relaxed text-slate-600">{doc.aboutRole}</p>
              ) : (
                <div className="mt-4">
                  <RichText
                    content={doc.description as Parameters<typeof RichText>[0]['content']}
                  />
                </div>
              )}
            </div>
            <BulletList title="Responsibilities" items={doc.responsibilities} />
            <BulletList title="Required Skills" items={doc.requiredSkills} />
            <BulletList title="Preferred Skills" items={doc.preferredSkills} />
            {doc.qualifications ? (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0F172A]">Qualifications</h2>
                <p className="mt-4 leading-relaxed text-slate-600">{doc.qualifications}</p>
              </div>
            ) : null}
            <BulletList title="Benefits" items={doc.benefits} />
            {!doc.responsibilities?.length ? (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0F172A]">Requirements</h2>
                <div className="mt-4">
                  <RichText
                    content={doc.requirements as Parameters<typeof RichText>[0]['content']}
                  />
                </div>
              </div>
            ) : null}
          </div>
          <aside id="apply" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <h2 className="font-display text-lg font-semibold text-[#0F172A]">
                Apply for this Position
              </h2>
              <div className="mt-6">
                <CareerApplicationForm careerId={String(doc.id)} jobTitle={doc.title} />
              </div>
            </div>
          </aside>
        </Container>
      </Section>
      <div className="container-x pb-12">
        <Link href="/careers" className="text-sm font-semibold text-[#0D9488] hover:underline">
          ← All openings
        </Link>
      </div>
    </>
  )
}
