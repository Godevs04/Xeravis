'use client'

import { motion, useReducedMotion } from 'framer-motion'

/** Soft ambient lighting + noise behind the whole product experience */
export function AmbientBackground() {
  const reduce = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-mesh absolute inset-0" />
      <div
        className={`absolute top-[-18%] -left-[18%] h-[62vh] w-[62vh] rounded-full bg-[radial-gradient(circle,rgba(109,94,249,0.42),transparent_68%)] blur-3xl ${reduce ? '' : 'animate-blob'}`}
      />
      <div
        className={`absolute top-[8%] -right-[16%] h-[58vh] w-[58vh] rounded-full bg-[radial-gradient(circle,rgba(161,140,255,0.34),transparent_68%)] blur-3xl ${reduce ? '' : 'animate-blob-slow'}`}
      />
      <div
        className={`absolute bottom-[-14%] left-[18%] h-[50vh] w-[58vh] rounded-full bg-[radial-gradient(circle,rgba(125,180,255,0.26),transparent_70%)] blur-3xl ${reduce ? '' : 'animate-blob'}`}
      />
      {!reduce ? (
        <>
          <motion.div
            className="absolute top-[36%] left-[42%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(109,94,249,0.18),transparent_70%)] blur-2xl"
            animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.12, 1], x: [0, 24, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              className="bg-accent/40 absolute h-1 w-1 rounded-full"
              style={{
                left: `${8 + ((i * 17) % 84)}%`,
                top: `${12 + ((i * 23) % 76)}%`,
              }}
              animate={{ opacity: [0.15, 0.7, 0.15], y: [0, -18, 0] }}
              transition={{
                duration: 5 + (i % 5),
                delay: i * 0.35,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      ) : null}
      <div className="noise-overlay" />
    </div>
  )
}
