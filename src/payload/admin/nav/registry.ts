import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Briefcase,
  Building2,
  FileText,
  FolderOpen,
  Image,
  LayoutDashboard,
  Layers,
  Mail,
  Newspaper,
  Settings2,
  Sparkles,
  Users,
} from 'lucide-react'

/** Single navigation registry for Enterprise Admin */

export type NavItem = {
  id: string
  label: string
  href: string
  description?: string
  icon?: LucideIcon
}

export type NavGroup = {
  id: string
  label: string
  description: string
  icon: LucideIcon
  /** Direct href when the group itself is a destination (e.g. Command Center) */
  href?: string
  items: NavItem[]
}

export type QuickCreate = {
  id: string
  label: string
  href: string
  icon: LucideIcon
}

export type BreadcrumbCrumb = {
  label: string
  href?: string
}

const col = (slug: string) => `/admin/collections/${slug}`
const glob = (slug: string) => `/admin/globals/${slug}`

/**
 * Canonical admin navigation — real Payload collection/global slugs only.
 * Desktop sidebar, mobile drawer, command palette, quick create, breadcrumbs
 * all derive from this list.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Executive dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    items: [],
  },
  {
    id: 'website',
    label: 'Website',
    description: 'Pages, services, SEO',
    icon: Building2,
    items: [
      { id: 'pages', label: 'Pages', href: col('pages'), description: 'Site pages' },
      { id: 'services', label: 'Services', href: col('services'), description: 'Service catalog' },
      {
        id: 'solutions',
        label: 'Solutions',
        href: col('solutions'),
        description: 'Solution catalog',
      },
      {
        id: 'industries',
        label: 'Industries',
        href: col('industries'),
        description: 'Sector pages',
      },
      { id: 'technologies', label: 'Technologies', href: col('technologies') },
      {
        id: 'navigation',
        label: 'Navigation',
        href: glob('navigation'),
        description: 'Primary menu',
      },
      { id: 'footer', label: 'Footer', href: glob('footer') },
      { id: 'seo-defaults', label: 'SEO Defaults', href: glob('seo-defaults') },
      { id: 'site-settings', label: 'Site Settings', href: glob('site-settings') },
      { id: 'announcement-bar', label: 'Announcement Bar', href: glob('announcement-bar') },
      { id: 'cookie-banner', label: 'Cookie Banner', href: glob('cookie-banner') },
      { id: 'contact-details', label: 'Contact Details', href: glob('contact-details') },
      { id: 'office-locations', label: 'Office Locations', href: glob('office-locations') },
    ],
  },
  {
    id: 'content',
    label: 'Insights',
    description: 'Blogs, research, case studies',
    icon: Newspaper,
    items: [
      { id: 'blogs', label: 'Blogs', href: col('blogs'), description: 'Articles' },
      { id: 'research', label: 'Research', href: col('research'), description: 'Papers & notes' },
      {
        id: 'case-studies',
        label: 'Case Studies',
        href: col('case-studies'),
        description: 'Outcomes',
      },
      { id: 'downloads', label: 'Downloads', href: col('downloads'), description: 'Resources' },
      { id: 'faqs', label: 'FAQs', href: col('faqs') },
      { id: 'testimonials', label: 'Testimonials', href: col('testimonials') },
      { id: 'clients', label: 'Clients', href: col('clients') },
      { id: 'team-members', label: 'Team', href: col('team-members') },
      { id: 'authors', label: 'Authors', href: col('authors') },
      { id: 'categories', label: 'Categories', href: col('categories') },
      { id: 'tags', label: 'Tags', href: col('tags') },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Subscribers, campaigns, social',
    icon: Mail,
    items: [
      {
        id: 'newsletter-subscribers',
        label: 'Subscribers',
        href: col('newsletter-subscribers'),
        description: 'Audience',
      },
      {
        id: 'newsletter-campaigns',
        label: 'Campaigns',
        href: col('newsletter-campaigns'),
        description: 'Sends',
      },
      /** social-media is a GLOBAL — never a collection */
      { id: 'social-media', label: 'Social', href: glob('social-media') },
    ],
  },
  {
    id: 'sales',
    label: 'Sales CRM',
    description: 'Leads and inquiries',
    icon: Users,
    items: [
      {
        id: 'contact-messages',
        label: 'Contact Messages',
        href: col('contact-messages'),
        description: 'Inbox',
      },
      {
        id: 'form-submissions',
        label: 'Form Submissions',
        href: col('form-submissions'),
        description: 'Forms',
      },
    ],
  },
  {
    id: 'recruitment',
    label: 'Recruitment',
    description: 'Jobs, candidates, interviews',
    icon: Briefcase,
    items: [
      { id: 'careers', label: 'Jobs', href: col('careers'), description: 'Open roles' },
      {
        id: 'job-applications',
        label: 'Candidates',
        href: col('job-applications'),
        description: 'Applications',
      },
      { id: 'interviews', label: 'Interviews', href: col('interviews'), description: 'Schedule' },
      { id: 'departments', label: 'Departments', href: col('departments') },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    description: 'Assets and library',
    icon: Image,
    items: [{ id: 'media-lib', label: 'Library', href: col('media'), description: 'All assets' }],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Traffic, conversions, activity',
    icon: BarChart3,
    items: [
      {
        id: 'analytics-events',
        label: 'Events',
        href: col('analytics-events'),
        description: 'Tracking',
      },
      {
        id: 'activity-logs',
        label: 'Activity Logs',
        href: col('activity-logs'),
        description: 'Audit trail',
      },
      { id: 'analytics-settings', label: 'Analytics Settings', href: glob('analytics') },
    ],
  },
  {
    id: 'ai',
    label: 'AI Assistant',
    description: 'Research & AI workspace',
    icon: Sparkles,
    items: [
      {
        id: 'ai-workspace',
        label: 'AI Workspace',
        href: '/admin/workspace/ai',
        description: 'Assist hub',
      },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    description: 'Users, settings, system',
    icon: Settings2,
    items: [
      { id: 'users', label: 'Users', href: col('users'), description: 'Access' },
      { id: 'notifications', label: 'Notifications', href: col('notifications') },
    ],
  },
]

export const QUICK_CREATES: QuickCreate[] = [
  { id: 'page', label: 'Page', href: `${col('pages')}/create`, icon: FileText },
  { id: 'blog', label: 'Blog', href: `${col('blogs')}/create`, icon: Newspaper },
  { id: 'job', label: 'Job', href: `${col('careers')}/create`, icon: Briefcase },
  { id: 'service', label: 'Service', href: `${col('services')}/create`, icon: FolderOpen },
  { id: 'case-study', label: 'Case Study', href: `${col('case-studies')}/create`, icon: Layers },
  { id: 'media', label: 'Media', href: `${col('media')}/create`, icon: Image },
  { id: 'interview', label: 'Interview', href: `${col('interviews')}/create`, icon: Users },
]

export function getNavGroups(): NavGroup[] {
  return NAV_GROUPS
}

export function getQuickCreates(): QuickCreate[] {
  return QUICK_CREATES
}

export function isLinkActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin' || pathname === '/admin/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function groupHasActiveLink(pathname: string, group: NavGroup): boolean {
  if (group.href && isLinkActive(pathname, group.href)) return true
  return group.items.some((item) => isLinkActive(pathname, item.href))
}

export function findActiveGroup(pathname: string): NavGroup | null {
  return NAV_GROUPS.find((g) => groupHasActiveLink(pathname, g)) ?? null
}

/**
 * Prefer the longest matching href so deep routes
 * (/collections/blogs/:id/versions) stay on the collection item,
 * not a shorter accidental sibling match.
 */
export function findActiveItem(pathname: string): { group: NavGroup; item: NavItem } | null {
  let best: { group: NavGroup; item: NavItem; score: number } | null = null

  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (!isLinkActive(pathname, item.href)) continue
      const score = item.href.length
      if (!best || score > best.score) best = { group, item, score }
    }
    if (group.href && isLinkActive(pathname, group.href)) {
      const score = group.href.length
      const item: NavItem = { id: group.id, label: group.label, href: group.href }
      if (!best || score > best.score) best = { group, item, score }
    }
  }

  return best ? { group: best.group, item: best.item } : null
}

