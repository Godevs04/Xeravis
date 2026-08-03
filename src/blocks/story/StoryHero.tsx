'use client'

import Link from 'next/link'
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'

import { HeroCinematicBackground } from '@/components/marketing/HeroCinematicBackground'
import { HeroProductVisual } from '@/components/marketing/HeroProductVisual'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

type StoryHeroProps = {
  eyebrow?: string | null
  heading: string
  subheading?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  secondaryCtaLabel?: string | null
  secondaryCtaHref?: string | null
  brand?: string | null
}

const EASE = [0.22, 1, 0.36, 1] as const

const EMPHASIS =
  /\b(AI|Healthcare|Enterprise|Innovation|Cloud|Digital|Intelligent|Excellence|Intelligence)\b/gi

const TRUST_LOGOS = [
  { name: 'Hospital Networks', mark: 'HN' },
  { name: 'Enterprise Clients', mark: 'EC' },
  { name: 'Research Labs', mark: 'RL' },
  { name: 'Fortune Companies', mark: 'FC' },
]

const LIVE_METRICS = [
  { value: 120, suffix: '+', label: 'Enterprise Deployments', decimals: 0 },
  { value: 99.98, suffix: '%', label: 'Platform Uptime', decimals: 2 },
  { value: 40, suffix: '+', label: 'Healthcare Partners', decimals: 0 },
  { value: 18, suffix: '+', label: 'Countries', decimals: 0 },
]

function renderEmphasizedTitle(title: string) {
  const parts: ReactNode[] = []
  let last = 0
  const re = new RegExp(EMPHASIS.source, 'gi')
  let match: RegExpExecArray | null
  let key = 0
  while ((match = re.exec(title)) !== null) {
    if (match.index > last) {
      parts.push(<span key={`t-${key++}`}>{title.slice(last, match.index)}</span>)
    }
    parts.push(
      <span key={`h-${key++}`} className="hero-emphasis-text">
        {match[0]}
      </span>,
    )
    last = match.index + match[0].length
  }
  if (last < title.length) {
    parts.push(<span key={`t-${key++}`}>{title.slice(last)}</span>)
  }
  return parts
}

function splitTitleLines(title: string) {
  const cleaned = title.trim()
  // Prefer a natural break near punctuation or mid-phrase.
  const dash = cleaned.indexOf(' — ')
  if (dash > 8) {
    return [cleaned.slice(0, dash), cleaned.slice(dash + 3)]
  }
  const words = cleaned.split(/\s+/)
  if (words.length <= 5) return [cleaned]
  const mid = Math.ceil(words.length * 0.55)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

function MetricCounter({
  value,
  suffix,
  decimals,
  active,
}: {
  value: number
  suffix: string
  decimals: number
  active: boolean
}) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce || !active ? value : 0)

  useEffect(() => {
    if (reduce) {
      setN(value)
      return
    }
    if (!active) return
    let frame = 0
    const duration = 1200
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = value * eased
      setN(decimals > 0 ? Number(next.toFixed(decimals)) : Math.round(next))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, value, decimals, reduce])

  return (
    <span className="tabular-nums">
      {decimals > 0 ? n.toFixed(decimals) : n}
      {suffix}
    </span>
  )
}

function MagneticCTA({ href, label, outline }: { href: string; label: string; outline?: boolean }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })
  const [ripples, setRipples] = useState<{ id: number; nx: number; ny: number }[]>([])

  const onMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    x.set(dx * 0.18)
    y.set(dy * 0.22)
  }

  return (
    <motion.div style={{ x: sx, y: sy }} className="relative">
      <Link
        ref={ref}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={() => {
          x.set(0)
          y.set(0)
        }}
        onClick={(e) => {
          if (reduce || !ref.current) return
          const rect = ref.current.getBoundingClientRect()
          const id = Date.now()
          setRipples((r) => [
            ...r,
            {
              id,
              nx: ((e.clientX - rect.left) / rect.width) * 100,
              ny: ((e.clientY - rect.top) / rect.height) * 100,
            },
          ])
          window.setTimeout(() => setRipples((prev) => prev.filter((item) => item.id !== id)), 700)
        }}
        className={cn(
          'group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold transition-[box-shadow,background,border-color,color] duration-300',
          outline
            ? 'border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] text-[color:var(--hero-text)] shadow-[var(--shadow-light)] backdrop-blur-md hover:border-[color:var(--color-accent)]/50 hover:bg-[color:var(--color-hover)]'
            : 'bg-gradient-to-r from-[#0D9488] via-[#0F9F96] to-[#06B6D4] text-white shadow-[0_14px_40px_rgba(13,148,136,0.45),inset_0_1px_0_rgba(255,255,255,0.28)] hover:shadow-[0_18px_48px_rgba(6,182,212,0.5)]',
        )}
      >
        {!outline ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.28)_45%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        ) : (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/15 transition-transform duration-500 group-hover:scale-x-100"
          />
        )}
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden
            className="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40"
            style={{
              left: `${r.nx}%`,
              top: `${r.ny}%`,
              animation: 'hero-ripple 0.65s ease-out forwards',
            }}
          />
        ))}
        <span className="relative z-10">{label}</span>
        <ArrowRight
          className={cn(
            'relative z-10 h-4 w-4 transition-transform duration-300',
            outline
              ? 'opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100'
              : 'group-hover:translate-x-1',
          )}
          aria-hidden
        />
      </Link>
    </motion.div>
  )
}

