'use client'

import React from 'react'

import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt'
import { PwaRegister } from '@/components/pwa/PwaRegister'

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
    ensureMeta('theme-color', '#6d5ef9')
    ensureMeta('mobile-web-app-capable', 'yes')
    ensureMeta('apple-mobile-web-app-capable', 'yes')
    ensureMeta('apple-mobile-web-app-status-bar-style', 'black-translucent')
    ensureMeta('apple-mobile-web-app-title', 'XV CMS')
  }, [])

  return (
    <>
      <PwaRegister scriptUrl="/admin/sw.js" scope="/admin/" />
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
