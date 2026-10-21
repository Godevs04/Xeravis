const NAV_KEY = 'xe-nav-collapsed'

/** Close the phone drawer through Payload's toggler so its NavProvider state stays in sync. */
export function closeMobileDrawer(): void {
  const root = document.documentElement
  if (root.getAttribute('data-xe-nav') !== 'open') return

  const aside = document.querySelector('aside.nav')
  if (aside?.classList.contains('nav--nav-open')) {
    document.querySelector<HTMLButtonElement>('.template-default__nav-toggler')?.click()
  }
  root.setAttribute(
    'data-xe-nav',
    window.localStorage.getItem(NAV_KEY) === '1' ? 'collapsed' : 'expanded',
  )
}
