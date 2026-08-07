'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export type DashStat = {
  label: string
  value: number
  meta: string
  href: string
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

type Props = {
  userName?: string
  summary: string
  stats: DashStat[]
  tasks: DashTask[]
  activity: DashRow[]
  messages: DashRow[]
  applications: DashRow[]
  quickActions: { label: string; href: string }[]
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
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

const ACTION_META: Record<string, { icon: string; hint: string }> = {
  'New blog': { icon: '✦', hint: 'Publish insight' },
  'New job': { icon: '▣', hint: 'Open a role' },
  Leads: { icon: '◎', hint: 'CRM pipeline' },
  Upload: { icon: '↑', hint: 'Media studio' },
}

export const DashboardShell = ({
  userName,
  summary,
  stats,
  tasks,
  activity,
  messages,
  applications,
  quickActions,
}: Props) => {
  const greeting = userName ? `Welcome back, ${userName}` : 'Welcome back'
  const hour = new Date().getHours()
  const daypart = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening'

  return (
    <div className="xe-dash xe-dash--os">
      {/* Hero */}
      <motion.header
        className="xe-os-hero"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
          <Link href="/admin/collections/blogs" className="xe-os-hero__ai">
            <span className="xe-os-hero__ai-icon" aria-hidden>
              ✶
            </span>
            <span>
              <strong>AI Assistant</strong>
              <em>Draft, SEO, summarize</em>
            </span>
          </Link>
          <Link href="/admin/collections/activity-logs" className="xe-os-hero__link">
            Activity feed →
          </Link>
        </div>
      </motion.header>

      {/* Quick actions */}
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

      {/* KPI strip */}
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
              <span className="xe-os-kpi__chevron" aria-hidden>
                ↗
              </span>
            </div>
            <div className="xe-os-kpi__value">
              <AnimatedValue value={stat.value} />
            </div>
            <div className="xe-os-kpi__meta">{stat.meta}</div>
            <div className="xe-os-kpi__bar" aria-hidden>
              <span style={{ width: `${Math.min(92, 28 + (stat.value % 60))}%` }} />
            </div>
          </motion.a>
        ))}
      </section>

      {/* Attention + timeline row */}
      <div className="xe-os-main">
        <section className="xe-os-card xe-os-card--attention" aria-label="Needs attention">
          <div className="xe-os-card__head">
            <div>
              <h2>Needs attention</h2>
              <p>Prioritized work for today</p>
            </div>
            <span className="xe-os-card__count">{tasks.length}</span>
          </div>
          <div className="xe-os-tasks">
            {tasks.length === 0 ? (
              <div className="xe-os-empty">
                <strong>All clear</strong>
                <span>Nothing urgent — pick a workspace and ship.</span>
              </div>
            ) : (
              tasks.map((task, i) => (
                <motion.a
                  key={task.id}
                  href={task.href}
                  className={`xe-os-task xe-os-task--${task.tone || 'default'}`}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                >
                  <span className="xe-os-task__dot" aria-hidden />
                  <span className="xe-os-task__body">
                    <strong>{task.title}</strong>
                    <em>{task.meta}</em>
                  </span>
                  <span className="xe-os-task__go" aria-hidden>
                    →
                  </span>
                </motion.a>
              ))
            )}
          </div>
        </section>

        <section className="xe-os-card xe-os-card--timeline" aria-label="Recent activity">
          <div className="xe-os-card__head">
            <div>
              <h2>Live activity</h2>
              <p>Recent system events</p>
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
      </div>

      {/* Pipeline panels */}
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
    </div>
  )
}

export default DashboardShell
