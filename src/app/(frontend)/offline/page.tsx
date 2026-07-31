import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline',
  description: 'You are offline. Cached pages may still be available.',
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-accent)] uppercase">
        Offline
      </p>
      <h1 className="font-display mt-4 max-w-lg text-[clamp(1.8rem,5vw,2.75rem)] font-bold tracking-[-0.04em] text-[color:var(--color-primary)]">
        You&apos;re offline right now.
      </h1>
      <p className="text-secondary mt-4 max-w-md text-base leading-relaxed">
        Reconnect to browse the latest from Xelarvis. Previously visited pages may still open from
        cache.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--color-accent)] px-6 text-sm font-semibold text-white shadow-[var(--shadow-hover)]"
      >
        Try homepage
      </Link>
    </div>
  )
}
