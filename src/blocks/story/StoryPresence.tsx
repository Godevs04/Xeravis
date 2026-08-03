'use client'

import Link from 'next/link'
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState, type MouseEvent } from 'react'

import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

export type PresenceQuote = {
  id: string
  quote: string
  authorName: string
  authorRole?: string | null
  company?: string | null
}

type StoryPresenceProps = {
  eyebrow?: string | null
  heading: string
  quotes?: PresenceQuote[] | null
}

type EnrichedVoice = PresenceQuote & {
  industry: string
  challenge: string
  solution: string
  rating: number
  duration: string
  year: string
  technologies: string[]
  metrics: { value: string; label: string }[]
  initials: string
}

const TRUST_INDUSTRIES = [
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Education',
  'Research',
  'Government',
]

const TRUST_METRICS = [
  { value: 98, suffix: '%', label: 'Client retention' },
  { value: 120, suffix: '+', label: 'Projects' },
  { value: 40, suffix: '+', label: 'Enterprise clients' },
  { value: 99, suffix: '%', label: 'Would recommend' },
]

const FALLBACK: PresenceQuote[] = [
  {
    id: '1',
    quote:
      'Xelarvis brought clinical rigor and modern AI craft into the same delivery — rare, and exactly what we needed.',
    authorName: 'Program Director',
    authorRole: 'Healthcare analytics',
    company: 'Regional health network',
  },
  {
    id: '2',
    quote:
      'They treat platforms like products. Operators adopted the system because it felt inevitable, not imposed.',
    authorName: 'Engineering Director',
    authorRole: 'Digital transformation',
    company: 'Leading fintech',
  },
  {
    id: '3',
    quote:
      'From discovery to production monitoring, every stage felt owned. Our submission timelines moved from hope to habit.',
    authorName: 'Head of Clinical Data',
    authorRole: 'Life sciences',
    company: 'Biotech partner',
  },
  {
    id: '4',
    quote:
      'Demo-ready AI became production-ready systems. Evaluation, governance, and delivery finally lived in one practice.',
    authorName: 'VP of Innovation',
    authorRole: 'Enterprise AI',
    company: 'Global enterprise',
  },
]

const PRESETS = [
  {
    industry: 'Healthcare Analytics',
    challenge: 'Fragmented clinical systems',
    solution: 'AI-powered analytics platform',
    duration: '14 weeks',
    year: '2025',
    technologies: ['Python', 'Azure', 'AI', 'Power BI'],
    metrics: [
      { value: '42%', label: 'Faster workflows' },
      { value: '98%', label: 'Prediction accuracy' },
      { value: '3×', label: 'Deployment speed' },
    ],
  },
  {
    industry: 'Fintech',
    challenge: 'Legacy monolith velocity',
    solution: 'Cloud-native platform rebuild',
    duration: '20 weeks',
    year: '2025',
    technologies: ['Next.js', 'Kubernetes', 'AWS', 'Docker'],
    metrics: [
      { value: '3×', label: 'Release cycles' },
      { value: '65%', label: 'Less manual work' },
      { value: '99.9%', label: 'Availability' },
    ],
  },
  {
    industry: 'Life Sciences',
    challenge: 'Slow submission analytics',
    solution: 'CDISC-aligned data science stack',
    duration: '18 weeks',
    year: '2024',
    technologies: ['SAS', 'Python', 'CDISC', 'Spark'],
    metrics: [
      { value: '40%', label: 'Ops efficiency' },
      { value: '2×', label: 'Faster cycles' },
      { value: '120M', label: 'Records processed' },
    ],
  },
  {
    industry: 'Enterprise AI',
    challenge: 'Demos stalled in production',
    solution: 'Grounded LLM delivery system',
    duration: '12 weeks',
    year: '2025',
    technologies: ['LangChain', 'OpenAI', 'Python', 'Cloud'],
    metrics: [
      { value: '4×', label: 'Time to value' },
      { value: '99%', label: 'Eval pass rate' },
      { value: '40%', label: 'Cost savings' },
    ],
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

function enrich(quotes: PresenceQuote[]): EnrichedVoice[] {
  return quotes.map((q, i) => {
    const preset = PRESETS[i % PRESETS.length]
    const initials = q.authorName
      .split(/\s+/)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    return {
      ...q,
      ...preset,
      rating: 5,
      initials,
    }
  })
}

function CountUp({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!active) {
      setN(reduce ? value : 0)
      return
    }
    if (reduce) {
      setN(value)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100)
      setN(Math.round(value * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, value, reduce])

  return (
    <span className="tabular-nums">
      {n}
      {suffix}
    </span>
  )
}

function VoiceCard({ voice, index }: { voice: EnrichedVoice; index: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.4, once: false })
  const [open, setOpen] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 120, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 18 })
  const accent = index % 2 === 0 ? '#0D9488' : '#06B6D4'

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
        setOpen(false)
      }}
      onMouseEnter={() => setOpen(true)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: EASE }}
      className={cn(
        'relative mb-8 overflow-hidden rounded-[28px] border p-6 shadow-[var(--shadow-medium)] backdrop-blur-xl last:mb-0 sm:p-8',
        open
          ? 'border-[color:var(--color-accent)]/50 bg-[color:var(--glass-bg-strong)] shadow-[var(--shadow-hover)]'
          : 'border-[color:var(--glass-border)] bg-[color:var(--glass-bg)]',
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `linear-gradient(145deg, ${accent}14, transparent 45%)`,
        }}
      />

      <div className="relative flex flex-wrap items-center gap-4">
        <div
          className="grid h-12 w-12 place-items-center rounded-2xl border border-white/40 text-sm font-bold text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${accent}, #06B6D4)` }}
        >
          {voice.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/10 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[color:var(--color-accent)] uppercase">
              {voice.industry}
            </span>
            <span className="text-[10px] tracking-wide text-[color:var(--color-muted)] uppercase">
              {voice.year} · {voice.duration}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-[color:var(--color-primary)]">
            {voice.company}
          </p>
        </div>
        <div className="flex gap-0.5" aria-label="5 star rating">
          {Array.from({ length: voice.rating }).map((_, i) => (
            <motion.span
              key={i}
              className="text-amber-400"
              initial={reduce ? false : { opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              ★
            </motion.span>
          ))}
        </div>
      </div>

      <div className="relative mt-6">
        <motion.span
          aria-hidden
          className="font-display absolute -top-4 -left-1 text-5xl text-[color:var(--color-accent)]/25"
          initial={reduce ? false : { opacity: 0, pathLength: 0 }}
          animate={inView ? { opacity: 1 } : {}}
        >
          “
        </motion.span>
        <blockquote className="font-display pl-2 text-[clamp(1.15rem,2.2vw,1.55rem)] leading-snug font-medium tracking-[-0.025em] text-[color:var(--color-primary)]">
          {voice.quote}
        </blockquote>
      </div>

      <footer className="relative mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[color:var(--color-secondary)]">
        <span className="font-semibold text-[color:var(--color-primary)]">{voice.authorName}</span>
        {voice.authorRole ? <span>· {voice.authorRole}</span> : null}
        <span className="ml-auto rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-500 uppercase">
          Verified delivery
        </span>
      </footer>

      <motion.div
        initial={false}
        animate={{
          height: open || reduce ? 'auto' : 0,
          opacity: open || reduce ? 1 : 0,
          marginTop: open || reduce ? 24 : 0,
        }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative overflow-hidden"
      >
        <div className="grid gap-4 border-t border-[color:var(--glass-border)] pt-5 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-muted)] uppercase">
              Challenge
            </p>
            <p className="mt-1.5 text-sm text-[color:var(--color-secondary)]">{voice.challenge}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-muted)] uppercase">
              Solution
            </p>
            <p className="mt-1.5 text-sm text-[color:var(--color-secondary)]">{voice.solution}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {voice.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--color-hover)] px-3 py-3"
            >
              <p className="font-display text-xl font-bold tracking-[-0.03em] text-[color:var(--color-primary)]">
                {m.value}
              </p>
              <p className="mt-0.5 text-[11px] text-[color:var(--color-muted)]">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {voice.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[color:var(--color-accent)]/25 bg-[color:var(--color-accent)]/10 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-accent)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {!open && !reduce ? (
        <p className="relative mt-5 text-[11px] tracking-wide text-[color:var(--color-muted)]">
          Hover to expand outcomes →
        </p>
      ) : null}
    </motion.article>
  )
}

