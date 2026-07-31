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
}

export function StoryCapabilities({
  eyebrow = 'Capabilities',
  heading,
  subheading,
  items,
}: StoryCapabilitiesProps) {
  const reduce = useReducedMotion()

  return (
    <section className="overflow-hidden bg-white py-24 lg:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold tracking-[0.2em] text-teal-700 uppercase">
              {eyebrow}
            </p>
            <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.04em] text-[color:var(--color-navy)]">
              {heading}
            </h2>
            {subheading ? (
              <p className="mt-4 max-w-xl text-base text-slate-600">{subheading}</p>
            ) : null}
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-teal-700 underline-offset-4 hover:underline"
          >
            All services →
          </Link>
        </div>
      </Container>

      <div className="mt-10 sm:mt-14">
        <p className="container-x mb-3 text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase lg:hidden">
          Swipe to explore →
        </p>
        <div className="[scrollbar-width:none] overflow-x-auto pb-6 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max gap-5 px-[max(1.25rem,calc((100vw-var(--grid-container))/2+1.25rem))] sm:gap-6 sm:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
            {items.map((item, index) => (
              <motion.li
                key={item.id}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="w-[min(78vw,22rem)] shrink-0 sm:w-[min(82vw,22rem)]"
              >
                <Link
                  href={item.href}
                  className="group block h-full border-l-2 border-teal-500/40 pl-5 transition-[border-color,padding] hover:border-cyan-500 hover:pl-8 sm:pl-6"
                >
                  <span className="font-display text-xs tracking-[0.16em] text-slate-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display mt-4 text-xl font-semibold tracking-[-0.03em] text-[color:var(--color-navy)] group-hover:text-teal-700 sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:mt-4">
                    {item.summary}
                  </p>
                  <span className="mt-6 inline-block text-sm font-semibold text-teal-700 sm:mt-8 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                    Explore →
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
