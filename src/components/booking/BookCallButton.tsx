'use client'

import { CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal'
import { track } from '@/lib/analytics-client'

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
    <Modal
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) track('booking_opened')
      }}
    >
      <ModalTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <CalendarDays className="h-4 w-4" aria-hidden />
          {label}
        </Button>
      </ModalTrigger>
      <ModalContent className="max-w-4xl p-0 sm:p-0">
        <ModalHeader className="px-6 pt-6">
          <ModalTitle>Book a call with Xelarvis</ModalTitle>
          <ModalDescription>
            Pick a time that suits you. You&apos;ll get a calendar invite by email.
          </ModalDescription>
        </ModalHeader>
        {open ? (
          <iframe
            title="Book a call"
            src={src}
            className="h-[min(70svh,640px)] w-full rounded-b-[var(--radius-dialog)] border-0"
            loading="lazy"
          />
        ) : null}
      </ModalContent>
    </Modal>
  )
}
