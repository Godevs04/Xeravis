import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CTA = { label: string; href: string; variant?: 'default' | 'primary' | 'accent' | 'outline' | 'secondary' }

type PageHeroProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  image?: string | null
  imageAlt?: string
  ctas?: CTA[]
  align?: 'left' | 'center'
  size?: 'default' | 'compact'
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
}: PageHeroProps) {
  const centered = align === 'center'

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        image ? 'min-h-[100svh] border-b-0' : 'border-b border-border pt-16 lg:pt-[4.5rem]',
      )}
    >
      {image && (
        <>
          <Image src={image} alt={imageAlt} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/88 via-dark/72 to-dark/45" />
        </>
      )}
      <Container
        className={cn(
          'relative flex flex-col justify-center',
          size === 'default'
            ? image
              ? 'min-h-[100svh] pb-24 pt-28 lg:pb-32 lg:pt-32'
              : 'py-20 lg:py-28'
            : 'py-16 lg:py-20',
          centered && 'items-center text-center',
        )}
      >
        {eyebrow && (
          <p
            className={cn(
              'mb-4 text-sm font-semibold uppercase tracking-[0.2em]',
              image ? 'text-white/80' : 'text-accent',
            )}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            'max-w-4xl text-balance font-bold tracking-tight',
            image ? 'text-[length:var(--text-display-xl)] text-white' : 'text-[length:var(--text-h1)] text-primary',
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              'mt-6 max-w-[65ch] text-lg leading-relaxed sm:text-xl',
              image ? 'text-white/80' : 'text-secondary',
              centered && 'mx-auto',
            )}
          >
            {subtitle}
          </p>
        )}
        {ctas.length > 0 && (
          <div className={cn('mt-10 flex flex-wrap gap-4', centered && 'justify-center')}>
            {ctas.map((cta) => (
              <Button
                key={`${cta.href}-${cta.label}`}
                asChild
                variant={cta.variant === 'accent' ? 'primary' : cta.variant || 'primary'}
                size="lg"
                className={
                  image && (cta.variant === 'outline' || cta.variant === 'secondary')
                    ? 'border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10'
                    : undefined
                }
              >
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
