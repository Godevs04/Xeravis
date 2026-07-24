export type CTALink = {
  label: string
  href: string
  style?: 'primary' | 'secondary' | 'ghost'
  openInNewTab?: boolean
}

export type NavItem = {
  label: string
  href: string
  mega?: 'none' | 'solutions' | 'services' | 'industries' | string | null
}

export type BreadcrumbItem = {
  label: string
  href?: string
}

export type MediaRef = {
  id?: string | number
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  filename?: string | null
}

export type AsyncState = 'idle' | 'loading' | 'success' | 'error'
