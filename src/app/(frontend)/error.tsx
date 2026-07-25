'use client'

import { useEffect } from 'react'

import { Container } from '@/components/layout/Container'
import { ErrorState } from '@/components/ui/error-state'
import { logger } from '@/lib/logger'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

const log = logger.child('frontend')

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    log.error(error)
  }, [error])

  return (
    <div className="pt-24 lg:pt-28">
      <Container className="py-16">
        <ErrorState
          title="This page failed to load"
          description={error.message || 'An unexpected error occurred. Please try again.'}
          onRetry={reset}
        />
      </Container>
    </div>
  )
}
