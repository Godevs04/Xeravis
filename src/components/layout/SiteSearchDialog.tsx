'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ArrowRight, CornerDownLeft, Loader2, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useState, type KeyboardEvent } from 'react'

import { CONNECTED_HUBS } from '@/lib/about-content'
import type { SiteSearchResult } from '@/lib/site-search'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'done' | 'error'

const MIN_QUERY = 2
const DEBOUNCE_MS = 200

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

function searchPageHref(query: string) {
  return `/search?q=${encodeURIComponent(query)}`
}

export function SiteSearchDialog({ triggerClassName }: { triggerClassName?: string }) {
  const router = useRouter()
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SiteSearchResult[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [active, setActive] = useState(0)

  const trimmed = query.trim()
  const searching = trimmed.length >= MIN_QUERY

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      } else if (event.key === '/' && !isEditableTarget(event.target)) {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open || trimmed.length < MIN_QUERY) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setStatus('loading')
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        })
        const data = (await response.json()) as { results?: SiteSearchResult[]; error?: string }
        if (!response.ok) throw new Error(data.error || 'Search is unavailable right now.')
        setResults(data.results ?? [])
        setActive(0)
        setStatus('done')
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Search is unavailable right now.')
        setStatus('error')
      }
    }, DEBOUNCE_MS)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [open, trimmed])

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setQuery('')
      setResults([])
      setStatus('idle')
      setActive(0)
    }
  }

  const go = (href: string) => {
    onOpenChange(false)
    router.push(href)
  }

  const visible = searching && status !== 'error' ? results : []

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && visible.length > 0) {
      event.preventDefault()
      setActive((index) => (index + 1) % visible.length)
    } else if (event.key === 'ArrowUp' && visible.length > 0) {
      event.preventDefault()
      setActive((index) => (index - 1 + visible.length) % visible.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const target = visible[active]
      if (target) go(target.href)
      else if (searching) go(searchPageHref(trimmed))
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger
        aria-label="Search the site"
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40 focus-visible:outline-none',
          triggerClassName,
        )}
      >
        <Search className="h-4 w-4" aria-hidden />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="bg-dark/55 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[60] backdrop-blur-sm" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="border-border bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[10vh] left-1/2 z-[60] flex max-h-[75vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 flex-col overflow-hidden rounded-3xl border shadow-[var(--shadow-floating)] duration-200"
        >
          <DialogPrimitive.Title className="sr-only">Search XELARVIS</DialogPrimitive.Title>
          <form
            role="search"
            action="/search"
            method="get"
            onSubmit={(event) => event.preventDefault()}
            className="flex items-center gap-3 border-b border-[color:var(--glass-border)] px-5"
          >
            {status === 'loading' ? (
              <Loader2 className="text-accent h-5 w-5 shrink-0 animate-spin" aria-hidden />
            ) : (
              <Search className="text-muted h-5 w-5 shrink-0" aria-hidden />
            )}
            <input
              autoFocus
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search services, solutions, insights, careers…"
              aria-label="Search query"
              aria-controls={listId}
              autoComplete="off"
              maxLength={100}
              className="text-primary placeholder:text-muted h-16 min-w-0 flex-1 bg-transparent text-base outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <DialogPrimitive.Close
              aria-label="Close search"
              className="text-muted hover:text-primary hover:bg-surface inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors"
            >
              <X className="h-4 w-4" aria-hidden />
            </DialogPrimitive.Close>
          </form>

          <div className="overflow-y-auto p-3" id={listId} aria-live="polite">
            {!searching ? (
              <div className="p-3">
                <p className="text-muted text-[10px] font-bold tracking-[0.14em] uppercase">
                  Popular
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CONNECTED_HUBS.map((hub) => (
                    <Link
                      key={hub.href}
                      href={hub.href}
                      onClick={() => onOpenChange(false)}
                      className="text-primary hover:border-accent hover:text-accent rounded-full border border-[color:var(--glass-border)] px-3.5 py-1.5 text-sm font-medium transition-colors"
                    >
                      {hub.label}
                    </Link>
                  ))}
                </div>
                <p className="text-muted mt-5 hidden text-xs sm:block">
                  Tip: press <kbd className="font-sans font-semibold">/</kbd> or{' '}
                  <kbd className="font-sans font-semibold">Ctrl K</kbd> anywhere to search.
                </p>
              </div>
            ) : status === 'error' ? (
              <p className="text-secondary p-4 text-sm">{error}</p>
            ) : status === 'done' && visible.length === 0 ? (
              <p className="text-secondary p-4 text-sm">
                No results for &ldquo;{trimmed}&rdquo;. Try a broader term such as &ldquo;AI&rdquo;,
                &ldquo;analytics&rdquo; or &ldquo;cloud&rdquo;.
              </p>
            ) : (
              <ul className="space-y-1">
                {visible.map((result, index) => (
                  <li key={result.id}>
                    <Link
                      href={result.href}
                      onClick={() => onOpenChange(false)}
                      onMouseEnter={() => setActive(index)}
                      className={cn(
                        'flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors',
                        index === active ? 'bg-surface' : 'hover:bg-surface',
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-primary truncate text-sm font-semibold">
                          {result.title}
                        </p>
                        {result.excerpt ? (
                          <p className="text-secondary mt-0.5 line-clamp-1 text-xs">
                            {result.excerpt}
                          </p>
                        ) : null}
                      </div>
                      <span className="text-muted shrink-0 text-[10px] font-bold tracking-[0.12em] uppercase">
                        {result.kind.replace('-', ' ')}
                      </span>
                      {index === active ? (
                        <CornerDownLeft className="text-accent h-4 w-4 shrink-0" aria-hidden />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {searching ? (
            <div className="border-t border-[color:var(--glass-border)] px-5 py-3">
              <Link
                href={searchPageHref(trimmed)}
                onClick={() => onOpenChange(false)}
                className="text-accent inline-flex items-center gap-2 text-sm font-semibold hover:underline"
              >
                See all results for &ldquo;{trimmed}&rdquo;
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
