'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

import { logger } from '@/lib/logger'

type PwaRegisterProps = {
  scriptUrl: string
  scope: string
}

const log = logger.child('pwa')

export function PwaRegister({ scriptUrl, scope }: PwaRegisterProps) {
  const [updateReady, setUpdateReady] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    if (!window.isSecureContext) return

    let cancelled = false
    let registration: ServiceWorkerRegistration | null = null
    let intervalId = 0

    const promptUpdate = (worker: ServiceWorker) => {
      setWaitingWorker(worker)
      setUpdateReady(true)
    }

    const onUpdateFound = () => {
      const worker = registration?.installing
      if (!worker) return
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          promptUpdate(worker)
        }
      })
    }

    const onControllerChange = () => {
      window.location.reload()
    }

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register(scriptUrl, { scope })
        if (cancelled) return
        log.debug(`Registered ${scriptUrl}`, registration.scope)

        if (registration.waiting && navigator.serviceWorker.controller) {
          promptUpdate(registration.waiting)
        }

        registration.addEventListener('updatefound', onUpdateFound)
        navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
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
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [scriptUrl, scope])

  const applyUpdate = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
    setUpdateReady(false)
  }

  if (!updateReady) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[70] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="status"
    >
      <div className="flex max-w-md items-center gap-3 rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] px-4 py-3 shadow-[var(--shadow-large)] backdrop-blur-xl">
        <p className="text-sm text-[color:var(--color-primary)]">
          A new version of the app is ready.
        </p>
        <button
          type="button"
          onClick={applyUpdate}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[color:var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Update
        </button>
      </div>
    </div>
  )
}
