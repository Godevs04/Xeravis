const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export const TURNSTILE_FIELD = 'cf-turnstile-response'

export function turnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
}

/**
 * Verifies a Cloudflare Turnstile token. Passes when Turnstile is not configured, so forms keep
 * working with only the honeypot; fails closed on network errors once it is configured.
 */
export async function verifyTurnstile(token: unknown, ip?: string): Promise<boolean> {
  if (!turnstileEnabled()) return true
  if (typeof token !== 'string' || !token || token.length > 2048) return false
  try {
    const body = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY || '',
      response: token,
    })
    if (ip && ip !== 'unknown') body.set('remoteip', ip)
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return false
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}