export type NavigationResolution = {
  section: string | null
  item: string | null
  ancestors: string[]
  breadcrumbs: BreadcrumbCrumb[]
  group: NavGroup | null
  navItem: NavItem | null
}

/**
 * Single route → navigation resolver.
 * Pathname is the source of truth for section, active item, ancestors, breadcrumbs.
 * Matches collection list + create + document + api + versions + any deeper segments.
 */
export function resolveNavigation(
  pathname: string,
  options?: { documentLabel?: string | null },
): NavigationResolution {
  const active = findActiveItem(pathname)
  const breadcrumbs = getBreadcrumbTrail(pathname, options)

  if (!active) {
    return {
      section: null,
      item: null,
      ancestors: [],
      breadcrumbs,
      group: null,
      navItem: null,
    }
  }

  const ancestors = active.group.id === 'overview' ? [] : [active.group.id]

  return {
    section: active.group.id,
    item: active.item.id,
    ancestors,
    breadcrumbs,
    group: active.group,
    navItem: active.item,
  }
}

/** Flat list for command palette */
export function getCommandItems(): Array<{
  id: string
  label: string
  href: string
  section: string
  description?: string
  icon?: LucideIcon
}> {
  const items: Array<{
    id: string
    label: string
    href: string
    section: string
    description?: string
    icon?: LucideIcon
  }> = []

  for (const group of NAV_GROUPS) {
    if (group.href) {
      items.push({
        id: group.id,
        label: group.label,
        href: group.href,
        section: 'Overview',
        description: group.description,
        icon: group.icon,
      })
    }
    for (const item of group.items) {
      items.push({
        id: `${group.id}:${item.id}`,
        label: item.label,
        href: item.href,
        section: group.label,
        description: item.description,
        icon: group.icon,
      })
    }
  }

  for (const create of QUICK_CREATES) {
    items.push({
      id: `create:${create.id}`,
      label: `Create ${create.label}`,
      href: create.href,
      section: 'Create',
      icon: create.icon,
    })
  }

  return items
}

