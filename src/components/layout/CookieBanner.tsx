'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

const CONSENT_KEY = 'xe-cookie-consent'

type CookieBannerProps = {
  message: string
  policyHref?: string | null
  acceptLabel?: string | null
}

export function CookieBanner({ message, policyHref, acceptLabel }: CookieBannerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(CONSENT_KEY) !== 'accepted')
    } catch {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[60] mx-auto max-w-md rounded-[var(--radius-card)] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] p-4 shadow-[var(--shadow-large)] backdrop-blur-xl sm:left-6 sm:mx-0"
    >
      <p className="text-sm leading-relaxed text-[color:var(--ds-secondary)]">
        {message}{' '}
        {policyHref ? (
          <Link
            href={policyHref}
            className="font-semibold text-[color:var(--color-accent)] hover:underline"
          >
            Learn more
          </Link>
        ) : null}
      </p>
      <div className="mt-3 flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            try {
              window.localStorage.setItem(CONSENT_KEY, 'accepted')
            } catch {
              // Ignore storage failures; hide for this session.
            }
            setVisible(false)
          }}
        >
          {acceptLabel || 'Accept'}
        </Button>
      </div>
    </div>
  )
}
