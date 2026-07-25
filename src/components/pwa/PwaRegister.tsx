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

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register(scriptUrl, { scope })
        log.debug(`Registered ${scriptUrl}`, registration.scope)
      } catch (error) {
        log.warn(`Failed to register ${scriptUrl}`, error)
      }
    }

    void register()
  }, [scriptUrl, scope])

  return null
}
