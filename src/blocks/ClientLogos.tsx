import Image from 'next/image'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { safePayload } from '@/lib/cms'
import { getMediaAlt, getMediaUrl } from '@/lib/media'

type ClientDoc = {
  id: string
  name: string
  logo: unknown
  url?: string | null
}

type ClientLogosProps = {
  heading: string
}

export async function ClientLogos({ heading }: ClientLogosProps) {
  const result = await safePayload((payload) =>
    payload.find({
      collection: 'clients',
      where: { featured: { equals: true } },
      limit: 8,
      depth: 1,
    }),
  )

  const clients = (result?.docs as ClientDoc[]) ?? []

  return (
    <Section>
      <Container>
        <AnimateIn>
          <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted">{heading}</h2>
        </AnimateIn>
        {clients.length === 0 ? (
          <p className="mt-8 text-center text-secondary">Client logos will appear here once published.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {clients.map((client, index) => {
              const logoUrl = getMediaUrl(client.logo as Parameters<typeof getMediaUrl>[0])
              if (!logoUrl) return null
              const img = (
                <Image
                  src={logoUrl}
                  alt={getMediaAlt(client.logo as Parameters<typeof getMediaAlt>[0], client.name)}
                  width={160}
                  height={48}
                  className="mx-auto h-10 w-auto object-contain opacity-60 grayscale transition-opacity hover:opacity-100"
                />
              )
              return (
                <AnimateIn key={client.id} delay={index * 0.03} className="flex justify-center">
                  {client.url ? (
                    <a href={client.url} target="_blank" rel="noopener noreferrer">
                      {img}
                    </a>
                  ) : (
                    img
                  )}
                </AnimateIn>
              )
            })}
          </div>
        )}
      </Container>
    </Section>
  )
}
