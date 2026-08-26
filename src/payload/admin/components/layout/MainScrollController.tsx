'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

import { resolveNavigation } from '@/payload/admin/nav/registry'

const MAIN_SCROLL_SEL = '.template-default__wrap'

function getMainScroll(): HTMLElement | null {
  return document.querySelector<HTMLElement>(MAIN_SCROLL_SEL)
}

/**
 * Owns main-content scroll only — never window/document.
 * Same nav section → preserve scroll; different section → reset to top.
 */
export function MainScrollController() {
  const pathname = usePathname() || '/admin'
  const prevSection = useRef<string | null>(null)
  const prevPath = useRef<string | null>(null)

  useEffect(() => {
    const { section } = resolveNavigation(pathname)
    const wrap = getMainScroll()
    if (!wrap) {
      prevSection.current = section
      prevPath.current = pathname
      return
    }

    const pathChanged = prevPath.current !== null && prevPath.current !== pathname
    const sectionChanged = prevSection.current !== null && prevSection.current !== section

    if (pathChanged && (sectionChanged || prevSection.current === null)) {
      wrap.scrollTop = 0
    }

    prevSection.current = section
    prevPath.current = pathname
  }, [pathname])

  return null
}

export default MainScrollController
