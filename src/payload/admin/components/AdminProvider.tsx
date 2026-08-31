'use client'

import React from 'react'

import { AdminPwa } from '@/components/pwa/AdminPwa'
import { WorkspaceProvider } from '@/payload/admin/workspace/WorkspaceContext'

import { ApiViewPolish } from './api/ApiViewPolish'
import { CommandPalette } from './CommandPalette'
import { HeaderChip } from './HeaderChip'
import { MainScrollController } from './layout/MainScrollController'
import { SidebarScrollController } from './layout/SidebarScrollController'
import { NavAudit } from './nav/NavAudit'

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

function bootAdminShell() {
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
    const pref = window.localStorage.getItem('xe-theme-preference')
    if (pref === 'auto') {
      applyResolvedTheme(resolveAutoTheme())
    } else if (pref === 'light' || pref === 'dark') {
      applyResolvedTheme(pref)
    } else {
      const existing = root.getAttribute('data-theme')
      if (existing === 'light' || existing === 'dark') {
        root.style.colorScheme = existing
        window.localStorage.setItem(STORAGE_KEY, existing)
      } else {
        applyResolvedTheme(readStoredTheme() ?? 'light')
      }
    }
  }

  const collapsed = window.localStorage.getItem(NAV_KEY) === '1'
  // One-time: expand sidebar after workspace-switcher removal so pages aren't stuck on icon-rail
  if (window.localStorage.getItem('xe-admin-nav-expand-v4') !== '1') {
    root.setAttribute('data-xe-nav', 'expanded')
    window.localStorage.setItem(NAV_KEY, '0')
    window.localStorage.setItem('xe-admin-nav-expand-v4', '1')
  } else {
    root.setAttribute('data-xe-nav', collapsed ? 'collapsed' : 'expanded')
  }
}

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  // Layout effect: apply theme/nav before paint when possible (no next/script → no hydration clash)
  React.useLayoutEffect(() => {
    bootAdminShell()
  }, [])

  React.useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-xe-ui', 'v5')

    // Payload sets `inert` when navOpen is false (common below large breakpoint).
    // Docked desktop sidebar must stay interactive — strip inert so it can scroll.
    const desktopMq = window.matchMedia('(min-width: 901px)')
    const syncNavInteractivity = () => {
      const aside = document.querySelector<HTMLElement>('aside.nav')
      if (!aside) return
      if (desktopMq.matches) {
        if (aside.hasAttribute('inert')) aside.removeAttribute('inert')
        root.setAttribute('data-xe-nav-shell', 'desktop')
        return
      }
      root.setAttribute('data-xe-nav-shell', 'mobile')
      if (aside.classList.contains('nav--nav-open')) {
        aside.removeAttribute('inert')
        root.setAttribute('data-xe-nav', 'open')
      }
    }
    syncNavInteractivity()
    const navObserver = new MutationObserver(() => {
      window.requestAnimationFrame(syncNavInteractivity)
    })
    const observeNav = () => {
      const aside = document.querySelector('aside.nav')
      if (aside) {
        navObserver.observe(aside, { attributes: true, attributeFilter: ['inert', 'class'] })
        return true
      }
      return false
    }
    if (!observeNav()) {
      const boot = new MutationObserver(() => {
        if (observeNav()) boot.disconnect()
      })
      boot.observe(document.body, { childList: true, subtree: true })
      window.setTimeout(() => boot.disconnect(), 8000)
    }
    desktopMq.addEventListener('change', syncNavInteractivity)

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

    /** Main shell scroller — never listen on window (document scroll is locked). */
    let mainScroll: HTMLElement | null = null
    let savedMainScroll = 0

    const onMainScroll = () => {
      const top = mainScroll?.scrollTop ?? 0
      if (top > 8) root.classList.add('is-scrolled')
      else root.classList.remove('is-scrolled')
    }

    const bindMainScroll = () => {
      const next = document.querySelector<HTMLElement>('.template-default__wrap')
      if (next === mainScroll) return
      if (mainScroll) mainScroll.removeEventListener('scroll', onMainScroll)
      mainScroll = next
      if (mainScroll) {
        mainScroll.addEventListener('scroll', onMainScroll, { passive: true })
        onMainScroll()
      }
    }
    bindMainScroll()
    const wrapObserver = new MutationObserver(() => bindMainScroll())
    wrapObserver.observe(document.body, { childList: true, subtree: true })

    /** Mobile drawer: lock main scroll and restore exactly on close. */
    const syncDrawerScrollLock = () => {
      const wrap = document.querySelector<HTMLElement>('.template-default__wrap')
      if (!wrap) return
      const open = root.getAttribute('data-xe-nav') === 'open'
      if (open) {
        if (!wrap.hasAttribute('data-xe-scroll-locked')) {
          savedMainScroll = wrap.scrollTop
          wrap.setAttribute('data-xe-scroll-locked', '1')
          wrap.style.overflowY = 'hidden'
        }
      } else if (wrap.hasAttribute('data-xe-scroll-locked')) {
        wrap.removeAttribute('data-xe-scroll-locked')
        wrap.style.overflowY = ''
        wrap.scrollTop = savedMainScroll
      }
    }
    const drawerObserver = new MutationObserver(syncDrawerScrollLock)
    drawerObserver.observe(root, { attributes: true, attributeFilter: ['data-xe-nav'] })
    syncDrawerScrollLock()

    /** Mobile scrim — close drawer when tapping the dimmed main area */
    const onScrimClick = (e: MouseEvent) => {
      if (root.getAttribute('data-xe-nav') !== 'open') return
      const wrap = document.querySelector('.template-default__wrap')
      if (!wrap || e.target !== wrap) return
      root.setAttribute('data-xe-nav', 'expanded')
      document.querySelector('aside.nav')?.classList.remove('nav--nav-open')
    }
    document.addEventListener('click', onScrimClick, true)

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
      navObserver.disconnect()
      wrapObserver.disconnect()
      drawerObserver.disconnect()
      desktopMq.removeEventListener('change', syncNavInteractivity)
      document.removeEventListener('change', onThemePreferenceChange, true)
      document.removeEventListener('click', onThemePreferenceClick, true)
      mq.removeEventListener('change', onSystemTheme)
      window.removeEventListener('keydown', onSave)
      document.removeEventListener('click', onScrimClick, true)
      if (mainScroll) mainScroll.removeEventListener('scroll', onMainScroll)
    }
  }, [])

  return (
    <WorkspaceProvider>
      {children}
      <MainScrollController />
      <SidebarScrollController />
      <HeaderChip />
      <CommandPalette />
      <ApiViewPolish />
      <AdminPwa />
      {process.env.NODE_ENV !== 'production' ? <NavAudit /> : null}
    </WorkspaceProvider>
  )
}

export default AdminProvider
