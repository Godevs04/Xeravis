'use client'

import { CalendarDays } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from '@/components/ui/link'
import { useRef, useState } from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { track } from '@/lib/analytics-client'

const BookCallModal = dynamic(
  () => import('@/components/booking/BookCallModal').then((m) => m.BookCallModal),
  { ssr: false },
)

/** Cal.com event path, e.g. `xelarvis/discovery-call`. */
const CALCOM_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK?.replace(
  /^https?:\/\/(app\.)?cal\.com\//,
  '',
)

export const bookingEnabled = Boolean(CALCOM_LINK)

type Props = {
  label?: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  className?: string
  /** What to render when Cal.com is not configured. */
  fallback?: 'contact' | 'none'
}

export function BookCallButton({
  label = 'Book a call',
  variant = 'outline',
  size = 'default',
  className,
  fallback = 'contact',
}: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  if (!CALCOM_LINK) {
    if (fallback === 'none') return null
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <Link href="/contact?intent=business">{label}</Link>
      </Button>
    )
  }

  const src = `https://cal.com/${CALCOM_LINK}?embed=true&layout=month_view`

  return (
    <>
      <Button
        ref={buttonRef}
        variant={variant}
        size={size}
        className={className}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setMounted(true)
          setOpen(true)
          track('booking_opened')
        }}
      >
        <CalendarDays className="h-4 w-4" aria-hidden />
        {label}
      </Button>
      {mounted ? (
        <BookCallModal open={open} onOpenChange={setOpen} src={src} returnFocusRef={buttonRef} />
      ) : null}
    </>
  )
}
