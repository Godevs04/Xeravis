'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  ArrowUpRight,
  CheckCircle2,
  Cloud,
  Cog,
  Layers,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

type Benefit = {
  title: string
  description: string
}

type ServiceDetailNarrativeProps = {
  challenges?: string | null
  benefits?: Benefit[] | null
  children?: ReactNode
}

const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.06 * i, ease: EASE },
  }),
}

function iconForBenefit(title: string): LucideIcon {
  const t = title.toLowerCase()
  if (t.includes('cloud') || t.includes('migrat')) return Cloud
  if (t.includes('automat') || t.includes('process')) return Cog
  if (t.includes('software') || t.includes('enterprise')) return Layers
  if (t.includes('secur') || t.includes('govern')) return Shield
  if (t.includes('ai') || t.includes('transform') || t.includes('digital')) return Sparkles
  return CheckCircle2
}

export function ServiceDetailNarrative({
  challenges,
  benefits,
  children,
}: ServiceDetailNarrativeProps) {
  const reduce = useReducedMotion()
  const items = benefits?.length ? benefits : []
  const hasChallenges = Boolean(challenges?.trim())
  const hasBody = Boolean(children)
  const hasBenefits = items.length > 0

  if (!hasChallenges && !hasBody && !hasBenefits) return null

  return (
    <section
      className="relative overflow-hidden bg-[color:var(--color-background)] py-20 sm:py-24 lg:py-28"
      aria-label="Service overview"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_0%_10%,rgba(13,148,136,0.12),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_90%,rgba(6,182,212,0.1),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 55% at 40% 30%, black, transparent)',
        }}
      />

      <Container className="relative z-10">
        <div
          className={cn(
            'grid gap-14 lg:gap-16',
            hasBenefits && (hasChallenges || hasBody)
              ? 'lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-start'
              : '',
          )}
        >
          {/* Left — challenges + body */}
          {(hasChallenges || hasBody) && (
            <div className="lg:sticky lg:top-28 lg:self-start">
              {hasChallenges ? (
                <motion.div
                  initial={reduce ? false : 'hidden'}
                  whileInView="show"
                  viewport={{ once: true, margin: '-8% 0px' }}
                  custom={0}
                  variants={fadeUp}
                >
                  <p className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase">
                    Overview
                  </p>
                  <h2 className="font-display mt-4 max-w-xl text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.08] font-bold tracking-[-0.04em] text-[color:var(--color-primary)]">
                    Challenges we solve
                  </h2>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--color-secondary)] sm:text-lg">
                    {challenges}
                  </p>
                </motion.div>
              ) : null}

              {hasBody ? (
                <motion.div
                  className={cn(
                    'max-w-xl text-base leading-relaxed text-[color:var(--color-secondary)]',
                    hasChallenges ? 'mt-8 border-t border-[color:var(--glass-border)] pt-8' : '',
                  )}
                  initial={reduce ? false : 'hidden'}
                  whileInView="show"
                  viewport={{ once: true, margin: '-8% 0px' }}
                  custom={1}
                  variants={fadeUp}
                >
                  <div className="prose-measure [&_p]:leading-relaxed [&_p]:text-[color:var(--color-secondary)]">
                    {children}
                  </div>
                </motion.div>
              ) : null}
            </div>
          )}

          {/* Right — benefits */}
          {hasBenefits ? (
            <div>
              <motion.div
                className="mb-8"
                initial={reduce ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true }}
                custom={0}
                variants={fadeUp}
              >
                <p className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase">
                  Outcomes
                </p>
                <h3 className="font-display mt-3 text-[clamp(1.5rem,2.8vw,2.1rem)] font-bold tracking-[-0.035em] text-[color:var(--color-primary)]">
                  Key benefits
                </h3>
              </motion.div>

              <ul className="space-y-3">
                {items.map((benefit, index) => {
                  const Icon = iconForBenefit(benefit.title)

                  return (
                    <motion.li
                      key={benefit.title}
                      initial={reduce ? false : 'hidden'}
                      whileInView="show"
                      viewport={{ once: true, margin: '-4% 0px' }}
                      custom={index + 1}
                      variants={fadeUp}
                    >
                      <motion.article
                        className={cn(
                          'group relative overflow-hidden rounded-[22px] border border-[color:var(--glass-border)]',
                          'bg-[color:var(--glass-bg)] p-5 shadow-[var(--shadow-light)] backdrop-blur-xl sm:p-6',
                          'transition-[border-color,box-shadow,background] duration-300',
                          'hover:border-[color:var(--color-accent)] hover:bg-[color:var(--glass-bg-strong)] hover:shadow-[var(--shadow-hover)]',
                        )}
                        whileHover={
                          reduce ? undefined : { y: -3, transition: { duration: 0.22, ease: EASE } }
                        }
                      >
                        <div
                          aria-hidden
                          className="pointer-events-none absolute -top-14 -right-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background:
                              'radial-gradient(circle, rgba(13,148,136,0.32), transparent 70%)',
                          }}
                        />

                        <div className="relative flex items-start gap-4">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] text-[color:var(--color-accent)] transition-colors group-hover:border-[color:var(--color-accent)]/40 group-hover:bg-teal-500/15">
                            <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-muted)] uppercase">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <ArrowUpRight className="ml-auto h-4 w-4 text-[color:var(--color-accent)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                            </div>
                            <h4 className="font-display mt-1.5 text-lg font-semibold tracking-tight text-[color:var(--color-primary)] transition-colors group-hover:text-[color:var(--color-accent)] sm:text-xl">
                              {benefit.title}
                            </h4>
                            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-secondary)]">
                              {benefit.description}
                            </p>
                          </div>
                        </div>

                        <motion.div
                          aria-hidden
                          className="absolute bottom-0 left-0 h-[2px] origin-left bg-gradient-to-r from-teal-500 to-cyan-400"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.7,
                            delay: 0.15 + index * 0.08,
                            ease: EASE,
                          }}
                          style={{ width: '100%' }}
                        />
                      </motion.article>
                    </motion.li>
                  )
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
