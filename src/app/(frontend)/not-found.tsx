import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Page not found',
  description: 'The page you requested could not be found.',
  noIndex: true,
})

export default function NotFound() {
  return (
    <section className="py-24 lg:py-32">
      <Container className="max-w-xl text-center">
        <p className="text-muted text-sm font-semibold tracking-[0.2em] uppercase">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="text-secondary mt-4">
          The page you are looking for may have moved or no longer exists.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild variant="accent">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}
