import { notFound } from 'next/navigation'

import { RelatedContent } from '@/components/content/RelatedContent'
import { JobDetailView } from '@/components/careers/JobDetailView'
import { JsonLd } from '@/components/seo/JsonLd'
import { RichText } from '@/components/RichText'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { FALLBACK_JOB_DETAILS, FALLBACK_JOBS } from '@/lib/fallback-data'
import { buildRelatedGroups } from '@/lib/related-content'
import { breadcrumbJsonLd, buildMetadata, graphJsonLd, jobPostingJsonLd } from '@/lib/seo'

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
  applicationDeadline?: string | null
  active?: boolean | null
  updatedAt?: string | null
  createdAt?: string | null
  postedAt?: string | null
  relatedServices?: unknown
  relatedSolutions?: unknown
  relatedIndustries?: unknown
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
  const title = job?.meta?.title || job?.title || fallback?.title

  return buildMetadata({
    title: title || 'Careers',
    description:
      job?.meta?.description ||
      job?.aboutRole ||
      FALLBACK_JOB_DETAILS[slug]?.aboutRole ||
      `Apply for ${job?.title || fallback?.title || 'open roles'} at Xelarvis—AI, Data Science, and IT Consulting.`,
    path: `/careers/${slug}`,
  })
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params
  const job = await getPublishedBySlug<CareerDoc>('careers', slug)
  const fallback = FALLBACK_JOBS.find((j) => j.slug === slug)
  const fallbackDetail = FALLBACK_JOB_DETAILS[slug]

  if (!job && !fallback) notFound()

  const applicationsOpen = Boolean(job?.id && job.active !== false)

  const doc = job || {
    ...fallback!,
    aboutRole: fallbackDetail?.aboutRole,
    description: undefined,
    requirements: undefined,
    responsibilities: fallbackDetail?.responsibilities,
    requiredSkills: fallbackDetail?.requiredSkills,
    preferredSkills: fallbackDetail?.preferredSkills,
    qualifications: fallbackDetail?.qualifications,
    benefits: fallbackDetail?.benefits,
  }

  const skills = [
    ...(doc.requiredSkills?.map((s) => s.item).filter(Boolean) as string[]),
    ...(doc.preferredSkills?.map((s) => s.item).filter(Boolean) as string[]),
  ]

  const jsonLd = graphJsonLd(
    jobPostingJsonLd({
      title: doc.title,
      description: doc.aboutRole || `Open role: ${doc.title} at Xelarvis Technologies.`,
      path: `/careers/${slug}`,
      datePosted: doc.postedAt || doc.createdAt || doc.updatedAt || undefined,
      validThrough: doc.applicationDeadline || undefined,
      employmentType: doc.type,
      workMode: doc.workMode,
      location: doc.location,
      experienceRequirements: doc.experienceRequired,
      skills,
    }),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Careers', path: '/careers' },
      { name: doc.title, path: `/careers/${slug}` },
    ]),
  )

  return (
    <>
      <JsonLd id="job-jsonld" data={jsonLd} />
      <JobDetailView
        applicationsOpen={applicationsOpen}
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
      {job ? (
        <RelatedContent
          heading="Related practice areas"
          groups={buildRelatedGroups(job as unknown as Record<string, unknown>)}
        />
      ) : null}
    </>
  )
}
