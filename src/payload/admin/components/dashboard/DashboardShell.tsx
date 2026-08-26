'use client'

import { ContentShell } from '@/payload/admin/components/layout/ContentShell'
import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'

export type DashStat = {
  label: string
  value: number
  meta: string
  href: string
  tone?: 'up' | 'down' | 'flat'
  icon?: string
}

export type DashRow = {
  id: string
  title: string
  subtitle: string
  href: string
  badge?: string
  badgeTone?: 'default' | 'open' | 'warn'
}

export type DashTask = {
  id: string
  title: string
  meta: string
  href: string
  tone?: 'default' | 'warn' | 'accent'
}

export type TrafficPoint = { date: string; label: string; views: number }
export type TopPage = { path: string; views: number }
export type SystemStatus = { id: string; label: string; status: 'operational' | 'degraded' }

type Props = {
  userName?: string
  summary: string
  dateRangeLabel: string
  stats: DashStat[]
  traffic: TrafficPoint[]
  topPages: TopPage[]
  activity: DashRow[]
  systemStatus: SystemStatus[]
  tasks: DashTask[]
  messages: DashRow[]
  applications: DashRow[]
  quickActions: { label: string; href: string }[]
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 * i, duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  }),
}

function AnimatedValue({ value }: { value: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const duration = 900
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(value * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])
  return <>{n.toLocaleString()}</>
}

function TrafficChart({ series }: { series: TrafficPoint[] }) {
  const { path, max } = useMemo(() => {
    const maxViews = Math.max(1, ...series.map((p) => p.views))
    const w = 640
    const h = 180
    const pad = 8
    if (series.length === 0) return { path: '', max: 1 }
    const coords = series.map((p, i) => {
      const x = pad + (i / Math.max(series.length - 1, 1)) * (w - pad * 2)
      const y = h - pad - (p.views / maxViews) * (h - pad * 2)
      return `${x},${y}`
    })
    return { path: `M ${coords.join(' L ')}`, max: maxViews }
  }, [series])

  if (series.length === 0) {
    return (
      <div className="xe-os-chart xe-os-chart--empty">
        <p>No pageviews in this period yet. Browse the public site to start collecting.</p>
      </div>
    )
  }

  return (
    <div className="xe-os-chart" aria-label={`Traffic chart, peak ${max} views`}>
      <svg viewBox="0 0 640 180" preserveAspectRatio="none" className="xe-os-chart__svg">
        <defs>
          <linearGradient id="xeTrafficFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(14,165,164,0.28)" />
            <stop offset="100%" stopColor="rgba(14,165,164,0)" />
          </linearGradient>
        </defs>
        <path d={`${path} L 632,172 L 8,172 Z`} fill="url(#xeTrafficFill)" stroke="none" />
        <path d={path} fill="none" stroke="#0ea5a4" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <div className="xe-os-chart__axis">
        <span>{series[0]?.label}</span>
        <span>{series[Math.floor(series.length / 2)]?.label}</span>
        <span>{series[series.length - 1]?.label}</span>
      </div>
    </div>
  )
}

const ACTION_META: Record<string, { icon: string; hint: string }> = {
  'New blog': { icon: '✦', hint: 'Publish insight' },
  'New job': { icon: '▣', hint: 'Open a role' },
  Leads: { icon: '◎', hint: 'CRM pipeline' },
  Upload: { icon: '↑', hint: 'Media studio' },
}

