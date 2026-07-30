'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function PageviewBeacon() {
  const pathname = usePathname()
  const last = useRef('')

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname === last.current) return
    last.current = pathname

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
