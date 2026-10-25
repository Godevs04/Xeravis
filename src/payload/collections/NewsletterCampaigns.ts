import type { CollectionConfig, PayloadRequest } from 'payload'

import { sendCampaign, sendTestCampaign } from '@/lib/campaigns'
import { canExportSubscribers, canManageMarketing, isAdmin, staffRead } from '@/payload/access'

async function readJson(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    return ((await req.json?.()) as Record<string, unknown>) || {}
  } catch {
    return {}
  }
}

export const NewsletterCampaigns: CollectionConfig = {
  slug: 'newsletter-campaigns',
  labels: {
    singular: 'Campaign',
    plural: 'Campaigns',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subject', 'status', 'sentCount', 'sentAt'],
    group: 'Marketing',
  },
  access: {
    read: staffRead,
    create: canManageMarketing,
    update: canManageMarketing,
    delete: isAdmin,
  },
  endpoints: [
    {
      path: '/:id/send',
      method: 'post',
      handler: async (req) => {
        if (!canExportSubscribers(req.user)) {
          return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 })
        }
        const id = String(req.routeParams?.id || '')
        if (!id) return Response.json({ ok: false, error: 'Missing id' }, { status: 400 })
        const body = await readJson(req)

        if (body.test) {
          const campaign = await req.payload.findByID({
            collection: 'newsletter-campaigns',
            id,
            depth: 0,
            overrideAccess: true,
          })
          const to = (req.user as { email?: string } | null)?.email
          if (!to) return Response.json({ ok: false, error: 'No email on your account' })
          const ok = await sendTestCampaign(campaign as never, to)
          return Response.json(
            ok ? { ok, to } : { ok, error: 'Email provider is not configured or failed.' },
          )
        }

        const result = await sendCampaign(req.payload, id)
        return Response.json(result, { status: result.ok ? 200 : 409 })
      },
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
      admin: {
        description:
          'Email content. A personal unsubscribe link is added automatically to every email.',
      },
    },
    {
      name: 'audienceFilter',
      type: 'select',
      defaultValue: 'active',
      admin: {
        description: 'Only confirmed (active) subscribers are ever emailed.',
      },
      options: [
        { label: 'All active subscribers', value: 'active' },
        { label: 'Insights newsletter subscribers', value: 'insights' },
        { label: 'Job alert subscribers', value: 'careers' },
        { label: 'All active (legacy)', value: 'all' },
      ],
    },
    {
      name: 'sendControls',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: './payload/admin/components/SendCampaignButton#SendCampaignButton',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      admin: { position: 'sidebar', readOnly: true },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sending', value: 'sending' },
        { label: 'Sent', value: 'sent' },
      ],
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'sentCount',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'failedCount',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
