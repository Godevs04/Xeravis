import { PageHero } from '@/components/layout/PageHero'

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
}: HeroBannerProps) {
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
      brand="Xelarvis"
      eyebrow={eyebrow || undefined}
      title={heading}
      subtitle={subheading || undefined}
      image={null}
      ctas={ctas}
      variant="product"
    />
  )
}

export function HeroBannerFallback() {
  return (
    <PageHero
      brand="Xelarvis"
      eyebrow="AI Research · Consulting · Data Science · Healthcare"
      title="Engineering Intelligent Systems for Healthcare, Enterprises, and the Future."
      subtitle="We help organisations transform data into measurable business value through AI-powered decision intelligence—backed by research depth and enterprise delivery."
      ctas={[
        { label: "Let's Talk", href: '/contact?intent=business', variant: 'accent' },
        { label: 'Explore services', href: '/services', variant: 'outline' },
      ]}
      variant="product"
    />
  )
}
