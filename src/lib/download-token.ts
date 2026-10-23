import { createHmac, timingSafeEqual } from 'node:crypto'

const TTL_MS = 15 * 60_000

function sign(value: string) {
  return createHmac('sha256', process.env.PAYLOAD_SECRET || 'dev-secret')
    .update(`download:${value}`)
    .digest('base64url')
}

/** Short-lived signed token that lets one visitor fetch a gated file after leaving their email. */
export function createDownloadToken(slug: string, now = Date.now()) {
  const exp = String(now + TTL_MS)
  return `${exp}.${sign(`${slug}.${exp}`)}`
}

export function verifyDownloadToken(slug: string, token: string | null, now = Date.now()) {
  if (!token) return false
  const [exp, sig] = token.split('.')
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < now) return false
  const expected = Buffer.from(sign(`${slug}.${exp}`))
  const given = Buffer.from(sig)
  return expected.length === given.length && timingSafeEqual(expected, given)
}
