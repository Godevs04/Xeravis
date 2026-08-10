'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Cta = {
  label?: string | null
  href?: string | null
  style?: string | null
}

type AboutPreviewProps = {
  heading: string
  body: string
  cta?: Cta | null
}

const EASE = [0.22, 1, 0.36, 1] as const

const HOW_WE_WORK = [
  { step: '01', label: 'Research' },
  { step: '02', label: 'Strategy' },
  { step: '03', label: 'Design' },
  { step: '04', label: 'Build' },
  { step: '05', label: 'Deploy' },
  { step: '06', label: 'Optimize' },
]

const PRINCIPLES = [
  { title: 'Research-driven', detail: 'Evaluation, evidence and responsible AI over hype.' },
  { title: 'Engineering-led', detail: 'Architecture and delivery that survive production.' },
  { title: 'Outcome-focused', detail: 'Problem → solution → measurable business value.' },
]

export function AboutPreview({ heading, body, cta }: AboutPreviewProps) {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-background)] py-20 sm:py-24 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_0%_0%,rgba(13,148,136,0.1),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(6,182,212,0.08),transparent_50%)]"
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
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <motion.p
              className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              Who we are
            </motion.p>
            <motion.h2
              className="font-display mt-4 text-[clamp(1.85rem,3.5vw,2.85rem)] font-bold tracking-[-0.04em] text-balance text-[color:var(--color-primary)]"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.05, ease: EASE }}
            >
              {heading}
            </motion.h2>
            <motion.p
              className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--color-secondary)] sm:text-lg"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            >
              {body}
            </motion.p>
            {cta?.label && cta?.href ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.16, ease: EASE }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="mt-8 rounded-full border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-6 font-semibold text-[color:var(--color-primary)] backdrop-blur hover:border-[color:var(--color-accent)]"
                >
                  <Link href={cta.href}>
                    {cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            <motion.div
              className="relative overflow-hidden rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] p-5 shadow-[var(--shadow-medium)] backdrop-blur-xl sm:col-span-2 sm:p-6"
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-12 h-36 w-36 rounded-full blur-2xl"
                style={{
                  background: 'radial-gradient(circle, rgba(13,148,136,0.28), transparent 70%)',
                }}
              />
              <p className="relative text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-muted)] uppercase">
                How we work
              </p>
              <div className="relative mt-5">
                <div
                  aria-hidden
                  className="absolute top-5 right-4 left-4 hidden h-px bg-[color:var(--glass-border)] sm:block"
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {HOW_WE_WORK.map((m, i) => (
                    <motion.div
                      key={m.step}
                      className="relative rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] px-3 py-3 text-center shadow-[var(--shadow-light)]"
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.4, ease: EASE }}
                    >
                      <span className="mx-auto mb-2 hidden h-2.5 w-2.5 rounded-full bg-[color:var(--color-accent)] shadow-[0_0_12px_var(--color-accent-glow)] sm:block" />
                      <p className="font-display text-sm font-bold text-[color:var(--color-accent)]">
                        {m.step}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[color:var(--color-secondary)]">
                        {m.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {PRINCIPLES.map((p, i) => (
              <motion.article
                key={p.title}
                className={cn(
                  'group relative h-full overflow-hidden rounded-[22px] border border-[color:var(--glass-border)]',
                  'bg-[color:var(--glass-bg)] p-5 shadow-[var(--shadow-light)] backdrop-blur-xl',
                  'transition-[border-color,box-shadow,transform] duration-300',
                  'hover:-translate-y-1 hover:border-[color:var(--color-accent)] hover:shadow-[var(--shadow-hover)]',
                )}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.45, ease: EASE }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-10 -right-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(circle, rgba(13,148,136,0.3), transparent 70%)',
                  }}
                />
                <p className="font-display relative text-[10px] font-bold tracking-[0.14em] text-[color:var(--color-muted)] uppercase">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display relative mt-2 text-base font-semibold text-[color:var(--color-primary)] transition-colors group-hover:text-[color:var(--color-accent)]">
                  {p.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-[color:var(--color-secondary)]">
                  {p.detail}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
