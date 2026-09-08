import { ContentPage } from '@/components/layout/ContentPage'
import { WHO_WE_ARE } from '@/lib/about-content'
import { ABOUT_MEGA, ABOUT_PAGES } from '@/lib/site-ia'
import { buildMetadata } from '@/lib/seo'

const page = ABOUT_PAGES.find((p) => p.slug === 'company-overview')!

export const metadata = buildMetadata({
  title: page.title,
  description: page.subtitle,
  path: page.path,
})

export default function Page() {
  return (
    <ContentPage
      page={page}
      cta={WHO_WE_ARE.cta}
      secondaryCta={{ label: 'About XELARVIS', href: '/about' }}
      related={ABOUT_MEGA.filter((item) => item.href !== page.path).map((item) => ({
        label: item.label,
        href: item.href,
      }))}
    />
  )
}
