'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { ATTRIBUTION_STORAGE_KEY, attributionFromLocation } from '@/lib/attribution'

/** Stores first-touch attribution once per browser session (read by lead forms). */
function captureFirstTouch() {
  try {
    if (window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return
    const attribution = attributionFromLocation(window.location.href, document.referrer)
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // Storage can be blocked; attribution is then skipped.
  }
}

export function PageviewBeacon() {
  const pathname = usePathname()
  const last = useRef('')

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname === last.current) return
    last.current = pathname
    captureFirstTouch()

    const controller = new AbortController()
    void fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'pageview',
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {})

    return () => controller.abort()
  }, [pathname])

  return null
}
