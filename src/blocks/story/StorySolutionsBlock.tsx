import { StoryCapabilities } from '@/blocks/story/StoryCapabilities'
import { listPublished } from '@/lib/cms'
import { mergePublishedSolutions } from '@/lib/solutions-catalog'

type SolutionDoc = {
  id: string
  title: string
  slug: string
  summary: string
}

type StorySolutionsBlockProps = {
  eyebrow?: string | null
  heading: string
  subheading?: string | null
}

export async function StorySolutionsBlock({
  eyebrow,
  heading,
  subheading,
}: StorySolutionsBlockProps) {
  const solutions = await listPublished<SolutionDoc>('solutions', { limit: 12, sort: 'order' })
  const merged = mergePublishedSolutions(solutions)
  const items = merged.map((s) => ({
    id: s.id,
    title: s.title,
    summary: s.summary,
    href: `/solutions/${s.slug}`,
  }))

  return (
    <StoryCapabilities
      eyebrow={eyebrow ?? 'Solutions'}
      heading={heading}
      subheading={subheading}
      items={items}
      viewAllHref="/solutions"
      viewAllLabel="All solutions →"
      exploreLabel="Explore solution →"
    />
  )
}
