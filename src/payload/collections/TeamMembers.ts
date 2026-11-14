import type { CollectionConfig } from 'payload'

import { anyone, canManageContent, isAdminOrEditor } from '@/payload/access'
import { orderField } from '@/payload/fields'
import { revalidateOnDelete, revalidateSlugPath } from '@/payload/hooks/revalidate'

const TEAM_PATHS = ['/', '/about', '/about/leadership']

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  hooks: {
    afterChange: [revalidateSlugPath('/about', undefined, TEAM_PATHS)],
    afterDelete: [revalidateOnDelete(TEAM_PATHS)],
  },
  admin: {
    group: 'Website',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'profileType', 'order', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: canManageContent,
    update: canManageContent,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        components: {
          Cell: './payload/admin/components/cells/CatalogTitleCell#CatalogTitleCell',
        },
      },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'profileType',
      type: 'select',
      label: 'Profile type',
      required: true,
      defaultValue: 'leadership',
      options: [
        { label: 'Founder', value: 'founder' },
        { label: 'Director', value: 'director' },
        { label: 'Leadership', value: 'leadership' },
        { label: 'Advisor', value: 'advisor' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Founders and directors are featured first with their full background.',
      },
    },
    {
      name: 'department',
      type: 'relationship',
      relationTo: 'departments',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Summary',
      admin: { description: 'One or two sentences introducing this person.' },
    },
    {
      name: 'background',
      type: 'textarea',
      label: 'Professional background',
      admin: {
        description:
          'Career history, prior roles and domain experience. Separate paragraphs with a blank line.',
      },
    },
    {
      name: 'education',
      type: 'text',
      label: 'Education',
      admin: { description: 'Degrees and institutions (e.g. M.Sc. Statistics — University name).' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    orderField(),
    {
      name: 'linkedIn',
      type: 'text',
      label: 'LinkedIn URL',
    },
    {
      name: 'expertise',
      type: 'text',
      label: 'Expertise',
      admin: {
        description:
          'Comma-separated expertise areas (e.g. AI strategy, data platforms, clinical data).',
      },
    },
    {
      name: 'researchInterests',
      type: 'textarea',
      label: 'Research interests',
      admin: { description: 'Optional — relevant for research-facing leadership profiles.' },
    },
  ],
}
