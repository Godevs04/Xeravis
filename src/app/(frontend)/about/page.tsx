import { AboutPageContent } from '@/components/about/AboutPageContent'
import { AboutPageHero } from '@/components/marketing/PageHeroes'
import { ABOUT_HERO } from '@/lib/about-content'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'About XELARVIS',
  description: ABOUT_HERO.subtitle,
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <AboutPageHero
        title={ABOUT_HERO.title}
        subtitle={ABOUT_HERO.subtitle}
        primaryCtaLabel={ABOUT_HERO.primaryCta.label}
        primaryCtaHref={ABOUT_HERO.primaryCta.href}
        secondaryCtaLabel={ABOUT_HERO.secondaryCta.label}
        secondaryCtaHref={ABOUT_HERO.secondaryCta.href}
      />
      <AboutPageContent />
    </>
  )
}
