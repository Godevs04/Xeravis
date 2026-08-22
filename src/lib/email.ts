import { Resend } from 'resend'
import nodemailer from 'nodemailer'

export type SendEmailInput = {
  to?: string | string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
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
  const fallback =
    process.env.CAREERS_NOTIFY_EMAIL ||
    process.env.CONTACT_NOTIFY_EMAIL ||
    process.env.EMAIL_TO ||
    process.env.SMTP_USER
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
  })
}

async function sendViaResend(input: SendEmailInput & { to: string | string[]; from: string }) {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  const resend = new Resend(key)
  await resend.emails.send({
    from: input.from,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
    html: input.html,
  })
}

/**
 * Send transactional mail. Prefers SMTP when SMTP_* is set; otherwise Resend.
 * Returns false when mail could not be sent (missing config or provider error).
 */
export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const to = resolveTo(input.to)
  const from = resolveFrom()
  if (!to) return false

  const payload = { ...input, to, from }
  const preferSmtp =
    process.env.EMAIL_PROVIDER === 'smtp' ||
    (process.env.EMAIL_PROVIDER !== 'resend' && smtpConfigured())

  try {
    if (preferSmtp && smtpConfigured()) {
      await sendViaSmtp(payload)
      return true
    }
    if (process.env.RESEND_API_KEY) {
      await sendViaResend(payload)
      return true
    }
    if (smtpConfigured()) {
      await sendViaSmtp(payload)
      return true
    }
    return false
  } catch {
    return false
  }
}
