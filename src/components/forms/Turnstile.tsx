'use client'

import { useEffect, useRef, useState } from 'react'

import type { TurnstileAction } from '@/lib/turnstile'

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
export function Turnstile({ action, resetKey }: { action: TurnstileAction; resetKey?: unknown }) {
  const ref = useRef<HTMLDivElement>(null)
  const [engaged, setEngaged] = useState(false)

  // The widget pulls a ~200 KB challenge frame, so it only loads once the visitor starts using
  // the form; filling in the fields gives it time to produce a token before submit.
  useEffect(() => {
    if (!SITE_KEY || engaged) return
    const form = ref.current?.closest('form')
    if (!form) {
      setEngaged(true)
      return
    }
    const engage = () => setEngaged(true)
    form.addEventListener('focusin', engage, { once: true })
    form.addEventListener('pointerdown', engage, { once: true })
    return () => {
      form.removeEventListener('focusin', engage)
      form.removeEventListener('pointerdown', engage)
    }
  }, [engaged])

  useEffect(() => {
    if (!SITE_KEY || !engaged || !ref.current) return
    let widgetId: string | null = null
    let cancelled = false
    const el = ref.current
    void loadScript().then((api) => {
      if (!api || cancelled) return
      widgetId = api.render(el, {
        sitekey: SITE_KEY,
        action,
        appearance: 'interaction-only',
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        // Without this Turnstile throws uncaught (e.g. 110200 on hostnames outside the widget's
        // domain list). The form still submits; the server rejects the missing token.
        'error-callback': () => true,
      })
    })
    return () => {
      cancelled = true
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [action, resetKey, engaged])

  if (!SITE_KEY) return null
  return <div ref={ref} className="min-h-0" />
}
