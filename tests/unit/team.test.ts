import { describe, expect, it } from 'vitest'

import {
  initialsOf,
  isFeaturedProfile,
  sortByProfileType,
  splitExpertise,
  splitParagraphs,
} from '@/lib/team'
import type { TeamMember } from '@/payload/generated-types/payload-types'

function member(id: string, profileType: TeamMember['profileType']): TeamMember {
  return { id, name: id, role: 'Role', profileType, updatedAt: '', createdAt: '' }
}

describe('team helpers', () => {
  it('orders founders, then directors, then leadership and advisors, keeping CMS order within a type', () => {
    const sorted = sortByProfileType([
      member('advisor', 'advisor'),
      member('lead-a', 'leadership'),
      member('director', 'director'),
      member('lead-b', 'leadership'),
      member('founder', 'founder'),
    ])
    expect(sorted.map((m) => m.id)).toEqual(['founder', 'director', 'lead-a', 'lead-b', 'advisor'])
  })

  it('features only founders and directors', () => {
    expect(isFeaturedProfile(member('a', 'founder'))).toBe(true)
    expect(isFeaturedProfile(member('b', 'director'))).toBe(true)
    expect(isFeaturedProfile(member('c', 'leadership'))).toBe(false)
    expect(isFeaturedProfile(member('d', 'advisor'))).toBe(false)
  })

  it('splits expertise and background text', () => {
    expect(splitExpertise('AI strategy, data platforms;  MLOps\n')).toEqual([
      'AI strategy',
      'data platforms',
      'MLOps',
    ])
    expect(splitExpertise(null)).toEqual([])
    expect(splitParagraphs('First.\n\n  Second.\n \nThird.')).toEqual([
      'First.',
      'Second.',
      'Third.',
    ])
  })

  it('builds initials from first and last names', () => {
    expect(initialsOf('Ada Lovelace')).toBe('AL')
    expect(initialsOf('  Grace  Brewster Hopper ')).toBe('GH')
    expect(initialsOf('Plato')).toBe('P')
  })
})
