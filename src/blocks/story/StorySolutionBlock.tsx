import { StorySolution, type SolutionChapter } from '@/blocks/story/StorySolution'
import { listPublished } from '@/lib/cms'
import { mergePublishedServices } from '@/lib/services-catalog'

type ServiceDoc = { id: string; title: string; slug: string; summary: string }

type StorySolutionBlockProps = {
  eyebrow?: string | null
  heading: string
  chapters?: { title: string; body: string }[] | null
}

const STOP_WORDS = new Set(['and', '&', 'the', 'of', 'advanced'])

function words(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((word) => word && !STOP_WORDS.has(word))
}

/** Pairs each chapter with the service sharing the most title words. */
function linkChapters(chapters: { title: string; body: string }[], services: ServiceDoc[]) {
  return chapters.map<SolutionChapter>((chapter) => {
    const chapterWords = new Set(words(chapter.title))
    let best: ServiceDoc | undefined
    let bestScore = 0
    for (const service of services) {
      const score = words(service.title).filter((word) => chapterWords.has(word)).length
      if (score > bestScore) {
        best = service
        bestScore = score
      }
    }
    return best ? { ...chapter, href: `/services/${best.slug}` } : chapter
  })
}

export async function StorySolutionBlock({ eyebrow, heading, chapters }: StorySolutionBlockProps) {
  const services = mergePublishedServices(
    await listPublished<ServiceDoc>('services', { limit: 8, sort: 'order' }),
  )

  return (
    <StorySolution
      eyebrow={eyebrow}
      heading={heading}
      chapters={chapters?.length ? linkChapters(chapters, services) : undefined}
      viewAllHref="/services"
    />
  )
}
