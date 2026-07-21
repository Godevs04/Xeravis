import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CTA = { label: string; href: string; variant?: 'default' | 'accent' | 'outline' }

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
    <section className={cn('relative overflow-hidden border-b border-border', image && 'min-h-[70vh]')}>
      {image && (
        <>
          <Image src={image} alt={imageAlt} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/85 via-dark/70 to-dark/40" />
        </>
      )}
      <Container
        className={cn(
          'relative flex flex-col justify-center',
          size === 'default' ? 'min-h-[70vh] py-24 lg:py-32' : 'py-16 lg:py-20',
          centered && 'items-center text-center',
        )}
      >
        {eyebrow && (
          <p className={cn('mb-4 text-sm font-semibold uppercase tracking-[0.2em]', image ? 'text-white/80' : 'text-accent')}>
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            'max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl',
            image ? 'text-white' : 'text-primary',
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              'mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl',
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
                key={cta.href}
                asChild
                variant={cta.variant || 'accent'}
                size="lg"
                className={
                  image && cta.variant === 'outline'
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
