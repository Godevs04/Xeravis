import { ContentPage } from '@/components/layout/ContentPage'
import { ABOUT_MEGA, ABOUT_PAGES } from '@/lib/site-ia'
import { buildMetadata } from '@/lib/seo'

const page = ABOUT_PAGES.find((p) => p.slug === 'technology-innovation')!

export const metadata = buildMetadata({
  title: page.title,
  description: page.subtitle,
  path: page.path,
})

export default function Page() {
  return (
    <ContentPage
      page={page}
      related={ABOUT_MEGA.filter((item) => item.href !== page.path).map((item) => ({
        label: item.label,
        href: item.href,
      }))}
    />
  )
}
