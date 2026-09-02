import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

const GATEWAYS = [
  {
    href: '/services',
    label: 'Capabilities',
    description:
      'How we work — AI, Data Science, IT Consulting, Data Engineering, and Healthcare specialty.',
  },
  {
    href: '/solutions',
    label: 'Solutions',
    description: 'What we solve — outcome themes for business challenges.',
  },
  {
    href: '/industries',
    label: 'Industries',
    description: 'Where we apply them — sector context and operating models.',
  },
  {
    href: '/ai-research-lab',
    label: 'Research',
    description: 'Methods that inform responsible, production-ready delivery.',
  },
  {
    href: '/case-studies',
    label: 'Case Studies',
    description: 'Evidence from governed AI and data programs.',
  },
  {
    href: '/insights',
    label: 'Insights',
    description: 'Perspective from the practice — blogs and resources.',
  },
  {
    href: '/careers',
    label: 'Careers',
    description: 'Join engineering, data science, and consulting teams.',
  },
] as const

/** Home gateway strip — consistent CTAs into primary hubs (plan Phase 7). */
export function HomeGatewayStrip() {
  return (
    <Section surface>
      <Container>
        <p className="text-xs font-semibold tracking-[0.14em] text-[color:var(--color-accent)] uppercase">
          Explore
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--color-primary)] md:text-3xl">
          Pathways into XELARVIS
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-[color:var(--color-secondary)] sm:text-base">
          Capabilities are how we work. Solutions are what we solve. Industries are where we apply
          them.
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {GATEWAYS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group block h-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--glass-bg)] px-4 py-4 transition hover:border-[color:var(--color-accent)]"
              >
                <span className="font-semibold text-[color:var(--color-primary)] group-hover:text-[color:var(--color-accent)]">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm text-[color:var(--color-secondary)]">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link
            href="/contact?intent=business"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Talk to an expert
          </Link>
        </div>
      </Container>
    </Section>
  )
}
