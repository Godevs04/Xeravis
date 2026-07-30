'use client'

import React from 'react'

import { AdminPwa } from '@/components/pwa/AdminPwa'
import { WorkspaceProvider } from '@/payload/admin/workspace/WorkspaceContext'

import { CommandPalette } from './CommandPalette'

const STORAGE_KEY = 'payload-theme'
const NAV_KEY = 'xe-nav-collapsed'

type ThemeMode = 'light' | 'dark'

function resolveAutoTheme(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyResolvedTheme(theme: ThemeMode) {
  const root = document.documentElement
  root.setAttribute('data-xe-ui', 'v5')
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
  window.localStorage.setItem(STORAGE_KEY, theme)
}

function readStoredTheme(): ThemeMode | null {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-xe-ui', 'v5')

    // V5 product default = light enterprise shell
    // One-time migrate off forced-dark from prior admin skins
    const migratedV5 = window.localStorage.getItem('xe-admin-v5-shell')
    if (migratedV5 !== '2') {
      applyResolvedTheme('light')
      window.localStorage.setItem('xe-admin-v5-shell', '2')
      window.localStorage.setItem('xe-theme-preference', 'light')
    } else {
      const existing = root.getAttribute('data-theme')
      if (existing === 'light' || existing === 'dark') {
        root.style.colorScheme = existing
        window.localStorage.setItem(STORAGE_KEY, existing)
      } else {
        applyResolvedTheme(readStoredTheme() ?? 'light')
      }
    }

    const collapsed = window.localStorage.getItem(NAV_KEY) === '1'
    root.setAttribute('data-xe-nav', collapsed ? 'collapsed' : 'expanded')

    const themeObserver = new MutationObserver(() => {
      if (root.getAttribute('data-xe-ui') !== 'v5') {
        root.setAttribute('data-xe-ui', 'v5')
      }
      const theme = root.getAttribute('data-theme')
      if (theme === 'light' || theme === 'dark') {
        root.style.colorScheme = theme
        window.localStorage.setItem(STORAGE_KEY, theme)
      }
    })
    themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-xe-ui'] })

    const onThemePreferenceChange = (event: Event) => {
      const target = event.target
      if (!(target instanceof HTMLInputElement) || target.type !== 'radio') return
      const id = (target.id || '').toLowerCase()
      const name = (target.name || '').toLowerCase()
      if (name !== 'theme' && !id.includes('theme')) return

      if (id.includes('light')) {
        window.localStorage.setItem('xe-theme-preference', 'light')
        applyResolvedTheme('light')
      } else if (id.includes('dark')) {
        window.localStorage.setItem('xe-theme-preference', 'dark')
        applyResolvedTheme('dark')
      } else if (id.includes('auto')) {
        window.localStorage.setItem('xe-theme-preference', 'auto')
        applyResolvedTheme(resolveAutoTheme())
      }
    }
    document.addEventListener('change', onThemePreferenceChange, true)

    const onThemePreferenceClick = (event: Event) => {
      const el = event.target
      if (!(el instanceof Element)) return
      const input =
        el instanceof HTMLInputElement && el.type === 'radio'
          ? el
          : el.closest('label')?.querySelector('input[type="radio"]')
      if (!(input instanceof HTMLInputElement)) return
      const id = (input.id || '').toLowerCase()
      if (!id.startsWith('field-theme-')) return
      window.setTimeout(() => {
        if (id.includes('light')) {
          window.localStorage.setItem('xe-theme-preference', 'light')
          applyResolvedTheme('light')
        } else if (id.includes('dark')) {
          window.localStorage.setItem('xe-theme-preference', 'dark')
          applyResolvedTheme('dark')
        } else if (id.includes('auto')) {
          window.localStorage.setItem('xe-theme-preference', 'auto')
          applyResolvedTheme(resolveAutoTheme())
        }
      }, 0)
    }
    document.addEventListener('click', onThemePreferenceClick, true)

    const onSystemTheme = (e: MediaQueryListEvent) => {
      if (window.localStorage.getItem('xe-theme-preference') === 'auto') {
        applyResolvedTheme(e.matches ? 'dark' : 'light')
      }
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', onSystemTheme)

    const onScroll = () => {
      if (window.scrollY > 8) root.classList.add('is-scrolled')
      else root.classList.remove('is-scrolled')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const onSave = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        const saveBtn =
          document.querySelector<HTMLButtonElement>('button[type="submit"].form-submit') ||
          document.querySelector<HTMLButtonElement>(
            '.doc-controls__controls .btn--style-primary',
          ) ||
          document.querySelector<HTMLButtonElement>('button.form-submit')
        if (saveBtn && !saveBtn.disabled) {
          e.preventDefault()
          saveBtn.click()
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        const path = window.location.pathname
        const match = path.match(/\/admin\/collections\/([^/]+)/)
        if (match?.[1] && !path.endsWith('/create')) {
          e.preventDefault()
          window.location.href = `/admin/collections/${match[1]}/create`
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        const next = root.getAttribute('data-xe-nav') === 'collapsed' ? 'expanded' : 'collapsed'
        root.setAttribute('data-xe-nav', next)
        window.localStorage.setItem(NAV_KEY, next === 'collapsed' ? '1' : '0')
      }
    }

    const storedDensity = window.localStorage.getItem('xe-list-density')
    if (storedDensity === 'compact' || storedDensity === 'comfortable') {
      root.setAttribute('data-xe-list', storedDensity)
    } else {
      root.setAttribute('data-xe-list', 'comfortable')
    }

    window.addEventListener('keydown', onSave)
    return () => {
      themeObserver.disconnect()
      document.removeEventListener('change', onThemePreferenceChange, true)
      document.removeEventListener('click', onThemePreferenceClick, true)
      mq.removeEventListener('change', onSystemTheme)
      window.removeEventListener('keydown', onSave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <WorkspaceProvider>
      {children}
      <CommandPalette />
      <AdminPwa />
    </WorkspaceProvider>
  )
}

export default AdminProvider
