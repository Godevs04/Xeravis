'use client'

import { useEffect, useState, type ReactNode } from 'react'

import {
  allowAnalytics,
  CONSENT_EVENT,
  hasStoredConsent,
  startMonitoring,
} from '@/lib/analytics-client'

type AnalyticsConsentProps = {
  /** True when the cookie banner is enabled, so tracking waits for the visitor to accept. */
  consentRequired: boolean
  /** Third-party tags, rendered only once analytics is allowed. */
  children?: ReactNode
}

/** Runs `fn` after the window load event, in the next idle period. */
function afterLoadIdle(fn: () => void) {
  let idleId: number | undefined
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const schedule = () => {
    if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(fn, { timeout: 5000 })
    else timeoutId = setTimeout(fn, 2500)
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
  return () => {
    window.removeEventListener('load', schedule)
    if (idleId !== undefined) window.cancelIdleCallback(idleId)
    if (timeoutId !== undefined) clearTimeout(timeoutId)
  }
}

export function AnalyticsConsent({ consentRequired, children }: AnalyticsConsentProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    let cancel: (() => void) | undefined
    const enable = () => {
      allowAnalytics()
      cancel = afterLoadIdle(() => {
        startMonitoring()
        setEnabled(true)
      })
    }
    if (!consentRequired || hasStoredConsent()) enable()
    else window.addEventListener(CONSENT_EVENT, enable, { once: true })
    return () => {
      window.removeEventListener(CONSENT_EVENT, enable)
      cancel?.()
    }
  }, [consentRequired])

  return enabled ? <>{children}</> : null
}
