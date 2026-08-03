'use client'

import Link from 'next/link'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowLeft, ArrowRight, Briefcase, Clock, MapPin, Sparkles, Users } from 'lucide-react'
import type { ReactNode } from 'react'

import { CareerApplicationForm } from '@/components/forms/CareerApplicationForm'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type JobDetailData = {
  id: string
  title: string
  department?: string | null
  location: string
  type: string
  workMode?: string | null
  experienceRequired?: string | null
  openings?: number | null
  aboutRole?: string | null
  qualifications?: string | null
  responsibilities?: { item?: string }[] | null
  requiredSkills?: { item?: string }[] | null
  preferredSkills?: { item?: string }[] | null
  benefits?: { item?: string }[] | null
}

type JobDetailViewProps = {
  job: JobDetailData
  descriptionSlot?: ReactNode
  requirementsSlot?: ReactNode
}

const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.05 * i, ease: EASE },
  }),
}

function listItems(items?: { item?: string }[] | null) {
  return (items || []).map((i) => i.item).filter(Boolean) as string[]
}

function MetaChip({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-3 py-1.5 text-xs font-medium text-[color:var(--hero-muted)] backdrop-blur-md">
      <Icon className="h-3.5 w-3.5 text-[color:var(--color-accent)]" strokeWidth={1.75} />
      {label}
    </span>
  )
}

function ContentBlock({
  title,
  index,
  children,
}: {
  title: string
  index: number
  children: ReactNode
}) {
  const reduce = useReducedMotion()
  return (
    <motion.section
      className="relative overflow-hidden rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] p-6 shadow-[var(--shadow-light)] backdrop-blur-xl sm:p-8"
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-6% 0px' }}
      custom={index}
      variants={fadeUp}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-12 h-36 w-36 rounded-full opacity-60 blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(13,148,136,0.22), transparent 70%)',
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="font-display text-[10px] font-bold tracking-[0.18em] text-[color:var(--color-accent)] uppercase">
            {String(index).padStart(2, '0')}
          </span>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[color:var(--color-primary)] sm:text-2xl">
            {title}
          </h2>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </motion.section>
  )
}

function BulletCards({ items }: { items: string[] }) {
  const reduce = useReducedMotion()
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <motion.li
          key={item}
          className="flex gap-3 rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--color-hover)] px-4 py-3 text-sm leading-relaxed text-[color:var(--color-secondary)]"
          initial={reduce ? false : { opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.04 * i, duration: 0.4, ease: EASE }}
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-accent)] shadow-[0_0_10px_var(--color-accent-glow)]" />
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  )
}

function SkillCloud({ items, accent }: { items: string[]; accent?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <motion.span
          key={item}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-semibold',
            accent
              ? 'border-[color:var(--color-accent)]/35 bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]'
              : 'border-[color:var(--glass-border)] bg-[color:var(--color-hover)] text-[color:var(--color-secondary)]',
          )}
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.03 * i, duration: 0.35, ease: EASE }}
          whileHover={reduce ? undefined : { y: -2, transition: { duration: 0.2 } }}
        >
          {item}
        </motion.span>
      ))}
    </div>
  )
}

