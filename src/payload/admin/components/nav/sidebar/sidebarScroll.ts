/** Sidebar body scroller — preserve position across client navigations. */
export const SIDEBAR_BODY_SEL = '.xe-sb__body'
export const SIDEBAR_SCROLL_KEY = 'xe-sb-body-scroll'

export function getSidebarBody(): HTMLElement | null {
  return document.querySelector<HTMLElement>(SIDEBAR_BODY_SEL)
}

export function readSidebarScroll(): number {
  try {
    return Number(sessionStorage.getItem(SIDEBAR_SCROLL_KEY) || '0')
  } catch {
    return 0
  }
}

export function saveSidebarScroll(from?: HTMLElement | null): void {
  const el = from ?? getSidebarBody()
  if (!el) return
  try {
    sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(el.scrollTop))
  } catch {
    /* ignore */
  }
}

export function restoreSidebarScroll(): void {
  const el = getSidebarBody()
  if (!el) return
  const saved = readSidebarScroll()
  if (saved > 0) el.scrollTop = saved
}

/** Scroll sidebar body only — never use scrollIntoView (can move document/main). */
export function revealActiveInSidebar(body: HTMLElement, active: HTMLElement): void {
  const bodyRect = body.getBoundingClientRect()
  const activeRect = active.getBoundingClientRect()
  if (activeRect.top >= bodyRect.top && activeRect.bottom <= bodyRect.bottom) return

  const offset = activeRect.top - bodyRect.top
  const centered = body.scrollTop + offset - body.clientHeight / 2 + activeRect.height / 2
  body.scrollTop = Math.max(0, centered)
}

export function bindSidebarScrollPersistence(body: HTMLElement): () => void {
  const onScroll = () => saveSidebarScroll(body)
  body.addEventListener('scroll', onScroll, { passive: true })
  return () => body.removeEventListener('scroll', onScroll)
}
