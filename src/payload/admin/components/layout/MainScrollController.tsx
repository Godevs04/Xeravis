'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useLayoutEffect, useRef } from 'react'

import { resolveNavigation } from '@/payload/admin/nav/registry'

import {
  bindMainScrollPersistence,
  getCollectionListKey,
  isDocumentRoute,
  resetMainScrollTop,
  restoreCollectionListScroll,
  getMainScroll,
  saveCollectionListScroll,
} from './mainScroll'

function restoreListWithRetry(pathname: string) {
  restoreCollectionListScroll(pathname)
  requestAnimationFrame(() => restoreCollectionListScroll(pathname))
  requestAnimationFrame(() => restoreCollectionListScroll(pathname))
}

/**
 * Owns main-content scroll only — never window/document.
 * List → list (same section): restore list position.
 * List → edit/create/global: reset to top.
 * Section change: reset to top.
 */
export function MainScrollController() {
  const pathname = usePathname() || '/admin'
  const prevSection = useRef<string | null>(null)
  const prevPath = useRef<string | null>(null)

  useEffect(() => {
    let wrap: HTMLElement | null = null
    let unbind: (() => void) | null = null

    const bind = () => {
      const next = getMainScroll()
      if (next === wrap) return
      unbind?.()
      wrap = next
      unbind = wrap ? bindMainScrollPersistence(wrap) : null
    }

    bind()
    const observer = new MutationObserver(bind)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      unbind?.()
    }
  }, [])

  useLayoutEffect(() => {
    const { section } = resolveNavigation(pathname)
    const prev = prevPath.current
    const pathChanged = prev !== null && prev !== pathname
    const sectionChanged = prevSection.current !== null && prevSection.current !== section

    if (pathChanged && prev) {
      if (getCollectionListKey(prev)) {
        saveCollectionListScroll(prev)
      }

      if (sectionChanged || isDocumentRoute(pathname)) {
        resetMainScrollTop()
      } else if (getCollectionListKey(pathname)) {
        restoreListWithRetry(pathname)
      } else {
        resetMainScrollTop()
      }
    }

    prevSection.current = section
    prevPath.current = pathname
  }, [pathname])

  return null
}

export default MainScrollController
