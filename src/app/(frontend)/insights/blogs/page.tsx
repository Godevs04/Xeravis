import { InsightsTypePage } from '@/components/insights/InsightsTypePage'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'Blogs',
  description: 'Articles from our engineering and delivery practice.',
  path: '/insights/blogs',
})

export default function Page() {
  return (
    <InsightsTypePage
      type="blog"
      title="Blogs"
      subtitle="Articles from our engineering and delivery practice."
    />
  )
}
