'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Button } from '@/components/ui/button'

type TechItem = {
  id: string
  title: string
  category: string
  description?: string | null
}

type TechnologyGridProps = {
  heading: string
  subheading?: string | null
  items: TechItem[]
  categories: string[]
}

/** Client visualization — data prepared by server wrapper */
export function TechnologyEcosystem({
  heading,
  subheading,
  items,
  categories,
}: TechnologyGridProps) {
  const reduce = useReducedMotion()

  return (
    <Section surface>
      <Container>
        <SectionHeader
          eyebrow="Technology"
          title={heading}
          description={subheading}
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/solutions">Explore solutions</Link>
            </Button>
          }
        />

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-secondary rounded-full border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] px-3 py-1 text-xs font-semibold capitalize backdrop-blur-md"
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="relative mt-12 overflow-hidden rounded-[32px] border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] p-6 shadow-[var(--shadow-floating)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(109,94,249,0.16),transparent_65%)]"
          />
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-30" />

          <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: reduce ? 0 : index * 0.04,
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={reduce ? undefined : { y: -4, scale: 1.02 }}
                className="group relative rounded-[22px] border border-[color:var(--glass-border-soft)] bg-white/70 p-4 shadow-[var(--shadow-light)] backdrop-blur-xl dark:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className="bg-accent h-2 w-2 rounded-full shadow-[0_0_12px_rgba(109,94,249,0.8)]" />
                  <p className="text-muted text-[10px] font-bold tracking-[0.14em] uppercase">
                    {item.category}
                  </p>
                </div>
                <h3 className="font-display mt-3 text-base font-semibold tracking-tight">
                  {item.title}
                </h3>
                {item.description ? (
                  <p className="text-secondary mt-2 text-xs leading-relaxed">{item.description}</p>
                ) : null}
                <div
                  aria-hidden
                  className="from-accent/0 to-accent/0 group-hover:from-accent/10 absolute inset-x-0 bottom-0 h-px bg-gradient-to-r group-hover:to-transparent"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
