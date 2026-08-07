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
      eyebrow="Data Science · AI · Healthcare"
      title="Data Science, AI & Healthcare."
      subtitle="We design and ship data science, AI, and healthcare solutions—clinical intelligence and platforms operators can trust."
      ctas={[
        { label: 'Start a project', href: '/contact?intent=project', variant: 'accent' },
        { label: 'Explore services', href: '/services', variant: 'outline' },
      ]}
      variant="product"
    />
  )
}
