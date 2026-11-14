import Image from 'next/image'
import Link from '@/components/ui/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import { PROFILE_TYPE_LABELS, getTeamMembers, initialsOf, isFeaturedProfile } from '@/lib/team'

type TeamGridProps = {
  heading: string
}

export async function TeamGrid({ heading }: TeamGridProps) {
  const members = (await getTeamMembers()).slice(0, 8)

  // Doc §11: only show Leadership when genuine profiles exist — never fake or empty placeholders.
  if (members.length === 0) return null

  return (
    <Section surface>
      <Container>
        <AnimateIn className="flex max-w-none flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          <Link
            href="/about/leadership"
            className="text-accent text-sm font-semibold hover:underline"
          >
            View full profiles
          </Link>
        </AnimateIn>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => {
            const photoUrl = getMediaUrl(member.photo as Parameters<typeof getMediaUrl>[0])
            return (
              <AnimateIn key={member.id} delay={index * 0.05}>
                <article>
                  <div className="bg-dark relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl">
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={getMediaAlt(
                          member.photo as Parameters<typeof getMediaAlt>[0],
                          member.name,
                        )}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div
                        aria-hidden
                        className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--color-accent)_45%,transparent),transparent_60%)]"
                      >
                        <span className="font-display text-4xl font-semibold text-white/90">
                          {initialsOf(member.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  {isFeaturedProfile(member) ? (
                    <p className="text-accent text-[10px] font-bold tracking-[0.14em] uppercase">
                      {PROFILE_TYPE_LABELS[member.profileType]}
                    </p>
                  ) : null}
                  <h3 className="text-primary mt-1 text-lg font-semibold">{member.name}</h3>
                  <p className="text-muted text-sm">{member.role}</p>
                  {member.bio && (
                    <p className="text-secondary mt-3 text-sm leading-relaxed">{member.bio}</p>
                  )}
                  {member.expertise && (
                    <p className="text-secondary mt-3 text-sm">
                      <span className="text-primary font-semibold">Expertise: </span>
                      {member.expertise}
                    </p>
                  )}
                </article>
              </AnimateIn>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
