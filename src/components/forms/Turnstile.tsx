'use client'

import { useEffect, useRef } from 'react'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let scriptPromise: Promise<TurnstileApi | null> | null = null

function loadScript(): Promise<TurnstileApi | null> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  scriptPromise ??= new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve(window.turnstile ?? null)
    script.onerror = () => resolve(null)
    document.head.appendChild(script)
  })
  return scriptPromise
}

/**
 * Cloudflare Turnstile bot check. Renders nothing unless `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set.
 * The widget adds a hidden `cf-turnstile-response` input to the surrounding form. Change `resetKey`
 * after each submit to get a fresh token (tokens are single-use).
 */
export function Turnstile({ resetKey }: { resetKey?: unknown }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return
    let widgetId: string | null = null
    let cancelled = false
    const el = ref.current
    void loadScript().then((api) => {
      if (!api || cancelled) return
      widgetId = api.render(el, {
        sitekey: SITE_KEY,
        appearance: 'interaction-only',
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      })
    })
    return () => {
      cancelled = true
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [resetKey])

  if (!SITE_KEY) return null
  return <div ref={ref} className="min-h-0" />
}
