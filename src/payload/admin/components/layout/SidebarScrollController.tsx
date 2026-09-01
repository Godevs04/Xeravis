'use client'

import { usePathname } from 'next/navigation'
import React, { useLayoutEffect } from 'react'

import { restoreSidebarScroll } from '@/payload/admin/components/nav/sidebar/sidebarScroll'

/** Restore sidebar scroll before paint on every client navigation. */
export function SidebarScrollController() {
  const pathname = usePathname() || '/admin'

  useLayoutEffect(() => {
    restoreSidebarScroll()
    requestAnimationFrame(restoreSidebarScroll)
  }, [pathname])

  return null
}

export default SidebarScrollController
