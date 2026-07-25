'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'

type Step = { title: string; description: string }

type ProcessStepsProps = {
  heading: string
  steps?: Step[] | null
}

export function ProcessSteps({ heading, steps }: ProcessStepsProps) {
  const reduce = useReducedMotion()
  const items = steps ?? []

  return (
    <Section surface>
      <Container>
        <AnimateIn className="max-w-2xl">
          <p className="text-accent mb-3 text-[11px] font-bold tracking-[0.18em] uppercase">
            How we deliver
          </p>
          <h2 className="font-display text-[length:var(--text-h2)] font-bold tracking-[-0.04em]">
            {heading}
          </h2>
        </AnimateIn>

        {items.length === 0 ? (
          <p className="text-secondary mt-8">Process steps will appear here when configured.</p>
        ) : (
          <div className="relative mt-12">
            <div
              aria-hidden
              className="from-accent/40 via-accent/20 absolute top-8 right-0 left-0 hidden h-px bg-gradient-to-r to-transparent lg:block"
            />
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {items.map((step, index) => (
                <motion.li
                  key={step.title}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-8%' }}
                  transition={{
                    delay: reduce ? 0 : index * 0.08,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative overflow-hidden rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] p-6 shadow-[var(--shadow-medium)] backdrop-blur-2xl"
                >
                  <div className="bg-accent mb-5 grid h-10 w-10 place-items-center rounded-2xl text-sm font-bold text-white shadow-[0_10px_28px_rgba(109,94,249,0.4)]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-display text-primary text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-secondary mt-3 text-sm leading-relaxed">{step.description}</p>
                  <div
                    aria-hidden
                    className="bg-accent/0 group-hover:bg-accent/20 pointer-events-none absolute -right-8 -bottom-10 h-32 w-32 rounded-full blur-3xl transition-colors duration-500"
                  />
                </motion.li>
              ))}
            </ol>
          </div>
        )}
      </Container>
    </Section>
  )
}
