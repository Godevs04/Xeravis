import { PageHero } from '@/components/layout/PageHero'
import { getMediaUrl } from '@/lib/media'

type HeroBannerProps = {
  eyebrow?: string | null
  heading: string
  subheading?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  image?: unknown
}

export function HeroBanner({ eyebrow, heading, subheading, ctaLabel, ctaHref, image }: HeroBannerProps) {
  const imageUrl = getMediaUrl(image as Parameters<typeof getMediaUrl>[0])
  const ctas = []

  if (ctaLabel && ctaHref) {
    ctas.push({ label: ctaLabel, href: ctaHref, variant: 'accent' as const })
  }
  ctas.push({ label: 'Our services', href: '/services', variant: 'outline' as const })

  return (
    <PageHero
      eyebrow={eyebrow || 'Xelarvis Technologies'}
      title={heading}
      subtitle={subheading || undefined}
      image={imageUrl}
      ctas={ctas}
    />
  )
}

export function HeroBannerFallback() {
  return (
    <PageHero
      eyebrow="Xelarvis Technologies"
      title="Engineering Digital Excellence."
      subtitle="We partner with enterprises to design, build, and operate software platforms that scale with ambition."
      image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=80"
      ctas={[
        { label: 'Talk to us', href: '/contact', variant: 'accent' },
        { label: 'Explore services', href: '/services', variant: 'outline' },
      ]}
    />
  )
}