export function StoryHero({
  eyebrow,
  heading,
  subheading,
  ctaLabel = "Let's Talk",
  ctaHref = '/contact',
  secondaryCtaLabel = 'Explore solutions',
  secondaryCtaHref = '/solutions',
  brand = 'Xelarvis',
}: StoryHeroProps) {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)
  const metricsInView = useInView(metricsRef, { once: true, margin: '-12% 0px' })
  const cursorX = useMotionValue(50)
  const cursorY = useMotionValue(40)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, reduce ? 1 : 0.28])
  const contentY = useTransform(scrollYProgress, [0, 0.55], [0, reduce ? 0 : -28])
  const bgMorph = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.06])

  const titleLines = splitTitleLines(heading)
  const subtitleWords = subheading ? subheading.split(/\s+/) : []

  return (
    <section
      ref={sectionRef}
      className="surface-navy relative isolate min-h-[100svh] overflow-hidden text-[color:var(--hero-text)]"
      onMouseMove={(e) => {
        if (reduce) return
        const rect = sectionRef.current?.getBoundingClientRect()
        if (!rect) return
        cursorX.set(((e.clientX - rect.left) / rect.width) * 100)
        cursorY.set(((e.clientY - rect.top) / rect.height) * 100)
      }}
    >
      <motion.div className="absolute inset-0" style={{ scale: bgMorph }}>
        <HeroCinematicBackground cursorX={cursorX} cursorY={cursorY} />
      </motion.div>

      <Container className="relative z-10 flex min-h-[100svh] flex-col justify-center pt-24 pb-16 lg:pt-28 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:gap-10">
          <motion.div style={{ opacity: contentOpacity, y: contentY }}>
            <motion.p
              className="font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--color-accent)] sm:text-3xl"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {brand}
            </motion.p>

            {eyebrow ? (
              <motion.p
                className="mt-3 text-[11px] font-semibold tracking-[0.22em] text-[color:var(--color-accent)]/80 uppercase"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.6 }}
              >
                {eyebrow}
              </motion.p>
            ) : null}

            <h1
              className="font-display mt-3 max-w-2xl text-[clamp(2.15rem,4.8vw,4.1rem)] leading-[1.02] font-bold tracking-[-0.045em] text-balance text-[color:var(--hero-text)]"
              aria-label={heading}
            >
              {titleLines.map((line, lineIndex) => (
                <span key={line} className="block overflow-hidden pb-0.5">
                  <motion.span
                    className="block"
                    initial={reduce ? false : { y: '110%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.14 + lineIndex * 0.12, duration: 0.72, ease: EASE }}
                  >
                    {renderEmphasizedTitle(line)}
                    {lineIndex < titleLines.length - 1 ? ' ' : null}
                  </motion.span>
                </span>
              ))}
            </h1>

            {subheading ? (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--hero-muted)] sm:text-lg">
                {subtitleWords.map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    className="inline-block pr-[0.28em]"
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.36 + i * 0.016, duration: 0.35, ease: EASE }}
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            ) : null}

            <motion.div
              className="mt-7 flex flex-wrap gap-3"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.55, ease: EASE }}
            >
              {ctaLabel && ctaHref ? <MagneticCTA href={ctaHref} label={ctaLabel} /> : null}
              {secondaryCtaLabel && secondaryCtaHref ? (
                <MagneticCTA href={secondaryCtaHref} label={secondaryCtaLabel} outline />
              ) : null}
            </motion.div>

            <motion.div
              className="mt-7"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56, duration: 0.55, ease: EASE }}
            >
              <p className="mb-2.5 text-[10px] font-bold tracking-[0.18em] text-[color:var(--hero-muted)] uppercase">
                Trusted by
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {TRUST_LOGOS.map((logo) => (
                  <div
                    key={logo.name}
                    className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-2.5 py-1 text-[color:var(--hero-muted)] grayscale transition-[filter,color,border-color,background] duration-300 hover:border-[color:var(--color-accent)]/40 hover:text-[color:var(--hero-text)] hover:grayscale-0"
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-md bg-[color:var(--color-hover)] text-[9px] font-bold tracking-wide text-[color:var(--hero-muted)] transition-colors group-hover:bg-teal-500/20 group-hover:text-[color:var(--color-accent)]">
                      {logo.mark}
                    </span>
                    <span className="text-[11px] font-semibold tracking-wide">{logo.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              ref={metricsRef}
              className="mt-6 grid max-w-xl grid-cols-2 gap-2.5 border-t border-[color:var(--hero-panel-border)] pt-5 sm:grid-cols-4"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.64, duration: 0.55, ease: EASE }}
            >
              {LIVE_METRICS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-3 py-3 shadow-[var(--shadow-light)] backdrop-blur-md"
                >
                  <p className="font-display text-xl font-bold tracking-tight text-[color:var(--hero-text)] sm:text-2xl">
                    <MetricCounter
                      value={item.value}
                      suffix={item.suffix}
                      decimals={item.decimals}
                      active={metricsInView}
                    />
                  </p>
                  <p className="mt-1 text-[10px] leading-snug text-[color:var(--hero-muted)] sm:text-xs">
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="relative min-h-[320px] overflow-visible sm:min-h-[420px] lg:min-h-[500px]">
            <HeroProductVisual scrollProgress={scrollYProgress} />
          </div>
        </div>
      </Container>

      {!reduce ? (
        <motion.div
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-semibold tracking-[0.18em] text-[color:var(--hero-muted)] uppercase"
          animate={{ y: [0, 6, 0], opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        >
          <span>Scroll</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.div>
      ) : null}
    </section>
  )
}
