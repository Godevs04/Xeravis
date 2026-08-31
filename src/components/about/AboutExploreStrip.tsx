'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { ABOUT_MEGA } from '@/lib/site-ia'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

/** Credibility hubs — Services, Research, Case Studies, Careers, Contact (plan Phase 7). */
const PRACTICE_HUBS = [
  {
    label: 'Services',
    href: '/services',
    description: 'AI, Data Science, IT Consulting, and specialty practices.',
  },
  {
    label: 'Research',
    href: '/ai-research-lab',
    description: 'Methods that inform responsible delivery.',
  },
  {
    label: 'Case Studies',
    href: '/case-studies',
    description: 'Evidence from production programs.',
  },
  {
    label: 'Careers',
    href: '/careers',
    description: 'Join the delivery and research practice.',
  },
  {
    label: 'Contact',
    href: '/contact',
    description: 'Start a conversation about your initiative.',
  },
] as const

export function AboutExploreStrip() {
  const reduce = useReducedMotion()
  const company = ABOUT_MEGA.slice(0, 4)

  return (
    <>
      <section
        className="relative border-y border-[color:var(--glass-border)] bg-[color:var(--color-surface)] py-10 sm:py-12"
        aria-label="Explore XELARVIS"
      >
        <Container>
          <div className="mb-6">
            <p className="text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-accent)] uppercase">
              Explore XELARVIS
            </p>
            <h2 className="font-display mt-2 text-xl font-semibold text-[color:var(--color-primary)] sm:text-2xl">
              Credibility hubs—not another services pitch
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PRACTICE_HUBS.map((item, index) => (
              <motion.li
                key={item.href}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.4, ease: EASE }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'group flex h-full flex-col justify-between rounded-[20px] border border-[color:var(--glass-border)]',
                    'bg-[color:var(--glass-bg)] p-4 shadow-[var(--shadow-light)] backdrop-blur-xl transition-all duration-300',
                    'hover:-translate-y-0.5 hover:border-[color:var(--color-accent)] hover:shadow-[var(--shadow-hover)]',
                  )}
                >
                  <div>
                    <p className="font-display text-sm font-semibold text-[color:var(--color-primary)] transition-colors group-hover:text-[color:var(--color-accent)]">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--color-secondary)]">
                      {item.description}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--glass-border)] text-[color:var(--color-accent)] transition-all group-hover:border-[color:var(--color-accent)] group-hover:bg-[color:var(--color-accent)] group-hover:text-white">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        className="relative bg-[color:var(--color-background)] py-8 sm:py-10"
        aria-label="Company pages"
      >
        <Container>
          <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-muted)] uppercase">
            Company
          </p>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {company.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-semibold text-[color:var(--color-primary)] hover:text-[color:var(--color-accent)]"
                >
                  {item.label} →
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
