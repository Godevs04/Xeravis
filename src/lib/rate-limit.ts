type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterMs: number
}

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

function prune(now: number) {
  if (buckets.size < 2000) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/**
 * Best-effort in-memory rate limiter (per serverless instance).
 * Suitable as a first line of defense for public writes/analytics.
 */
export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now()
  prune(now)

  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs })
    return { ok: true, remaining: options.limit - 1, retryAfterMs: options.windowMs }
  }

  if (existing.count >= options.limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterMs: Math.max(0, existing.resetAt - now),
    }
  }

  existing.count += 1
  buckets.set(key, existing)
  return {
    ok: true,
    remaining: Math.max(0, options.limit - existing.count),
    retryAfterMs: Math.max(0, existing.resetAt - now),
  }
}

export function clientKeyFromHeaders(headersList: Headers, prefix: string) {
  const forwarded = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')
  const ip = (forwarded?.split(',')[0] || realIp || 'unknown').trim()
  return `${prefix}:${ip}`
}

export function boundMeta(input: unknown, maxKeys = 12, maxString = 200) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined
  const out: Record<string, string | number | boolean | null> = {}
  let count = 0
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (count >= maxKeys) break
    if (typeof value === 'string') {
      out[key.slice(0, 40)] = value.slice(0, maxString)
      count += 1
    } else if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
      out[key.slice(0, 40)] = value
      count += 1
    }
  }
  return Object.keys(out).length ? out : undefined
}
