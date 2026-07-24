'use client'

import { motion, useReducedMotion } from 'framer-motion'

/** Soft ambient lighting + noise behind the whole product experience */
export function AmbientBackground() {
  const reduce = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-mesh absolute inset-0" />
      <div
        className={`absolute top-[-10%] -left-[20%] h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(circle,rgba(109,94,249,0.28),transparent_68%)] blur-3xl ${reduce ? '' : 'animate-blob'}`}
      />
      <div
        className={`absolute top-[20%] -right-[15%] h-[48vh] w-[48vh] rounded-full bg-[radial-gradient(circle,rgba(161,140,255,0.22),transparent_68%)] blur-3xl ${reduce ? '' : 'animate-blob-slow'}`}
      />
      <div
        className={`absolute bottom-[-10%] left-[30%] h-[42vh] w-[50vh] rounded-full bg-[radial-gradient(circle,rgba(125,180,255,0.18),transparent_70%)] blur-3xl ${reduce ? '' : 'animate-blob'}`}
      />
      {!reduce ? (
        <motion.div
          className="absolute top-[40%] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(109,94,249,0.12),transparent_70%)] blur-2xl"
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : null}
      <div className="noise-overlay" />
    </div>
  )
}
