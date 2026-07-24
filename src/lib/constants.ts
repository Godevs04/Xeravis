export const SITE = {
  defaultLocale: 'en',
  revalidateSeconds: 60,
  contactPath: '/contact',
  projectIntentQuery: 'intent=project',
} as const

export const ROUTES = {
  home: '/',
  about: '/about',
  services: '/services',
  industries: '/industries',
  solutions: '/solutions',
  insights: '/insights',
  blog: '/blog',
  caseStudies: '/case-studies',
  careers: '/careers',
  contact: '/contact',
  search: '/search',
  privacy: '/privacy-policy',
  terms: '/terms',
  admin: '/admin',
} as const

export const FORM_HONEYPOT = 'website'

export const MEDIA_FOLDERS = [
  'general',
  'hero',
  'blogs',
  'services',
  'industries',
  'team',
  'clients',
  'logos',
  'icons',
  'documents',
  'og',
] as const
