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

export function emailLayout({ heading, bodyHtml, cta, footerHtml }: LayoutInput): string {
  const button = cta
    ? `<p style="margin:28px 0"><a href="${escapeHtml(cta.href)}" style="background:#0f766e;color:#ffffff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">${escapeHtml(cta.label)}</a></p>`
    : ''
  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">
        <tr><td style="padding:24px 32px;border-bottom:1px solid #e2e8f0">
          <a href="${absoluteUrl('/')}" style="font-size:18px;font-weight:700;color:#0f172a;text-decoration:none">Xelarvis</a>
        </td></tr>
        <tr><td style="padding:32px;font-size:15px;line-height:1.6">
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${escapeHtml(heading)}</h1>
          ${bodyHtml}
          ${button}
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f8fafc;font-size:12px;line-height:1.5;color:#64748b">
          ${footerHtml || 'Xelarvis Technologies'}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function paragraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 14px">${escapeHtml(block).replace(/\n/g, '<br />')}</p>`)
    .join('')
}
