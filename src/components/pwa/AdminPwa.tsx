'use client'

import React from 'react'

import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt'
import { PwaRegister } from '@/components/pwa/PwaRegister'

/** Matches `--xe-bg` so the browser and OS chrome blend into the admin background */
const THEME_COLORS = { light: '#F8FAFC', dark: '#0B1220' } as const

/** Mounts CMS PWA registration + elegant install prompt inside Payload admin */
export function AdminPwa() {
  React.useEffect(() => {
    if (typeof document === 'undefined') return

    const ensure = (rel: string, attrs: Record<string, string>) => {
      const selector = Object.entries(attrs)
        .map(([k, v]) => `[${k}="${v}"]`)
        .join('')
      if (document.head.querySelector(`link${selector}`)) return
      const link = document.createElement('link')
      link.rel = rel
      Object.entries(attrs).forEach(([k, v]) => link.setAttribute(k, v))
      document.head.appendChild(link)
    }

    const ensureMeta = (name: string, content: string) => {
      let meta = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    ensure('manifest', { href: '/admin/manifest.webmanifest' })
    ensure('apple-touch-icon', { href: '/icons/admin-192.png' })
    ensureMeta('mobile-web-app-capable', 'yes')
    ensureMeta('apple-mobile-web-app-capable', 'yes')
    // 'default' keeps iOS content below the status bar; 'black-translucent' would need safe-area padding everywhere
    ensureMeta('apple-mobile-web-app-status-bar-style', 'default')
    ensureMeta('apple-mobile-web-app-title', 'XV CMS')

    const root = document.documentElement
    const syncThemeColor = () => {
      ensureMeta(
        'theme-color',
        THEME_COLORS[root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'],
      )
    }
    syncThemeColor()

    // Earlier builds registered at '/admin/', which outranks '/admin' for every sub-page
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations
          .filter((r) => new URL(r.scope).pathname === '/admin/')
          .forEach((r) => void r.unregister())
      })
    }

    const observer = new MutationObserver(syncThemeColor)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <PwaRegister scriptUrl="/admin/sw.js" scope="/admin" />
      <PwaInstallPrompt
        appName="Xelarvis CMS"
        description="Install the CMS as a desktop/mobile app for quick content edits and a focused workspace."
        storageKey="xe-pwa-admin"
        tone="admin"
      />
    </>
  )
}

export default AdminPwa
