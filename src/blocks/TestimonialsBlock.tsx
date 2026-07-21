import Image from 'next/image'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { safePayload } from '@/lib/cms'
import { getMediaUrl } from '@/lib/media'

type TestimonialDoc = {
  id: string
  quote: string
  authorName: string
  authorRole?: string | null
  company?: string | null
  logo?: unknown
}

type TestimonialsBlockProps = {
  heading: string
}

export async function TestimonialsBlock({ heading }: TestimonialsBlockProps) {
  const result = await safePayload((payload) =>
    payload.find({
      collection: 'testimonials',
      where: { featured: { equals: true } },
      limit: 3,
      depth: 1,
    }),
  )

  const testimonials = (result?.docs as TestimonialDoc[]) ?? []

  if (!testimonials.length) {
    return (
      <Section>
        <Container>
          <AnimateIn>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
            <p className="mt-4 max-w-2xl text-lg text-secondary">
              Client testimonials will appear here once published in the CMS.
            </p>
          </AnimateIn>
        </Container>
      </Section>
    )
  }

  return (
    <Section>
      <Container>
        <AnimateIn className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
        </AnimateIn>
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {testimonials.map((item, index) => {
            const logoUrl = getMediaUrl(item.logo as Parameters<typeof getMediaUrl>[0])
            return (
              <AnimateIn key={item.id} delay={index * 0.05}>
                <figure className="flex h-full flex-col border-l-2 border-accent pl-6">
                  <blockquote className="flex-1 text-base leading-relaxed text-secondary">&ldquo;{item.quote}&rdquo;</blockquote>
                  <figcaption className="mt-6">
                    {logoUrl && (
                      <Image src={logoUrl} alt="" width={96} height={32} className="mb-4 h-8 w-auto object-contain opacity-70" />
                    )}
                    <p className="font-semibold text-primary">{item.authorName}</p>
                    <p className="text-sm text-muted">
                      {[item.authorRole, item.company].filter(Boolean).join(' · ')}
                    </p>
                  </figcaption>
                </figure>
              </AnimateIn>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
