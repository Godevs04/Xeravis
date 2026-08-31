import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { Plugin } from 'payload'

import { createCloudinaryAdapter, isCloudinaryEnabled } from './cloudinaryAdapter'

const COLLECTION_PATHS: Record<string, string> = {
  pages: '',
  services: '/services',
  industries: '/industries',
  solutions: '/solutions',
  blogs: '/blog',
  'case-studies': '/case-studies',
  careers: '/careers',
}

const generateTitle = ({ doc }: { doc: { title?: string } }) =>
  doc?.title || process.env.SITE_NAME || 'Xelarvis'

const generateURL = ({
  doc,
  collectionConfig,
}: {
  doc: { slug?: string }
  collectionConfig?: { slug?: string }
}) => {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
  const slug = doc?.slug
  if (!slug) return site

  const collectionSlug = collectionConfig?.slug || 'pages'
  const prefix = COLLECTION_PATHS[collectionSlug]

  if (collectionSlug === 'pages') {
    return slug === 'home' ? site : `${site}/${slug}`
  }

  if (prefix === undefined) {
    return `${site}/${slug}`
  }

  return `${site}${prefix}/${slug}`
}

export const plugins: Plugin[] = [
  seoPlugin({
    collections: [
      'pages',
      'services',
      'industries',
      'solutions',
      'blogs',
      'case-studies',
      'careers',
    ],
    uploadsCollection: 'media',
    generateTitle,
    generateURL,
  }),
  searchPlugin({
    collections: [
      'pages',
      'services',
      'industries',
      'solutions',
      'blogs',
      'careers',
      'case-studies',
    ],
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
