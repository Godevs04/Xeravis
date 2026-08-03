import { notFound } from 'next/navigation'

import { JobDetailView } from '@/components/careers/JobDetailView'
import { RichText } from '@/components/RichText'
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

  return (
    <JobDetailView
      job={{
        id: String(doc.id),
        title: doc.title,
        department: doc.department,
        location: doc.location,
        type: doc.type,
        workMode: doc.workMode,
        experienceRequired: doc.experienceRequired,
        openings: doc.openings,
        aboutRole: doc.aboutRole,
        qualifications: doc.qualifications,
        responsibilities: doc.responsibilities,
        requiredSkills: doc.requiredSkills,
        preferredSkills: doc.preferredSkills,
        benefits: doc.benefits,
      }}
      descriptionSlot={
        doc.description ? (
          <RichText content={doc.description as Parameters<typeof RichText>[0]['content']} />
        ) : null
      }
      requirementsSlot={
        doc.requirements ? (
          <RichText content={doc.requirements as Parameters<typeof RichText>[0]['content']} />
        ) : null
      }
    />
  )
}
