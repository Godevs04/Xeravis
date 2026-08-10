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

import { WORKSPACES, type NavLink, type WorkspaceId } from '@/payload/admin/workspace/definitions'

export type NavModuleId = WorkspaceId | 'overview' | 'media' | 'ai'

export type NavModule = {
  id: NavModuleId
  label: string
  description: string
  icon: LucideIcon
  /** Direct link when module has no children (e.g. Command Center) */
  href?: string
  links: NavLink[]
  creates: { label: string; href: string }[]
}

const byId = (id: WorkspaceId) => WORKSPACES.find((w) => w.id === id)!

/**
 * Enterprise modules — same Payload collection/global hrefs as before.
 * Media + AI called out as first-class modules per OS redesign brief.
 */
export const NAV_MODULES: NavModule[] = [
  {
    id: 'overview',
    label: 'Command Center',
    description: 'Executive dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    links: [],
    creates: [],
  },
  {
    id: 'website',
    label: 'Website',
    description: byId('website').description,
    icon: Building2,
    links: [
      ...byId('website').links.filter((l) => !l.href.includes('/media')),
      { label: 'Footer', href: '/admin/globals/footer', hint: 'Site footer' },
    ],
    creates: byId('website').creates,
  },
  {
    id: 'content',
    label: 'Insights',
    description: byId('content').description,
    icon: Newspaper,
    links: byId('content').links,
    creates: byId('content').creates,
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: byId('marketing').description,
    icon: Mail,
    links: byId('marketing').links,
    creates: byId('marketing').creates,
  },
  {
    id: 'sales',
    label: 'Sales CRM',
    description: byId('sales').description,
    icon: Users,
    links: byId('sales').links,
    creates: byId('sales').creates,
  },
  {
    id: 'recruitment',
    label: 'Recruitment',
    description: byId('recruitment').description,
    icon: Briefcase,
    links: byId('recruitment').links,
    creates: byId('recruitment').creates,
  },
  {
    id: 'media',
    label: 'Media',
    description: 'Assets and library',
    icon: Image,
    links: [
      { label: 'Library', href: '/admin/collections/media', hint: 'All assets' },
      { label: 'Downloads', href: '/admin/collections/downloads', hint: 'Lead magnets' },
    ],
    creates: [{ label: 'Upload media', href: '/admin/collections/media/create' }],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: byId('analytics').description,
    icon: BarChart3,
    links: byId('analytics').links,
    creates: byId('analytics').creates,
  },
  {
    id: 'ai',
    label: 'AI Assistant',
    description: 'Research & AI workspace',
    icon: Sparkles,
    links: [
      { label: 'AI workspace', href: '/admin/workspace/ai', hint: 'Assist hub' },
      { label: 'Research', href: '/admin/collections/research', hint: 'Papers' },
      { label: 'Blogs', href: '/admin/collections/blogs', hint: 'Content' },
    ],
    creates: [
      { label: 'Research', href: '/admin/collections/research/create' },
      { label: 'Blog', href: '/admin/collections/blogs/create' },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    description: byId('administration').description,
    icon: Settings2,
    links: byId('administration').links,
    creates: byId('administration').creates,
  },
]

export const QUICK_CREATES = [
  { label: 'Page', href: '/admin/collections/pages/create', icon: FileText },
  { label: 'Blog', href: '/admin/collections/blogs/create', icon: Newspaper },
  { label: 'Job', href: '/admin/collections/careers/create', icon: Briefcase },
  { label: 'Service', href: '/admin/collections/services/create', icon: FolderOpen },
  { label: 'Case Study', href: '/admin/collections/case-studies/create', icon: Layers },
  { label: 'Media', href: '/admin/collections/media/create', icon: Image },
  { label: 'Interview', href: '/admin/collections/interviews/create', icon: Users },
] as const

export function isLinkActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin' || pathname === '/admin/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function moduleHasActiveLink(pathname: string, mod: NavModule) {
  if (mod.href && isLinkActive(pathname, mod.href)) return true
  return mod.links.some((l) => isLinkActive(pathname, l.href))
}
