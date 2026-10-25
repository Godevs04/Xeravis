import { absoluteUrl } from '@/lib/utils'

/** Public route prefix for each previewable collection. */
export const PREVIEW_PATHS = {
  pages: '',
  blogs: '/blog',
  'case-studies': '/case-studies',
  services: '/services',
  solutions: '/solutions',
  industries: '/industries',
  research: '/research',
  careers: '/careers',
} as const

export type PreviewCollection = keyof typeof PREVIEW_PATHS

export function isPreviewCollection(value: unknown): value is PreviewCollection {
  return typeof value === 'string' && value in PREVIEW_PATHS
}

export function previewPath(collection: PreviewCollection, slug?: string | null): string {
  if (collection === 'pages') return !slug || slug === 'home' ? '/' : `/${slug}`
  return slug ? `${PREVIEW_PATHS[collection]}/${slug}` : PREVIEW_PATHS[collection]
}

/** URL used by the admin Preview button and the Live Preview iframe. */
export function previewUrl(collection: PreviewCollection, slug?: string | null): string {
  const params = new URLSearchParams({ collection, slug: slug || '' })
  if (process.env.PREVIEW_SECRET) params.set('secret', process.env.PREVIEW_SECRET)
  return absoluteUrl(`/api/preview?${params.toString()}`)
}

export function previewAdmin(collection: PreviewCollection) {
  const url = ({ data }: { data?: { slug?: string | null } | null }) =>
    previewUrl(collection, data?.slug)
  return { livePreview: { url }, preview: (doc: Record<string, unknown>) => url({ data: doc }) }
}
