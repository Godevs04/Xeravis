'use client'

import { m as motion, useReducedMotion } from 'framer-motion'
import {
  Brain,
  Cloud,
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  Rocket,
  Stethoscope,
  Users,
  type LucideIcon,
} from 'lucide-react'

import { Container } from '@/components/layout/Container'
import type { WhyJoinItem } from '@/lib/site-ia'
import { cn } from '@/lib/utils'

type WhyJoinSectionProps = {
  benefits: readonly WhyJoinItem[]
}

const EASE = [0.22, 1, 0.36, 1] as const

const ICONS: Record<WhyJoinItem['id'], LucideIcon> = {
  'client-work': Brain,
  research: FlaskConical,
  learning: GraduationCap,
  flexible: Cloud,
  teams: Users,
  mentorship: Rocket,
  healthcare: Stethoscope,
  inclusive: HeartHandshake,
}

export function WhyJoinSection({ benefits }: WhyJoinSectionProps) {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-neutral)] py-20 sm:py-24 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_8%_20%,rgba(13,148,136,0.12),transparent_55%),radial-gradient(ellipse_55%_45%_at_92%_75%,rgba(6,182,212,0.1),transparent_50%)]"
      />

      <Container className="relative z-10">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase">
              Why join
            </p>
            <h2 className="font-display mt-4 max-w-md text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] font-bold tracking-[-0.04em] text-[color:var(--color-primary)]">
              What working at XELARVIS looks like
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[color:var(--color-secondary)]">
              Engineers, analysts, researchers and consultants work side by side on client programs.
              You get mentorship, room to learn, and clear ownership of what you deliver.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {benefits.map((item, index) => {
              const Icon = ICONS[item.id] ?? Users
              const featured = 'featured' in item && item.featured
              return (
                <motion.li
                  key={item.id}
                  className={cn(
                    'rounded-[22px] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] p-5 shadow-[var(--shadow-light)] sm:p-6',
                    featured && 'sm:col-span-2',
                  )}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  data-reveal
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                  transition={{ duration: 0.45, delay: 0.04 * index, ease: EASE }}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-[color:var(--color-accent)]">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="font-display mt-4 text-lg font-semibold tracking-tight text-[color:var(--color-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-[color:var(--color-secondary)]">
                    {item.description}
                  </p>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
