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
  badgeTone?: 'default' | 'open'
}

type Props = {
  userName?: string
  stats: DashStat[]
  blogs: DashRow[]
  services: DashRow[]
  careers: DashRow[]
  messages: DashRow[]
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
}

function StatCard({ stat, index }: { stat: DashStat; index: number }) {
  return (
    <motion.a
      href={stat.href}
      className="xe-stat"
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div className="xe-stat__glow" />
      <div className="xe-stat__label">{stat.label}</div>
      <div className="xe-stat__value">{stat.value.toLocaleString()}</div>
      <div className="xe-stat__meta xe-stat__meta--up">{stat.meta}</div>
    </motion.a>
  )
}

function Panel({
  title,
  href,
  rows,
  empty,
}: {
  title: string
  href: string
  rows: DashRow[]
  empty: string
}) {
  return (
    <div className="xe-panel">
      <div className="xe-panel__head">
        <h3 className="xe-panel__title">{title}</h3>
        <Link className="xe-panel__link" href={href}>
          View all
        </Link>
      </div>
      <div className="xe-panel__body">
        {rows.length === 0 ? (
          <div className="xe-empty">{empty}</div>
        ) : (
          rows.map((row) => (
            <Link key={row.id} href={row.href} className="xe-row">
              <span className="xe-row__icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="xe-row__main">
                <span className="xe-row__title">{row.title}</span>
                <span className="xe-row__sub">{row.subtitle}</span>
              </span>
              {row.badge ? (
                <span
                  className={`xe-row__badge${row.badgeTone === 'open' ? 'xe-row__badge--open' : ''}`}
                >
                  {row.badge}
                </span>
              ) : null}
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export const DashboardShell = ({ userName, stats, blogs, services, careers, messages }: Props) => {
  const greeting = userName ? `Welcome back, ${userName}` : 'Command center'

  return (
    <div className="xe-dash">
      <motion.section
        className="xe-dash__hero"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <div className="xe-dash__eyebrow">Xelarvis · Operations</div>
          <h1 className="xe-dash__title">{greeting}</h1>
          <p className="xe-dash__subtitle">
            Monitor content, careers, and inbound demand from one enterprise workspace.
          </p>
        </div>
        <Link className="xe-dash__cta" href="/admin/collections/blogs/create">
          New blog post
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.section>

      <section className="xe-analytics" aria-label="Analytics overview">
        <div className="xe-analytics__head">
          <h2 className="xe-analytics__title">Analytics</h2>
          <p className="xe-analytics__hint">Live snapshot across content and demand</p>
        </div>
        <div className="xe-stats">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </section>

      <div className="xe-shortcuts">
        {[
          { label: 'Pages', hint: 'Manage site structure', href: '/admin/collections/pages' },
          { label: 'Media library', hint: 'Assets & folders', href: '/admin/collections/media' },
          {
            label: 'Messages',
            hint: 'Inbound contact queue',
            href: '/admin/collections/contact-messages',
          },
          {
            label: 'Site settings',
            hint: 'Brand & SEO defaults',
            href: '/admin/globals/site-settings',
          },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="xe-shortcut">
            <span className="xe-shortcut__label">{item.label}</span>
            <span className="xe-shortcut__hint">{item.hint}</span>
          </Link>
        ))}
      </div>

      <div className="xe-panels">
        <Panel
          title="Latest blogs"
          href="/admin/collections/blogs"
          rows={blogs}
          empty="No blog posts yet. Create your first article."
        />
        <Panel
          title="Services"
          href="/admin/collections/services"
          rows={services}
          empty="No services published yet."
        />
      </div>

      <div className="xe-panels">
        <Panel
          title="Open careers"
          href="/admin/collections/careers"
          rows={careers}
          empty="No open roles right now."
        />
        <Panel
          title="Recent messages"
          href="/admin/collections/contact-messages"
          rows={messages}
          empty="Inbox is clear."
        />
      </div>
    </div>
  )
}

export default DashboardShell
