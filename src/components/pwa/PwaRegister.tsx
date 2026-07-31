'use client'

import { useEffect } from 'react'

import { logger } from '@/lib/logger'

type PwaRegisterProps = {
  scriptUrl: string
  scope: string
}

const log = logger.child('pwa')

export function PwaRegister({ scriptUrl, scope }: PwaRegisterProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    if (!window.isSecureContext) return

    let cancelled = false
    let registration: ServiceWorkerRegistration | null = null
    let intervalId = 0

    const onUpdateFound = () => {
      const worker = registration?.installing
      if (!worker) return
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          worker.postMessage({ type: 'SKIP_WAITING' })
        }
      })
    }

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register(scriptUrl, { scope })
        if (cancelled) return
        log.debug(`Registered ${scriptUrl}`, registration.scope)
        registration.addEventListener('updatefound', onUpdateFound)
        intervalId = window.setInterval(
          () => {
            void registration?.update()
          },
          60 * 60 * 1000,
        )
      } catch (error) {
        log.warn(`Failed to register ${scriptUrl}`, error)
      }
    }

    void register()

    return () => {
      cancelled = true
      registration?.removeEventListener('updatefound', onUpdateFound)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [scriptUrl, scope])

  return null
}
