'use client'

import Link from 'next/link'

import { MeshBackdrop } from '@/components/marketing/MeshBackdrop'
import { OrbitDiagram, type OrbitNode } from '@/components/marketing/OrbitDiagram'
import { Container } from '@/components/layout/Container'

type StoryTechOrbitProps = {
  eyebrow?: string | null
  heading: string
  subheading?: string | null
  nodes: OrbitNode[]
}

export function StoryTechOrbit({
  eyebrow = 'Technology',
  heading,
  subheading,
  nodes,
}: StoryTechOrbitProps) {
  return (
    <MeshBackdrop className="py-24 lg:py-32" interactive={false}>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-teal-300 uppercase">
              {eyebrow}
            </p>
            <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.4rem)] font-bold tracking-[-0.04em] text-balance text-white">
              {heading}
            </h2>
            {subheading ? (
              <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300">{subheading}</p>
            ) : null}
            <Link
              href="/technologies"
              className="mt-8 inline-flex text-sm font-semibold text-cyan-300 underline-offset-4 hover:underline"
            >
              Full technology map →
            </Link>
          </div>
          <OrbitDiagram nodes={nodes} />
        </div>
      </Container>
    </MeshBackdrop>
  )
}