export function JobDetailView({ job, descriptionSlot, requirementsSlot }: JobDetailViewProps) {
  const reduce = useReducedMotion()
  const responsibilities = listItems(job.responsibilities)
  const requiredSkills = listItems(job.requiredSkills)
  const preferredSkills = listItems(job.preferredSkills)
  const benefits = listItems(job.benefits)
  const typeLabel = job.type?.replace('-', ' ')

  return (
    <>
      {/* Hero — theme-aware cinematic composition */}
      <section className="surface-navy relative overflow-hidden pt-28 pb-28 text-[color:var(--hero-text)] lg:pt-36 lg:pb-36">
        <div aria-hidden className="hero-navy absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(var(--hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 40% 40%, black, transparent)',
          }}
        />
        {!reduce ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-24 right-[12%] h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--hero-glow-2),transparent_70%)] blur-3xl"
            animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : null}

        <Container className="relative z-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--hero-muted)] transition-colors hover:text-[color:var(--color-accent)]"
            >
              <ArrowLeft className="h-4 w-4" />
              All openings
            </Link>
          </motion.div>

          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <motion.p
                className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
              >
                {job.department || 'Careers'}
              </motion.p>
              <motion.h1
                className="font-display mt-4 max-w-3xl text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.045em] text-balance text-[color:var(--hero-text)]"
                initial={reduce ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              >
                {job.title}
              </motion.h1>

              <motion.div
                className="mt-6 flex flex-wrap gap-2"
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
              >
                <MetaChip icon={MapPin} label={job.location} />
                {typeLabel ? <MetaChip icon={Briefcase} label={typeLabel} /> : null}
                {job.workMode ? <MetaChip icon={Sparkles} label={job.workMode} /> : null}
                {job.experienceRequired ? (
                  <MetaChip icon={Clock} label={job.experienceRequired} />
                ) : null}
                {job.openings ? (
                  <MetaChip
                    icon={Users}
                    label={`${job.openings} opening${job.openings > 1 ? 's' : ''}`}
                  />
                ) : null}
              </motion.div>

              <motion.div
                className="mt-8 flex flex-wrap gap-3"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
              >
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-7 font-semibold text-white shadow-[0_0_32px_rgba(13,148,136,0.45)] hover:from-teal-400 hover:to-cyan-400"
                >
                  <Link href="#apply">
                    Apply for this Position
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-7 font-semibold text-[color:var(--hero-text)] backdrop-blur hover:border-[color:var(--color-accent)]/40 hover:bg-[color:var(--color-hover)]"
                >
                  <Link href="/contact?intent=careers">Talk to recruiting</Link>
                </Button>
              </motion.div>
            </div>

            <motion.aside
              className="relative hidden overflow-hidden rounded-[28px] border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] p-6 backdrop-blur-xl lg:block"
              initial={reduce ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
            >
              <p className="text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-accent)] uppercase">
                Hiring path
              </p>
              <p className="font-display mt-2 text-lg font-semibold text-[color:var(--hero-text)]">
                Clear steps from application to onboarding
              </p>
              <ol className="mt-5 space-y-3">
                {['Apply', 'Screen', 'Interview', 'Offer'].map((step, i) => (
                  <li
                    key={step}
                    className="flex items-center gap-3 text-sm text-[color:var(--hero-muted)]"
                  >
                    <span className="font-display grid h-7 w-7 place-items-center rounded-full border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent-soft)] text-[10px] font-bold text-[color:var(--color-accent)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <Link
                href="/careers"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--color-accent)] hover:text-[color:var(--color-accent-hover)]"
              >
                View hiring process
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.aside>
          </div>
        </Container>

        {/* Angled transition into content */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[color:var(--color-background)]"
        />
      </section>

      {/* Body + apply */}
      <section className="relative bg-[color:var(--color-background)] pb-20 lg:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_0%_0%,rgba(13,148,136,0.1),transparent_55%),radial-gradient(ellipse_45%_35%_at_100%_40%,rgba(6,182,212,0.08),transparent_50%)]"
        />

        <Container className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] lg:gap-12 xl:gap-14">
          <div className="space-y-5 sm:space-y-6">
            {(job.aboutRole || descriptionSlot) && (
              <ContentBlock title="About the Role" index={1}>
                {job.aboutRole ? (
                  <p className="text-base leading-relaxed text-[color:var(--color-secondary)]">
                    {job.aboutRole}
                  </p>
                ) : (
                  <div className="prose-measure text-[color:var(--color-secondary)] [&_p]:leading-relaxed">
                    {descriptionSlot}
                  </div>
                )}
              </ContentBlock>
            )}

            {responsibilities.length > 0 && (
              <ContentBlock title="Responsibilities" index={2}>
                <BulletCards items={responsibilities} />
              </ContentBlock>
            )}

            {requiredSkills.length > 0 && (
              <ContentBlock title="Required Skills" index={3}>
                <SkillCloud items={requiredSkills} accent />
              </ContentBlock>
            )}

            {preferredSkills.length > 0 && (
              <ContentBlock title="Preferred Skills" index={4}>
                <SkillCloud items={preferredSkills} />
              </ContentBlock>
            )}

            {job.qualifications ? (
              <ContentBlock title="Qualifications" index={5}>
                <p className="text-base leading-relaxed text-[color:var(--color-secondary)]">
                  {job.qualifications}
                </p>
              </ContentBlock>
            ) : null}

            {benefits.length > 0 && (
              <ContentBlock title="Benefits" index={6}>
                <BulletCards items={benefits} />
              </ContentBlock>
            )}

            {!responsibilities.length && requirementsSlot ? (
              <ContentBlock title="Requirements" index={7}>
                <div className="prose-measure text-[color:var(--color-secondary)] [&_p]:leading-relaxed">
                  {requirementsSlot}
                </div>
              </ContentBlock>
            ) : null}
          </div>

          <aside id="apply" className="lg:sticky lg:top-28 lg:self-start">
            <motion.div
              className="relative overflow-hidden rounded-[28px] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] p-6 shadow-[var(--shadow-floating)] backdrop-blur-2xl sm:p-7"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-16 h-44 w-44 rounded-full blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(13,148,136,0.28), transparent 70%)',
                }}
              />
              <div className="relative">
                <p className="text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-accent)] uppercase">
                  Application
                </p>
                <h2 className="font-display mt-2 text-xl font-semibold text-[color:var(--color-primary)]">
                  Apply for this Position
                </h2>
                <div className="mt-6">
                  <CareerApplicationForm careerId={String(job.id)} jobTitle={job.title} />
                </div>
              </div>
            </motion.div>
          </aside>
        </Container>
      </section>
    </>
  )
}
