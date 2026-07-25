'use client'

import type { ReactNode } from 'react'

import { SitePwa } from '@/components/pwa/SitePwa'
import { SmoothScroll } from '@/providers/SmoothScroll'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { ToastProvider } from '@/providers/ToastProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SmoothScroll>
        {children}
        <ToastProvider />
        <SitePwa />
      </SmoothScroll>
    </ThemeProvider>
  )
}
