'use client'

import type { ReactNode } from 'react'

import { SitePwa } from '@/components/pwa/SitePwa'
import { MotionProvider } from '@/providers/MotionProvider'
import { SmoothScroll } from '@/providers/SmoothScroll'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { ToastProvider } from '@/providers/ToastProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <SmoothScroll>
          {children}
          <ToastProvider />
          <SitePwa />
        </SmoothScroll>
      </MotionProvider>
    </ThemeProvider>
  )
}
