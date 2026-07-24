import { PageHero } from '@/components/layout/PageHero'
import { getMediaUrl } from '@/lib/media'

type HeroBannerProps = {
  eyebrow?: string | null
  heading: string
  subheading?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  secondaryCtaLabel?: string | null
  secondaryCtaHref?: string | null
  image?: unknown
}

export function HeroBanner({
  eyebrow,
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  image,
}: HeroBannerProps) {
  const imageUrl = getMediaUrl(image as Parameters<typeof getMediaUrl>[0])
  const ctas: { label: string; href: string; variant: 'accent' | 'outline' }[] = []

  if (ctaLabel && ctaHref) {
    ctas.push({ label: ctaLabel, href: ctaHref, variant: 'accent' })
  }
  if (secondaryCtaLabel && secondaryCtaHref) {
    ctas.push({ label: secondaryCtaLabel, href: secondaryCtaHref, variant: 'outline' })
  } else if (ctas.length < 2) {
    ctas.push({ label: 'Explore Services', href: '/services', variant: 'outline' })
  }

  return (
    <PageHero
      eyebrow={eyebrow || undefined}
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
      subtitle="Enterprise consulting, product engineering, and cloud platforms for organizations that need clarity, speed, and lasting quality."
      image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=80"
      ctas={[
        { label: 'Start Your Project', href: '/contact?intent=project', variant: 'accent' },
        { label: 'Explore Services', href: '/services', variant: 'outline' },
      ]}
    />
  )
}
