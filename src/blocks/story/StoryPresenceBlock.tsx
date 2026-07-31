import { StoryPresence } from '@/blocks/story/StoryPresence'
import { safePayload } from '@/lib/cms'

type TestimonialDoc = {
  id: string
  quote: string
  authorName: string
  authorRole?: string | null
  company?: string | null
}

type StoryPresenceBlockProps = {
  eyebrow?: string | null
  heading: string
}

export async function StoryPresenceBlock({ eyebrow, heading }: StoryPresenceBlockProps) {
  const result = await safePayload((payload) =>
    payload.find({
      collection: 'testimonials',
      where: { featured: { equals: true } },
      limit: 4,
      depth: 0,
    }),
  )

  const docs = (result?.docs as TestimonialDoc[]) ?? []
  const quotes = docs.map((t) => ({
    id: t.id,
    quote: t.quote,
    authorName: t.authorName,
    authorRole: t.authorRole,
    company: t.company,
  }))

  return <StoryPresence eyebrow={eyebrow} heading={heading} quotes={quotes} />
}
