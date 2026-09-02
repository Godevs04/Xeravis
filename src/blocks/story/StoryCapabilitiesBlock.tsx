import { StoryCapabilities } from '@/blocks/story/StoryCapabilities'
import { listPublished } from '@/lib/cms'
import { mergePublishedServices } from '@/lib/services-catalog'

type ServiceDoc = {
  id: string
  title: string
  slug: string
  summary: string
}

type StoryCapabilitiesBlockProps = {
  eyebrow?: string | null
  heading: string
  subheading?: string | null
}

export async function StoryCapabilitiesBlock({
  eyebrow,
  heading,
  subheading,
}: StoryCapabilitiesBlockProps) {
  const services = await listPublished<ServiceDoc>('services', { limit: 8, sort: 'order' })
  const merged = mergePublishedServices(services)
  const items = merged.map((s) => ({
    id: s.id,
    title: s.title,
    summary: s.summary,
    href: `/services/${s.slug}`,
  }))

  return (
    <StoryCapabilities
      eyebrow={eyebrow ?? 'Capabilities'}
      heading={heading}
      subheading={subheading}
      items={items}
    />
  )
}
