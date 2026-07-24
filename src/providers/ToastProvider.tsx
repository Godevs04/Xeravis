'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: 'rounded-[var(--radius-card)] border border-border bg-background text-primary shadow-[var(--shadow-floating)]',
      }}
    />
  )
}
