import { IndustriesPageHero } from '@/components/marketing/PageHeroes'
import { IndustriesIndexSection } from '@/components/industries/IndustriesIndexSection'
import { listPublished } from '@/lib/cms'
import { FALLBACK_INDUSTRIES } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type IndustryDoc = {
  id: string
  title: string
  slug: string
  summary: string
}

export const metadata = buildMetadata({
  title: 'Healthcare & Enterprise Industries',
  description:
    'Industry engineering for healthcare, life sciences, finance, and manufacturing — AI, cloud, and clinical data platforms from Xelarvis.',
  path: '/industries',
})

export default async function IndustriesPage() {
  const industries = await listPublished<IndustryDoc>('industries')
  const items = industries.length ? industries : FALLBACK_INDUSTRIES

  return (
    <>
      <IndustriesPageHero
        title="Domain expertise where regulation, scale, and reliability intersect."
        subtitle="We adapt platform patterns to the realities of your sector."
      />
      <IndustriesIndexSection industries={items} />
    </>
  )
}
