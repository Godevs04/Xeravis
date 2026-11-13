import { Suspense } from 'react'

import { WhyJoinSection } from '@/components/careers/WhyJoinSection'
import { HiringProcessSection } from '@/components/careers/HiringProcessSection'
import { CareersBoard, JobList, type BoardJob } from '@/components/careers/CareersBoard'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { CareersPageHero } from '@/components/marketing/PageHeroes'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'
import { listPublished } from '@/lib/cms'
import { isPastDeadline } from '@/lib/date'
import { FALLBACK_JOBS } from '@/lib/fallback-data'
import { GRADUATE_PROGRAMS, HIRING_STEPS, WHY_JOIN } from '@/lib/site-ia'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type CareerDoc = {
  id: string
  title: string
  slug: string
  department?: string | null
  departmentRef?: { title?: string } | string | null
  location: string
  type: string
  workMode?: string | null
  experienceRequired?: string | null
  openings?: number | null
  postedAt?: string | null
  applicationDeadline?: string | null
  active?: boolean | null
}

function departmentLabel(job: CareerDoc) {
  if (typeof job.departmentRef === 'object' && job.departmentRef?.title) {
    return job.departmentRef.title
  }
  return job.department || 'General'
}

export const metadata = buildMetadata({
  title: 'Careers in AI, Data Science & IT Consulting',
  description:
    'Join Xelarvis—life at XELARVIS, hiring process, learning & development, internships, graduate programs, and open roles across Artificial Intelligence, Data Science, and IT Consulting.',
  path: '/careers',
})

const PROGRAMS = [
  {
    id: 'internships',
    title: 'Internships',
    body: 'Hands-on work across AI, data science and IT consulting projects, with a named mentor and real delivery tasks.',
  },
  {
    id: 'graduates',
    title: GRADUATE_PROGRAMS.title,
    body: GRADUATE_PROGRAMS.body,
  },
  {
    id: 'research',
    title: 'Research opportunities',
    body: 'Join the AI Research Lab on benchmarks, publications, open-source and applied projects.',
  },
] as const

export default async function CareersPage() {
  const careers = (
    await listPublished<CareerDoc>('careers', {
      where: { active: { equals: true } },
    })
  ).filter((job) => !isPastDeadline(job.applicationDeadline))
  const fromCms = careers.length > 0
  const items = fromCms ? careers : FALLBACK_JOBS
  const boardJobs: BoardJob[] = items.map((job) => ({
    id: job.id,
    title: job.title,
    slug: job.slug,
    department: departmentLabel(job),
    location: job.location,
    type: job.type,
    workMode: job.workMode,
    experienceRequired: job.experienceRequired,
    openings: job.openings,
    postedAt: 'postedAt' in job ? job.postedAt : null,
    applicationDeadline: 'applicationDeadline' in job ? job.applicationDeadline : null,
  }))

  return (
    <>
      <CareersPageHero
        title="Build careers in AI, Data Science, and IT Consulting"
        subtitle="Work with engineers, data scientists and consultants on client programs in AI, data science and IT consulting, with a healthcare specialty track."
      />

      <WhyJoinSection benefits={WHY_JOIN} />

      <div id="hiring-process">
        <HiringProcessSection steps={HIRING_STEPS} />
      </div>

      <Section id="open-roles">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[color:var(--color-primary)]">
                Open Positions
              </h2>
              <p className="mt-2 max-w-xl text-[color:var(--color-secondary)]">
                {fromCms
                  ? 'Select a role to review responsibilities, requirements, and apply online.'
                  : 'Preview roles below. Online applications open when positions are published in careers admin—or email hr@xelarvis.in.'}
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <a href="mailto:hr@xelarvis.in">Email recruiting</a>
            </Button>
          </div>
          {items.length === 0 ? (
            <div className="rounded-[24px] border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] p-8 text-center">
              <p className="text-[color:var(--color-secondary)]">
                No open roles at the moment. Send your profile to{' '}
                <a
                  href="mailto:hr@xelarvis.in"
                  className="font-semibold text-[color:var(--color-accent)] hover:underline"
                >
                  hr@xelarvis.in
                </a>{' '}
                and we will keep you in mind for future openings.
              </p>
            </div>
          ) : (
            <Suspense fallback={<JobList jobs={boardJobs} />}>
              <CareersBoard jobs={boardJobs} />
            </Suspense>
          )}
        </Container>
      </Section>

      <Section id="job-alerts" surface>
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-[color:var(--color-primary)]">
            Get job alerts
          </h2>
          <p className="mt-2 mb-6 text-sm text-[color:var(--color-secondary)]">
            Be the first to hear about new roles. We email only when positions open, and you can
            unsubscribe at any time.
          </p>
          <NewsletterForm topic="careers" submitLabel="Notify me" />
        </Container>
      </Section>

      <Section id="programs">
        <Container>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[color:var(--color-primary)]">
            Early-career and research programs
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {PROGRAMS.map((card) => (
              <div key={card.id} id={card.id}>
                <h3 className="font-display text-lg font-semibold text-[color:var(--color-primary)]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-secondary)]">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