/**
 * Breadcrumb trail from pathname.
 * Uses human labels from the registry. Document IDs are never shown raw —
 * use optional documentLabel, else "Edit" / view segment labels.
 */
export function getBreadcrumbTrail(
  pathname: string,
  options?: { documentLabel?: string | null },
): BreadcrumbCrumb[] {
  const crumbs: BreadcrumbCrumb[] = [{ label: 'Xelarvis', href: '/admin' }]
  const active = findActiveItem(pathname)

  if (!active) {
    if (pathname.startsWith('/admin/account')) {
      crumbs.push({ label: 'Account' })
      return crumbs
    }
    if (pathname.startsWith('/admin/workspace/')) {
      const hub = pathname.split('/')[3]
      crumbs.push({ label: hub ? titleCase(hub) : 'Workspace' })
      return crumbs
    }
    return crumbs
  }

  if (active.group.id !== 'overview') {
    crumbs.push({
      label: active.group.label,
      href: active.group.items[0]?.href ?? active.group.href,
    })
  }

  if (active.item.href !== '/admin') {
    crumbs.push({ label: active.item.label, href: active.item.href })
  }

  const collectionDeep = pathname.match(/^\/admin\/collections\/[^/]+\/(.+)$/)
  if (collectionDeep?.[1]) {
    const parts = collectionDeep[1].split('/').filter(Boolean)
    const head = parts[0]

    if (head === 'create') {
      crumbs.push({ label: 'Create' })
      return crumbs
    }

    // Document id — never display raw ObjectIds
    const docLabel = options?.documentLabel?.trim() || 'Edit'
    crumbs.push({ label: docLabel })

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i]
      if (part === 'api') crumbs.push({ label: 'API' })
      else if (part === 'versions') crumbs.push({ label: 'Versions' })
      else crumbs.push({ label: titleCase(part) })
    }
    return crumbs
  }

  if (pathname.endsWith('/create')) {
    crumbs.push({ label: 'Create' })
  }

  const globalDeep = pathname.match(/^\/admin\/globals\/[^/]+\/([^/]+)$/)
  if (globalDeep?.[1]) {
    crumbs.push({ label: titleCase(globalDeep[1]) })
  }

  return crumbs
}

function titleCase(value: string) {
  return value
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

/** Workspace path → group id (for WorkspaceContext compatibility) */
export function workspaceIdFromPath(pathname: string): string | null {
  if (pathname.startsWith('/admin/workspace/newsletter')) return 'marketing'
  if (pathname.startsWith('/admin/workspace/crm')) return 'sales'
  if (pathname.startsWith('/admin/workspace/recruitment')) return 'recruitment'
  if (pathname.startsWith('/admin/workspace/analytics')) return 'analytics'
  if (pathname.startsWith('/admin/workspace/activity')) return 'analytics'
  if (pathname.startsWith('/admin/workspace/seo')) return 'website'
  if (pathname.startsWith('/admin/workspace/media')) return 'media'
  if (pathname.startsWith('/admin/workspace/ai')) return 'ai'

  const active = findActiveGroup(pathname)
  if (!active || active.id === 'overview') return null
  return active.id
}