export const DashboardShell = ({
  userName,
  summary,
  dateRangeLabel,
  stats,
  traffic,
  topPages,
  activity,
  systemStatus,
  tasks,
  messages,
  applications,
  quickActions,
}: Props) => {
  const greeting = userName ? `Welcome back, ${userName}` : 'Welcome back'
  const hour = new Date().getHours()
  const daypart = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening'

  return (
    <ContentShell className="xe-dash xe-dash--os xe-dash--collage">
      <motion.header
        className="xe-os-hero xe-page__header"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="xe-os-hero__copy">
          <p className="xe-os-hero__eyebrow">
            <span className="xe-os-hero__pulse" aria-hidden />
            {daypart} · Command Center
          </p>
          <h1 className="xe-os-hero__title">{greeting}</h1>
          <p className="xe-os-hero__subtitle">{summary}</p>
        </div>
        <div className="xe-os-hero__aside">
          <div className="xe-os-hero__range" aria-label="Reporting period">
            <span>{dateRangeLabel}</span>
          </div>
          <Link href="/admin/workspace/ai" className="xe-os-hero__ai">
            <span className="xe-os-hero__ai-icon" aria-hidden>
              ✶
            </span>
            <span>
              <strong>AI Assistant</strong>
              <em>Draft, SEO, summarize</em>
            </span>
          </Link>
        </div>
      </motion.header>

      <section className="xe-os-actions" aria-label="Quick actions">
        {quickActions.map((item, i) => {
          const meta = ACTION_META[item.label] || { icon: '→', hint: 'Open' }
          return (
            <motion.a
              key={item.href}
              href={item.href}
              className="xe-os-action"
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <span className="xe-os-action__icon" aria-hidden>
                {meta.icon}
              </span>
              <span className="xe-os-action__label">{item.label}</span>
              <span className="xe-os-action__hint">{meta.hint}</span>
            </motion.a>
          )
        })}
      </section>

      <section className="xe-os-kpis" aria-label="Key metrics">
        {stats.map((stat, index) => (
          <motion.a
            key={stat.label}
            href={stat.href}
            className={`xe-os-kpi xe-os-kpi--${index}`}
            custom={index}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div className="xe-os-kpi__top">
              <span className="xe-os-kpi__label">{stat.label}</span>
              <span className="xe-os-kpi__icon" aria-hidden>
                {stat.icon || '↗'}
              </span>
            </div>
            <div className="xe-os-kpi__value">
              <AnimatedValue value={stat.value} />
            </div>
            <div className={`xe-os-kpi__meta xe-os-kpi__meta--${stat.tone || 'flat'}`}>
              {stat.meta}
            </div>
          </motion.a>
        ))}
      </section>

      <div className="xe-os-collage-main">
        <section className="xe-os-card xe-os-card--chart" aria-label="Traffic overview">
          <div className="xe-os-card__head">
            <div>
              <h2>Traffic Overview</h2>
              <p>First-party pageviews · last 30 days</p>
            </div>
            <Link className="xe-os-card__link" href="/admin/workspace/analytics">
              Analytics →
            </Link>
          </div>
          <TrafficChart series={traffic} />
        </section>

        <section className="xe-os-card xe-os-card--pages" aria-label="Top pages">
          <div className="xe-os-card__head">
            <div>
              <h2>Top Pages</h2>
              <p>Most viewed paths</p>
            </div>
          </div>
          {topPages.length === 0 ? (
            <div className="xe-os-empty">No pageviews yet.</div>
          ) : (
            <ul className="xe-os-top-pages">
              {topPages.map((page) => (
                <li key={page.path}>
                  <span className="xe-os-top-pages__path" title={page.path}>
                    {page.path}
                  </span>
                  <span className="xe-os-top-pages__views">{page.views.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="xe-os-collage-secondary">
        <section className="xe-os-card xe-os-card--timeline" aria-label="Recent activity">
          <div className="xe-os-card__head">
            <div>
              <h2>Recent Activity</h2>
              <p>Live CMS events</p>
            </div>
            <Link className="xe-os-card__link" href="/admin/collections/activity-logs">
              View all
            </Link>
          </div>
          <ol className="xe-os-timeline">
            {activity.length === 0 ? (
              <li className="xe-os-empty">No recent activity.</li>
            ) : (
              activity.slice(0, 6).map((row, i) => (
                <li key={row.id}>
                  <Link href={row.href} className="xe-os-timeline__item">
                    <span
                      className={`xe-os-timeline__rail${i === 0 ? 'is-live' : ''}`}
                      aria-hidden
                    />
                    <span className="xe-os-timeline__copy">
                      <strong>{row.title}</strong>
                      <em>{row.subtitle}</em>
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ol>
        </section>

        <section className="xe-os-card xe-os-card--status" aria-label="System status">
          <div className="xe-os-card__head">
            <div>
              <h2>System Status</h2>
              <p>Platform health</p>
            </div>
          </div>
          <ul className="xe-os-status">
            {systemStatus.map((item) => (
              <li key={item.id} className={`xe-os-status__item is-${item.status}`}>
                <span className="xe-os-status__dot" aria-hidden />
                <span className="xe-os-status__label">{item.label}</span>
                <span className="xe-os-status__pill">
                  {item.status === 'operational' ? 'Operational' : 'Degraded'}
                </span>
              </li>
            ))}
          </ul>
          {tasks.length > 0 ? (
            <div className="xe-os-status__tasks">
              <p className="xe-os-status__tasks-label">Needs attention</p>
              {tasks.slice(0, 3).map((task) => (
                <Link key={task.id} href={task.href} className="xe-os-status__task">
                  {task.title}
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <div className="xe-os-panels">
        <section className="xe-os-card xe-os-card--panel">
          <div className="xe-os-card__head">
            <div>
              <h2>Sales · Leads</h2>
              <p>New inquiries in CRM</p>
            </div>
            <Link className="xe-os-card__link" href="/admin/collections/contact-messages">
              Open CRM
            </Link>
          </div>
          <div className="xe-os-list">
            {messages.length === 0 ? (
              <div className="xe-os-empty">No new leads.</div>
            ) : (
              messages.map((row) => (
                <Link key={row.id} href={row.href} className="xe-os-row">
                  <span className="xe-os-row__avatar" aria-hidden>
                    {row.title.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="xe-os-row__main">
                    <strong>{row.title}</strong>
                    <em>{row.subtitle}</em>
                  </span>
                  <span className="xe-os-badge">New</span>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="xe-os-card xe-os-card--panel">
          <div className="xe-os-card__head">
            <div>
              <h2>Recruitment</h2>
              <p>Latest applications</p>
            </div>
            <Link className="xe-os-card__link" href="/admin/collections/job-applications">
              Hiring
            </Link>
          </div>
          <div className="xe-os-list">
            {applications.length === 0 ? (
              <div className="xe-os-empty">No applications.</div>
            ) : (
              applications.map((row) => (
                <Link key={row.id} href={row.href} className="xe-os-row">
                  <span className="xe-os-row__avatar xe-os-row__avatar--teal" aria-hidden>
                    {row.title.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="xe-os-row__main">
                    <strong>{row.title}</strong>
                    <em>{row.subtitle}</em>
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </ContentShell>
  )
}

export default DashboardShell
