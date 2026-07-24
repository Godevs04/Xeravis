import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Heading } from '@/components/ui/heading'

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
    <Section surface>
      <Container>
        <Heading level="h2" className="mb-10">
          {heading}
        </Heading>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-primary text-lg font-semibold">{missionTitle}</h3>
            <p className="text-secondary mt-3 text-sm leading-relaxed md:text-base">
              {missionBody}
            </p>
          </div>
          <div>
            <h3 className="text-primary text-lg font-semibold">{visionTitle}</h3>
            <p className="text-secondary mt-3 text-sm leading-relaxed md:text-base">{visionBody}</p>
          </div>
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
        <div className="mb-10 max-w-2xl">
          <Heading level="h2">{heading}</Heading>
          {subheading ? <p className="text-secondary mt-3">{subheading}</p> : null}
        </div>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <li key={value.title} className="border-border border-t pt-6">
              <h3 className="text-primary text-base font-semibold">{value.title}</h3>
              <p className="text-secondary mt-2 text-sm leading-relaxed">{value.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
