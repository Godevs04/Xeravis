type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterMs: number
}

type RateLimitOptions = { limit: number; windowMs: number }

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

function toResult(count: number, ttlMs: number, options: RateLimitOptions): RateLimitResult {
  const retryAfterMs = Math.max(0, ttlMs)
  return count > options.limit
    ? { ok: false, remaining: 0, retryAfterMs }
    : { ok: true, remaining: Math.max(0, options.limit - count), retryAfterMs }
}

/** Per-instance fallback; limits reset on restart and are not shared across instances. */
function memoryRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  prune(now)

  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs })
    return toResult(1, options.windowMs, options)
  }

  existing.count += 1
  return toResult(existing.count, existing.resetAt - now, options)
}

/** Fixed-window counter in Upstash Redis (REST API, works in Node and Edge runtimes). */
async function upstashRateLimit(
  url: string,
  token: string,
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const redisKey = `rl:${key}`
  const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ['INCR', redisKey],
      ['PEXPIRE', redisKey, String(options.windowMs), 'NX'],
      ['PTTL', redisKey],
    ]),
    cache: 'no-store',
    signal: AbortSignal.timeout(1500),
  })
  if (!response.ok) throw new Error(`Upstash HTTP ${response.status}`)
  const [incr, , ttl] = (await response.json()) as { result?: number; error?: string }[]
  if (typeof incr?.result !== 'number') throw new Error(incr?.error || 'Upstash INCR failed')
  const ttlMs = typeof ttl?.result === 'number' && ttl.result > 0 ? ttl.result : options.windowMs
  return toResult(incr.result, ttlMs, options)
}

/**
 * Fixed-window rate limiter. Uses a shared Upstash Redis store when `UPSTASH_REDIS_REST_URL` and
 * `UPSTASH_REDIS_REST_TOKEN` are set (limits hold across serverless instances), otherwise an
 * in-memory store. Store errors fall back to memory so a Redis outage never blocks visitors.
 */
export async function rateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    try {
      return await upstashRateLimit(url, token, key, options)
    } catch {
      // Fall through to the in-memory limiter.
    }
  }
  return memoryRateLimit(key, options)
}

/**
 * Client IP for rate-limit keys. Prefers headers set by the hosting platform, then the last
 * `X-Forwarded-For` hop (appended by the nearest proxy). The first hop is client-controlled and
 * would let a client pick a fresh key per request.
 */
export function clientIpFromHeaders(headersList: Headers) {
  const platformIp =
    headersList.get('x-vercel-forwarded-for')?.split(',')[0] || headersList.get('x-real-ip')
  if (platformIp?.trim()) return platformIp.trim()
  const hops = headersList.get('x-forwarded-for')?.split(',') ?? []
  return hops.at(-1)?.trim() || 'unknown'
}

export function clientKeyFromHeaders(headersList: Headers, prefix: string) {
  return `${prefix}:${clientIpFromHeaders(headersList)}`
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
