import { cache } from 'react'

import { safePayload } from '@/lib/cms'
import type { TeamMember } from '@/payload/generated-types/payload-types'

export type ProfileType = NonNullable<TeamMember['profileType']>

export const PROFILE_TYPE_LABELS: Record<ProfileType, string> = {
  founder: 'Founder',
  director: 'Director',
  leadership: 'Leadership',
  advisor: 'Advisor',
}

const PROFILE_TYPE_RANK: Record<ProfileType, number> = {
  founder: 0,
  director: 1,
  leadership: 2,
  advisor: 3,
}

export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  const result = await safePayload((payload) =>
    payload.find({
      collection: 'team-members',
      sort: 'order',
      limit: 24,
      depth: 1,
    }),
  )
  return sortByProfileType(result?.docs ?? [])
})

export function sortByProfileType(members: TeamMember[]): TeamMember[] {
  return members
    .map((member, index) => ({ member, index }))
    .sort(
      (a, b) =>
        PROFILE_TYPE_RANK[a.member.profileType ?? 'leadership'] -
          PROFILE_TYPE_RANK[b.member.profileType ?? 'leadership'] || a.index - b.index,
    )
    .map(({ member }) => member)
}

export function isFeaturedProfile(member: TeamMember): boolean {
  return member.profileType === 'founder' || member.profileType === 'director'
}

export function splitExpertise(value?: string | null): string[] {
  if (!value) return []
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function splitParagraphs(value?: string | null): string[] {
  if (!value) return []
  return value
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}
