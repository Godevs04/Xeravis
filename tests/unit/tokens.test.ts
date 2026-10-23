import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/payload', () => ({ getPayload: vi.fn() }))
vi.mock('@/lib/email', () => ({ sendEmail: vi.fn() }))

import { createDownloadToken, verifyDownloadToken } from '@/lib/download-token'
import { confirmUrl, unsubscribeFooterHtml, unsubscribeHeaders } from '@/lib/newsletter'
import { createToken, isWellFormedToken } from '@/lib/tokens'

describe('tokens', () => {
  it('creates unique URL-safe tokens that pass validation', () => {
    const a = createToken()
    const b = createToken()
    expect(a).not.toBe(b)
    expect(isWellFormedToken(a)).toBe(true)
  })

  it('rejects malformed tokens', () => {
    expect(isWellFormedToken('short')).toBe(false)
    expect(isWellFormedToken('a'.repeat(30) + '$')).toBe(false)
    expect(isWellFormedToken({ $ne: null })).toBe(false)
  })
})

describe('newsletter links', () => {
  it('builds absolute, encoded confirm links', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://xelarvis.in')
    expect(confirmUrl('abc+/=')).toBe('https://xelarvis.in/newsletter/confirm?token=abc%2B%2F%3D')
  })

  it('emits RFC 8058 one-click unsubscribe headers', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://xelarvis.in')
    expect(unsubscribeHeaders('tok')).toEqual({
      'List-Unsubscribe': '<https://xelarvis.in/api/newsletter/unsubscribe?token=tok>',
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    })
  })

  it('escapes the unsubscribe link in HTML', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://xelarvis.in')
    expect(unsubscribeFooterHtml('a"b')).not.toContain('a"b')
  })
})

describe('download tokens', () => {
  it('verifies a fresh token for the same slug', () => {
    const now = Date.now()
    const token = createDownloadToken('guide', now)
    expect(verifyDownloadToken('guide', token, now)).toBe(true)
  })

  it('rejects other slugs, expired and tampered tokens', () => {
    const now = Date.now()
    const token = createDownloadToken('guide', now)
    expect(verifyDownloadToken('other', token, now)).toBe(false)
    expect(verifyDownloadToken('guide', token, now + 16 * 60_000)).toBe(false)
    expect(verifyDownloadToken('guide', `${token}x`, now)).toBe(false)
    expect(verifyDownloadToken('guide', null, now)).toBe(false)
    expect(verifyDownloadToken('guide', 'garbage', now)).toBe(false)
  })
})
