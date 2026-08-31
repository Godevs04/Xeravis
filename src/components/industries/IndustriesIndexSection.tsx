'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  Building2,
  Factory,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Landmark,
  Pill,
  ShoppingBag,
  Truck,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

type IndustryItem = {
  id: string
  title: string
  slug: string
  summary: string
}

type IndustriesIndexSectionProps = {
  industries: readonly IndustryItem[]
}

const EASE = [0.22, 1, 0.36, 1] as const

const ICONS: Record<string, LucideIcon> = {
  'healthcare-life-sciences': HeartPulse,
  pharmaceutical: Pill,
  biotechnology: FlaskConical,
  'banking-finance': Landmark,
  manufacturing: Factory,
  retail: ShoppingBag,
  logistics: Truck,
  education: GraduationCap,
  'enterprise-technology': Building2,
  'government-public-sector': Landmark,
  'energy-utilities': Zap,
}

function iconFor(slug: string): LucideIcon {
  return ICONS[slug] ?? Building2
}

export function IndustriesIndexSection({ industries }: IndustriesIndexSectionProps) {
  const reduce = useReducedMotion()
  const items = [...industries]

  return (
    <section
      className="relative overflow-hidden bg-[color:var(--color-background)] py-16 sm:py-20 lg:py-28"
      aria-label="Industry sectors"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_0%_0%,rgba(13,148,136,0.1),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(6,182,212,0.1),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 55% at 50% 30%, black, transparent)',
        }}
      />

      <Container className="relative z-10">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.p
              className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              Sectors
            </motion.p>
            <motion.h2
              className="font-display mt-3 max-w-xl text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.08] font-bold tracking-[-0.04em] text-[color:var(--color-primary)]"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
            >
              Built for regulated and high-scale operating contexts
            </motion.h2>
          </div>
          <motion.p
            className="max-w-sm text-sm leading-relaxed text-[color:var(--color-secondary)] sm:text-right"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
          >
            Industry-focused solutions for organizations navigating complex data, technology and AI
            challenges.
          </motion.p>
        </div>

        <ul className="grid gap-3 sm:gap-4">
          {items.map((industry, index) => {
            const Icon = iconFor(industry.slug)

            return (
              <motion.li
                key={industry.id}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-4% 0px' }}
                transition={{ duration: 0.45, delay: index * 0.035, ease: EASE }}
              >
                <Link
                  href={`/industries/${industry.slug}`}
                  className={cn(
                    'group relative flex flex-col gap-4 overflow-hidden rounded-[22px] border border-[color:var(--glass-border)]',
                    'bg-[color:var(--glass-bg)] p-5 shadow-[var(--shadow-light)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6',
                    'transition-[transform,border-color,box-shadow,background] duration-300',
                    'hover:-translate-y-0.5 hover:border-[color:var(--color-accent)] hover:bg-[color:var(--glass-bg-strong)] hover:shadow-[var(--shadow-hover)]',
                  )}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-12 h-36 w-36 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: 'radial-gradient(circle, rgba(13,148,136,0.3), transparent 70%)',
                    }}
                  />

                  <div className="relative flex min-w-0 items-start gap-4 sm:items-center">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] text-[color:var(--color-accent)] shadow-[var(--shadow-light)] transition-colors group-hover:border-[color:var(--color-accent)]/40 group-hover:bg-teal-500/15">
                      <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-muted)] uppercase">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="font-display mt-1 text-xl font-semibold tracking-tight text-[color:var(--color-primary)] transition-colors group-hover:text-[color:var(--color-accent)] sm:text-2xl">
                        {industry.title}
                      </h3>
                    </div>
                  </div>

                  <div className="relative flex items-end justify-between gap-4 sm:max-w-md sm:items-center sm:justify-end">
                    <p className="text-sm leading-relaxed text-[color:var(--color-secondary)] sm:text-right">
                      {industry.summary}
                    </p>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--glass-border)] text-[color:var(--color-accent)] transition-all group-hover:border-[color:var(--color-accent)] group-hover:bg-[color:var(--color-accent)] group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
