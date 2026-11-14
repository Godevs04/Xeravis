import { Resend } from 'resend'
import nodemailer from 'nodemailer'

import { createLogger } from '@/lib/logger'

const log = createLogger({ scope: 'email' })

export type SendEmailInput = {
  to?: string | string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
  headers?: Record<string, string>
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

function resolveFrom() {
  return (
    process.env.SMTP_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    process.env.EMAIL_FROM ||
    (process.env.SMTP_USER ? `Xelarvis <${process.env.SMTP_USER}>` : undefined) ||
    'Xelarvis <noreply@xelarvis.in>'
  )
}

function resolveTo(explicit?: string | string[]) {
  if (explicit) return explicit
  const fallback = process.env.CONTACT_NOTIFY_EMAIL || process.env.EMAIL_TO || process.env.SMTP_USER
  return fallback || undefined
}

async function sendViaSmtp(input: SendEmailInput & { to: string | string[]; from: string }) {
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = port === 465
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '')

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass,
    },
  })

  await transporter.sendMail({
    from: input.from,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
    html: input.html,
    headers: input.headers,
  })
}

async function sendViaResend(input: SendEmailInput & { to: string | string[]; from: string }) {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  const resend = new Resend(key)
  const { error } = await resend.emails.send({
    from: input.from,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
    html: input.html,
    headers: input.headers,
  })
  if (error) throw new Error(`Resend: ${error.message}`)
}

export type EmailFailureReason = 'no-recipient' | 'not-configured' | 'provider-error'
export type SendEmailResult = { ok: true } | { ok: false; reason: EmailFailureReason }

/** Logs and reports to Sentry without recipient or subject, which may contain personal data. */
async function reportFailure(reason: EmailFailureReason, error?: unknown) {
  log.warn(`email not sent: ${reason}${error instanceof Error ? ` (${error.message})` : ''}`)
  if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) return
  const Sentry = await import('@sentry/nextjs')
  Sentry.captureException(error ?? new Error(`Email not sent: ${reason}`), {
    tags: { area: 'email', reason },
  })
}

/** Send transactional mail. Prefers SMTP when SMTP_* is set; otherwise Resend. */
export async function sendEmailResult(input: SendEmailInput): Promise<SendEmailResult> {
  const to = resolveTo(input.to)
  const from = resolveFrom()
  if (!to) {
    await reportFailure('no-recipient')
    return { ok: false, reason: 'no-recipient' }
  }

  const payload = { ...input, to, from }
  const preferSmtp =
    process.env.EMAIL_PROVIDER === 'smtp' ||
    (process.env.EMAIL_PROVIDER !== 'resend' && smtpConfigured())

  try {
    if (preferSmtp && smtpConfigured()) {
      await sendViaSmtp(payload)
      return { ok: true }
    }
    if (process.env.RESEND_API_KEY) {
      await sendViaResend(payload)
      return { ok: true }
    }
    if (smtpConfigured()) {
      await sendViaSmtp(payload)
      return { ok: true }
    }
    await reportFailure('not-configured')
    return { ok: false, reason: 'not-configured' }
  } catch (error) {
    await reportFailure('provider-error', error)
    return { ok: false, reason: 'provider-error' }
  }
}

/** Returns false when mail could not be sent; failures are logged and reported to Sentry. */
export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  return (await sendEmailResult(input)).ok
}
