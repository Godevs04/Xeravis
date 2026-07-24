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
            <h2 className="font-display text-[length:var(--text-h2)] font-bold tracking-tight">
              {heading}
            </h2>
            <p className="text-secondary mt-4 max-w-2xl text-lg">
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
          <p className="text-accent mb-3 text-sm font-semibold tracking-[0.16em] uppercase">
            Trust
          </p>
          <h2 className="font-display text-[length:var(--text-h2)] font-bold tracking-tight">
            {heading}
          </h2>
        </AnimateIn>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => {
            const logoUrl = getMediaUrl(item.logo as Parameters<typeof getMediaUrl>[0])
            return (
              <AnimateIn key={item.id} delay={index * 0.06}>
                <figure className="flex h-full flex-col rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-7 shadow-[var(--shadow-medium)] backdrop-blur-xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-hover)]">
                  <blockquote className="text-secondary flex-1 text-[15px] leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <figcaption className="border-border mt-8 border-t pt-5">
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt=""
                        width={96}
                        height={32}
                        className="mb-4 h-7 w-auto object-contain opacity-70"
                      />
                    ) : null}
                    <p className="text-primary font-semibold">{item.authorName}</p>
                    <p className="text-muted mt-1 text-sm">
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
