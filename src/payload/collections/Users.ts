import { Forbidden, type CollectionConfig } from 'payload'

import { adminFieldAccess, isAdmin, isSuperAdmin } from '@/payload/access'
import type { UserRole } from '@/payload/access'

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
      hooks: {
        beforeChange: [
          ({ value, originalDoc, req }) => {
            const actorRoles = (req.user as { roles?: UserRole[] } | null)?.roles
            // First-user bootstrap and super-admins may grant or revoke super-admin; nobody else
            if (!req.user || actorRoles?.includes('super-admin')) return value
            const had = Boolean(
              (originalDoc?.roles as UserRole[] | undefined)?.includes('super-admin'),
            )
            const has = Boolean((value as UserRole[] | undefined)?.includes('super-admin'))
            if (had !== has) throw new Forbidden(req.t)
            return value
          },
        ],
      },
    },
  ],
}
