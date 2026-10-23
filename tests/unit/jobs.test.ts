import type { PayloadRequest } from 'payload'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/email', () => ({ sendEmail: vi.fn() }))

import { jobs } from '@/payload/jobs'

function canRun(authorization: string | null, user: unknown = null) {
  const headers = new Headers(authorization ? { authorization } : {})
  return jobs.access?.run?.({ req: { user, headers } as unknown as PayloadRequest })
}

describe('jobs runner access', () => {
  it('accepts the cron secret as a bearer token', () => {
    vi.stubEnv('CRON_SECRET', 'cron-secret')
    expect(canRun('Bearer cron-secret')).toBe(true)
    expect(canRun('Bearer wrong')).toBe(false)
    expect(canRun(null)).toBe(false)
  })

  it('stays closed when no secret is configured', () => {
    vi.stubEnv('CRON_SECRET', '')
    expect(canRun('Bearer ')).toBe(false)
    expect(canRun('Bearer undefined')).toBe(false)
  })

  it('lets signed-in admin users run jobs', () => {
    vi.stubEnv('CRON_SECRET', '')
    expect(canRun(null, { id: 'u1' })).toBe(true)
  })
})
