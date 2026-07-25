import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

type MissionVisionProps = {
  heading: string
  missionTitle?: string | null
  missionBody: string
  visionTitle?: string | null
  visionBody: string
}

export function MissionVision({
  heading,
  missionTitle = 'Mission',
  missionBody,
  visionTitle = 'Vision',
  visionBody,
}: MissionVisionProps) {
  return (
    <Section>
      <Container>
        <SectionHeader eyebrow="Purpose" title={heading} />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <AnimateIn>
            <SpotlightCard className="h-full p-6 sm:p-8">
              <p className="text-accent text-[11px] font-bold tracking-[0.16em] uppercase">
                {missionTitle}
              </p>
              <p className="text-secondary mt-4 text-base leading-relaxed sm:text-lg">
                {missionBody}
              </p>
            </SpotlightCard>
          </AnimateIn>
          <AnimateIn delay={0.08}>
            <SpotlightCard className="h-full p-6 sm:p-8">
              <p className="text-accent text-[11px] font-bold tracking-[0.16em] uppercase">
                {visionTitle}
              </p>
              <p className="text-secondary mt-4 text-base leading-relaxed sm:text-lg">
                {visionBody}
              </p>
            </SpotlightCard>
          </AnimateIn>
        </div>
      </Container>
    </Section>
  )
}

type ValuesGridProps = {
  heading: string
  subheading?: string | null
  values?: { title: string; description: string }[] | null
}

export function ValuesGrid({ heading, subheading, values }: ValuesGridProps) {
  if (!values?.length) return null

  return (
    <Section>
      <Container>
        <SectionHeader eyebrow="Principles" title={heading} description={subheading || undefined} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, i) => (
            <li key={value.title} className="list-none">
              <AnimateIn delay={0.05 * i}>
                <SpotlightCard className="h-full p-6">
                  <h3 className="font-display text-primary text-lg font-semibold tracking-[-0.02em]">
                    {value.title}
                  </h3>
                  <p className="text-secondary mt-3 text-sm leading-relaxed">{value.description}</p>
                </SpotlightCard>
              </AnimateIn>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
