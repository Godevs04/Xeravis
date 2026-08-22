'use client'

import Link from 'next/link'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import {
  ArrowRight,
  Activity,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Cloud,
  Cpu,
  Download,
  FileText,
  FlaskConical,
  HeartPulse,
  Layers,
  LineChart,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'

import { cn } from '@/lib/utils'

export type MegaMenuItem = {
  label: string
  href: string
  description?: string
}

type MegaMenuProps = {
  items: MegaMenuItem[]
  category?: string | null
  className?: string
  id?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

const CATEGORY_META: Record<string, { title: string; blurb: string; featuredLabel: string }> = {
  solutions: {
    title: 'Solutions',
    blurb: 'Outcome-oriented themes for AI, clinical, and enterprise delivery.',
    featuredLabel: 'Featured solution',
  },
  services: {
    title: 'Services',
    blurb:
      'Artificial Intelligence, Data Science, and IT Consulting—capabilities that move strategy into production.',
    featuredLabel: 'Featured service',
  },
  industries: {
    title: 'Industries',
    blurb: 'Sector patterns where regulation, scale, and reliability meet.',
    featuredLabel: 'Featured industry',
  },
  company: {
    title: 'About',
    blurb: 'Who we are, how we work, and where to go deeper.',
    featuredLabel: 'Featured',
  },
  about: {
    title: 'About',
    blurb: 'Who we are, how we work, and where to go deeper.',
    featuredLabel: 'Featured',
  },
  research: {
    title: 'Research & Innovation',
    blurb: 'AI research, collaborations, and the technology stack behind delivery.',
    featuredLabel: 'Featured',
  },
  insights: {
    title: 'Insights',
    blurb: 'Perspective from AI, clinical, and engineering practice.',
    featuredLabel: 'Featured insight',
  },
}

const QUICK_ACTIONS = [
  { label: 'Case studies', href: '/case-studies', icon: FileText },
  { label: 'Talk to expert', href: '/contact?intent=business', icon: Sparkles },
  { label: 'Schedule consult', href: '/contact?intent=business', icon: Calendar },
  { label: 'Company profile', href: '/about', icon: Download },
  { label: 'Success stories', href: '/case-studies', icon: Activity },
]

function iconForItem(label: string, href: string): LucideIcon {
  const t = `${label} ${href}`.toLowerCase()
  if (t.includes('health') || t.includes('clinical')) return HeartPulse
  if (t.includes('ai') || t.includes('intelligent') || t.includes('predict')) return Sparkles
  if (t.includes('cloud') || t.includes('azure') || t.includes('aws')) return Cloud
  if (t.includes('analytics') || t.includes('intelligence') || t.includes('bi')) return LineChart
  if (t.includes('research') || t.includes('lab')) return FlaskConical
  if (t.includes('tech')) return Cpu
  if (t.includes('about') || t.includes('company') || t.includes('overview')) return Building2
  if (t.includes('blog') || t.includes('insight') || t.includes('news')) return BookOpen
  if (t.includes('all ') || t.includes('catalog')) return Layers
  return Briefcase
}

function tagsForItem(label: string, href: string): string[] {
  const t = `${label} ${href}`.toLowerCase()
  if (t.includes('health') || t.includes('clinical')) return ['Healthcare specialty', 'Clinical']
  if (t.includes('ai') || t.includes('intelligent')) return ['Generative AI', 'LLMs', 'Automation']
  if (t.includes('cloud') || t.includes('engineering') || t.includes('platform'))
    return ['Azure', 'AWS', 'Kubernetes']
  if (t.includes('intelligence') || t.includes('analytics') || t.includes('bi'))
    return ['Analytics', 'Power BI', 'Dashboards']
  if (t.includes('predict')) return ['Forecasting', 'Risk', 'Models']
  if (t.includes('automat') || t.includes('modern')) return ['Workflows', 'Integrations']
  return ['Enterprise', 'Production']
}

function metricsForItem(label: string, href: string) {
  const t = `${label} ${href}`.toLowerCase()
  if (t.includes('health') || t.includes('clinical')) {
    return [
      { v: 'Clinical', l: 'Standards' },
      { v: 'Governed', l: 'Analytics' },
      { v: 'RWD', l: 'Insights' },
    ]
  }
  if (t.includes('ai') || t.includes('intelligent')) {
    return [
      { v: 'Strategy', l: 'to Prod' },
      { v: 'Eval', l: 'Gates' },
      { v: 'Ops', l: 'Ready' },
    ]
  }
  if (t.includes('cloud') || t.includes('platform')) {
    return [
      { v: 'Secure', l: 'Foundations' },
      { v: 'Scalable', l: 'Pipelines' },
      { v: 'MLOps', l: 'Ready' },
    ]
  }
  return [
    { v: 'AI', l: 'Pillar' },
    { v: 'Data', l: 'Pillar' },
    { v: 'IT', l: 'Pillar' },
  ]
}

function FeaturedPreview({ accent, variant }: { accent: string; variant: string }) {
  const reduce = useReducedMotion()
  const isHealth = /health|clinical/i.test(variant)
  const isAi = /ai|intelligent|predict/i.test(variant)

  return (
    <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--color-neutral)] shadow-[var(--shadow-light)] dark:border-white/15 dark:bg-[rgba(15,23,42,0.55)] dark:shadow-none">
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 30% 20%, ${accent}28, transparent 55%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(6,182,212,0.16), transparent 50%)`,
        }}
        animate={reduce ? undefined : { opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-0"
        style={{
          backgroundImage:
            'linear-gradient(var(--hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      <svg viewBox="0 0 320 200" className="relative z-10 h-full w-full p-4" aria-hidden>
        <defs>
          <linearGradient id="mega-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
          <linearGradient id="mega-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {isHealth ? (
          <>
            {[
              [40, 120],
              [90, 70],
              [140, 95],
              [190, 55],
              [240, 80],
              [280, 45],
            ].map(([x, y], i, arr) => {
              const next = arr[i + 1]
              return next ? (
                <motion.line
                  key={`l-${i}`}
                  x1={x}
                  y1={y}
                  x2={next[0]}
                  y2={next[1]}
                  stroke="url(#mega-line)"
                  strokeWidth="2"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                />
              ) : null
            })}
            {[
              [40, 120],
              [90, 70],
              [140, 95],
              [190, 55],
              [240, 80],
              [280, 45],
            ].map(([cx, cy], i) => (
              <motion.circle
                key={`c-${i}`}
                cx={cx}
                cy={cy}
                r="4"
                fill="#22D3EE"
                initial={reduce ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              />
            ))}
          </>
        ) : isAi ? (
          <>
            <motion.circle
              cx="160"
              cy="100"
              r="28"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="1.5"
              strokeOpacity="0.5"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '160px', originY: '100px' }}
            />
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180
              const x = 160 + Math.cos(rad) * 56
              const y = 100 + Math.sin(rad) * 56
              return (
                <motion.circle
                  key={deg}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#0D9488"
                  initial={reduce ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.12 + i * 0.04 }}
                />
              )
            })}
            <circle cx="160" cy="100" r="8" fill="#06B6D4" />
          </>
        ) : (
          <>
            {[36, 58, 44, 72, 52, 80, 60].map((h, i) => (
              <motion.rect
                key={i}
                x={28 + i * 38}
                y={160 - h}
                width="22"
                height={h}
                rx="5"
                fill="url(#mega-bar)"
                initial={reduce ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ originY: 1 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.55, ease: EASE }}
              />
            ))}
          </>
        )}

        {!reduce ? (
          <motion.circle
            r="3.5"
            fill="#22D3EE"
            animate={{ cx: [40, 280, 40], cy: [50, 90, 50] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : null}
      </svg>
    </div>
  )
}

export function MegaMenu({ items, category, className, id }: MegaMenuProps) {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? '')
  const meta = CATEGORY_META[category || ''] || {
    title: 'Explore',
    blurb: 'Navigate capabilities, markets, and company depth.',
    featuredLabel: 'Featured',
  }

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const glowX = useSpring(mouseX, { stiffness: 120, damping: 28 })
  const glowY = useSpring(mouseY, { stiffness: 120, damping: 28 })
  const glowBg = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(6,182,212,0.18), transparent 55%)`

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (reduce || !rootRef.current) return
      const rect = rootRef.current.getBoundingClientRect()
      mouseX.set(((e.clientX - rect.left) / rect.width) * 100)
      mouseY.set(((e.clientY - rect.top) / rect.height) * 100)
    },
    [mouseX, mouseY, reduce],
  )

  const { overview, cards } = useMemo(() => {
    const overviewItem = items[0]
    const rest = items.slice(1)
    const cardsList = rest.length ? rest : items
    return { overview: overviewItem, cards: cardsList }
  }, [items])

  const activeItem = items.find((i) => i.href === activeHref) || items[0]
  const ActiveIcon = iconForItem(activeItem?.label || '', activeItem?.href || '')
  const featuredMetrics = metricsForItem(activeItem?.label || '', activeItem?.href || '')

  const focusItem = useCallback(
    (index: number) => {
      const item = items[index]
      if (!item || !rootRef.current) return
      setActiveHref(item.href)
      const el = rootRef.current.querySelector<HTMLElement>(`[data-mega-index="${index}"]`)
      el?.focus()
    },
    [items],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!rootRef.current) return
      const idx = items.findIndex((i) => i.href === activeHref)
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        focusItem(Math.min(items.length - 1, Math.max(0, idx) + 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        focusItem(Math.max(0, (idx < 0 ? 0 : idx) - 1))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        const cardIdx = cards.findIndex((c) => c.href === activeHref)
        const next = cards[Math.min(cards.length - 1, Math.max(0, cardIdx) + 1)]
        if (next) {
          setActiveHref(next.href)
          rootRef.current?.querySelector<HTMLElement>(`[data-mega-card="${next.href}"]`)?.focus()
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const sideIdx = items.findIndex((i) => i.href === activeHref)
        focusItem(sideIdx < 0 ? 0 : sideIdx)
      } else if (e.key === 'Home') {
        e.preventDefault()
        focusItem(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        focusItem(items.length - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeHref, cards, focusItem, items])

  if (!items.length) return null

  return (
    <motion.div
      ref={rootRef}
      id={id}
      role="menu"
      aria-label={`${meta.title} menu`}
      onPointerMove={onPointerMove}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={reduce ? { duration: 0.12 } : { duration: 0.18, ease: EASE }}
      className={cn(
        // In-flow under the header bridge — parent owns placement
        'relative mx-auto w-full max-w-[1220px]',
        className,
      )}
    >
      {/* Gradient border shell — theme tokens for light + dark */}
      <div
        className={cn(
          'rounded-[28px] p-[1px]',
          'shadow-[var(--shadow-floating),0_0_80px_var(--color-accent-glow)]',
        )}
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 70%, transparent), color-mix(in srgb, var(--color-primary) 12%, transparent) 42%, color-mix(in srgb, var(--color-secondary-accent) 55%, transparent))',
        }}
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-[27px] backdrop-blur-2xl',
            'bg-[color:var(--card-bg)] text-[color:var(--color-primary)]',
            'shadow-[var(--shadow-inset-glass)]',
          )}
        >
          {/* Mesh + grid + noise */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 10% 0%, var(--mesh-glow), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 100%, var(--mesh-glow-2), transparent 50%), linear-gradient(180deg, var(--color-surface), var(--glass-bg))',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
            }}
          />
          <div aria-hidden className="noise-overlay opacity-[0.04]" />
          {!reduce ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: glowBg }}
            />
          ) : null}
          {!reduce ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/3 h-48 w-48 rounded-full blur-3xl"
              style={{ background: 'var(--aurora-spot)' }}
              animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.08, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : null}

          <div className="relative grid lg:grid-cols-[252px_minmax(0,1fr)_292px]">
            {/* LEFT — category navigator */}
            <aside className="border-b border-[color:var(--glass-border)] bg-[color:var(--color-surface)]/80 p-3 lg:border-r lg:border-b-0">
              <p className="px-3 pt-2 text-[10px] font-bold tracking-[0.18em] text-[color:var(--color-accent)] uppercase">
                {meta.title}
              </p>
              <p className="mt-1 px-3 pb-3 text-xs leading-relaxed text-[color:var(--color-muted)]">
                {meta.blurb}
              </p>
              <ul className="max-h-[min(52vh,22rem)] space-y-0.5 overflow-y-auto pr-1" role="none">
                {items.map((item, index) => {
                  const Icon = iconForItem(item.label, item.href)
                  const selected = item.href === activeHref
                  return (
                    <li key={item.href} role="none">
                      <motion.div
                        initial={reduce ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.3, ease: EASE }}
                      >
                        <Link
                          href={item.href}
                          role="menuitem"
                          data-mega-index={index}
                          aria-current={selected ? 'page' : undefined}
                          onMouseEnter={() => setActiveHref(item.href)}
                          onFocus={() => setActiveHref(item.href)}
                          className={cn(
                            'group relative flex items-start gap-3 rounded-2xl px-3 py-2.5 transition-all duration-300',
                            'focus-visible:ring-2 focus-visible:ring-[color:var(--color-secondary-accent)] focus-visible:outline-none',
                            selected
                              ? 'bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-secondary-accent)] text-white shadow-[var(--shadow-hover)]'
                              : 'text-[color:var(--color-primary)] hover:bg-[color:var(--color-hover)] hover:shadow-[var(--shadow-light)]',
                          )}
                        >
                          {selected ? (
                            <motion.span
                              layoutId="mega-nav-indicator"
                              aria-hidden
                              className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white/95"
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          ) : null}
                          <span
                            className={cn(
                              'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl border transition-all duration-300',
                              selected
                                ? 'border-white/30 bg-white/15 text-white'
                                : 'border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-[color:var(--color-accent)] group-hover:border-[color:var(--color-accent)] group-hover:shadow-[0_0_16px_var(--color-accent-soft)]',
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-4 w-4 transition-transform duration-300',
                                'group-hover:scale-110 group-hover:rotate-6',
                              )}
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold tracking-tight">
                              {item.label}
                            </span>
                            {item.description ? (
                              <span
                                className={cn(
                                  'mt-0.5 line-clamp-2 block text-[11px] leading-snug',
                                  selected ? 'text-white/80' : 'text-[color:var(--color-muted)]',
                                )}
                              >
                                {item.description}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      </motion.div>
                    </li>
                  )
                })}
              </ul>
            </aside>

            {/* CENTER — content cards */}
            <div className="p-4 sm:p-5">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-muted)] uppercase">
                    Browse
                  </p>
                  <p className="font-display mt-1 text-lg font-semibold text-[color:var(--color-primary)]">
                    {meta.title} catalog
                  </p>
                </div>
                {overview ? (
                  <Link
                    href={overview.href}
                    role="menuitem"
                    className="group inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--color-accent)] hover:text-[color:var(--color-secondary-accent)]"
                  >
                    {overview.label}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ) : null}
              </div>

              <div className="grid max-h-[min(52vh,22rem)] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                {cards.slice(0, 8).map((item, index) => {
                  const Icon = iconForItem(item.label, item.href)
                  const selected = item.href === activeHref
                  const tags = tagsForItem(item.label, item.href)
                  return (
                    <motion.div
                      key={item.href}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + index * 0.04, duration: 0.35, ease: EASE }}
                    >
                      <Link
                        href={item.href}
                        role="menuitem"
                        data-mega-card={item.href}
                        onMouseEnter={() => setActiveHref(item.href)}
                        onFocus={() => setActiveHref(item.href)}
                        className={cn(
                          'group relative flex h-full flex-col overflow-hidden rounded-2xl border p-4 transition-all duration-300',
                          'focus-visible:ring-2 focus-visible:ring-[color:var(--color-secondary-accent)] focus-visible:outline-none',
                          'border-[color:var(--glass-border)] bg-[color:var(--card-bg)]',
                          selected
                            ? '-translate-y-0.5 border-[color:var(--color-accent)] shadow-[var(--shadow-hover)]'
                            : 'hover:-translate-y-1 hover:border-[color:var(--color-accent)] hover:shadow-[var(--shadow-medium)]',
                        )}
                      >
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background:
                              'radial-gradient(ellipse 80% 60% at 100% 0%, var(--color-accent-soft), transparent 55%)',
                          }}
                        />
                        <div className="relative flex items-start justify-between gap-2">
                          <span className="grid h-9 w-9 place-items-center rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-[color:var(--color-accent)] transition-all duration-300 group-hover:scale-105 group-hover:rotate-6 group-hover:border-[color:var(--color-accent)] group-hover:shadow-[0_0_20px_var(--color-accent-soft)]">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide text-[color:var(--color-muted)] uppercase transition-all group-hover:translate-x-0.5 group-hover:text-[color:var(--color-accent)]">
                            View
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                        <span className="relative mt-3 block text-sm font-semibold text-[color:var(--color-primary)]">
                          {item.label}
                        </span>
                        {item.description ? (
                          <span className="relative mt-1 line-clamp-2 text-xs leading-relaxed text-[color:var(--color-muted)]">
                            {item.description}
                          </span>
                        ) : null}
                        <div className="relative mt-3 flex flex-wrap gap-1.5">
                          {tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-[color:var(--color-hover)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--color-secondary)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* RIGHT — featured panel */}
            <aside className="border-t border-[color:var(--glass-border)] bg-[color:var(--color-neutral)] p-5 text-[color:var(--color-primary)] lg:border-t-0 lg:border-l lg:border-[color:var(--glass-border)] dark:bg-gradient-to-b dark:from-[#0F172A] dark:to-[#0B1224] dark:text-white dark:lg:border-white/10">
              <p className="text-[10px] font-bold tracking-[0.18em] text-[color:var(--color-accent)] uppercase">
                {meta.featuredLabel}
              </p>
              <div className="mt-3 flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--color-hover)] text-[color:var(--color-accent)] shadow-[0_0_24px_var(--color-accent-soft)] dark:border-white/15 dark:bg-white/10 dark:text-cyan-300">
                  <ActiveIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-lg leading-snug font-semibold tracking-tight text-[color:var(--color-primary)] dark:text-white">
                    {activeItem?.label}
                  </p>
                  {activeItem?.description ? (
                    <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-secondary)] dark:text-slate-300">
                      {activeItem.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <FeaturedPreview
                accent="#0D9488"
                variant={`${activeItem?.label || ''} ${activeItem?.href || ''}`}
              />

              <div className="mt-4 grid grid-cols-3 gap-2">
                {featuredMetrics.map((m) => (
                  <div
                    key={m.l}
                    className="rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-2 py-2 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <p className="font-display text-sm font-bold text-[color:var(--color-primary)] dark:text-white">
                      {m.v}
                    </p>
                    <p className="text-[9px] tracking-wide text-[color:var(--color-muted)] uppercase dark:text-slate-400">
                      {m.l}
                    </p>
                  </div>
                ))}
              </div>

              {activeItem ? (
                <Link
                  href={activeItem.href}
                  role="menuitem"
                  className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_32px_rgba(13,148,136,0.45)] transition-all hover:from-teal-400 hover:to-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : null}
            </aside>
          </div>

          {/* Bottom quick actions */}
          <div className="relative flex flex-wrap items-center gap-2 border-t border-[color:var(--glass-border)] bg-[color:var(--color-surface)] px-4 py-3">
            <span className="mr-1 text-[10px] font-bold tracking-[0.14em] text-[color:var(--color-muted)] uppercase">
              Quick
            </span>
            {QUICK_ACTIONS.map((action, i) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.label}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.04, duration: 0.3 }}
                >
                  <Link
                    href={action.href}
                    role="menuitem"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-secondary)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] hover:shadow-[var(--shadow-hover)]"
                  >
                    <Icon className="h-3.5 w-3.5 text-[color:var(--color-accent)]" />
                    {action.label}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
