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
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Xelarvis Enterprise CMS',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/favicon.ico',
        },
      ],
    },
    theme: 'dark',
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
      beforeDashboard: ['./payload/admin/components/dashboard/BeforeDashboard#BeforeDashboard'],
      afterDashboard: ['./payload/admin/components/dashboard/AfterDashboard#AfterDashboard'],
      header: ['./payload/admin/components/HeaderChip#HeaderChip'],
      actions: ['./payload/admin/components/CommandAction#CommandAction'],
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
