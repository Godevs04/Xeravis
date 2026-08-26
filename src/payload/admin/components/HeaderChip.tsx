'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { resolveNavigation } from '@/payload/admin/nav/registry'

const SLOT_SELECTOR = '.app-header__step-nav-wrapper'

function readDocumentTitle(): string | null {
  if (typeof document === 'undefined') return null
  const selectors = [
    '.doc-header__title',
    '.doc-header h1',
    '.collection-edit .doc-header__title',
    '.render-title',
    'h1.doc-header__title',
  ]
  for (const sel of selectors) {
    const el = document.querySelector(sel)
    const text = el?.textContent?.trim()
    if (text && text.length > 0 && text.length < 120) return text
  }
  return null
}

/** Breadcrumb trail — portaled into AppHeader (Payload header slot sits outside the grid). */
export const HeaderChip = () => {
  const pathname = usePathname() || '/admin'
  const [documentLabel, setDocumentLabel] = useState<string | null>(null)
  const [slot, setSlot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const sync = () => {
      const el = document.querySelector<HTMLElement>(SLOT_SELECTOR)
      if (el) setSlot(el)
    }
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.body, { childList: true, subtree: true })
    return () => obs.disconnect()
  }, [pathname])

  useEffect(() => {
    setDocumentLabel(null)
    const isDoc =
      /\/admin\/collections\/[^/]+\/(?!create$)[^/]+/.test(pathname) ||
      /\/admin\/globals\/[^/]+/.test(pathname)
    if (!isDoc) return

    let cancelled = false
    const apply = () => {
      if (cancelled) return
      const title = readDocumentTitle()
      if (title) setDocumentLabel(title)
    }

    apply()
    const t1 = window.setTimeout(apply, 120)
    const t2 = window.setTimeout(apply, 400)
    const obs = new MutationObserver(apply)
    obs.observe(document.body, { childList: true, subtree: true, characterData: true })

    return () => {
      cancelled = true
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      obs.disconnect()
    }
  }, [pathname])

  const crumbs = useMemo(
    () => resolveNavigation(pathname, { documentLabel }).breadcrumbs,
    [pathname, documentLabel],
  )

  if (crumbs.length <= 1 || !slot) return null

  return createPortal(
    <nav className="xe-header-chip xe-header-chip--breadcrumb" aria-label="Breadcrumb">
      <ol className="xe-breadcrumb">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1
          return (
            <li key={`${crumb.label}-${index}`} className="xe-breadcrumb__item">
              {index > 0 ? (
                <span className="xe-breadcrumb__sep" aria-hidden>
                  /
                </span>
              ) : null}
              {crumb.href && !last ? (
                <Link href={crumb.href} scroll={false} className="xe-breadcrumb__link">
                  {crumb.label}
                </Link>
              ) : (
                <span className="xe-breadcrumb__current" aria-current={last ? 'page' : undefined}>
                  {crumb.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>,
    slot,
  )
}

export default HeaderChip
