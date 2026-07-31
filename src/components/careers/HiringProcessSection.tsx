'use client'

import Link from 'next/link'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileText,
  Handshake,
  MessageSquare,
  Rocket,
  Search,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type HiringStep = {
  title: string
  description: string
}

type HiringProcessSectionProps = {
  steps: readonly HiringStep[]
}

const EASE = [0.22, 1, 0.36, 1] as const

const STEP_ICONS: LucideIcon[] = [
  FileText,
  Search,
  MessageSquare,
  ClipboardCheck,
  Wrench,
  Handshake,
  BadgeCheck,
  Rocket,
]

export function HiringProcessSection({ steps }: HiringProcessSectionProps) {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const items = useMemo(() => [...steps], [steps])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 55%'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  const lineScale = useTransform(progress, [0, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(items.length - 1, Math.max(0, Math.floor(v * items.length)))
    setActive((prev) => (prev === next ? prev : next))
  })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[color:var(--color-background)] py-20 sm:py-24 lg:py-32"
      aria-label="Hiring process"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_90%_10%,rgba(6,182,212,0.1),transparent_55%),radial-gradient(ellipse_50%_40%_at_5%_90%,rgba(13,148,136,0.1),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
        }}
      />
      <div aria-hidden className="noise-overlay opacity-[0.03]" />

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:gap-14 xl:gap-16">
          {/* Left intro */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.p
              className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              How we hire
            </motion.p>
            <motion.h2
              className="font-display mt-4 max-w-md text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-bold tracking-[-0.045em] text-[color:var(--color-primary)]"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.06, ease: EASE }}
            >
              Hiring Process
            </motion.h2>
            <motion.p
              className="mt-5 max-w-md text-base leading-relaxed text-[color:var(--color-secondary)]"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
            >
              A clear path from application to onboarding so you always know what to expect.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.18, ease: EASE }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[color:var(--color-accent)] px-7 font-semibold text-white shadow-[var(--shadow-hover)] hover:bg-[color:var(--color-accent-hover)]"
              >
                <Link href="#open-roles">
                  Browse open roles
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-7 font-semibold text-[color:var(--color-primary)] backdrop-blur hover:border-[color:var(--color-accent)]"
              >
                <Link href="/contact?intent=careers">Talk to recruiting</Link>
              </Button>
            </motion.div>

            <div className="mt-10 hidden rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] p-5 backdrop-blur-xl lg:block">
              <p className="text-[10px] font-bold tracking-[0.14em] text-[color:var(--color-muted)] uppercase">
                Current stage
              </p>
              <p className="font-display mt-2 text-lg font-semibold text-[color:var(--color-primary)]">
                {items[active]?.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-secondary)]">
                Step {active + 1} of {items.length}
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[color:var(--color-hover)]">
                <motion.div
                  className="h-full origin-left rounded-full bg-gradient-to-r from-teal-500 to-cyan-400"
                  style={{ scaleX: lineScale }}
                />
              </div>
            </div>
          </div>

          {/* Right timeline */}
          <ol className="relative space-y-4">
            <div
              aria-hidden
              className="absolute top-3 bottom-3 left-[1.35rem] w-px bg-[color:var(--glass-border)] sm:left-[1.6rem]"
            />
            <motion.div
              aria-hidden
              className="absolute top-3 left-[1.35rem] w-px origin-top bg-gradient-to-b from-teal-500 via-cyan-400 to-teal-500 sm:left-[1.6rem]"
              style={{
                height: 'calc(100% - 1.5rem)',
                scaleY: reduce ? 1 : lineScale,
              }}
            />

            {items.map((step, index) => {
              const Icon = STEP_ICONS[index % STEP_ICONS.length]
              const isActive = index === active
              const isDone = index < active

              return (
                <motion.li
                  key={step.title}
                  className="relative grid grid-cols-[2.75rem_1fr] gap-3 sm:grid-cols-[3.25rem_1fr] sm:gap-4"
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-8% 0px' }}
                  transition={{ duration: 0.5, delay: index * 0.04, ease: EASE }}
                >
                  <div className="relative z-10 flex justify-center pt-5">
                    <motion.span
                      className={cn(
                        'grid h-10 w-10 place-items-center rounded-full border text-[color:var(--color-accent)] shadow-[var(--shadow-light)] sm:h-11 sm:w-11',
                        isActive
                          ? 'border-cyan-400/60 bg-gradient-to-br from-teal-500/30 to-cyan-400/20 text-white shadow-[0_0_28px_var(--color-accent-glow)]'
                          : isDone
                            ? 'border-teal-500/50 bg-teal-500/15'
                            : 'border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)]',
                      )}
                      animate={
                        reduce || !isActive
                          ? undefined
                          : { scale: [1, 1.06, 1], transition: { duration: 2.4, repeat: Infinity } }
                      }
                    >
                      <Icon
                        className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]"
                        strokeWidth={1.75}
                      />
                    </motion.span>
                  </div>

                  <motion.article
                    className={cn(
                      'group relative overflow-hidden rounded-[22px] border p-5 backdrop-blur-xl transition-[border-color,box-shadow,background] duration-300 sm:p-6',
                      isActive
                        ? 'border-[color:var(--color-accent)] bg-[color:var(--glass-bg-strong)] shadow-[var(--shadow-hover)]'
                        : 'border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] shadow-[var(--shadow-light)] hover:border-[color:var(--color-accent)]/50 hover:shadow-[var(--shadow-medium)]',
                    )}
                    whileHover={
                      reduce ? undefined : { y: -3, transition: { duration: 0.22, ease: EASE } }
                    }
                  >
                    <div
                      aria-hidden
                      className={cn(
                        'pointer-events-none absolute -top-12 -right-10 h-28 w-28 rounded-full blur-2xl transition-opacity duration-300',
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-70',
                      )}
                      style={{
                        background:
                          'radial-gradient(circle, rgba(13,148,136,0.35), transparent 70%)',
                      }}
                    />

                    <div className="relative flex flex-wrap items-center gap-2">
                      <span className="font-display text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-accent)] uppercase">
                        Step {String(index + 1).padStart(2, '0')}
                      </span>
                      {isActive ? (
                        <span className="rounded-full border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[color:var(--color-accent)] uppercase">
                          In focus
                        </span>
                      ) : null}
                    </div>
                    <h3 className="font-display relative mt-2 text-lg font-semibold tracking-tight text-[color:var(--color-primary)] sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="relative mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--color-secondary)]">
                      {step.description}
                    </p>
                  </motion.article>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </Container>
    </section>
  )
}
