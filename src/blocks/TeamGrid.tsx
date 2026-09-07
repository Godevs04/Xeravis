import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { safePayload } from '@/lib/cms'
import { getMediaAlt, getMediaUrl } from '@/lib/media'

type TeamMemberDoc = {
  id: string
  name: string
  role: string
  bio?: string | null
  photo?: unknown
  linkedIn?: string | null
  expertise?: string | null
  researchInterests?: string | null
}

type TeamGridProps = {
  heading: string
}

export async function TeamGrid({ heading }: TeamGridProps) {
  const result = await safePayload((payload) =>
    payload.find({
      collection: 'team-members',
      sort: 'order',
      limit: 8,
      depth: 1,
    }),
  )

  const members = (result?.docs as TeamMemberDoc[]) ?? []

  return (
    <Section surface>
      <Container>
        <AnimateIn className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
        </AnimateIn>
        {members.length === 0 ? (
          <p className="text-secondary mt-8">
            Leadership profiles will appear here once published.
          </p>
        ) : (
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member, index) => {
              const photoUrl = getMediaUrl(member.photo as Parameters<typeof getMediaUrl>[0])
              return (
                <AnimateIn key={member.id} delay={index * 0.05}>
                  <article>
                    {photoUrl ? (
                      <div className="bg-surface relative mb-5 aspect-[4/5] overflow-hidden">
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
                      </div>
                    ) : (
                      <div className="bg-surface mb-5 aspect-[4/5]" />
                    )}
                    <h3 className="text-primary text-lg font-semibold">{member.name}</h3>
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
                    {member.researchInterests && (
                      <p className="text-secondary mt-2 text-sm">
                        <span className="text-primary font-semibold">Research: </span>
                        {member.researchInterests}
                      </p>
                    )}
                    {member.linkedIn && (
                      <Link
                        href={member.linkedIn}
                        className="text-accent mt-3 inline-block text-sm font-medium hover:underline"
                      >
                        LinkedIn
                      </Link>
                    )}
                  </article>
                </AnimateIn>
              )
            })}
          </div>
        )}
      </Container>
    </Section>
  )
}
