import Image from 'next/image'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/RichText'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import { cn } from '@/lib/utils'
import { UNSPLASH } from '@/lib/fallback-data'

type FeatureSplitProps = {
  heading: string
  body: unknown
  image?: unknown
  reverse?: boolean | null
}

export function FeatureSplit({ heading, body, image, reverse }: FeatureSplitProps) {
  const imageUrl = getMediaUrl(image as Parameters<typeof getMediaUrl>[0]) || UNSPLASH.team

  return (
    <Section>
      <Container>
        <div
          className={cn(
            'grid items-center gap-10 lg:grid-cols-2 lg:gap-14',
            reverse && 'lg:[&>*:first-child]:order-2',
          )}
        >
          <AnimateIn>
            <p className="text-accent mb-3 text-[11px] font-bold tracking-[0.18em] uppercase">
              Spotlight
            </p>
            <h2 className="font-display text-[length:var(--text-h2)] font-bold tracking-[-0.04em]">
              {heading}
            </h2>
            <div className="mt-6">
              <RichText content={body as Parameters<typeof RichText>[0]['content']} />
            </div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border border-[color:var(--glass-border-soft)] shadow-[var(--shadow-floating)]">
              <Image
                src={imageUrl}
                alt={getMediaAlt(image as Parameters<typeof getMediaAlt>[0], heading)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(28,22,48,0.35))]"
              />
            </div>
          </AnimateIn>
        </div>
      </Container>
    </Section>
  )
}
