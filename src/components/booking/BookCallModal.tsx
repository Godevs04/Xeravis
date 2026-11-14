'use client'

import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import type { RefObject } from 'react'

export function BookCallModal({
  open,
  onOpenChange,
  src,
  returnFocusRef,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string
  returnFocusRef: RefObject<HTMLElement | null>
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        className="max-w-4xl p-0 sm:p-0"
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          returnFocusRef.current?.focus()
        }}
      >
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
