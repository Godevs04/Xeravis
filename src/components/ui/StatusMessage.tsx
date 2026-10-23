import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  eyebrow: string
  title: string
  description: ReactNode
  children?: ReactNode
  primary?: { href: string; label: string }
}

export function StatusMessage({ eyebrow, title, description, children, primary }: Props) {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-accent)] uppercase">
        {eyebrow}
      </p>
      <h1 className="font-display mt-4 max-w-lg text-[clamp(1.8rem,5vw,2.75rem)] font-bold tracking-[-0.04em] text-[color:var(--color-primary)]">
        {title}
      </h1>
      <div className="text-secondary mt-4 max-w-md text-base leading-relaxed">{description}</div>
      {children}
      {primary ? (
        <Link
          href={primary.href}
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--color-accent)] px-6 text-sm font-semibold text-[color:var(--color-on-accent)] shadow-[var(--shadow-hover)]"
        >
          {primary.label}
        </Link>
      ) : null}
    </div>
  )
}
