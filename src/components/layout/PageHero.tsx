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
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.6, ease: EASE },
        }

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        hasMedia
          ? 'min-h-[100svh]'
          : 'border-b border-[color:var(--glass-border-soft)] pt-20 lg:pt-24',
      )}
    >
      {isProduct ? (
        <>
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
          <div
            aria-hidden
            className="pointer-events-none absolute top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(109,94,249,0.22),transparent_70%)] blur-3xl"
          />
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
          'relative grid items-center gap-12 lg:gap-16',
          isProduct && 'lg:grid-cols-[1.05fr_0.95fr]',
          size === 'default'
            ? hasMedia
              ? 'min-h-[100svh] pt-28 pb-20 lg:pt-32 lg:pb-28'
              : 'py-20 lg:py-28'
            : 'py-16 lg:py-20',
          centered && !isProduct && 'justify-items-center text-center',
        )}
      >
        <div className={cn(centered && !isProduct && 'flex flex-col items-center')}>
          <motion.p
            {...fade(0.05)}
            className="font-display text-accent mb-5 text-sm font-semibold tracking-[0.18em] uppercase sm:text-base"
          >
            {brand}
          </motion.p>

          {eyebrow && eyebrow.toLowerCase() !== brand.toLowerCase() ? (
            <motion.p {...fade(0.1)} className="text-secondary mb-4 text-sm font-medium">
              {eyebrow}
            </motion.p>
          ) : null}

          <motion.h1
            {...fade(0.14)}
            className={cn(
              'font-display text-gradient max-w-[14ch] font-bold tracking-[-0.05em] text-balance',
              hasMedia
                ? 'text-[length:var(--text-display-xl)]'
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
              {...fade(0.22)}
              className={cn(
                'text-secondary mt-6 max-w-[36ch] text-lg leading-relaxed sm:text-xl',
                centered && !isProduct && 'mx-auto',
              )}
            >
              {subtitle}
            </motion.p>
          ) : null}

          {ctas.length > 0 ? (
            <motion.div
              {...fade(0.3)}
              className={cn(
                'mt-10 flex flex-wrap gap-3',
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
                      ? 'border-border bg-surface/60 text-primary hover:bg-surface transition-shadow hover:border-[color:var(--color-border-strong)]'
                      : 'shadow-[0_0_40px_var(--color-accent-glow)] transition-shadow hover:shadow-[0_0_52px_var(--color-accent-glow)]'
                  }
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              ))}
            </motion.div>
          ) : null}
        </div>

        {isProduct ? (
          <div className="relative overflow-visible">
            <HeroProductVisual />
          </div>
        ) : null}
      </Container>

      <div
        aria-hidden
        className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent"
      />
    </section>
  )
}
