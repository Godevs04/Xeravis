'use client'

import { useEffect } from 'react'

import { Container } from '@/components/layout/Container'
import { ErrorState } from '@/components/ui/error-state'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
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
