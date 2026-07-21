import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { Plugin } from 'payload'

import { createCloudinaryAdapter, isCloudinaryEnabled } from './cloudinaryAdapter'

const generateTitle = ({ doc }: { doc: { title?: string } }) => doc?.title || 'Xelarvis Technologies'

const generateURL = ({ doc }: { doc: { slug?: string }; collectionConfig?: { slug?: string } }) => {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const slug = doc?.slug
  if (!slug) return site
  return `${site}/${slug}`
}

export const plugins: Plugin[] = [
  seoPlugin({
    collections: ['pages', 'services', 'industries', 'solutions', 'blogs', 'case-studies', 'careers'],
    uploadsCollection: 'media',
    generateTitle,
    generateURL,
  }),
  searchPlugin({
    collections: ['pages', 'services', 'industries', 'solutions', 'blogs', 'careers', 'case-studies'],
    defaultPriorities: {
      pages: 10,
      services: 20,
      industries: 30,
      solutions: 25,
      blogs: 40,
      careers: 50,
      'case-studies': 35,
    },
  }),
  ...(isCloudinaryEnabled()
    ? [
        cloudStoragePlugin({
          collections: {
            media: {
              adapter: createCloudinaryAdapter(),
              disableLocalStorage: true,
              generateFileURL: ({ filename }) => {
                const cloud = process.env.CLOUDINARY_CLOUD_NAME
                const folder = process.env.CLOUDINARY_FOLDER || 'xelarvis'
                return `https://res.cloudinary.com/${cloud}/image/upload/${folder}/${filename}`
              },
            },
          },
        }),
      ]
    : []),
]
