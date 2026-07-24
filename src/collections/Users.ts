import type { CollectionConfig } from 'payload'

import { adminFieldAccess, isAdmin, isSuperAdmin } from '@/access'
import type { UserRole } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles', 'updatedAt'],
    group: 'System',
  },
  access: {
    create: async ({ req }) => {
      if (isAdmin({ req }) || isSuperAdmin({ req })) return true
      const users = await req.payload.find({
        collection: 'users',
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      return users.totalDocs === 0
    },
    delete: isSuperAdmin,
    read: (args) => {
      if (isAdmin(args) || isSuperAdmin(args)) return true
      const { user } = args.req
      if (user) return { id: { equals: user.id } }
      return false
    },
    update: (args) => {
      if (isAdmin(args) || isSuperAdmin(args)) return true
      const { user } = args.req
      if (user) return { id: { equals: user.id } }
      return false
    },
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      saveToJWT: true,
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Administrator', value: 'administrator' },
        { label: 'Editor', value: 'editor' },
        { label: 'Content Manager', value: 'content-manager' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Recruiter', value: 'recruiter' },
        { label: 'Viewer', value: 'viewer' },
      ] satisfies { label: string; value: UserRole }[],
      access: {
        create: adminFieldAccess,
        update: adminFieldAccess,
      },
    },
  ],
}
