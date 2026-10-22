export function formatDate(
  value: string | Date | null | undefined,
  locale = 'en-US',
): string | null {
  if (!value) return null
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** A day-only deadline stays open through the end of that day (UTC). */
export function isPastDeadline(value: string | Date | null | undefined, now = new Date()): boolean {
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  date.setUTCHours(23, 59, 59, 999)
  return now > date
}

export function formatDateTime(
  value: string | Date | null | undefined,
  locale = 'en-US',
): string | null {
  if (!value) return null
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
