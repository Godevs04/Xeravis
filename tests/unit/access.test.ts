import type { PayloadRequest } from 'payload'
import { describe, expect, it } from 'vitest'

import {
  authenticatedOrPublished,
  canExportSubscribers,
  canManageCareers,
  isAdmin,
  mediaRead,
  RESUME_FOLDER,
  GATED_FOLDER,
  type UserRole,
} from '@/payload/access'

type AccessFn = (args: { req: PayloadRequest }) => unknown

function run(access: unknown, roles: UserRole[] | null) {
  const user = roles ? { id: 'u1', roles } : null
  return (access as AccessFn)({ req: { user } as unknown as PayloadRequest })
}

describe('role access', () => {
  it('limits admin access to admin roles', () => {
    expect(run(isAdmin, ['super-admin'])).toBe(true)
    expect(run(isAdmin, ['administrator'])).toBe(true)
    expect(run(isAdmin, ['editor'])).toBe(false)
    expect(run(isAdmin, null)).toBe(false)
  })

  it('lets recruiters manage careers but not viewers', () => {
    expect(run(canManageCareers, ['recruiter'])).toBe(true)
    expect(run(canManageCareers, ['viewer'])).toBe(false)
  })

  it('restricts subscriber export to marketing roles', () => {
    expect(canExportSubscribers({ id: 1, roles: ['marketing'] })).toBe(true)
    expect(canExportSubscribers({ id: 1, roles: ['recruiter'] })).toBe(false)
    expect(canExportSubscribers(null)).toBe(false)
  })
})

describe('authenticatedOrPublished', () => {
  it('shows drafts to staff and only published docs to visitors', () => {
    expect(run(authenticatedOrPublished, ['viewer'])).toBe(true)
    expect(run(authenticatedOrPublished, null)).toEqual({ _status: { equals: 'published' } })
  })
})

describe('mediaRead', () => {
  it('hides resumes and gated files from anonymous visitors', () => {
    expect(run(mediaRead, null)).toEqual({
      folder: { not_in: [RESUME_FOLDER, GATED_FOLDER] },
    })
  })

  it('hides resumes from staff without application access', () => {
    expect(run(mediaRead, ['marketing'])).toEqual({ folder: { not_equals: RESUME_FOLDER } })
  })

  it('gives recruiters full access', () => {
    expect(run(mediaRead, ['recruiter'])).toBe(true)
  })
})
