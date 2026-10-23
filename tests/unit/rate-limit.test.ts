import { describe, expect, it, vi } from 'vitest'

import { boundMeta, clientIpFromHeaders, rateLimit } from '@/lib/rate-limit'

describe('rateLimit (memory store)', () => {
  it('allows up to the limit, then blocks', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    const key = `test:${Math.random()}`
    const options = { limit: 2, windowMs: 60_000 }
    expect((await rateLimit(key, options)).ok).toBe(true)
    const second = await rateLimit(key, options)
    expect(second).toMatchObject({ ok: true, remaining: 0 })
    const third = await rateLimit(key, options)
    expect(third.ok).toBe(false)
    expect(third.retryAfterMs).toBeGreaterThan(0)
  })

  it('falls back to memory when Upstash fails', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://example.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'token')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')))
    const result = await rateLimit(`test:${Math.random()}`, { limit: 1, windowMs: 1000 })
    expect(result.ok).toBe(true)
  })
})

describe('clientIpFromHeaders', () => {
  it('prefers the platform header', () => {
    const headers = new Headers({
      'x-vercel-forwarded-for': '1.1.1.1',
      'x-forwarded-for': '9.9.9.9, 2.2.2.2',
    })
    expect(clientIpFromHeaders(headers)).toBe('1.1.1.1')
  })

  it('uses the last X-Forwarded-For hop, not the client-controlled first one', () => {
    expect(clientIpFromHeaders(new Headers({ 'x-forwarded-for': '9.9.9.9, 2.2.2.2' }))).toBe(
      '2.2.2.2',
    )
  })

  it('returns unknown without headers', () => {
    expect(clientIpFromHeaders(new Headers())).toBe('unknown')
  })
})

describe('boundMeta', () => {
  it('keeps primitives, drops objects, and caps keys and lengths', () => {
    const out = boundMeta({ a: 'x'.repeat(500), b: 1, c: { nested: true }, d: null }, 12, 10)
    expect(out).toEqual({ a: 'x'.repeat(10), b: 1, d: null })
  })

  it('rejects non-objects', () => {
    expect(boundMeta('nope')).toBeUndefined()
    expect(boundMeta([1, 2])).toBeUndefined()
  })
})
