import { InsightsTypePage } from '@/components/insights/InsightsTypePage'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'White Papers',
  description: 'In-depth briefs on AI, healthcare, and digital transformation.',
  path: '/insights/white-papers',
})

export default function Page() {
  return (
    <InsightsTypePage
      type="white-paper"
      title="White Papers"
      subtitle="In-depth briefs on AI, healthcare, and digital transformation."
    />
  )
}
