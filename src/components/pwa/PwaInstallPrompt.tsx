'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type PwaInstallPromptProps = {
  appName: string
  description: string
  storageKey: string
  tone?: 'site' | 'admin'
}

const REPROMPT_MS = 14 * 24 * 60 * 60 * 1000

function canShowPrompt(storageKey: string) {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return true
  if (raw === 'installed') return false
  if (raw === 'dismissed') return false
  try {
    const data = JSON.parse(raw) as { status?: string; at?: number }
    if (data.status === 'installed') return false
    if (data.status === 'dismissed' && typeof data.at === 'number') {
      return Date.now() - data.at > REPROMPT_MS
    }
  } catch {
    return false
  }
  return true
}

function persist(storageKey: string, status: 'dismissed' | 'installed') {
  localStorage.setItem(storageKey, JSON.stringify({ status, at: Date.now() }))
}

export function PwaInstallPrompt({
  appName,
  description,
  storageKey,
  tone = 'site',
}: PwaInstallPromptProps) {
  const reduce = useReducedMotion()
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [open, setOpen] = useState(false)
  const [iosHint, setIosHint] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (!canShowPrompt(storageKey)) return

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isSafari = Boolean(navigator.userAgent.match(/Version\/[\d.]+.*Safari/))
    if (isIos && isSafari) {
      const timer = window.setTimeout(() => setIosHint(true), 1800)
      return () => window.clearTimeout(timer)
    }

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setOpen(true)
    }

    window.addEventListener('beforeinstallprompt', onBip)
    return () => window.removeEventListener('beforeinstallprompt', onBip)
  }, [storageKey])

  const dismiss = () => {
    persist(storageKey, 'dismissed')
    setOpen(false)
    setIosHint(false)
    setDeferred(null)
  }

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    const choice = await deferred.userChoice
    if (choice.outcome === 'accepted') {
      persist(storageKey, 'installed')
    } else {
      persist(storageKey, 'dismissed')
    }
    setOpen(false)
    setDeferred(null)
  }

  const visible = open || iosHint
  const isAdmin = tone === 'admin'

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="xe-pwa-root"
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label={`Install ${appName}`}
        >
          <div className={`xe-pwa-card xe-pwa-card--${isAdmin ? 'admin' : 'site'}`}>
            <div className="xe-pwa-glow" aria-hidden />
            <button
              type="button"
              onClick={dismiss}
              className="xe-pwa-dismiss"
              aria-label="Dismiss install prompt"
            >
              <X size={16} strokeWidth={2} />
            </button>

            <div className="xe-pwa-body">
              <div className="xe-pwa-mark" aria-hidden>
                {isAdmin ? 'XV' : 'X'}
              </div>
              <div className="xe-pwa-copy">
                <p className="xe-pwa-title">{appName}</p>
                <p className="xe-pwa-desc">
                  {iosHint
                    ? 'On iPhone: tap Share, then “Add to Home Screen” for the full app experience.'
                    : description}
                </p>
              </div>
            </div>

            <div className="xe-pwa-actions">
              {!iosHint ? (
                <button type="button" onClick={install} className="xe-pwa-btn xe-pwa-btn--primary">
                  <Download size={16} strokeWidth={2} />
                  Install app
                </button>
              ) : null}
              <button
                type="button"
                onClick={dismiss}
                className={`xe-pwa-btn xe-pwa-btn--ghost${iosHint ? 'xe-pwa-btn--full' : ''}`}
              >
                {iosHint ? 'Got it' : 'Not now'}
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
