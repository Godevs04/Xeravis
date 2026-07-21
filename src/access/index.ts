import type { Access, FieldAccess } from 'payload'

export type UserRole = 'admin' | 'editor' | 'content-manager'

type UserWithRoles = {
  id: string | number
  roles?: UserRole[]
}

const hasRole = (user: UserWithRoles | null | undefined, roles: UserRole[]) =>
  Boolean(user?.roles?.some((role) => roles.includes(role)))

export const isAdmin: Access = ({ req: { user } }) => hasRole(user as UserWithRoles, ['admin'])

export const isAdminOrEditor: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['admin', 'editor'])

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

export const canManageContent: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['admin', 'editor', 'content-manager'])

export const canPublish: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['admin', 'editor'])

/** Public read for published docs; authenticated staff see all. */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (hasRole(user as UserWithRoles, ['admin', 'editor', 'content-manager'])) return true
  return { _status: { equals: 'published' } }
}

export const anyone: Access = () => true

export const adminFieldAccess: FieldAccess = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['admin'])
