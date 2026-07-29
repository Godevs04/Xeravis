'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

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

const TRUST = [
  { value: '120+', label: 'Products shipped' },
  { value: '40+', label: 'Enterprise teams' },
  { value: '12yr', label: 'Delivery depth' },
]

const TECH = ['Next.js', 'Cloud', 'AI', 'Security', 'Platforms', 'Data']

function splitTitle(title: string) {
  const cleaned = title.trim()
  const accent = cleaned.match(/^(.*?\b)(Digital|Intelligent|Excellence)(\b.*)$/i)
  if (accent) {
    return { lead: accent[1], highlight: accent[2], trail: accent[3] }
  }
  const words = cleaned.split(/\s+/)
  if (words.length < 3) return { lead: cleaned, highlight: '', trail: '' }
  const highlight = words[1]
  const lead = `${words[0]} `
  const trail = ` ${words.slice(2).join(' ')}`
  return { lead, highlight, trail }
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
  const { lead, highlight, trail } = splitTitle(title)

  const fade = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.55, ease: EASE },
        }

  if (isProduct) {
    return (
      <section
        className="relative isolate min-h-[min(100svh,940px)] overflow-hidden text-white"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 85% 35%, rgba(6,182,212,0.22), transparent 55%), radial-gradient(ellipse 55% 50% at 10% 20%, rgba(13,148,136,0.2), transparent 50%), linear-gradient(165deg, #0F172A 0%, #0B1224 45%, #0F172A 100%)',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
          }}
        />
        {!reduce ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[28%] left-[18%] h-52 w-52 rounded-full blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)',
            }}
            animate={{ opacity: [0.25, 0.65, 0.25], x: [0, 36, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : null}

        <Container className="relative z-10 grid items-center gap-10 pt-28 pb-20 lg:grid-cols-[1.02fr_1.08fr] lg:gap-10 lg:pt-32 lg:pb-24 xl:gap-12">
          <div className="relative z-10">
            <motion.div
              {...fade(0.04)}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22D3EE] shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <span className="text-[11px] font-bold tracking-[0.16em] text-cyan-200 uppercase">
                {eyebrow && eyebrow.toLowerCase() !== brand.toLowerCase() ? eyebrow : brand}
              </span>
            </motion.div>

            <motion.h1
              {...fade(0.1)}
              className="font-display max-w-[22ch] text-[clamp(2.4rem,5.2vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.05em] text-balance text-white"
            >
              {lead}
              {highlight ? (
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #2DD4BF, #22D3EE)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {highlight}
                </span>
              ) : null}
              {trail}
            </motion.h1>

            {subtitle ? (
              <motion.p
                {...fade(0.18)}
                className="mt-5 max-w-[42ch] text-base leading-relaxed text-slate-200 sm:text-lg"
              >
                {subtitle}
              </motion.p>
            ) : null}

            {ctas.length > 0 ? (
              <motion.div {...fade(0.26)} className="mt-8 flex flex-wrap gap-3">
                {ctas.map((cta) => {
                  const isOutline = cta.variant === 'outline' || cta.variant === 'secondary'
                  return (
                    <Button
                      key={`${cta.href}-${cta.label}`}
                      asChild
                      size="lg"
                      className={
                        isOutline
                          ? 'rounded-full border-2 border-cyan-300/90 bg-transparent font-semibold text-white hover:bg-white/10'
                          : 'rounded-full bg-[#0D9488] font-semibold text-white shadow-[0_12px_40px_rgba(13,148,136,0.55)] hover:bg-[#06B6D4]'
                      }
                    >
                      <Link href={cta.href}>{cta.label}</Link>
                    </Button>
                  )
                })}
              </motion.div>
            ) : null}

            <motion.div
              {...fade(0.34)}
              className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-white/15 pt-8"
            >
              {TRUST.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-md"
                >
                  <p className="font-display text-2xl font-bold tracking-tight text-white">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-slate-300">{item.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div {...fade(0.4)} className="mt-7 flex flex-wrap gap-2">
              {TECH.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="relative z-10 min-h-[360px] overflow-visible sm:min-h-[440px] lg:min-h-[520px]">
            <HeroProductVisual />
          </div>
        </Container>

        {!reduce ? (
          <motion.div
            className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase"
            animate={{ y: [0, 6, 0], opacity: [0.45, 0.9, 0.45] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
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
        'relative overflow-hidden border-b border-slate-200 bg-white',
        image ? 'min-h-[min(100svh,720px)]' : 'pt-24 lg:pt-28',
        size === 'default' ? 'pb-16 lg:pb-20' : 'pb-12 lg:pb-16',
      )}
    >
      {image ? (
        <>
          <Image src={image} alt={imageAlt} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/50 via-[#0F172A]/75 to-[#0F172A]" />
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
              image ? 'text-cyan-200' : 'text-[#0D9488]',
            )}
          >
            {eyebrow}
          </motion.p>
        ) : null}
        <motion.h1
          {...fade(0.08)}
          className={cn(
            'font-display max-w-[18ch] text-[clamp(2.25rem,4.5vw,3.75rem)] font-bold tracking-[-0.045em] text-balance',
            image ? 'text-white' : 'text-[#0F172A]',
          )}
        >
          {title}
        </motion.h1>
        {subtitle ? (
          <motion.p
            {...fade(0.16)}
            className={cn(
              'mt-5 max-w-[48ch] text-base leading-relaxed sm:text-lg',
              image ? 'text-slate-200' : 'text-slate-600',
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
                      ? 'rounded-full border-2 border-slate-300 bg-transparent font-semibold text-[#0F172A] hover:bg-slate-50'
                      : 'rounded-full bg-[#0D9488] font-semibold text-white hover:bg-[#06B6D4]'
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
