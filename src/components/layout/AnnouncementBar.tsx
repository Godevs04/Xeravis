'use client'

import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export type AnnouncementData = {
  message: string
  ctaLabel?: string | null
  ctaLink?: string | null
}

/** Dismissal is per message, so publishing a new announcement shows it again. */
const storageKey = (message: string) => `xe-announcement:${message.slice(0, 80)}`

export function AnnouncementBar({ message, ctaLabel, ctaLink }: AnnouncementData) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      setDismissed(window.sessionStorage.getItem(storageKey(message)) === '1')
    } catch {
      // Storage can be unavailable (privacy mode); keep the bar visible.
    }
  }, [message])

  if (dismissed) return null

  return (
    <div className="pointer-events-none mx-auto mt-2 flex max-w-[1280px] justify-center px-1">
      <div
        role="region"
        aria-label="Announcement"
        className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] py-1 pr-1 pl-3.5 text-xs font-medium text-[color:var(--ds-primary)] shadow-[var(--shadow-medium)] backdrop-blur-xl sm:text-[13px]"
      >
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-accent)]"
          aria-hidden
        />
        <span className="min-w-0 truncate">{message}</span>
        {ctaLabel && ctaLink ? (
          <Link
            href={ctaLink}
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-semibold text-[color:var(--color-accent)] hover:underline"
          >
            {ctaLabel}
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setDismissed(true)
            try {
              window.sessionStorage.setItem(storageKey(message), '1')
            } catch {
              // Ignore storage failures; dismissal still applies for this view.
            }
          }}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[color:var(--ds-muted)] transition-colors hover:bg-[color:var(--glass-border)] hover:text-[color:var(--ds-primary)]"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  )
}
