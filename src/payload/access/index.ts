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
  hasRole(user as UserWithRoles, [
    'super-admin',
    'administrator',
    'editor',
    'marketing',
    'content-manager',
    'recruiter',
  ])

export const canManageCareers: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['super-admin', 'administrator', 'recruiter', 'editor'])

export const RESUME_FOLDER = 'resumes'

/** Candidate resumes are personal data: only people who can read applications may see them. */
export const mediaRead: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['super-admin', 'administrator', 'recruiter', 'editor'])
    ? true
    : { folder: { not_equals: RESUME_FOLDER } }

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

/** Role aliases matching org naming (Admin / Editor / Marketing / Recruiter / Viewer) */
export const isAdministrator = isAdmin
export const isEditor: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['super-admin', 'administrator', 'editor'])
export const isMarketing: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['super-admin', 'administrator', 'marketing'])
export const isRecruiter: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, ['super-admin', 'administrator', 'recruiter'])
export const isViewer: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, [
    'super-admin',
    'administrator',
    'editor',
    'content-manager',
    'marketing',
    'recruiter',
    'viewer',
  ])

const MARKETING_ROLES: UserRole[] = ['super-admin', 'administrator', 'marketing', 'editor']

export const canManageMarketing: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, MARKETING_ROLES)

/** Bulk subscriber export is a marketing task, stricter than row-level staff read access. */
export const canExportSubscribers = (user: unknown) =>
  hasRole(user as UserWithRoles, MARKETING_ROLES)
