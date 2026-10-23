import { InsightsTypePage } from '@/components/insights/InsightsTypePage'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'Resources',
  description:
    'Practical guides, checklists and materials from Xelarvis for teams adopting AI, data platforms and intelligent automation in their organisations.',
  path: '/insights/resources',
})

export default function Page() {
  return (
    <InsightsTypePage
      type="resource"
      title="Resources"
      subtitle="Guides and materials for teams adopting intelligent solutions."
    />
  )
}
