import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { collections } from './payload/collections'
import { globals } from './payload/globals'
import { plugins } from './payload/plugins'
import { Users } from './payload/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    avatar: 'default',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Xelarvis Enterprise CMS',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/icons/admin-32.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          url: '/icons/admin-192.png',
        },
      ],
    },
    theme: 'all',
    components: {
      providers: ['./payload/admin/components/AdminProvider#AdminProvider'],
      graphics: {
        Logo: './payload/admin/components/graphics/Logo#Logo',
        Icon: './payload/admin/components/graphics/Icon#Icon',
      },
      beforeLogin: ['./payload/admin/components/BeforeLogin#BeforeLogin'],
      beforeNav: ['./payload/admin/components/nav/BeforeNav#BeforeNav'],
      beforeNavLinks: ['./payload/admin/components/nav/BeforeNavLinks#BeforeNavLinks'],
      afterNavLinks: ['./payload/admin/components/nav/AfterNavLinks#AfterNavLinks'],
      actions: [
        './payload/admin/components/QuickCreateAction#QuickCreateAction',
        './payload/admin/components/NotificationBell#NotificationBell',
        './payload/admin/components/CommandAction#CommandAction',
        './payload/admin/components/AdminThemeToggle#AdminThemeToggle',
      ],
      views: {
        dashboard: {
          Component: './payload/admin/components/dashboard/EnterpriseDashboard#EnterpriseDashboard',
          path: '/',
          meta: { title: 'Command Center' },
        },
        recruitment: {
          Component: './payload/admin/workspace/RecruitmentView#RecruitmentView',
          path: '/workspace/recruitment',
          meta: { title: 'Recruitment' },
        },
        crm: {
          Component: './payload/admin/workspace/CrmView#CrmView',
          path: '/workspace/crm',
          meta: { title: 'CRM Inbox' },
        },
        analyticsWorkspace: {
          Component: './payload/admin/workspace/AnalyticsView#AnalyticsView',
          path: '/workspace/analytics',
          meta: { title: 'Analytics' },
        },
        newsletterWorkspace: {
          Component: './payload/admin/workspace/NewsletterView#NewsletterView',
          path: '/workspace/newsletter',
          meta: { title: 'Newsletter' },
        },
        seoCenter: {
          Component: './payload/admin/workspace/SeoView#SeoView',
          path: '/workspace/seo',
          meta: { title: 'SEO Center' },
        },
        aiAssistant: {
          Component: './payload/admin/workspace/AiAssistantView#AiAssistantView',
          path: '/workspace/ai',
          meta: { title: 'AI Assistant' },
        },
        mediaStudio: {
          Component: './payload/admin/workspace/MediaStudioView#MediaStudioView',
          path: '/workspace/media',
          meta: { title: 'Media Studio' },
        },
        activityTimeline: {
          Component: './payload/admin/workspace/ActivityView#ActivityView',
          path: '/workspace/activity',
          meta: { title: 'Activity' },
        },
      },
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections,
  globals,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload/generated-types/payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  cors: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'].filter(Boolean),
  plugins,
  sharp,
})
