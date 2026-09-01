'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

export type SolutionChallengeItem = {
  id: string
  title: string
  slug: string
  summary: string
  challenge?: string | null
  services?: { href: string; label: string }[]
}

const CHALLENGES = [
  { id: 'all', label: 'All challenges' },
  { id: 'ai', label: 'Adopt AI / agents' },
  { id: 'analytics', label: 'Predict & decide' },
  { id: 'data', label: 'Modernize data' },
  { id: 'automation', label: 'Automate operations' },
  { id: 'clinical', label: 'Clinical intelligence' },
  { id: 'apps', label: 'Modernize applications' },
] as const

function challengeFor(slug: string): string {
  if (slug.includes('ai-agents') || slug.includes('enterprise-ai') || slug.includes('custom-ai'))
    return 'ai'
  if (slug.includes('predictive') || slug.includes('business-intelligence')) return 'analytics'
  if (slug.includes('data-platform')) return 'data'
  if (slug.includes('automation')) return 'automation'
  if (slug.includes('healthcare') || slug.includes('clinical')) return 'clinical'
  if (slug.includes('modernization') || slug.includes('application')) return 'apps'
  return 'all'
}

type SolutionsChallengeSelectorProps = {
  solutions: SolutionChallengeItem[]
}

export function SolutionsChallengeSelector({ solutions }: SolutionsChallengeSelectorProps) {
  const [active, setActive] = useState<(typeof CHALLENGES)[number]['id']>('all')

  const filtered = useMemo(() => {
    if (active === 'all') return solutions
    return solutions.filter((s) => challengeFor(s.slug) === active)
  }, [active, solutions])

  return (
    <section className="relative overflow-hidden py-16 sm:py-20" aria-label="Choose your challenge">
      <Container>
        <p className="text-xs font-semibold tracking-[0.14em] text-[color:var(--color-accent)] uppercase">
          Choose your challenge
        </p>
        <h2 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-[color:var(--color-primary)] md:text-3xl">
          Outcome themes delivered through our services
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-[color:var(--color-secondary)] sm:text-base">
          Each solution packages one or more XELARVIS services—AI, Data Science, IT Consulting, data
          engineering, and healthcare specialty programs—into a focused business outcome.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Challenge filters">
          {CHALLENGES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active === c.id}
              onClick={() => setActive(c.id)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
                active === c.id
                  ? 'border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white'
                  : 'border-[color:var(--color-border)] text-[color:var(--color-secondary)] hover:border-[color:var(--color-accent)]',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <ul className="mt-10 divide-y divide-[color:var(--color-border)] border-t border-[color:var(--color-border)]">
          {filtered.map((solution, index) => (
            <li key={solution.id} className="py-10">
              <Link href={`/solutions/${solution.slug}`} className="group block">
                <p className="font-display text-xs tracking-[0.16em] text-teal-600">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display mt-3 text-[clamp(1.4rem,2.8vw,2.2rem)] font-semibold tracking-[-0.035em] text-[color:var(--color-navy)] transition-colors group-hover:text-teal-700">
                  {solution.title}
                </h3>
                <p className="text-secondary mt-3 max-w-2xl text-sm sm:text-base">
                  {solution.challenge || solution.summary}
                </p>
              </Link>
              {solution.services && solution.services.length > 0 ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold tracking-[0.08em] text-[color:var(--color-secondary)] uppercase">
                    Delivered via
                  </span>
                  {solution.services.map((svc) => (
                    <Link
                      key={svc.href}
                      href={svc.href}
                      className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--glass-bg)] px-3 py-1 text-xs font-semibold text-[color:var(--color-primary)] transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
                    >
                      {svc.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
          {!filtered.length ? (
            <li className="py-10 text-sm text-[color:var(--color-secondary)]">
              No solutions match this challenge yet. Browse all themes or talk to us.
            </li>
          ) : null}
        </ul>
      </Container>
    </section>
  )
}
