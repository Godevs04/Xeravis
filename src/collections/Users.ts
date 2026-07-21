import type { CollectionConfig } from 'payload'

import { adminFieldAccess, isAdmin } from '@/access'
import type { UserRole } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles', 'updatedAt'],
  },
  access: {
    // Allow first user creation when no admins exist yet
    create: async ({ req }) => {
      if (isAdmin({ req })) return true
      const users = await req.payload.find({
        collection: 'users',
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      return users.totalDocs === 0
    },
    delete: isAdmin,
    read: (args) => {
      if (isAdmin(args)) return true
      const { user } = args.req
      if (user) return { id: { equals: user.id } }
      return false
    },
    update: (args) => {
      if (isAdmin(args)) return true
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
      defaultValue: ['admin'],
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Content Manager', value: 'content-manager' },
      ] satisfies { label: string; value: UserRole }[],
      access: {
        create: adminFieldAccess,
        update: adminFieldAccess,
      },
    },
  ],
}
