import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PaginationProps = {
  page: number
  totalPages: number
  hrefForPage: (page: number) => string
  className?: string
}

export function Pagination({ page, totalPages, hrefForPage, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const prev = page > 1 ? page - 1 : null
  const next = page < totalPages ? page + 1 : null

  return (
    <nav className={cn('flex items-center justify-between gap-4', className)} aria-label="Pagination">
      {prev ? (
        <Button asChild variant="outline" size="sm">
          <Link href={hrefForPage(prev)} rel="prev">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      )}
      <p className="text-sm text-secondary">
        Page <span className="font-medium text-primary">{page}</span> of {totalPages}
      </p>
      {next ? (
        <Button asChild variant="outline" size="sm">
          <Link href={hrefForPage(next)} rel="next">
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  )
}
