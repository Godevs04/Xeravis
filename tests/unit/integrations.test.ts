import { describe, expect, it, vi } from 'vitest'

import { formatLeadAlert, notifyLead } from '@/lib/notify'
import { verifyTurnstile } from '@/lib/turnstile'

const alert = {
  type: 'contact' as const,
  title: 'Jane Doe',
  fields: [
    ['Email', 'jane@example.com'],
    ['Phone', ''],
    ['Company', null],
  ] as Array<[string, string | null]>,
  adminPath: '/admin/collections/contact-messages/1',
}

describe('formatLeadAlert', () => {
  it('includes non-empty fields and the admin link only', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://xelarvis.in')
    const text = formatLeadAlert(alert)
    expect(text).toContain('*New contact enquiry*: Jane Doe')
    expect(text).toContain('*Email:* jane@example.com')
    expect(text).not.toContain('Phone')
    expect(text).toContain('https://xelarvis.in/admin/collections/contact-messages/1')
  })
})

describe('notifyLead', () => {
  it('is a no-op without a webhook', async () => {
    vi.stubEnv('LEAD_WEBHOOK_URL', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    expect(await notifyLead(alert)).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts JSON text to the webhook', async () => {
    vi.stubEnv('LEAD_WEBHOOK_URL', 'https://hooks.example.com/x')
    const fetchMock = vi.fn().mockResolvedValue(new Response('ok'))
    vi.stubGlobal('fetch', fetchMock)
    expect(await notifyLead(alert)).toBe(true)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://hooks.example.com/x')
    expect(JSON.parse(init.body).text).toContain('Jane Doe')
  })

  it('never throws on network errors', async () => {
    vi.stubEnv('LEAD_WEBHOOK_URL', 'https://hooks.example.com/x')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(await notifyLead(alert)).toBe(false)
  })
})

describe('verifyTurnstile', () => {
  const contact = { action: 'contact' as const }
  const valid = { success: true, action: 'contact', hostname: 'xelarvis.in' }

  function configure(secret = 'secret') {
    vi.stubEnv('TURNSTILE_SECRET_KEY', secret)
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'site')
    vi.stubEnv('TURNSTILE_HOSTNAMES', '')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://xelarvis.in')
  }

  it('passes when Turnstile is not configured', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '')
    expect(await verifyTurnstile(undefined, contact)).toBe(true)
  })

  it('fails on a missing token once configured', async () => {
    configure()
    expect(await verifyTurnstile('', contact)).toBe(false)
  })

  it('accepts a matching verification and forwards the IP', async () => {
    configure()
    const fetchMock = vi.fn().mockResolvedValue(Response.json(valid))
    vi.stubGlobal('fetch', fetchMock)
    expect(await verifyTurnstile('token', { ...contact, ip: '1.2.3.4' })).toBe(true)
    const body = fetchMock.mock.calls[0][1].body as URLSearchParams
    expect(body.get('remoteip')).toBe('1.2.3.4')
  })

  it('rejects a token signed for another action or hostname', async () => {
    configure()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ ...valid, action: 'newsletter' })),
    )
    expect(await verifyTurnstile('token', contact)).toBe(false)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ ...valid, hostname: 'evil.com' })),
    )
    expect(await verifyTurnstile('token', contact)).toBe(false)
  })

  it('prefers TURNSTILE_HOSTNAMES over the site URL', async () => {
    configure()
    vi.stubEnv('TURNSTILE_HOSTNAMES', 'www.xelarvis.in, xelarvis.in')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ ...valid, hostname: 'www.xelarvis.in' })),
    )
    expect(await verifyTurnstile('token', contact)).toBe(true)
  })

  it('only checks success with Cloudflare test secrets', async () => {
    configure('1x0000000000000000000000000000000AA')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ success: true, hostname: 'example.com' })),
    )
    expect(await verifyTurnstile('token', contact)).toBe(true)
  })

  it('fails closed on rejection and network errors', async () => {
    configure()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ success: false })))
    expect(await verifyTurnstile('token', contact)).toBe(false)
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    expect(await verifyTurnstile('token', contact)).toBe(false)
  })
})
