import { InsightsTypePage } from '@/components/insights/InsightsTypePage'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'News',
  description:
    'Company announcements, partnership news and industry updates from Xelarvis on artificial intelligence, data science, cloud engineering and healthcare data.',
  path: '/insights/news',
})

export default function Page() {
  return (
    <InsightsTypePage
      type="news"
      title="News"
      subtitle="Company announcements and industry updates."
    />
  )
}
