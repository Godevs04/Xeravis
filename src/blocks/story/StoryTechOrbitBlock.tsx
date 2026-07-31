import { StoryTechOrbit } from '@/blocks/story/StoryTechOrbit'
import { listDocs } from '@/lib/cms'

type TechDoc = {
  id: string
  title: string
  category?: string | null
}

const FALLBACK = [
  { id: '1', title: 'Python', category: 'ai' },
  { id: '2', title: 'TensorFlow', category: 'ai' },
  { id: '3', title: 'SAS', category: 'clinical' },
  { id: '4', title: 'CDISC', category: 'clinical' },
  { id: '5', title: 'Power BI', category: 'bi' },
  { id: '6', title: 'Spark', category: 'data' },
  { id: '7', title: 'LangChain', category: 'ai' },
  { id: '8', title: 'OpenAI', category: 'ai' },
]

type StoryTechOrbitBlockProps = {
  eyebrow?: string | null
  heading: string
  subheading?: string | null
}

export async function StoryTechOrbitBlock({
  eyebrow,
  heading,
  subheading,
}: StoryTechOrbitBlockProps) {
  const docs = await listDocs<TechDoc>('technologies', { limit: 12, sort: 'order' })
  const source = docs.length ? docs : FALLBACK
  const nodes = source.map((t) => ({
    id: t.id,
    label: t.title,
    category: t.category,
  }))

  return (
    <StoryTechOrbit eyebrow={eyebrow} heading={heading} subheading={subheading} nodes={nodes} />
  )
}
