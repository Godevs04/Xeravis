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
    columns === 2 ? 'sm:grid-cols-2' : columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'

  return (
    <dl className={cn('grid grid-cols-1 gap-8', colClass, className)}>
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className="border-l border-border pl-5">
          <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{item.label}</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {item.value}
            {item.suffix ? <span className="text-accent">{item.suffix}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  )
}
