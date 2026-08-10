import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { StoryHeroEnhance } from './StoryHeroEnhance'
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

const EMPHASIS =
  /\b(AI|Data|Science|Consulting|Healthcare|Enterprise|Innovation|Cloud|Digital|Intelligent|Excellence|Intelligence)\b/gi

const TRUST_LOGOS = [
  { name: 'Banking & Finance', mark: 'BF' },
  { name: 'Manufacturing', mark: 'MF' },
  { name: 'Healthcare Specialty', mark: 'HS' },
  { name: 'Technology', mark: 'TE' },
] as const

const LIVE_PILLARS = [
  { label: 'Artificial Intelligence', short: 'AI' },
  { label: 'Data Science', short: 'Data' },
  { label: 'IT Consulting', short: 'IT' },
  { label: 'Healthcare Specialty', short: 'Health' },
] as const

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
  return parts.length > 0 ? parts : title
}

function splitTitleLines(title: string) {
  const cleaned = title.trim()
  const dash = cleaned.indexOf(' — ')
  if (dash > 8) {
    return [cleaned.slice(0, dash), cleaned.slice(dash + 3)]
  }
  const words = cleaned.split(/\s+/)
  if (words.length <= 5) return [cleaned]
  const mid = Math.ceil(words.length * 0.55)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

function CtaLink({ href, label, outline }: { href: string; label: string; outline?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold transition-[box-shadow,background,border-color,color] duration-300',
        outline
          ? 'border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] text-[color:var(--hero-text)] shadow-[var(--shadow-light)] backdrop-blur-md hover:border-[color:var(--color-accent)]/50 hover:bg-[color:var(--color-hover)]'
          : 'bg-gradient-to-r from-[#0D9488] via-[#0F9F96] to-[#06B6D4] text-white shadow-[0_14px_40px_rgba(13,148,136,0.45),inset_0_1px_0_rgba(255,255,255,0.28)] hover:shadow-[0_18px_48px_rgba(6,182,212,0.5)]',
      )}
    >
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
  )
}

/** Server-rendered hero — H1 paints without waiting on Framer / client hydration. */
export function StoryHero({
  eyebrow,
  heading,
  subheading,
  ctaLabel = "Let's Talk",
  ctaHref = '/contact?intent=business',
  secondaryCtaLabel = 'Explore services',
  secondaryCtaHref = '/services',
  brand = 'Xelarvis',
}: StoryHeroProps) {
  const titleLines = splitTitleLines(heading)

  return (
    <section className="surface-navy relative isolate min-h-[100svh] overflow-hidden text-[color:var(--hero-text)]">
      <div className="absolute inset-0 bg-[color:var(--hero-bg)]" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 55% 45% at 12% 18%, var(--hero-glow), transparent 58%),
              radial-gradient(ellipse 48% 42% at 88% 22%, var(--hero-glow-2), transparent 55%),
              radial-gradient(ellipse 70% 50% at 40% 110%, var(--hero-vignette), transparent 55%),
              linear-gradient(165deg, var(--hero-bg) 0%, var(--color-neutral) 42%, var(--hero-bg) 100%)
            `,
          }}
        />
      </div>

      <Container className="relative z-10 flex min-h-[100svh] flex-col justify-center pt-24 pb-16 lg:pt-28 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:gap-10">
          <div>
            <p className="font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--color-accent)] sm:text-3xl">
              {brand}
            </p>

            {eyebrow ? (
              <p className="mt-3 text-[11px] font-semibold tracking-[0.22em] text-[color:var(--color-accent)]/80 uppercase">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="font-display mt-3 max-w-2xl text-[clamp(2.15rem,4.8vw,4.1rem)] leading-[1.02] font-bold tracking-[-0.045em] text-balance text-[color:var(--hero-text)]">
              {titleLines.map((line, lineIndex) => (
                <span key={`line-${lineIndex}`} className="block pb-0.5">
                  {renderEmphasizedTitle(line)}
                  {lineIndex < titleLines.length - 1 ? ' ' : null}
                </span>
              ))}
            </h1>

            {subheading ? (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--hero-muted)] sm:text-lg">
                {subheading}
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-3">
              {ctaLabel && ctaHref ? <CtaLink href={ctaHref} label={ctaLabel} /> : null}
              {secondaryCtaLabel && secondaryCtaHref ? (
                <CtaLink href={secondaryCtaHref} label={secondaryCtaLabel} outline />
              ) : null}
            </div>

            <div className="mt-7">
              <p className="mb-2.5 text-[10px] font-bold tracking-[0.18em] text-[color:var(--hero-muted)] uppercase">
                Industries we serve
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {TRUST_LOGOS.map((logo) => (
                  <div
                    key={logo.name}
                    className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-2.5 py-1 text-[color:var(--hero-muted)] transition-[color,border-color,background] duration-300 hover:border-[color:var(--color-accent)]/40 hover:text-[color:var(--hero-text)]"
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-md bg-[color:var(--color-hover)] text-[9px] font-bold tracking-wide text-[color:var(--hero-muted)] transition-colors group-hover:bg-teal-500/20 group-hover:text-[color:var(--color-accent)]">
                      {logo.mark}
                    </span>
                    <span className="text-[11px] font-semibold tracking-wide">{logo.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid max-w-xl grid-cols-2 gap-2.5 border-t border-[color:var(--hero-panel-border)] pt-5 sm:grid-cols-4">
              {LIVE_PILLARS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-3 py-3 shadow-[var(--shadow-light)] backdrop-blur-md"
                >
                  <p className="font-display text-sm font-bold tracking-tight text-[color:var(--hero-text)] sm:text-base">
                    {item.short}
                  </p>
                  <p className="mt-1 text-[10px] leading-snug font-medium tracking-wide text-[color:var(--hero-muted)] uppercase">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto aspect-[5/4] w-full max-w-2xl overflow-visible lg:max-w-none">
            <div
              className="h-full w-full rounded-[28px] border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)]/50 shadow-[var(--shadow-light)]"
              aria-hidden
            />
          </div>
        </div>
      </Container>

      <StoryHeroEnhance />
    </section>
  )
}
