import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Authors } from './collections/Authors'
import { Blogs } from './collections/Blogs'
import { Careers } from './collections/Careers'
import { CaseStudies } from './collections/CaseStudies'
import { Categories } from './collections/Categories'
import { Clients } from './collections/Clients'
import { Faqs } from './collections/Faqs'
import { FormSubmissions } from './collections/FormSubmissions'
import { Industries } from './collections/Industries'
import { JobApplications } from './collections/JobApplications'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Services } from './collections/Services'
import { Solutions } from './collections/Solutions'
import { TeamMembers } from './collections/TeamMembers'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { ContactDetails } from './globals/ContactDetails'
import { Footer } from './globals/Footer'
import { Navigation } from './globals/Navigation'
import { OfficeLocations } from './globals/OfficeLocations'
import { SeoDefaults } from './globals/SeoDefaults'
import { SiteSettings } from './globals/SiteSettings'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Xelarvis CMS',
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Services,
    Industries,
    Solutions,
    CaseStudies,
    Blogs,
    Categories,
    Authors,
    Careers,
    Testimonials,
    TeamMembers,
    Clients,
    Faqs,
    FormSubmissions,
    JobApplications,
  ],
  globals: [SiteSettings, Navigation, Footer, ContactDetails, OfficeLocations, SeoDefaults],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  cors: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'].filter(Boolean),
  plugins,
  sharp,
})
