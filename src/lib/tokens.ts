import { randomBytes } from 'node:crypto'

/** URL-safe random token for confirm / unsubscribe / status links. */
export function createToken(bytes = 24): string {
  return randomBytes(bytes).toString('base64url')
}

export function isWellFormedToken(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{20,64}$/.test(value)
}
