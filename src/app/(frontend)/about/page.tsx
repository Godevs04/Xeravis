import { AboutPageContent } from '@/components/about/AboutPageContent'
import { AboutPageHero } from '@/components/marketing/PageHeroes'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'About XELARVIS',
  description:
    'XELARVIS is an AI, data and technology company helping organizations transform complex data and technology challenges into scalable, measurable solutions.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <AboutPageHero
        title="Engineering Intelligence for a Data-Driven World"
        subtitle="XELARVIS is an AI, data and technology company focused on helping organizations transform complex data and technology challenges into scalable, measurable solutions."
      />
      <AboutPageContent />
    </>
  )
}
