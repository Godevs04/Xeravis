import type { Metadata } from 'next'

import { SwaggerDocs } from '@/components/docs/SwaggerDocs'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'API Docs',
    description: 'OpenAPI / Swagger documentation for Xelarvis website and admin helper APIs.',
    path: '/docs/api',
  }),
  robots: { index: false, follow: false },
}

export default function ApiDocsPage() {
  return <SwaggerDocs />
}
