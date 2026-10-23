'use client'

import { useEffect } from 'react'

import { reportError } from '@/lib/analytics-client'
import { logger } from '@/lib/logger'

const log = logger.child('global-error')

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

/** Last-resort error UI when a root layout itself fails; renders its own <html> and <body>. */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    log.error(error)
    reportError(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          background: '#f8fafc',
          color: '#0f172a',
        }}
      >
        <main style={{ maxWidth: 480, textAlign: 'center' }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#0f766e',
            }}
          >
            Xelarvis
          </p>
          <h1 style={{ margin: '12px 0 8px', fontSize: 28, lineHeight: 1.2 }}>
            Something went wrong
          </h1>
          <p style={{ margin: '0 0 24px', color: '#475569', lineHeight: 1.6 }}>
            The page could not be loaded. Please try again, or come back in a few minutes.
            {error.digest ? ` (Reference: ${error.digest})` : null}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                border: 0,
                borderRadius: 999,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 600,
                background: '#0f766e',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- the app shell is down */}
            <a
              href="/"
              style={{
                borderRadius: 999,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 600,
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                textDecoration: 'none',
              }}
            >
              Go to homepage
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
