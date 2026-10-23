'use client'

import { useEffect, useState, type ReactNode } from 'react'

import {
  allowAnalytics,
  CONSENT_EVENT,
  hasStoredConsent,
  loadPosthog,
} from '@/lib/analytics-client'

type AnalyticsConsentProps = {
  /** True when the cookie banner is enabled, so tracking waits for the visitor to accept. */
  consentRequired: boolean
  /** Third-party tags, rendered only once analytics is allowed. */
  children?: ReactNode
}

export function AnalyticsConsent({ consentRequired, children }: AnalyticsConsentProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const enable = () => {
      allowAnalytics()
      setEnabled(true)
      const start = () => void loadPosthog()
      if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 4000 })
      else setTimeout(start, 2000)
    }
    if (!consentRequired || hasStoredConsent()) {
      enable()
      return
    }
    window.addEventListener(CONSENT_EVENT, enable, { once: true })
    return () => window.removeEventListener(CONSENT_EVENT, enable)
  }, [consentRequired])

  return enabled ? <>{children}</> : null
}
