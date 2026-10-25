'use client'

import { Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useId, useMemo, useState, useTransition } from 'react'

import { JobCard } from '@/components/domain/JobCard'
import { Input } from '@/components/ui/input'

export type BoardJob = {
  id: string
  title: string
  slug: string
  department: string
  location: string
  type: string
  workMode?: string | null
  experienceRequired?: string | null
  openings?: number | null
  postedAt?: string | null
  applicationDeadline?: string | null
}

const FILTERS = [
  { key: 'department', label: 'Department' },
  { key: 'location', label: 'Location' },
  { key: 'workMode', label: 'Work mode' },
  { key: 'type', label: 'Type' },
] as const

type FilterKey = (typeof FILTERS)[number]['key']

function humanize(value: string) {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function options(jobs: BoardJob[], key: FilterKey) {
  return Array.from(new Set(jobs.map((job) => job[key]).filter(Boolean) as string[])).sort()
}

export function CareersBoard({ jobs }: { jobs: BoardJob[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [, startTransition] = useTransition()
  const searchId = useId()
  const [query, setQuery] = useState(params.get('q') || '')

  const active = useMemo(() => {
    const out: Partial<Record<FilterKey, string>> = {}
    for (const { key } of FILTERS) {
      const value = params.get(key)
      if (value) out[key] = value
    }
    return out
  }, [params])

  function update(next: Partial<Record<FilterKey | 'q', string>>) {
    const search = new URLSearchParams(params.toString())
    for (const [key, value] of Object.entries(next)) {
      if (value) search.set(key, value)
      else search.delete(key)
    }
    const qs = search.toString()
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ''}#open-roles`, { scroll: false })
    })
  }

  const needle = query.trim().toLowerCase()
  const filtered = jobs.filter((job) => {
    for (const { key } of FILTERS) {
      if (active[key] && job[key] !== active[key]) return false
    }
    if (!needle) return true
    return [job.title, job.department, job.location].join(' ').toLowerCase().includes(needle)
  })
  const hasFilters = Boolean(needle) || Object.keys(active).length > 0

  return (
    <div>
      <div className="mb-6 grid gap-3 md:grid-cols-[1.5fr_repeat(4,1fr)]">
        <div className="relative">
          <label htmlFor={searchId} className="sr-only">
            Search roles
          </label>
          <Search
            className="text-muted pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            id={searchId}
            type="search"
            placeholder="Search roles"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              update({ q: e.target.value.trim() })
            }}
            className="pl-9"
          />
        </div>
        {FILTERS.map(({ key, label }) => {
          const values = options(jobs, key)
          if (values.length < 2) return <div key={key} className="hidden md:block" />
          return (
            <select
              key={key}
              aria-label={label}
              value={active[key] || ''}
              onChange={(e) => update({ [key]: e.target.value })}
              className="border-border bg-background text-primary focus-visible:ring-accent h-[var(--touch-min)] w-full rounded-xl border px-3 text-sm outline-none focus-visible:ring-2"
            >
              <option value="">All {label.toLowerCase()}s</option>
              {values.map((value) => (
                <option key={value} value={value}>
                  {humanize(value)}
                </option>
              ))}
            </select>
          )
        })}
      </div>

      <div className="text-muted mb-4 flex items-center justify-between text-sm" role="status">
        <span>
          {filtered.length} {filtered.length === 1 ? 'role' : 'roles'}
        </span>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              update({ q: '', department: '', location: '', workMode: '', type: '' })
            }}
            className="text-accent inline-flex items-center gap-1 font-semibold hover:underline"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Clear filters
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="text-secondary rounded-[24px] border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] p-8 text-center">
          No roles match these filters. Try clearing them, or sign up for job alerts below.
        </p>
      ) : (
        <JobList jobs={filtered} />
      )}
    </div>
  )
}

/** Plain list, also used as the server-rendered fallback before filters hydrate. */
export function JobList({ jobs }: { jobs: BoardJob[] }) {
  return (
    <div className="grid gap-3">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          title={job.title}
          department={job.department}
          location={job.location}
          type={job.type}
          workMode={job.workMode}
          experienceRequired={job.experienceRequired}
          openings={job.openings}
          postedAt={job.postedAt}
          applicationDeadline={job.applicationDeadline}
          href={`/careers/${job.slug}`}
        />
      ))}
    </div>
  )
}
