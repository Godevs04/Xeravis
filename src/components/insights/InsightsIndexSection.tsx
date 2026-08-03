'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  FileText,
  FolderOpen,
  Newspaper,
  ScrollText,
  type LucideIcon,
} from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

type InsightLink = {
  label: string
  href: string
  description?: string
}

type InsightsIndexSectionProps = {
  items: readonly InsightLink[]
}

const EASE = [0.22, 1, 0.36, 1] as const

const ICONS: Record<string, LucideIcon> = {
  '/case-studies': Briefcase,
  '/insights/blogs': BookOpen,
  '/insights/white-papers': FileText,
  '/insights/news': Newspaper,
  '/insights/reports': ScrollText,
  '/insights/resources': FolderOpen,
}

export function InsightsIndexSection({ items }: InsightsIndexSectionProps) {
  const reduce = useReducedMotion()
  const links = items.filter((i) => i.href !== '/insights')

  return (
    <section
      className="relative overflow-hidden bg-[color:var(--color-background)] py-16 sm:py-20 lg:py-24"
      aria-label="Insight categories"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_100%_0%,rgba(6,182,212,0.1),transparent_55%),radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(13,148,136,0.1),transparent_50%)]"
      />

      <Container className="relative z-10">
        <ul className="grid gap-3 sm:gap-4">
          {links.map((item, index) => {
            const Icon = ICONS[item.href] ?? BookOpen

            return (
              <motion.li
                key={item.href}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-4% 0px' }}
                transition={{ duration: 0.45, delay: index * 0.05, ease: EASE }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'group relative flex flex-col gap-3 overflow-hidden rounded-[22px] border border-[color:var(--glass-border)]',
                    'bg-[color:var(--glass-bg)] p-5 shadow-[var(--shadow-light)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6',
                    'transition-[transform,border-color,box-shadow,background] duration-300',
                    'hover:-translate-y-0.5 hover:border-[color:var(--color-accent)] hover:bg-[color:var(--glass-bg-strong)] hover:shadow-[var(--shadow-hover)]',
                  )}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-14 -right-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: 'radial-gradient(circle, rgba(13,148,136,0.3), transparent 70%)',
                    }}
                  />

                  <div className="relative flex min-w-0 items-center gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] text-[color:var(--color-accent)] transition-colors group-hover:border-[color:var(--color-accent)]/40 group-hover:bg-teal-500/15">
                      <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <span className="font-display text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-muted)] uppercase">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="font-display mt-1 text-xl font-semibold tracking-tight text-[color:var(--color-primary)] transition-colors group-hover:text-[color:var(--color-accent)] sm:text-2xl">
                        {item.label}
                      </h2>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between gap-4 sm:max-w-md sm:justify-end">
                    {item.description ? (
                      <p className="text-sm leading-relaxed text-[color:var(--color-secondary)] sm:text-right">
                        {item.description}
                      </p>
                    ) : null}
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
