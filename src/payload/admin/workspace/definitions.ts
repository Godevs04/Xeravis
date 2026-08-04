export type WorkspaceId =
  'website' | 'content' | 'marketing' | 'sales' | 'recruitment' | 'analytics' | 'administration'

export type NavLink = {
  label: string
  href: string
  hint?: string
}

export type WorkspaceDef = {
  id: WorkspaceId
  label: string
  description: string
  /** Collection / global path segments used for focus filtering */
  paths: string[]
  /** Primary sidebar links — always Payload collections/globals (default admin shell) */
  links: NavLink[]
  /** Quick create targets */
  creates: { label: string; href: string }[]
}

const col = (slug: string) => `/admin/collections/${slug}`
const glob = (slug: string) => `/admin/globals/${slug}`

/**
 * Admin areas aligned to Mainplan + ops.
 * Navigation goes through default Payload collection/global URLs — not /workspace/*.
 * Custom hub views remain registered for Command Center deep-links only.
 */
export const WORKSPACES: WorkspaceDef[] = [
  {
    id: 'website',
    label: 'Website',
    description: 'Pages, services, solutions, SEO',
    paths: [
      'pages',
      'services',
      'solutions',
      'industries',
      'technologies',
      'case-studies',
      'media',
      'navigation',
      'footer',
      'seo-defaults',
      'site-settings',
      'announcement-bar',
      'cookie-banner',
      'contact-details',
      'office-locations',
    ],
    links: [
      { label: 'Pages', href: col('pages'), hint: 'Site pages' },
      { label: 'Services', href: col('services'), hint: 'Service catalog' },
      { label: 'Solutions', href: col('solutions'), hint: 'Solution catalog' },
      { label: 'Industries', href: col('industries'), hint: 'Sector pages' },
      { label: 'Navigation', href: glob('navigation'), hint: 'Primary menu' },
      { label: 'SEO defaults', href: glob('seo-defaults'), hint: 'Meta defaults' },
      { label: 'Media', href: col('media'), hint: 'Assets' },
      { label: 'Site settings', href: glob('site-settings'), hint: 'Brand & contact' },
    ],
    creates: [
      { label: 'Page', href: `${col('pages')}/create` },
      { label: 'Service', href: `${col('services')}/create` },
    ],
  },
  {
    id: 'content',
    label: 'Insights & Research',
    description: 'Blogs, research, case studies',
    paths: [
      'blogs',
      'research',
      'case-studies',
      'faqs',
      'testimonials',
      'clients',
      'team-members',
      'authors',
      'categories',
      'tags',
      'media',
      'downloads',
    ],
    links: [
      { label: 'Blogs', href: col('blogs'), hint: 'Articles' },
      { label: 'Research', href: col('research'), hint: 'Papers & notes' },
      { label: 'Case studies', href: col('case-studies'), hint: 'Outcomes' },
      { label: 'Downloads', href: col('downloads'), hint: 'Resources' },
      { label: 'FAQs', href: col('faqs') },
      { label: 'Team', href: col('team-members') },
    ],
    creates: [
      { label: 'Blog', href: `${col('blogs')}/create` },
      { label: 'Research', href: `${col('research')}/create` },
    ],
  },
  {
    id: 'marketing',
    label: 'Newsletter',
    description: 'Subscribers, campaigns, downloads',
    paths: ['newsletter-subscribers', 'newsletter-campaigns', 'downloads', 'social-media', 'blogs'],
    links: [
      { label: 'Subscribers', href: col('newsletter-subscribers'), hint: 'Audience' },
      { label: 'Campaigns', href: col('newsletter-campaigns'), hint: 'Sends' },
      { label: 'Downloads', href: col('downloads'), hint: 'Lead magnets' },
      { label: 'Social', href: col('social-media') },
    ],
    creates: [{ label: 'Campaign', href: `${col('newsletter-campaigns')}/create` }],
  },
  {
    id: 'sales',
    label: 'Sales CRM',
    description: 'Leads and inquiries',
    paths: ['contact-messages', 'form-submissions'],
    links: [
      { label: 'Contact messages', href: col('contact-messages'), hint: 'Inbox' },
      { label: 'Form submissions', href: col('form-submissions'), hint: 'Forms' },
    ],
    creates: [],
  },
  {
    id: 'recruitment',
    label: 'Recruitment',
    description: 'Jobs, candidates, interviews',
    paths: ['careers', 'job-applications', 'interviews', 'departments'],
    links: [
      { label: 'Jobs', href: col('careers'), hint: 'Open roles' },
      { label: 'Candidates', href: col('job-applications'), hint: 'Applications' },
      { label: 'Interviews', href: col('interviews'), hint: 'Schedule' },
      { label: 'Departments', href: col('departments') },
    ],
    creates: [
      { label: 'Job', href: `${col('careers')}/create` },
      { label: 'Interview', href: `${col('interviews')}/create` },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Traffic, conversions, activity',
    paths: [
      'analytics-events',
      'analytics',
      'activity-logs',
      'downloads',
      'newsletter-subscribers',
    ],
    links: [
      { label: 'Events', href: col('analytics-events'), hint: 'Tracking' },
      { label: 'Activity logs', href: col('activity-logs'), hint: 'Audit trail' },
      { label: 'Analytics settings', href: glob('analytics') },
    ],
    creates: [],
  },
  {
    id: 'administration',
    label: 'Administration',
    description: 'Users, settings, system',
    paths: [
      'users',
      'media',
      'notifications',
      'activity-logs',
      'site-settings',
      'analytics',
      'contact-details',
      'office-locations',
      'cookie-banner',
      'navigation',
      'footer',
    ],
    links: [
      { label: 'Users', href: col('users'), hint: 'Access' },
      { label: 'Notifications', href: col('notifications') },
      { label: 'Site settings', href: glob('site-settings') },
      { label: 'Contact details', href: glob('contact-details') },
      { label: 'Cookie banner', href: glob('cookie-banner') },
    ],
    creates: [{ label: 'User', href: `${col('users')}/create` }],
  },
]

export const DEFAULT_WORKSPACE: WorkspaceId = 'website'

export const WORKSPACE_STORAGE_KEY = 'xe-workspace-v5'

export function getWorkspace(id: WorkspaceId): WorkspaceDef {
  return WORKSPACES.find((w) => w.id === id) || WORKSPACES[0]
}

/** Infer focus area from any admin path (collections, globals, legacy hubs) */
export function workspaceIdFromPath(pathname: string): WorkspaceId | null {
  if (pathname.startsWith('/admin/workspace/newsletter')) return 'marketing'
  if (pathname.startsWith('/admin/workspace/crm')) return 'sales'
  if (pathname.startsWith('/admin/workspace/recruitment')) return 'recruitment'
  if (pathname.startsWith('/admin/workspace/analytics')) return 'analytics'
  if (pathname.startsWith('/admin/workspace/activity')) return 'analytics'
  if (pathname.startsWith('/admin/workspace/seo')) return 'website'
  if (pathname.startsWith('/admin/workspace/media')) return 'website'
  if (pathname.startsWith('/admin/workspace/ai')) return 'content'

  const match = pathname.match(/\/admin\/(?:collections|globals)\/([^/?#]+)/)
  const slug = match?.[1]?.toLowerCase()
  if (!slug) {
    if (pathname === '/admin' || pathname === '/admin/') return null
    return null
  }

  for (const ws of WORKSPACES) {
    if (ws.paths.includes(slug)) return ws.id
  }
  return null
}
