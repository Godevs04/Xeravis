import { listDocs } from '@/lib/cms'

import { DownloadCard, type DownloadItem } from './DownloadCard'

export type DownloadCategory = 'white-paper' | 'report' | 'resource'

export function listDownloads(category: DownloadCategory) {
  return listDocs<DownloadItem>('downloads', {
    where: { category: { equals: category } },
    sort: '-updatedAt',
    limit: 24,
    depth: 0,
  })
}

type Props = {
  id: string
  items: DownloadItem[]
  heading?: string
}

export function DownloadsSection({ id, items, heading = 'Downloads' }: Props) {
  if (items.length === 0) return null
  return (
    <section aria-labelledby={id} className="mb-12">
      <h2 id={id} className="font-display text-primary mb-5 text-xl font-semibold tracking-tight">
        {heading}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <DownloadCard
            key={item.id}
            item={{
              id: item.id,
              title: item.title,
              slug: item.slug,
              description: item.description,
              gated: item.gated,
            }}
          />
        ))}
      </div>
    </section>
  )
}
