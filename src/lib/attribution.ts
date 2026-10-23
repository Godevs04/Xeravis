/** Lead attribution shared by the client capture and the server-side parser. */

export const ATTRIBUTION_FIELDS = [
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'utmTerm',
  'utmContent',
  'referrer',
  'landingPage',
] as const

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number]
export type Attribution = Partial<Record<AttributionField, string>>

export const ATTRIBUTION_PREFIX = 'attr_'
export const ATTRIBUTION_STORAGE_KEY = 'xe-attribution'

const UTM_PARAMS: Array<[string, AttributionField]> = [
  ['utm_source', 'utmSource'],
  ['utm_medium', 'utmMedium'],
  ['utm_campaign', 'utmCampaign'],
  ['utm_term', 'utmTerm'],
  ['utm_content', 'utmContent'],
]

function clean(value: unknown, max = 300): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().slice(0, max)
  return trimmed || undefined
}

/** First-touch attribution from a landing URL and `document.referrer`. */
export function attributionFromLocation(href: string, referrer: string): Attribution {
  const url = new URL(href)
  const out: Attribution = { landingPage: clean(url.pathname) }
  for (const [param, field] of UTM_PARAMS) {
    const value = clean(url.searchParams.get(param), 120)
    if (value) out[field] = value
  }
  if (referrer) {
    try {
      const ref = new URL(referrer)
      if (ref.host !== url.host) out.referrer = clean(`${ref.origin}${ref.pathname}`)
    } catch {
      // Ignore malformed referrers.
    }
  }
  return out
}

/** Reads `attr_*` hidden fields from a submitted form; returns undefined when empty. */
export function attributionFromFormData(formData: FormData): Attribution | undefined {
  const out: Attribution = {}
  for (const field of ATTRIBUTION_FIELDS) {
    const value = clean(formData.get(`${ATTRIBUTION_PREFIX}${field}`))
    if (value) out[field] = value
  }
  return Object.keys(out).length > 0 ? out : undefined
}
