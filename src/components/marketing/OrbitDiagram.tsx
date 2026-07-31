'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

import { cn } from '@/lib/utils'

export type OrbitNode = {
  id: string
  label: string
  category?: string | null
}

type OrbitDiagramProps = {
  nodes: OrbitNode[]
  className?: string
  centerLabel?: string
}

const RINGS = [28, 42, 56]

function roundPct(n: number) {
  return Math.round(n * 1000) / 1000
}

export function OrbitDiagram({ nodes, className, centerLabel = 'XELARVIS' }: OrbitDiagramProps) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<string | null>(null)
  const placed = nodes.slice(0, 12)

  return (
    <div className={cn('relative mx-auto aspect-square w-full max-w-xl', className)}>
      <div aria-hidden className="absolute inset-[8%] rounded-full border border-teal-500/20" />
      <div aria-hidden className="absolute inset-[18%] rounded-full border border-cyan-400/15" />
      <div aria-hidden className="absolute inset-[28%] rounded-full border border-white/10" />

      {!reduce
        ? RINGS.map((r, i) => (
            <motion.div
              key={r}
              aria-hidden
              className="pointer-events-none absolute inset-0"
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{
                duration: 48 + i * 18,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div
                className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/60"
                style={{ transform: `translate(-50%, -50%) translateY(-${r}%)` }}
              />
            </motion.div>
          ))
        : null}

      <div className="absolute inset-0 grid place-items-center">
        <div className="relative z-10 grid h-28 w-28 place-items-center rounded-full border border-teal-400/40 bg-[rgba(15,23,42,0.85)] shadow-[0_0_60px_rgba(13,148,136,0.35)] backdrop-blur-xl sm:h-32 sm:w-32">
          <span className="font-display text-center text-[10px] font-bold tracking-[0.2em] text-cyan-200 uppercase sm:text-xs">
            {centerLabel}
          </span>
        </div>
      </div>

      {placed.map((node, index) => {
        const ring = RINGS[index % RINGS.length]
        const angle = (index / placed.length) * Math.PI * 2 - Math.PI / 2
        const x = roundPct(50 + Math.cos(angle) * ring)
        const y = roundPct(50 + Math.sin(angle) * ring)
        const isActive = active === node.id

        return (
          <motion.button
            key={node.id}
            type="button"
            className={cn(
              'absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-left backdrop-blur-md transition-colors',
              isActive
                ? 'border-cyan-300/70 bg-teal-500/30 text-white'
                : 'border-white/15 bg-white/5 text-slate-200 hover:border-teal-400/50 hover:bg-teal-500/20',
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduce ? undefined : { scale: 1.08 }}
            onHoverStart={() => setActive(node.id)}
            onHoverEnd={() => setActive(null)}
            onFocus={() => setActive(node.id)}
            onBlur={() => setActive(null)}
          >
            <span className="font-display block max-w-[7.5rem] truncate text-[11px] font-semibold tracking-tight sm:text-xs">
              {node.label}
            </span>
            {node.category ? (
              <span className="mt-0.5 block text-[9px] tracking-wide text-slate-400 uppercase">
                {node.category}
              </span>
            ) : null}
          </motion.button>
        )
      })}
    </div>
  )
}
