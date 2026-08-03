import { ContentPage } from '@/components/layout/ContentPage'
import { INSIGHTS_MEGA } from '@/lib/site-ia'
import { buildMetadata } from '@/lib/seo'

const page = {
  slug: 'reports',
  path: '/insights/reports',
  eyebrow: 'Insights',
  title: 'Reports & Research Briefs',
  subtitle:
    'Concise research digests and industry briefs from XELARVIS practice — fuller CMS-backed reports will land here as content is published.',
  sections: [
    {
      heading: 'What you will find here',
      body: 'Short research briefs, methodology notes, and industry digests that complement our white papers and blogs. Check back as new reports are published, or explore related Insights content.',
      bullets: [
        'Research briefs from AI and clinical practice',
        'Industry digests for healthcare and enterprise technology',
        'Pointers to deeper white papers and case studies',
      ],
    },
  ],
}

export const metadata = buildMetadata({
  title: page.title,
  description: page.subtitle,
  path: page.path,
})

export default function ReportsPage() {
  return (
    <ContentPage
      page={page}
      related={INSIGHTS_MEGA.filter((item) => item.href !== page.path).map((item) => ({
        label: item.label,
        href: item.href,
      }))}
      cta={{ label: 'Contact research', href: '/contact?intent=research' }}
    />
  )
}
