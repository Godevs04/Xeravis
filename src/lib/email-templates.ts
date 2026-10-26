import { absoluteUrl } from '@/lib/utils'

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type LayoutInput = {
  heading: string
  /** Trusted HTML for the body (escape any user input before passing it in). */
  bodyHtml: string
  cta?: { label: string; href: string }
  footerHtml?: string
}

export function ctaButton(cta: { label: string; href: string }): string {
  return `<p style="margin:28px 0"><a href="${escapeHtml(cta.href)}" style="background:#0f766e;color:#ffffff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">${escapeHtml(cta.label)}</a></p>`
}

export function emailLayout({ heading, bodyHtml, cta, footerHtml }: LayoutInput): string {
  const button = cta ? ctaButton(cta) : ''
  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">
        <tr><td style="padding:22px 32px;background:#0b1630;border-bottom:3px solid #14b8a6">
          <a href="${absoluteUrl('/')}" style="font-size:18px;font-weight:800;letter-spacing:0.08em;color:#ffffff;text-decoration:none">XELARVIS</a>
          <span style="display:block;margin-top:2px;font-size:11px;letter-spacing:0.04em;color:#94a3b8">AI · Data Science · IT Consulting</span>
        </td></tr>
        <tr><td style="padding:32px;font-size:15px;line-height:1.6">
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${escapeHtml(heading)}</h1>
          ${bodyHtml}
          ${button}
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f8fafc;font-size:12px;line-height:1.5;color:#64748b">
          ${footerHtml || `XELARVIS Pvt Ltd · <a href="${absoluteUrl('/')}" style="color:#64748b">xelarvis.in</a>`}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

type DetailValue = string | { html: string } | null | undefined
type DetailRow = [label: string, value: DetailValue] | null | undefined

/** Two-column key/value table; rows with an empty value are skipped. Plain strings are escaped. */
export function detailsTable(rows: DetailRow[]): string {
  const cells = rows
    .filter((row): row is [string, DetailValue] => Boolean(row && row[1]))
    .map(([label, value]) => {
      const html = typeof value === 'string' ? escapeHtml(value) : value!.html
      return `<tr><td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:600">${html}</td></tr>`
    })
    .join('')
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:8px 0 20px;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0">${cells}</table>`
}

export function noteBox(text: string): string {
  return `<p style="margin:0 0 16px;padding:12px 14px;background:#f0fdfa;border-left:3px solid #14b8a6;border-radius:6px;font-size:14px;color:#134e4a">${escapeHtml(text)}</p>`
}

export function paragraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 14px">${escapeHtml(block).replace(/\n/g, '<br />')}</p>`)
    .join('')
}
