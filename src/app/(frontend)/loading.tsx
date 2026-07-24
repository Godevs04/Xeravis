import { Container } from '@/components/layout/Container'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="pt-24 lg:pt-28" aria-busy="true" aria-live="polite">
      <Container className="space-y-8 py-12 md:py-16">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full max-w-2xl" />
        <SkeletonText lines={3} className="max-w-xl" />
        <div className="grid gap-6 pt-8 md:grid-cols-3">
          <Skeleton className="h-40 w-full rounded-[var(--radius-card)]" />
          <Skeleton className="h-40 w-full rounded-[var(--radius-card)]" />
          <Skeleton className="h-40 w-full rounded-[var(--radius-card)]" />
        </div>
      </Container>
    </div>
  )
}
