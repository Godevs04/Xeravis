'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

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

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt = '',
  ctas = [],
  align = 'left',
  size = 'default',
  variant = 'default',
  brand = 'Xelarvis',
}: PageHeroProps) {
  const reduce = useReducedMotion()
  const centered = align === 'center'
  const isProduct = variant === 'product'
  const hasMedia = Boolean(image) || isProduct

  const fade = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.55, ease: EASE },
        }

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        hasMedia
          ? 'min-h-[min(100svh,920px)]'
          : 'border-b border-[color:var(--glass-border-soft)] pt-20 lg:pt-24',
      )}
    >
      {isProduct ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(109,94,249,0.18),transparent_60%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(161,140,255,0.28),transparent_68%)] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-8%] bottom-10 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(109,94,249,0.22),transparent_70%)] blur-3xl"
          />
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
        </>
      ) : null}

      {image && !isProduct ? (
        <>
          <Image src={image} alt={imageAlt} fill priority className="object-cover" sizes="100vw" />
          <div className="from-background/40 via-background/75 to-background absolute inset-0 bg-gradient-to-b" />
        </>
      ) : null}

      <Container
        className={cn(
          'relative grid items-center',
          isProduct && 'gap-10 lg:grid-cols-[1.05fr_1.05fr] lg:gap-8 xl:gap-12',
          !isProduct && 'gap-12 lg:gap-16',
          size === 'default'
            ? hasMedia
              ? 'pt-24 pb-14 lg:pt-28 lg:pb-16'
              : 'py-20 lg:py-28'
            : 'py-16 lg:py-20',
          centered && !isProduct && 'justify-items-center text-center',
        )}
      >
        <div
          className={cn('relative z-10', centered && !isProduct && 'flex flex-col items-center')}
        >
          <motion.div
            {...fade(0.04)}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#6d5ef9]/20 bg-white/80 px-3 py-1.5 shadow-[0_8px_24px_rgba(109,94,249,0.12)] backdrop-blur-md dark:border-white/10 dark:bg-white/5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#6d5ef9] shadow-[0_0_10px_#6d5ef9]" />
            <span className="text-[11px] font-bold tracking-[0.16em] text-[#6d5ef9] uppercase">
              {eyebrow && eyebrow.toLowerCase() !== brand.toLowerCase() ? eyebrow : brand}
            </span>
          </motion.div>

          <motion.h1
            {...fade(0.1)}
            className={cn(
              'font-display max-w-[13ch] font-bold tracking-[-0.055em] text-balance',
              hasMedia
                ? 'text-gradient text-[clamp(2.75rem,6.2vw,5rem)] leading-[0.98]'
                : 'text-primary text-[length:var(--text-h1)]',
            )}
            style={
              hasMedia
                ? undefined
                : {
                    background: 'none',
                    color: 'var(--color-primary)',
                    WebkitTextFillColor: 'unset',
                  }
            }
          >
            {title}
          </motion.h1>

          {subtitle ? (
            <motion.p
              {...fade(0.18)}
              className={cn(
                'text-secondary mt-5 max-w-[40ch] text-base leading-relaxed sm:text-lg',
                centered && !isProduct && 'mx-auto',
              )}
            >
              {subtitle}
            </motion.p>
          ) : null}

          {ctas.length > 0 ? (
            <motion.div
              {...fade(0.26)}
              className={cn(
                'mt-8 flex flex-wrap gap-3',
                centered && !isProduct && 'justify-center',
              )}
            >
              {ctas.map((cta) => (
                <Button
                  key={`${cta.href}-${cta.label}`}
                  asChild
                  variant={
                    cta.variant === 'outline' || cta.variant === 'secondary' ? 'outline' : 'primary'
                  }
                  size="lg"
                  className={
                    cta.variant === 'outline' || cta.variant === 'secondary'
                      ? 'text-primary border-[#6d5ef9]/25 bg-white/80 shadow-[0_8px_24px_rgba(109,94,249,0.08)] backdrop-blur-md hover:border-[#6d5ef9]/45 hover:bg-white'
                      : 'shadow-[0_12px_40px_rgba(109,94,249,0.45)] hover:shadow-[0_16px_48px_rgba(109,94,249,0.55)]'
                  }
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              ))}
            </motion.div>
          ) : null}

          {isProduct ? (
            <>
              <motion.div
                {...fade(0.34)}
                className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-[#6d5ef9]/12 pt-8"
              >
                {TRUST.map((item) => (
                  <div key={item.label}>
                    <p className="font-display text-2xl font-bold tracking-tight text-[#1f1f21] dark:text-white">
                      {item.value}
                    </p>
                    <p className="text-muted mt-1 text-xs leading-snug">{item.label}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div {...fade(0.4)} className="mt-7 flex flex-wrap gap-2">
                {TECH.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[#6d5ef9]/15 bg-white/70 px-3 py-1 text-xs font-semibold text-[#5c5c66] shadow-[0_4px_14px_rgba(109,94,249,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-[#a8a2c4]"
                  >
                    {tech}
                  </span>
                ))}
              </motion.div>
            </>
          ) : null}
        </div>

        {isProduct ? (
          <div className="relative z-10 min-h-[340px] overflow-visible sm:min-h-[420px] lg:min-h-[480px]">
            <HeroProductVisual />
          </div>
        ) : null}
      </Container>
    </section>
  )
}
