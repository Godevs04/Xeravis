import { ContentPage } from '@/components/layout/ContentPage'
import { LAB_PAGES, RESEARCH_MEGA } from '@/lib/site-ia'
import { buildMetadata } from '@/lib/seo'

const page = LAB_PAGES.find((p) => p.slug === 'publications')!

export const metadata = buildMetadata({
  title: page.title,
  description: page.subtitle,
  path: page.path,
})

export default function Page() {
  return (
    <ContentPage
      page={page}
      related={RESEARCH_MEGA.filter((item) => item.href !== page.path).map((item) => ({
        label: item.label,
        href: item.href,
      }))}
    />
  )
}
