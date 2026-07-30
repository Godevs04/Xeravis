export type WorkspaceId =
  'website' | 'recruitment' | 'sales' | 'marketing' | 'content' | 'analytics' | 'administration'

export type WorkspaceDef = {
  id: WorkspaceId
  label: string
  description: string
  /** Collection / global path segments to show in Payload nav */
  paths: string[]
  /** Custom ops views for this workspace */
  modules: { label: string; href: string; hint?: string }[]
  /** Quick create targets */
  creates: { label: string; href: string }[]
}

/**
 * Real workspaces = filtered CMS views.
 * Collections are never removed — only hidden in the sidebar for focus.
 */
export const WORKSPACES: WorkspaceDef[] = [
  {
    id: 'website',
    label: 'Website',
    description: 'Pages, services, navigation, SEO',
    paths: [
      'pages',
      'services',
      'solutions',
      'industries',
      'case-studies',
      'technologies',
      'media',
      'navigation',
      'footer',
      'seo-defaults',
      'site-settings',
      'announcement-bar',
      'cookie-banner',
    ],
    modules: [
      { label: 'SEO Center', href: '/admin/workspace/seo', hint: 'Coverage & defaults' },
      { label: 'Media Studio', href: '/admin/workspace/media', hint: 'Assets' },
    ],
    creates: [
      { label: 'Page', href: '/admin/collections/pages/create' },
      { label: 'Service', href: '/admin/collections/services/create' },
    ],
  },
  {
    id: 'recruitment',
    label: 'Recruitment',
    description: 'Jobs, candidates, interviews',
    paths: ['careers', 'job-applications', 'interviews', 'departments'],
    modules: [
      { label: 'HR Dashboard', href: '/admin/workspace/recruitment', hint: 'Hiring funnel' },
    ],
    creates: [
      { label: 'Job', href: '/admin/collections/careers/create' },
      { label: 'Interview', href: '/admin/collections/interviews/create' },
    ],
  },
  {
    id: 'sales',
    label: 'Sales CRM',
    description: 'Leads and inquiry pipeline',
    paths: ['contact-messages', 'form-submissions'],
    modules: [{ label: 'CRM Pipeline', href: '/admin/workspace/crm', hint: 'Leads' }],
    creates: [],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Newsletter, downloads, campaigns',
    paths: [
      'newsletter-subscribers',
      'newsletter-campaigns',
      'downloads',
      'contact-messages',
      'blogs',
      'social-media',
    ],
    modules: [
      { label: 'Newsletter', href: '/admin/workspace/newsletter', hint: 'Audience' },
      { label: 'CRM', href: '/admin/workspace/crm', hint: 'Leads' },
    ],
    creates: [
      { label: 'Campaign', href: '/admin/collections/newsletter-campaigns/create' },
      { label: 'Download', href: '/admin/collections/downloads/create' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    description: 'Blogs, research, brand content',
    paths: [
      'blogs',
      'research',
      'faqs',
      'testimonials',
      'clients',
      'team-members',
      'authors',
      'categories',
      'tags',
      'media',
    ],
    modules: [
      { label: 'AI Assistant', href: '/admin/workspace/ai', hint: 'Draft copy' },
      { label: 'Media Studio', href: '/admin/workspace/media', hint: 'Assets' },
    ],
    creates: [
      { label: 'Blog', href: '/admin/collections/blogs/create' },
      { label: 'Research', href: '/admin/collections/research/create' },
      { label: 'Whitepaper intent', href: '/admin/collections/blogs/create' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Traffic, conversions, activity',
    paths: [
      'analytics-events',
      'downloads',
      'newsletter-subscribers',
      'activity-logs',
      'analytics',
    ],
    modules: [
      { label: 'Analytics Hub', href: '/admin/workspace/analytics', hint: 'KPIs' },
      { label: 'Activity', href: '/admin/workspace/activity', hint: 'Timeline' },
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
    ],
    modules: [{ label: 'Activity', href: '/admin/workspace/activity', hint: 'Audit' }],
    creates: [{ label: 'User', href: '/admin/collections/users/create' }],
  },
]

export const DEFAULT_WORKSPACE: WorkspaceId = 'website'

export const WORKSPACE_STORAGE_KEY = 'xe-workspace-v3'

export function getWorkspace(id: WorkspaceId): WorkspaceDef {
  return WORKSPACES.find((w) => w.id === id) || WORKSPACES[0]
}
