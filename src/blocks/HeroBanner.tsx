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
      eyebrow="Artificial Intelligence · Data Science · IT Consulting"
      title="Engineering Intelligence. Transforming Business."
      subtitle="XELARVIS combines Artificial Intelligence, Data Science and IT Consulting to help organisations turn complex data and technology challenges into measurable business outcomes—with specialized expertise in Healthcare & Life Sciences."
      ctas={[
        { label: 'Explore Our Capabilities', href: '/services', variant: 'accent' },
        { label: 'Talk to XELARVIS', href: '/contact?intent=business', variant: 'outline' },
      ]}
      variant="product"
    />
  )
}
