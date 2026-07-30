'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

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
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.03 * i, duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  }),
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
  const greeting = userName ? `Good to see you, ${userName}` : 'Today'

  return (
    <div className="xe-dash xe-dash--v3 xe-dash--tight">
      <header className="xe-dash__top">
        <div>
          <p className="xe-dash__eyebrow">Today</p>
          <h1 className="xe-dash__title">{greeting}</h1>
          <p className="xe-dash__subtitle">{summary}</p>
        </div>
        <div className="xe-dash__actions">
          {quickActions.map((item) => (
            <Link key={item.href} href={item.href} className="xe-dash__chip">
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      <section className="xe-dash-section xe-dash-section--first" aria-label="Needs attention">
        <div className="xe-dash-section__head">
          <h2>Needs attention</h2>
        </div>
        <div className="xe-tasks">
          {tasks.length === 0 ? (
            <div className="xe-empty xe-empty--inline">Nothing urgent. You&apos;re clear.</div>
          ) : (
            tasks.map((task, i) => (
              <motion.a
                key={task.id}
                href={task.href}
                className={`xe-task xe-task--${task.tone || 'default'}`}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
              >
                <strong>{task.title}</strong>
                <span>{task.meta}</span>
              </motion.a>
            ))
          )}
        </div>
      </section>

      <section className="xe-analytics xe-analytics--tight" aria-label="Key metrics">
        <div className="xe-stats xe-stats--four">
          {stats.map((stat, index) => (
            <motion.a
              key={stat.label}
              href={stat.href}
              className="xe-stat xe-stat--clean"
              custom={index}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <div className="xe-stat__label">{stat.label}</div>
              <div className="xe-stat__value">{stat.value.toLocaleString()}</div>
              <div className="xe-stat__meta">{stat.meta}</div>
            </motion.a>
          ))}
        </div>
      </section>

      <div className="xe-panels xe-panels--3">
        <div className="xe-panel">
          <div className="xe-panel__head">
            <h3 className="xe-panel__title">Leads</h3>
            <Link className="xe-panel__link" href="/admin/workspace/crm">
              CRM
            </Link>
          </div>
          <div className="xe-panel__body">
            {messages.length === 0 ? (
              <div className="xe-empty">No new leads.</div>
            ) : (
              messages.map((row) => (
                <Link key={row.id} href={row.href} className="xe-row">
                  <span className="xe-row__main">
                    <span className="xe-row__title">{row.title}</span>
                    <span className="xe-row__sub">{row.subtitle}</span>
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="xe-panel">
          <div className="xe-panel__head">
            <h3 className="xe-panel__title">Applications</h3>
            <Link className="xe-panel__link" href="/admin/workspace/recruitment">
              Hiring
            </Link>
          </div>
          <div className="xe-panel__body">
            {applications.length === 0 ? (
              <div className="xe-empty">No applications.</div>
            ) : (
              applications.map((row) => (
                <Link key={row.id} href={row.href} className="xe-row">
                  <span className="xe-row__main">
                    <span className="xe-row__title">{row.title}</span>
                    <span className="xe-row__sub">{row.subtitle}</span>
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="xe-panel">
          <div className="xe-panel__head">
            <h3 className="xe-panel__title">Activity</h3>
            <Link className="xe-panel__link" href="/admin/workspace/activity">
              All
            </Link>
          </div>
          <div className="xe-panel__body">
            {activity.length === 0 ? (
              <div className="xe-empty">No recent activity.</div>
            ) : (
              activity.slice(0, 5).map((row) => (
                <Link key={row.id} href={row.href} className="xe-row">
                  <span className="xe-row__main">
                    <span className="xe-row__title">{row.title}</span>
                    <span className="xe-row__sub">{row.subtitle}</span>
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardShell
