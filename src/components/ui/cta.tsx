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
        'rounded-[var(--radius-hero)] px-8 py-12 md:px-12 md:py-16',
        inverted ? 'bg-primary text-white dark:bg-surface' : 'border border-border bg-surface',
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            'mb-3 text-xs font-semibold uppercase tracking-[0.14em]',
            inverted ? 'text-white/70' : 'text-muted',
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading level="h2" className={cn(inverted && 'text-white')}>
        {title}
      </Heading>
      {description ? (
        <p className={cn('mt-4 max-w-2xl text-base leading-relaxed', inverted ? 'text-white/80' : 'text-secondary')}>
          {description}
        </p>
      ) : null}
      {(primary || secondary) && (
        <div className="mt-8 flex flex-wrap gap-3">
          {primary ? (
            <Button asChild variant={inverted ? 'secondary' : 'primary'}>
              <Link href={primary.href} target={primary.openInNewTab ? '_blank' : undefined} rel={primary.openInNewTab ? 'noreferrer' : undefined}>
                {primary.label}
              </Link>
            </Button>
          ) : null}
          {secondary ? (
            <Button asChild variant={inverted ? 'ghost' : 'outline'} className={inverted ? 'text-white hover:bg-white/10 hover:text-white' : undefined}>
              <Link href={secondary.href} target={secondary.openInNewTab ? '_blank' : undefined} rel={secondary.openInNewTab ? 'noreferrer' : undefined}>
                {secondary.label}
              </Link>
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}
