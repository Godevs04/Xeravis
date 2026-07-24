import type { Access, FieldAccess } from 'payload'

export type UserRole =
  | 'super-admin'
  | 'administrator'
  | 'editor'
  | 'content-manager'
  | 'marketing'
  | 'recruiter'
  | 'viewer'

type UserWithRoles = {
  id: string | number
  roles?: UserRole[]
}

const hasRole = (user: UserWithRoles | null | undefined, roles: UserRole[]) =>
  Boolean(user?.roles?.some((role) => roles.includes(role)))

export const isSuperAdmin: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['super-admin'])

export const isAdmin: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['super-admin', 'administrator'])

export const isAdminOrEditor: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['super-admin', 'administrator', 'editor'])

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

export const canManageContent: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, [
    'super-admin',
    'administrator',
    'editor',
    'content-manager',
    'marketing',
  ])

export const canPublish: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['super-admin', 'administrator', 'editor', 'marketing'])

export const canManageCareers: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['super-admin', 'administrator', 'recruiter', 'editor'])

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (
    hasRole(user as UserWithRoles, [
      'super-admin',
      'administrator',
      'editor',
      'content-manager',
      'marketing',
      'recruiter',
      'viewer',
    ])
  ) {
    return true
  }
  return { _status: { equals: 'published' } }
}

export const anyone: Access = () => true

export const adminFieldAccess: FieldAccess = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['super-admin', 'administrator'])

export const staffRead: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, [
    'super-admin',
    'administrator',
    'editor',
    'content-manager',
    'marketing',
    'recruiter',
    'viewer',
  ])
