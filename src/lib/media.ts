type MediaObject = {
  url?: string | null
  alt?: string | null
  filename?: string | null
}

export function getMediaUrl(media: string | MediaObject | null | undefined): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  if (media.url) return media.url
  return null
}

export function getMediaAlt(media: string | MediaObject | null | undefined, fallback = ''): string {
  if (!media || typeof media === 'string') return fallback
  return media.alt || fallback
}
