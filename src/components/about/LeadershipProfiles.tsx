import Image from 'next/image'
import { Linkedin } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import {
  PROFILE_TYPE_LABELS,
  initialsOf,
  isFeaturedProfile,
  splitExpertise,
  splitParagraphs,
} from '@/lib/team'
import { cn } from '@/lib/utils'
import type { TeamMember } from '@/payload/generated-types/payload-types'

const CARD =
  'rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-sm'

function Portrait({ member, className }: { member: TeamMember; className?: string }) {
  const photoUrl = getMediaUrl(member.photo as Parameters<typeof getMediaUrl>[0])
  return (
    <div className={cn('relative aspect-[4/5] overflow-hidden rounded-2xl', className)}>
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={getMediaAlt(member.photo as Parameters<typeof getMediaAlt>[0], member.name)}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 280px"
        />
      ) : (
        <div
          aria-hidden
          className="bg-dark flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--color-accent)_45%,transparent),transparent_60%)]"
        >
          <span className="font-display text-5xl font-semibold tracking-wide text-white/90">
            {initialsOf(member.name)}
          </span>
        </div>
      )}
    </div>
  )
}

function ProfileBadge({ member }: { member: TeamMember }) {
  return (
    <span className="text-accent inline-flex items-center rounded-full border border-[color:var(--color-accent)]/30 px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase">
      {PROFILE_TYPE_LABELS[member.profileType]}
    </span>
  )
}

function ExpertiseChips({ value }: { value?: string | null }) {
  const items = splitExpertise(value)
  if (items.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="text-primary list-none rounded-full border border-[color:var(--glass-border)] px-3 py-1 text-xs font-medium"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

function LinkedInLink({ href, name }: { href?: string | null; name: string }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on LinkedIn`}
      className="text-accent inline-flex items-center gap-2 text-sm font-semibold hover:underline"
    >
      <Linkedin className="size-4" aria-hidden />
      LinkedIn
    </a>
  )
}

function FeaturedProfile({ member }: { member: TeamMember }) {
  const background = splitParagraphs(member.background)
  const hasDetails = Boolean(member.expertise || member.researchInterests || member.education)

  return (
    <article className={cn(CARD, 'grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,280px)_1fr]')}>
      <Portrait member={member} className="w-full max-w-[280px]" />
      <div className="min-w-0">
        <ProfileBadge member={member} />
        <h3 className="font-display text-primary mt-4 text-2xl font-semibold sm:text-3xl">
          {member.name}
        </h3>
        <p className="text-accent mt-1 text-base font-semibold">{member.role}</p>
        {member.bio ? (
          <p className="text-secondary mt-5 text-lg leading-relaxed">{member.bio}</p>
        ) : null}

        {background.length > 0 ? (
          <div className="mt-6">
            <h4 className="text-muted text-[10px] font-bold tracking-[0.14em] uppercase">
              Background
            </h4>
            <div className="text-secondary mt-3 space-y-3 text-sm leading-relaxed">
              {background.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        ) : null}

        {hasDetails ? (
          <dl className="mt-6 grid gap-5 border-t border-[color:var(--glass-border)] pt-6 lg:grid-cols-2">
            {member.expertise ? (
              <div className="lg:col-span-2">
                <dt className="text-muted text-[10px] font-bold tracking-[0.14em] uppercase">
                  Areas of expertise
                </dt>
                <dd className="mt-3">
                  <ExpertiseChips value={member.expertise} />
                </dd>
              </div>
            ) : null}
            {member.researchInterests ? (
              <div>
                <dt className="text-muted text-[10px] font-bold tracking-[0.14em] uppercase">
                  Research interests
                </dt>
                <dd className="text-secondary mt-2 text-sm leading-relaxed">
                  {member.researchInterests}
                </dd>
              </div>
            ) : null}
            {member.education ? (
              <div>
                <dt className="text-muted text-[10px] font-bold tracking-[0.14em] uppercase">
                  Education
                </dt>
                <dd className="text-secondary mt-2 text-sm leading-relaxed">{member.education}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        <div className="mt-6">
          <LinkedInLink href={member.linkedIn} name={member.name} />
        </div>
      </div>
    </article>
  )
}

function CompactProfile({ member }: { member: TeamMember }) {
  return (
    <article className={cn(CARD, 'flex h-full flex-col p-5')}>
      <Portrait member={member} />
      <div className="mt-5 flex flex-1 flex-col">
        <h3 className="font-display text-primary text-lg font-semibold">{member.name}</h3>
        <p className="text-accent text-sm font-semibold">{member.role}</p>
        {member.bio ? (
          <p className="text-secondary mt-3 text-sm leading-relaxed">{member.bio}</p>
        ) : null}
        {member.expertise ? (
          <div className="mt-4">
            <ExpertiseChips value={member.expertise} />
          </div>
        ) : null}
        {member.education ? (
          <p className="text-secondary mt-4 text-xs leading-relaxed">
            <span className="text-primary font-semibold">Education: </span>
            {member.education}
          </p>
        ) : null}
        <div className="mt-auto pt-4">
          <LinkedInLink href={member.linkedIn} name={member.name} />
        </div>
      </div>
    </article>
  )
}

export function LeadershipProfiles({ members }: { members: TeamMember[] }) {
  const featured = members.filter(isFeaturedProfile)
  const leaders = members.filter((member) => member.profileType === 'leadership')
  const advisors = members.filter((member) => member.profileType === 'advisor')

  const groups = [
    { key: 'leadership', eyebrow: 'Leadership', title: 'Leadership Team', items: leaders },
    { key: 'advisors', eyebrow: 'Advisory', title: 'Advisors', items: advisors },
  ].filter((group) => group.items.length > 0)

  return (
    <>
      {featured.length > 0 ? (
        <Section>
          <Container>
            <SectionHeader
              eyebrow="Founders & Directors"
              title="The people behind XELARVIS"
              description="The founders and directors who set our direction across artificial intelligence, data science and IT consulting."
            />
            <div className="mt-10 space-y-8">
              {featured.map((member, index) => (
                <AnimateIn key={member.id} delay={index * 0.06}>
                  <FeaturedProfile member={member} />
                </AnimateIn>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {groups.map((group, groupIndex) => (
        <Section key={group.key} surface={((featured.length > 0 ? 1 : 0) + groupIndex) % 2 === 1}>
          <Container>
            <SectionHeader eyebrow={group.eyebrow} title={group.title} />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((member, index) => (
                <li key={member.id} className="list-none">
                  <AnimateIn delay={index * 0.05} className="h-full">
                    <CompactProfile member={member} />
                  </AnimateIn>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ))}
    </>
  )
}
