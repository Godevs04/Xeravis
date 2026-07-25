import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { cn } from '@/lib/utils'
import type { CTALink } from '@/types'

type CTAProps = {
  eyebrow?: string | null
  title: string
  description?: string | null
  primary?: CTALink | null
  secondary?: CTALink | null
  className?: string
  tone?: 'default' | 'inverted'
}

export function CTA({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  className,
  tone = 'default',
}: CTAProps) {
  const inverted = tone === 'inverted'

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[32px] px-8 py-12 md:px-12 md:py-16',
        inverted
          ? 'bg-gradient-to-br from-[color:var(--color-accent)] via-[color:var(--color-secondary-accent)] to-[color:var(--color-accent-light)] text-white shadow-[var(--shadow-floating)]'
          : 'border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] shadow-[var(--shadow-floating)] backdrop-blur-2xl',
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl',
          inverted ? 'bg-white/20' : 'bg-accent/20',
        )}
      />
      {eyebrow ? (
        <p
          className={cn(
            'mb-3 text-xs font-semibold tracking-[0.14em] uppercase',
            inverted ? 'text-white/70' : 'text-muted',
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading level="h2" className={cn('relative', inverted && 'text-white')}>
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            'relative mt-4 max-w-2xl text-base leading-relaxed',
            inverted ? 'text-white/85' : 'text-secondary',
          )}
        >
          {description}
        </p>
      ) : null}
      {(primary || secondary) && (
        <div className="relative mt-8 flex flex-wrap gap-3">
          {primary ? (
            <Button
              asChild
              variant={inverted ? 'secondary' : 'primary'}
              className={
                inverted ? 'border-white/40 bg-white text-[#6d5ef9] hover:bg-white/95' : undefined
              }
            >
              <Link
                href={primary.href}
                target={primary.openInNewTab ? '_blank' : undefined}
                rel={primary.openInNewTab ? 'noreferrer' : undefined}
              >
                {primary.label}
              </Link>
            </Button>
          ) : null}
          {secondary ? (
            <Button
              asChild
              variant={inverted ? 'ghost' : 'outline'}
              className={inverted ? 'text-white hover:bg-white/15 hover:text-white' : undefined}
            >
              <Link
                href={secondary.href}
                target={secondary.openInNewTab ? '_blank' : undefined}
                rel={secondary.openInNewTab ? 'noreferrer' : undefined}
              >
                {secondary.label}
              </Link>
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}
