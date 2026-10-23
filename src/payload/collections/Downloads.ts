import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import {
  anyone,
  canManageMarketing,
  GATED_FOLDER,
  isAdminOrEditor,
  RESUME_FOLDER,
} from '@/payload/access'
import { slugField } from '@/payload/fields'
import { autoSlugFromTitle } from '@/payload/hooks'

/** Keeps a gated download's file out of public Media reads (and moves it back when un-gated). */
const syncFileVisibility: CollectionAfterChangeHook = async ({ doc, req }) => {
  const fileId = typeof doc.file === 'object' && doc.file ? doc.file.id : doc.file
  if (!fileId) return doc
  try {
    const media = await req.payload.findByID({
      collection: 'media',
      id: fileId,
      depth: 0,
      overrideAccess: true,
      req,
    })
    if (media.folder === RESUME_FOLDER) return doc
    const folder = doc.gated
      ? GATED_FOLDER
      : media.folder === GATED_FOLDER
        ? 'documents'
        : media.folder
    if (folder !== media.folder) {
      await req.payload.update({
        collection: 'media',
        id: fileId,
        data: { folder },
        overrideAccess: true,
        req,
      })
    }
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Download file visibility sync failed' })
  }
  return doc
}

export const Downloads: CollectionConfig = {
  slug: 'downloads',
  labels: {
    singular: 'Download',
    plural: 'Downloads',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'gated', 'downloadCount', 'updatedAt'],
    group: 'Website',
  },
  access: {
    read: anyone,
    create: canManageMarketing,
    update: canManageMarketing,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeValidate: [autoSlugFromTitle('title')],
    afterChange: [syncFileVisibility],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 140,
      admin: {
        components: {
          Cell: './payload/admin/components/cells/CatalogTitleCell#CatalogTitleCell',
        },
      },
    },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      maxLength: 400,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'relatedBlog',
      type: 'relationship',
      relationTo: 'blogs',
    },
    {
      name: 'relatedResearch',
      type: 'relationship',
      relationTo: 'research',
    },
    {
      name: 'gated',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Require an email before download. The email is saved under Form Submissions and the file becomes private (only served via the download link).',
      },
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
