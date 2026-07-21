import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { FALLBACK_STATS } from '@/lib/fallback-data'

type Stat = { label: string; value: string }

type StatsRowProps = {
  heading: string
  stats?: Stat[] | null
}

export function StatsRow({ heading, stats }: StatsRowProps) {
  const items = stats?.length ? stats : FALLBACK_STATS

  return (
    <Section className="border-y border-border bg-dark text-white">
      <Container>
        <AnimateIn>
          <h2 className="sr-only">{heading}</h2>
        </AnimateIn>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((stat, index) => (
            <AnimateIn key={stat.label} delay={index * 0.05}>
              <div>
                <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                <p className="mt-2 text-sm text-white/65">{stat.label}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </Container>
    </Section>
  )
}
