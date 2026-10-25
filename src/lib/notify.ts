import { createLogger } from '@/lib/logger'
import { absoluteUrl } from '@/lib/utils'

const log = createLogger({ scope: 'notify' })

export type LeadType = 'contact' | 'application' | 'download' | 'assessment'

export type LeadAlert = {
  type: LeadType
  title: string
  fields: Array<[label: string, value: string | null | undefined]>
  /** Admin path such as `/admin/collections/contact-messages`. */
  adminPath?: string
}

const TYPE_LABEL: Record<LeadType, string> = {
  contact: 'New contact enquiry',
  application: 'New job application',
  download: 'New download lead',
  assessment: 'New AI readiness assessment',
}

export function formatLeadAlert(alert: LeadAlert): string {
  const lines = alert.fields
    .filter(([, value]) => typeof value === 'string' && value.trim())
    .map(([label, value]) => `*${label}:* ${String(value).trim().slice(0, 300)}`)
  const link = alert.adminPath ? `\n<${absoluteUrl(alert.adminPath)}|Open in admin>` : ''
  return `*${TYPE_LABEL[alert.type]}*: ${alert.title}\n${lines.join('\n')}${link}`
}

/**
 * Posts text to `LEAD_WEBHOOK_URL` (Slack incoming webhook, or any endpoint that accepts
 * `{ text }`, such as Teams workflows). No-op when unset; never throws.
 */
export async function postToLeadWebhook(text: string): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL
  if (!url) return false
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) log.warn(`Lead webhook responded ${res.status}`)
    return res.ok
  } catch (error) {
    log.warn('Lead webhook failed', error instanceof Error ? error.message : error)
    return false
  }
}

export function notifyLead(alert: LeadAlert): Promise<boolean> {
  return postToLeadWebhook(formatLeadAlert(alert))
}
