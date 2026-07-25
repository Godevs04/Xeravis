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
          ? 'min-h-[min(100svh,940px)]'
          : 'border-b border-[color:var(--glass-border-soft)] pt-20 lg:pt-24',
      )}
    >
      {isProduct ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(109,94,249,0.22),transparent_60%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-[-10%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(161,140,255,0.32),transparent_68%)] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-8%] bottom-10 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(109,94,249,0.26),transparent_70%)] blur-3xl"
          />
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-45" />
          {!reduce ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-[30%] left-[20%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35),transparent_70%)] blur-2xl"
              animate={{ opacity: [0.2, 0.55, 0.2], x: [0, 40, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : null}
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
          isProduct && 'gap-10 lg:grid-cols-[1.02fr_1.08fr] lg:gap-8 xl:gap-12',
          !isProduct && 'gap-12 lg:gap-16',
          size === 'default'
            ? hasMedia
              ? 'pt-24 pb-16 lg:pt-28 lg:pb-20'
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
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white/80 px-3 py-1.5 shadow-[var(--shadow-medium)] backdrop-blur-md dark:border-white/10 dark:bg-white/5"
          >
            <span className="bg-accent h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_10px_var(--color-accent-glow)]" />
            <span className="text-accent text-[11px] font-bold tracking-[0.16em] uppercase">
              {eyebrow && eyebrow.toLowerCase() !== brand.toLowerCase() ? eyebrow : brand}
            </span>
          </motion.div>

          <motion.h1
            {...fade(0.1)}
            className={cn(
              'font-display max-w-[14ch] font-bold tracking-[-0.055em] text-balance',
              hasMedia
                ? 'text-gradient text-[clamp(2.85rem,6.4vw,5.25rem)] leading-[0.96]'
                : 'text-primary text-[length:var(--text-h1)]',
            )}
          >
            {title}
          </motion.h1>

          {subtitle ? (
            <motion.p
              {...fade(0.18)}
              className={cn(
                'text-secondary mt-5 max-w-[42ch] text-base leading-relaxed sm:text-lg',
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
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#6d5ef9]/12 bg-white/55 px-3 py-3 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
                  >
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
                    className="rounded-full border border-[#6d5ef9]/15 bg-white/70 px-3 py-1 text-xs font-semibold text-[#4a4a55] shadow-[0_4px_14px_rgba(109,94,249,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-[#a8a2c4]"
                  >
                    {tech}
                  </span>
                ))}
              </motion.div>
            </>
          ) : null}
        </div>

        {isProduct ? (
          <div className="relative z-10 min-h-[360px] overflow-visible sm:min-h-[440px] lg:min-h-[520px]">
            <HeroProductVisual />
          </div>
        ) : null}
      </Container>

      {isProduct && !reduce ? (
        <motion.div
          className="text-muted absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-semibold tracking-[0.18em] uppercase"
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
