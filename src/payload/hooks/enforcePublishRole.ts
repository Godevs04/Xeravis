import type { CollectionBeforeChangeHook } from 'payload'

import type { UserRole } from '@/payload/access'

type UserWithRoles = {
  roles?: UserRole[]
}

const PUBLISH_ROLES: UserRole[] = ['super-admin', 'administrator', 'editor', 'marketing']

export const enforcePublishRole: CollectionBeforeChangeHook = ({ data, req }) => {
  if (!data || data._status !== 'published') return data

  // Local API / seed (no authenticated user) may publish via overrideAccess
  if (!req.user) return data

  const user = req.user as UserWithRoles
  const allowed = Boolean(user.roles?.some((role) => PUBLISH_ROLES.includes(role)))

  if (!allowed) {
    return { ...data, _status: 'draft' }
  }

  return data
}