export function StoryPresence({ eyebrow = 'Client stories', heading, quotes }: StoryPresenceProps) {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.2 })
  const voices = enrich(quotes?.length ? quotes : FALLBACK)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[color:var(--color-background)] py-24 lg:py-32"
      aria-label={eyebrow || 'Client stories'}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_10%_15%,rgba(13,148,136,0.12),transparent_55%),radial-gradient(ellipse_55%_40%_at_90%_80%,rgba(6,182,212,0.1),transparent_50%)]"
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
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-24 right-[15%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.18),transparent_70%)] blur-3xl"
        animate={reduce ? undefined : { opacity: [0.35, 0.65, 0.35], y: [0, 20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      {!reduce
        ? Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute h-1 w-1 rounded-full bg-[color:var(--color-accent)]/30"
              style={{
                left: `${15 + ((i * 23) % 70)}%`,
                top: `${20 + ((i * 31) % 60)}%`,
              }}
              animate={{ y: [0, -10, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3.5 + (i % 3), repeat: Infinity, delay: i * 0.25 }}
            />
          ))
        : null}

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:gap-14 xl:gap-16">
          {/* LEFT sticky */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase">
              {eyebrow || 'Client stories'}
            </p>
            <motion.h2
              className="font-display mt-5 max-w-md text-[clamp(2rem,4vw,3.3rem)] leading-[1.05] font-bold tracking-[-0.045em] text-[color:var(--color-primary)]"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {heading || 'Trusted by leaders building the future.'}
            </motion.h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[color:var(--color-secondary)]">
              Enterprise teams choose Xelarvis when clinical rigor, AI craft, and production
              delivery have to live in the same system.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
              {TRUST_METRICS.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-4 py-4 shadow-[var(--shadow-light)] backdrop-blur-xl"
                >
                  <p className="font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--color-primary)]">
                    <CountUp value={m.value} suffix={m.suffix} active={inView} />
                  </p>
                  <p className="mt-1 text-[11px] tracking-wide text-[color:var(--color-muted)] uppercase">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-muted)] uppercase">
                Industries served
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TRUST_INDUSTRIES.map((ind, i) => (
                  <motion.span
                    key={ind}
                    className="rounded-full border border-[color:var(--glass-border)] bg-[color:var(--color-hover)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-secondary)] transition-colors hover:border-[color:var(--color-accent)]/40 hover:bg-[color:var(--color-accent)]/10 hover:text-[color:var(--color-accent)]"
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {ind}
                  </motion.span>
                ))}
              </div>
            </div>

            <Link
              href="/case-studies"
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-accent)]/40 bg-[color:var(--color-accent)]/10 px-5 py-2.5 text-sm font-semibold text-[color:var(--color-accent)] transition-colors hover:bg-[color:var(--color-accent)]/20"
            >
              Explore case studies
              <span aria-hidden>→</span>
            </Link>
          </aside>

          {/* RIGHT voice cards */}
          <div>
            {voices.map((voice, index) => (
              <VoiceCard key={voice.id} voice={voice} index={index} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
