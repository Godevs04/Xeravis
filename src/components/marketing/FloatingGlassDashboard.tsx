'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { ConstellationCanvas } from '@/components/marketing/ConstellationCanvas'
import { cn } from '@/lib/utils'

type FloatingGlassDashboardProps = {
  className?: string
}

const BARS = [38, 62, 44, 78, 56, 88, 70, 92]

export function FloatingGlassDashboard({ className }: FloatingGlassDashboardProps) {
  const reduce = useReducedMotion()

  return (
    <div className={cn('relative mx-auto w-full max-w-lg', className)}>
      <motion.div
        className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.06] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-6"
        initial={reduce ? false : { opacity: 0, y: 28, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1200 }}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-cyan-300/90 uppercase">
              Clinical intelligence
            </p>
            <p className="font-display mt-1 text-lg font-semibold text-white">Delivery cockpit</p>
          </div>
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-teal-400/80" />
            <span className="h-2 w-2 rounded-full bg-cyan-400/60" />
            <span className="h-2 w-2 rounded-full bg-slate-500/80" />
          </div>
        </div>

        <div className="relative mb-5 h-36 overflow-hidden rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.55)]">
          <ConstellationCanvas className="opacity-90" />
        </div>

        <div className="flex items-end gap-1.5 sm:gap-2">
          {BARS.map((h, i) => (
            <motion.div
              key={h}
              className="flex-1 rounded-t-md bg-gradient-to-t from-teal-600/80 to-cyan-400/90"
              initial={reduce ? false : { height: 8 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ minHeight: 8, maxHeight: 72 }}
            />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
          {[
            { label: 'Pipeline', value: 'Live' },
            { label: 'Models', value: '12' },
            { label: 'SLA', value: '99.9%' },
          ].map((m) => (
            <div key={m.label}>
              <p className="text-[10px] tracking-wide text-slate-400 uppercase">{m.label}</p>
              <p className="font-display mt-0.5 text-sm font-semibold text-white">{m.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {!reduce ? (
        <motion.div
          aria-hidden
          className="absolute -right-6 -bottom-8 hidden h-36 w-44 rounded-2xl border border-cyan-400/20 bg-teal-500/10 p-4 backdrop-blur-xl sm:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <p className="text-[9px] tracking-[0.16em] text-cyan-200/80 uppercase">Signal</p>
          <p className="font-display mt-2 text-2xl font-bold text-white">+34%</p>
          <p className="mt-1 text-xs text-slate-400">Outcome lift</p>
        </motion.div>
      ) : null}
    </div>
  )
}
