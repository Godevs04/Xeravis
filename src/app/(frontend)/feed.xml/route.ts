import { listPublished } from '@/lib/cms'
import { escapeHtml } from '@/lib/email-templates'
import { absoluteUrl } from '@/lib/utils'

export const revalidate = 3600

type FeedDoc = {
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  updatedAt?: string
}

type FeedItem = { title: string; link: string; description: string; date: Date; category: string }

function toItems(docs: FeedDoc[], base: string, category: string): FeedItem[] {
  return docs
    .filter((doc) => doc.slug && doc.title)
    .map((doc) => ({
      title: doc.title,
      link: absoluteUrl(`${base}/${doc.slug}`),
      description: doc.excerpt || '',
      date: new Date(doc.publishedAt || doc.updatedAt || Date.now()),
      category,
    }))
}

export async function GET() {
  const [blogs, research] = await Promise.all([
    listPublished<FeedDoc>('blogs', { sort: '-publishedAt', limit: 30, depth: 0 }),
    listPublished<FeedDoc>('research', { sort: '-publishedAt', limit: 20, depth: 0 }),
  ])
  const items = [
    ...toItems(blogs, '/blog', 'Insights'),
    ...toItems(research, '/research', 'Research'),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 40)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Xelarvis Insights</title>
    <link>${absoluteUrl('/insights')}</link>
    <description>Insights and research on AI, data science, data engineering and digital transformation from Xelarvis.</description>
    <language>en</language>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
    ${items[0] ? `<lastBuildDate>${items[0].date.toUTCString()}</lastBuildDate>` : ''}
${items
  .map(
    (item) => `    <item>
      <title>${escapeHtml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <category>${item.category}</category>
      <description>${escapeHtml(item.description)}</description>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
