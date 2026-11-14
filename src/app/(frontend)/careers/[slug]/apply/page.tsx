import Link from '@/components/ui/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Briefcase, MapPin, Sparkles } from 'lucide-react'

import { CareerApplicationForm } from '@/components/forms/CareerApplicationForm'
import { Container } from '@/components/layout/Container'
import { getPublishedBySlug } from '@/lib/cms'
import { isPastDeadline } from '@/lib/date'
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
  applicationDeadline?: string | null
  active?: boolean | null
}

type Props = { params: Promise<{ slug: string }> }

const NEXT_STEPS = [
  {
    title: 'Application review',
    body: 'Our talent team reviews your profile against the role requirements.',
  },
  {
    title: 'Screening conversation',
    body: 'A short call to discuss your experience, interests and expectations.',
  },
  {
    title: 'Interviews',
    body: 'Technical and team conversations with the people you would work with.',
  },
  {
    title: 'Offer',
    body: 'A clear offer with role, scope and next steps for onboarding.',
  },
]

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const job = await getPublishedBySlug<CareerDoc>('careers', slug)
  return buildMetadata({
    title: job ? `Apply: ${job.title}` : 'Apply',
    description: job
      ? `Submit your application for the ${job.title} role at XELARVIS.`
      : 'Apply for an open role at XELARVIS.',
    path: `/careers/${slug}/apply`,
    noIndex: true,
  })
}

export default async function CareerApplyPage({ params }: Props) {
  const { slug } = await params
  const job = await getPublishedBySlug<CareerDoc>('careers', slug)
  if (!job) notFound()
  if (job.active === false || isPastDeadline(job.applicationDeadline)) {
    redirect(`/careers/${slug}`)
  }

  const meta = [
    { icon: MapPin, value: job.location },
    { icon: Briefcase, value: job.type?.replace('-', ' ') },
    { icon: Sparkles, value: job.workMode },
  ].filter((item) => Boolean(item.value))

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-background)] pt-28 pb-20 lg:pt-32 lg:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_0%_0%,rgba(13,148,136,0.12),transparent_55%),radial-gradient(ellipse_45%_35%_at_100%_30%,rgba(6,182,212,0.08),transparent_50%)]"
      />
      <Container className="relative z-10 max-w-6xl">
        <Link
          href={`/careers/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-accent)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to role details
        </Link>

        <div className="mt-8 max-w-3xl">
          <p className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase">
            Application{job.department ? ` · ${job.department}` : ''}
          </p>
          <h1 className="font-display mt-3 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] font-bold tracking-[-0.035em] text-balance text-[color:var(--color-primary)]">
            Apply for {job.title}
          </h1>
          {meta.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {meta.map(({ icon: Icon, value }) => (
                <li
                  key={value}
                  className="inline-flex list-none items-center gap-1.5 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-secondary)] capitalize"
                >
                  <Icon
                    className="h-3.5 w-3.5 text-[color:var(--color-accent)]"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  {value}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
          <div className="rounded-[28px] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] p-6 shadow-[var(--shadow-floating)] backdrop-blur-2xl sm:p-8">
            <CareerApplicationForm careerId={String(job.id)} jobTitle={job.title} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] p-6 backdrop-blur-xl">
              <p className="text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-accent)] uppercase">
                What happens next
              </p>
              <ol className="mt-5 space-y-5">
                {NEXT_STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="font-display grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent-soft)] text-[10px] font-bold text-[color:var(--color-accent)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--color-primary)]">
                        {step.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-secondary)]">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <p className="px-2 text-xs leading-relaxed text-[color:var(--color-muted)]">
              You will receive an email confirmation with a link to track your application status.
              Questions?{' '}
              <a
                href="mailto:hr@xelarvis.in"
                className="font-semibold text-[color:var(--color-accent)] hover:underline"
              >
                hr@xelarvis.in
              </a>
            </p>
          </aside>
        </div>
      </Container>
    </section>
  )
}
