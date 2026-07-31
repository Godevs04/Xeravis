'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { Container } from '@/components/layout/Container'

export type PresenceQuote = {
  id: string
  quote: string
  authorName: string
  authorRole?: string | null
  company?: string | null
}

type StoryPresenceProps = {
  eyebrow?: string | null
  heading: string
  quotes?: PresenceQuote[] | null
}

const FALLBACK: PresenceQuote[] = [
  {
    id: '1',
    quote:
      'Xelarvis brought clinical rigor and modern AI craft into the same delivery — rare, and exactly what we needed.',
    authorName: 'Program lead',
    authorRole: 'Healthcare analytics',
    company: 'Life sciences partner',
  },
  {
    id: '2',
    quote:
      'They treat platforms like products. Operators adopted the system because it felt inevitable, not imposed.',
    authorName: 'Engineering director',
    authorRole: 'Digital transformation',
    company: 'Enterprise client',
  },
]

export function StoryPresence({ eyebrow = 'Presence', heading, quotes }: StoryPresenceProps) {
  const reduce = useReducedMotion()
  const items = quotes?.length ? quotes : FALLBACK

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-neutral)] py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"
      />
      <Container>
        <p className="text-[11px] font-bold tracking-[0.2em] text-teal-700 uppercase">{eyebrow}</p>
        <h2 className="font-display mt-4 max-w-2xl text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-[-0.04em] text-[color:var(--color-navy)]">
          {heading}
        </h2>

        <div className="mt-16 space-y-16">
          {items.map((item, index) => (
            <motion.blockquote
              key={item.id}
              className="relative max-w-4xl backdrop-blur-sm"
              style={{ marginLeft: index % 2 === 0 ? 0 : 'auto' }}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-[clamp(1.4rem,3vw,2.2rem)] leading-snug font-medium tracking-[-0.025em] text-[color:var(--color-navy)]">
                “{item.quote}”
              </p>
              <footer className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{item.authorName}</span>
                {item.authorRole ? <span>· {item.authorRole}</span> : null}
                {item.company ? <span>· {item.company}</span> : null}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </Container>
    </section>
  )
}
