'use client'

import { Search } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

const SiteSearchDialog = dynamic(
  () => import('@/components/layout/SiteSearchDialog').then((m) => m.SiteSearchDialog),
  { ssr: false },
)

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

/** Search button and keyboard shortcuts; the dialog code loads on first open. */
export function SiteSearchTrigger({ triggerClassName }: { triggerClassName?: string }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const show = (next: boolean) => {
    if (next) setMounted(true)
    setOpen(next)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setMounted(true)
        setOpen((value) => !value)
      } else if (event.key === '/' && !isEditableTarget(event.target)) {
        event.preventDefault()
        setMounted(true)
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Search the site"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => show(true)}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40 focus-visible:outline-none',
          triggerClassName,
        )}
      >
        <Search className="h-4 w-4" aria-hidden />
      </button>
      {mounted ? (
        <SiteSearchDialog open={open} onOpenChange={show} returnFocusRef={buttonRef} />
      ) : null}
    </>
  )
}
