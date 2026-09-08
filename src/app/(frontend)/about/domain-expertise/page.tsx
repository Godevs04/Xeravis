import { ContentPage } from '@/components/layout/ContentPage'
import { ABOUT_MEGA, ABOUT_PAGES } from '@/lib/site-ia'
import { HEALTHCARE_SPECIALTY } from '@/lib/about-content'
import { buildMetadata } from '@/lib/seo'

const page = ABOUT_PAGES.find((p) => p.slug === 'domain-expertise')!

export const metadata = buildMetadata({
  title: page.title,
  description: page.subtitle,
  path: page.path,
})

export default function Page() {
  return (
    <ContentPage
      page={page}
      cta={{ label: HEALTHCARE_SPECIALTY.cta.label, href: HEALTHCARE_SPECIALTY.cta.href }}
      secondaryCta={{ label: 'About XELARVIS', href: '/about' }}
      related={ABOUT_MEGA.filter((item) => item.href !== page.path).map((item) => ({
        label: item.label,
        href: item.href,
      }))}
    />
  )
}
