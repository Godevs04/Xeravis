'use client'

import Image from 'next/image'
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
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CTA = {
  label: string
  href: string
  variant?: 'default' | 'primary' | 'accent' | 'outline' | 'secondary'
}

type PageHeroProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  image?: string | null
  imageAlt?: string
  ctas?: CTA[]
  align?: 'left' | 'center'
  size?: 'default' | 'compact'
  /** Home / marketing hero — navy canvas + product visual */
  variant?: 'default' | 'product'
  brand?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

const EMPHASIS = /\b(AI|Healthcare|Enterprise|Innovation|Cloud|Digital|Intelligent|Excellence)\b/gi

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
  const words = title.trim().split(/\s+/)
  if (words.length <= 4) return [title.trim()]
  const mid = Math.ceil(words.length / 2)
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

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const onClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
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
    window.setTimeout(() => setRipples((r) => r.filter((item) => item.id !== id)), 700)
  }

  return (
    <motion.div style={{ x: sx, y: sy }} className="relative">
      <Link
        ref={ref}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onClick}
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

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt = '',
  ctas = [],
  align = 'left',
  size = 'default',
  variant = 'product',
  brand = 'Xelarvis',
}: PageHeroProps) {
  const reduce = useReducedMotion()
  const centered = align === 'center'
  const isProduct = variant !== 'default'
  const sectionRef = useRef<HTMLElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)
  const metricsInView = useInView(metricsRef, { once: true, margin: '-12% 0px' })
  const cursorX = useMotionValue(50)
  const cursorY = useMotionValue(40)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, reduce ? 1 : 0.25])
  const contentY = useTransform(scrollYProgress, [0, 0.55], [0, reduce ? 0 : -28])
  const bgMorph = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08])

  const fade = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.55, ease: EASE },
        }

  const titleLines = splitTitleLines(title)
  const subtitleWords = subtitle ? subtitle.split(/\s+/) : []

  if (isProduct) {
    return (
      <section
        ref={sectionRef}
        className="surface-navy relative isolate min-h-[min(100svh,760px)] overflow-hidden text-[color:var(--hero-text)] sm:min-h-[min(100svh,880px)] lg:min-h-[min(100svh,980px)]"
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

        <Container className="relative z-10 grid items-center gap-10 pt-28 pb-20 lg:grid-cols-[1.02fr_1.08fr] lg:gap-10 lg:pt-32 lg:pb-24 xl:gap-12">
          <motion.div className="relative z-10" style={{ opacity: contentOpacity, y: contentY }}>
            <motion.div
              {...fade(0.04)}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-3 py-1.5 shadow-[var(--shadow-light)] backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22D3EE] shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <span className="text-[11px] font-bold tracking-[0.16em] text-[color:var(--color-accent)] uppercase">
                {eyebrow && eyebrow.toLowerCase() !== brand.toLowerCase() ? eyebrow : brand}
              </span>
            </motion.div>

            <h1 className="font-display max-w-[22ch] text-[clamp(2.4rem,5.2vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.05em] text-balance text-[color:var(--hero-text)]">
              {titleLines.map((line, lineIndex) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span
                    className="block"
                    initial={reduce ? false : { y: '110%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + lineIndex * 0.12, duration: 0.7, ease: EASE }}
                  >
                    {renderEmphasizedTitle(line)}
                    {lineIndex < titleLines.length - 1 ? ' ' : null}
                  </motion.span>
                </span>
              ))}
            </h1>

            {subtitle ? (
              <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-[color:var(--hero-muted)] sm:text-lg">
                {subtitleWords.map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    className="inline-block pr-[0.3em]"
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32 + i * 0.018, duration: 0.35, ease: EASE }}
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            ) : null}

            {ctas.length > 0 ? (
              <motion.div {...fade(0.42)} className="mt-8 flex flex-wrap gap-3">
                {ctas.map((cta) => {
                  const isOutline = cta.variant === 'outline' || cta.variant === 'secondary'
                  return (
                    <MagneticCTA
                      key={`${cta.href}-${cta.label}`}
                      href={cta.href}
                      label={cta.label}
                      outline={isOutline}
                    />
                  )
                })}
              </motion.div>
            ) : null}

            <motion.div {...fade(0.5)} className="mt-10">
              <p className="mb-3 text-[10px] font-bold tracking-[0.18em] text-[color:var(--hero-muted)] uppercase">
                Trusted by
              </p>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {TRUST_LOGOS.map((logo) => (
                  <div
                    key={logo.name}
                    className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-3 py-1.5 text-[color:var(--hero-muted)] grayscale transition-[filter,color,border-color,background] duration-300 hover:border-[color:var(--color-accent)]/40 hover:text-[color:var(--hero-text)] hover:grayscale-0"
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
              {...fade(0.58)}
              className="mt-8 grid max-w-xl grid-cols-2 gap-3 border-t border-[color:var(--hero-panel-border)] pt-7 sm:grid-cols-4"
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

          <div className="relative z-10 min-h-[340px] overflow-visible sm:min-h-[440px] lg:min-h-[520px]">
            <HeroProductVisual scrollProgress={scrollYProgress} />
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

  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-[color:var(--color-border)] bg-[color:var(--color-background)]',
        image ? 'min-h-[min(100svh,720px)]' : 'pt-24 lg:pt-28',
        size === 'default' ? 'pb-16 lg:pb-20' : 'pb-12 lg:pb-16',
      )}
    >
      {image ? (
        <>
          <Image src={image} alt={imageAlt} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/55 via-[#0F172A]/78 to-[#0F172A]" />
        </>
      ) : null}

      <Container
        className={cn(
          'relative z-10',
          image ? 'pt-28 pb-16 text-white' : 'py-16 lg:py-20',
          centered && 'flex flex-col items-center text-center',
        )}
      >
        {eyebrow ? (
          <motion.p
            {...fade(0.02)}
            className={cn(
              'mb-4 text-[11px] font-bold tracking-[0.16em] uppercase',
              image ? 'text-cyan-200' : 'text-[color:var(--color-accent)]',
            )}
          >
            {eyebrow}
          </motion.p>
        ) : null}
        <motion.h1
          {...fade(0.08)}
          className={cn(
            'font-display max-w-[18ch] text-[clamp(2.25rem,4.5vw,3.75rem)] font-bold tracking-[-0.045em] text-balance',
            image ? 'text-white' : 'text-[color:var(--color-primary)]',
          )}
        >
          {title}
        </motion.h1>
        {subtitle ? (
          <motion.p
            {...fade(0.16)}
            className={cn(
              'mt-5 max-w-[48ch] text-base leading-relaxed sm:text-lg',
              image ? 'text-slate-200' : 'text-[color:var(--color-secondary)]',
            )}
          >
            {subtitle}
          </motion.p>
        ) : null}
        {ctas.length > 0 ? (
          <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap gap-3">
            {ctas.map((cta) => {
              const isOutline = cta.variant === 'outline' || cta.variant === 'secondary'
              return (
                <Button
                  key={`${cta.href}-${cta.label}`}
                  asChild
                  size="lg"
                  className={
                    isOutline
                      ? 'rounded-full border-2 border-[color:var(--color-border)] bg-transparent font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-hover)]'
                      : 'rounded-full bg-[color:var(--color-accent)] font-semibold text-white hover:bg-[color:var(--color-accent-hover)]'
                  }
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              )
            })}
          </motion.div>
        ) : null}
      </Container>
    </section>
  )
}
