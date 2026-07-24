'use client'

import Link from 'next/link'
import React from 'react'

/** Account + logout for Payload admin sidebar */
export const AdminAccountBar = () => {
  return (
    <div className="xe-account-bar">
      <div className="xe-account-bar__title">Session</div>
      <Link className="xe-account-bar__link" href="/admin/account">
        <span className="xe-account-bar__icon" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M5 19.5c1.8-3.2 4.2-4.8 7-4.8s5.2 1.6 7 4.8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
        Account
      </Link>
      <Link className="xe-account-bar__link xe-account-bar__link--logout" href="/admin/logout">
        <span className="xe-account-bar__icon" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M15 12H3m0 0 3-3m-3 3 3 3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        Log out
      </Link>
      <a
        className="xe-account-bar__link xe-account-bar__link--site"
        href="/"
        target="_blank"
        rel="noreferrer"
      >
        <span className="xe-account-bar__icon" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 5h5v5M19 5l-8 8M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        View website
      </a>
    </div>
  )
}

export default AdminAccountBar
