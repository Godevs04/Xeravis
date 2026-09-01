/** Main content scroller — preserve position within the same nav section. */
export const MAIN_SCROLL_SEL = '.template-default__wrap'
export const MAIN_SCROLL_KEY = 'xe-main-scroll'
export const LIST_SCROLL_PREFIX = 'xe-list-scroll:'

export function getMainScroll(): HTMLElement | null {
  return document.querySelector<HTMLElement>(MAIN_SCROLL_SEL)
}

export function readMainScroll(): number {
  try {
    return Number(sessionStorage.getItem(MAIN_SCROLL_KEY) || '0')
  } catch {
    return 0
  }
}

export function saveMainScroll(from?: HTMLElement | null): void {
  const el = from ?? getMainScroll()
  if (!el) return
  try {
    sessionStorage.setItem(MAIN_SCROLL_KEY, String(el.scrollTop))
  } catch {
    /* ignore */
  }
}

export function restoreMainScroll(): void {
  const el = getMainScroll()
  if (!el) return
  el.scrollTop = readMainScroll()
}

export function clearMainScroll(): void {
  try {
    sessionStorage.setItem(MAIN_SCROLL_KEY, '0')
  } catch {
    /* ignore */
  }
}

export function getCollectionListKey(pathname: string): string | null {
  const match = pathname.match(/^\/admin\/collections\/([^/]+)\/?$/)
  if (!match) return null
  return `${LIST_SCROLL_PREFIX}collections/${match[1]}`
}

/** Collection document, global editor, or create flow — always open at top. */
export function isDocumentRoute(pathname: string): boolean {
  if (pathname.endsWith('/create')) return true
  if (/^\/admin\/collections\/[^/]+\/.+/.test(pathname)) return true
  if (/^\/admin\/globals\//.test(pathname)) return true
  return false
}

export function saveCollectionListScroll(pathname: string, from?: HTMLElement | null): void {
  const key = getCollectionListKey(pathname)
  if (!key) return
  const el = from ?? getMainScroll()
  if (!el) return
  try {
    sessionStorage.setItem(key, String(el.scrollTop))
  } catch {
    /* ignore */
  }
}

export function restoreCollectionListScroll(pathname: string): void {
  const key = getCollectionListKey(pathname)
  if (!key) return
  const el = getMainScroll()
  if (!el) return
  try {
    el.scrollTop = Number(sessionStorage.getItem(key) || '0')
  } catch {
    /* ignore */
  }
}

export function resetMainScrollTop(): void {
  const el = getMainScroll()
  if (el) el.scrollTop = 0
  clearMainScroll()
}

export function bindMainScrollPersistence(wrap: HTMLElement): () => void {
  const onScroll = () => {
    saveMainScroll(wrap)
    const listKey = getCollectionListKey(window.location.pathname)
    if (listKey) {
      try {
        sessionStorage.setItem(listKey, String(wrap.scrollTop))
      } catch {
        /* ignore */
      }
    }
  }
  wrap.addEventListener('scroll', onScroll, { passive: true })
  return () => wrap.removeEventListener('scroll', onScroll)
}
