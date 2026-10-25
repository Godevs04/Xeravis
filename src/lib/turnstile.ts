const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export const TURNSTILE_FIELD = 'cf-turnstile-response'

/** One action per protected form; checked against the action the widget signed into the token. */
export type TurnstileAction = 'contact' | 'career' | 'newsletter' | 'download' | 'assessment'

/** Cloudflare's dummy secrets return placeholder action/hostname values, so only `success` is checked. */
const TEST_SECRET = /^[123]x0+AA$/

export function turnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
}

/** `TURNSTILE_HOSTNAMES` (comma-separated), else the host of `NEXT_PUBLIC_SITE_URL`. */
function expectedHostnames(): Set<string> {
  const configured = (process.env.TURNSTILE_HOSTNAMES ?? '')
    .split(',')
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean)
  if (configured.length) return new Set(configured)
  try {
    return new Set([new URL(process.env.NEXT_PUBLIC_SITE_URL || '').hostname.toLowerCase()])
  } catch {
    return new Set()
  }
}

/**
 * Verifies a Cloudflare Turnstile token. Passes when Turnstile is not configured, so forms keep
 * working with only the honeypot; once configured it requires success, the expected action and an
 * approved hostname, and fails closed on network errors.
 */
export async function verifyTurnstile(
  token: unknown,
  { action, ip }: { action: TurnstileAction; ip?: string },
): Promise<boolean> {
  if (!turnstileEnabled()) return true
  if (typeof token !== 'string' || !token || token.length > 2048) return false
  const secret = process.env.TURNSTILE_SECRET_KEY || ''
  const testMode = TEST_SECRET.test(secret)
  const hostnames = expectedHostnames()
  if (!testMode && hostnames.size === 0) return false
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip && ip !== 'unknown') body.set('remoteip', ip)
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return false
    const data = (await res.json()) as { success?: boolean; action?: string; hostname?: string }
    if (data.success !== true) return false
    if (testMode) return true
    return data.action === action && hostnames.has((data.hostname ?? '').toLowerCase())
  } catch {
    return false
  }
}
