'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

import { Container } from '@/components/layout/Container'

export type CapabilityItem = {
  id: string
  title: string
  summary: string
  href: string
}

type StoryCapabilitiesProps = {
  eyebrow?: string | null
  heading: string
  subheading?: string | null
  items: CapabilityItem[]
  viewAllHref?: string
  viewAllLabel?: string
  exploreLabel?: string
}

export function StoryCapabilities({
  eyebrow = 'Capabilities',
  heading,
  subheading,
  items,
  viewAllHref = '/services',
  viewAllLabel = 'All capabilities →',
  exploreLabel = 'Explore →',
}: StoryCapabilitiesProps) {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-background)] py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_0%_0%,rgba(13,148,136,0.1),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(6,182,212,0.08),transparent_50%)]"
      />

      <Container className="relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-accent)] uppercase">
              {eyebrow}
            </p>
            <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.04em] text-[color:var(--color-primary)]">
              {heading}
            </h2>
            {subheading ? (
              <p className="mt-4 max-w-xl text-base text-[color:var(--color-secondary)]">
                {subheading}
              </p>
            ) : null}
          </div>
          <Link
            href={viewAllHref}
            className="text-sm font-semibold text-[color:var(--color-accent)] underline-offset-4 hover:underline"
          >
            {viewAllLabel}
          </Link>
        </div>
      </Container>

      <div className="relative z-10 mt-10 sm:mt-14">
        <p className="container-x mb-3 text-[10px] font-semibold tracking-[0.14em] text-[color:var(--color-muted)] uppercase lg:hidden">
          Swipe to explore →
        </p>
        <div className="snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto pb-6 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max gap-5 px-[max(1.25rem,calc((100vw-var(--grid-container))/2+1.25rem))] sm:gap-6 sm:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
            {items.map((item, index) => (
              <motion.li
                key={item.id}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="w-[min(78vw,22rem)] shrink-0 snap-start sm:w-[min(82vw,22rem)]"
              >
                <Link
                  href={item.href}
                  className="group block h-full rounded-r-[20px] border-l-2 border-[color:var(--color-accent)]/40 py-2 pl-5 transition-[border-color,padding,background] hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-hover)] hover:pl-8 sm:pl-6"
                >
                  <span className="font-display text-xs tracking-[0.16em] text-[color:var(--color-accent)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display mt-4 text-xl font-semibold tracking-[-0.03em] text-[color:var(--color-primary)] transition-colors group-hover:text-[color:var(--color-accent)] sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-secondary)] sm:mt-4">
                    {item.summary}
                  </p>
                  <span className="mt-6 inline-block text-sm font-semibold text-[color:var(--color-accent)] sm:mt-8 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                    {exploreLabel}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
