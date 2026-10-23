import { cn } from '@/lib/utils'

export type StatItem = {
  label: string
  value: string
  suffix?: string | null
}

type StatsProps = {
  items: StatItem[]
  className?: string
  columns?: 2 | 3 | 4
}

export function Stats({ items, className, columns = 4 }: StatsProps) {
  if (!items.length) return null

  const colClass =
    columns === 2
      ? 'sm:grid-cols-2'
      : columns === 3
        ? 'sm:grid-cols-3'
        : 'sm:grid-cols-2 lg:grid-cols-4'

  return (
    <dl className={cn('grid grid-cols-1 gap-8', colClass, className)}>
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className="border-border border-l pl-5">
          <dt className="text-muted text-xs font-medium tracking-[0.12em] uppercase">
            {item.label}
          </dt>
          <dd className="text-primary mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {item.value}
            {item.suffix ? <span className="text-accent">{item.suffix}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  )
}
