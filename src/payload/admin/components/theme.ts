export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'payload-theme'
/** Payload's ThemeProvider reads this cookie on the server and on mount; without it Payload falls back to the OS theme. */
const COOKIE_KEY = 'payload-theme'

export function persistTheme(theme: ThemeMode): void {
  const root = document.documentElement
  root.setAttribute('data-xe-ui', 'v5')
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
  window.localStorage.setItem(STORAGE_KEY, theme)
  document.cookie = `${COOKIE_KEY}=${theme};path=/;max-age=31536000;samesite=lax`
}
