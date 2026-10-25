import type { ErrorEvent } from '@sentry/nextjs'
import { describe, expect, it } from 'vitest'

import { sentryOptions } from '@/lib/sentry-options'

describe('sentryOptions.beforeSend', () => {
  const { beforeSend } = sentryOptions('https://key@example.ingest.sentry.io/1')
  const event = { message: 'boom' } as ErrorEvent

  it('drops expected 401/403 auth errors', () => {
    const unauthorized = Object.assign(new Error('Unauthorized'), { status: 401 })
    const forbidden = Object.assign(new Error('Forbidden'), { status: 403 })
    expect(beforeSend(event, { originalException: unauthorized })).toBeNull()
    expect(beforeSend(event, { originalException: forbidden })).toBeNull()
  })

  it('keeps everything else', () => {
    const serverError = Object.assign(new Error('Server error'), { status: 500 })
    expect(beforeSend(event, { originalException: serverError })).toBe(event)
    expect(beforeSend(event, { originalException: new Error('plain') })).toBe(event)
    expect(beforeSend(event, {})).toBe(event)
  })
})
