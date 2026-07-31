'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useId, useMemo } from 'react'

import { cn } from '@/lib/utils'

type Node = { x: number; y: number; r?: number }

type ConstellationCanvasProps = {
  className?: string
  nodes?: Node[]
  animate?: boolean
}

const DEFAULT_NODES: Node[] = [
  { x: 12, y: 28, r: 3.5 },
  { x: 28, y: 18, r: 2.5 },
  { x: 42, y: 36, r: 4 },
  { x: 58, y: 22, r: 2.8 },
  { x: 72, y: 40, r: 3.2 },
  { x: 86, y: 26, r: 2.4 },
  { x: 34, y: 58, r: 2.6 },
  { x: 52, y: 68, r: 3.8 },
  { x: 68, y: 62, r: 2.5 },
  { x: 22, y: 72, r: 2.2 },
  { x: 80, y: 74, r: 3 },
]

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [2, 6],
  [6, 7],
  [7, 8],
  [7, 4],
  [6, 9],
  [8, 10],
  [4, 8],
]

export function ConstellationCanvas({
  className,
  nodes = DEFAULT_NODES,
  animate = true,
}: ConstellationCanvasProps) {
  const reduce = useReducedMotion()
  const id = useId()
  const paths = useMemo(
    () =>
      EDGES.map(([a, b]) => {
        const n1 = nodes[a]
        const n2 = nodes[b]
        if (!n1 || !n2) return null
        return `M ${n1.x} ${n1.y} L ${n2.x} ${n2.y}`
      }).filter(Boolean) as string[],
    [nodes],
  )

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none h-full w-full', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-thread`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D9488" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.55" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke={`url(#${id}-thread)`}
          strokeWidth={0.35}
          strokeLinecap="round"
          initial={
            animate && !reduce ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.7 }
          }
          whileInView={{ pathLength: 1, opacity: 0.75 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {nodes.map((n, i) => (
        <motion.circle
          key={`${n.x}-${n.y}`}
          cx={n.x}
          cy={n.y}
          r={n.r ?? 2.5}
          fill="#06B6D4"
          filter={`url(#${id}-glow)`}
          initial={reduce ? false : { opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 0.95, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.04, duration: 0.5 }}
        />
      ))}
    </svg>
  )
}
