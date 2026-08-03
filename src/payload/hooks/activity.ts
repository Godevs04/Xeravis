import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'

type ActivityAction = 'created' | 'updated' | 'published' | 'deleted' | 'status-change' | 'upload'

async function notifyStaff(
  payload: Payload,
  input: {
    title: string
    body?: string
    type: 'lead' | 'application' | 'interview' | 'publish' | 'media' | 'info'
    href?: string
  },
) {
  try {
    const users = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 20,
      overrideAccess: true,
      where: {
        roles: {
          in: ['super-admin', 'administrator', 'editor', 'marketing', 'recruiter'],
        },
      },
    })

    await Promise.all(
      users.docs.map((user) =>
        payload.create({
          collection: 'notifications',
          data: {
            title: input.title,
            body: input.body,
            type: input.type,
            href: input.href,
            user: user.id,
            read: false,
          },
          overrideAccess: true,
        }),
      ),
    )
  } catch {
    // Notifications are best-effort; never block the primary write.
  }
}

async function writeActivity(
  payload: Payload,
  input: {
    summary: string
    action: ActivityAction
    collectionSlug: string
    documentId?: string
    actorId?: string | number
    meta?: Record<string, unknown>
  },
) {
  try {
    await payload.create({
      collection: 'activity-logs',
      data: {
        summary: input.summary,
        action: input.action,
        collectionSlug: input.collectionSlug,
        documentId: input.documentId,
        actor: input.actorId != null ? String(input.actorId) : undefined,
        meta: input.meta,
      },
      overrideAccess: true,
    })
  } catch {
    // Activity is best-effort.
  }
}

function docLabel(doc: Record<string, unknown>) {
  return (
    (typeof doc.title === 'string' && doc.title) ||
    (typeof doc.name === 'string' && doc.name) ||
    (typeof doc.email === 'string' && doc.email) ||
    (typeof doc.filename === 'string' && doc.filename) ||
    String(doc.id)
  )
}

export function trackActivity(collectionSlug: string): CollectionAfterChangeHook {
  return async ({ doc, previousDoc, operation, req, collection }) => {
    const record = doc as unknown as Record<string, unknown>
    const prev = (previousDoc || {}) as Record<string, unknown>
    const label = docLabel(record)
    const actorId = req.user?.id
    const slug = collectionSlug || collection?.slug || 'unknown'

    let action: ActivityAction = operation === 'create' ? 'created' : 'updated'
    if (record._status === 'published' && prev._status !== 'published') {
      action = 'published'
    } else if (
      typeof record.status === 'string' &&
      typeof prev.status === 'string' &&
      record.status !== prev.status
    ) {
      action = 'status-change'
    } else if (slug === 'media' && operation === 'create') {
      action = 'upload'
    }

    await writeActivity(req.payload, {
      summary: `${action.replace(/-/g, ' ')} · ${slug} · ${label}`,
      action,
      collectionSlug: slug,
      documentId: String(record.id),
      actorId,
      meta: {
        status: record.status || record._status,
      },
    })

    if (slug === 'contact-messages' && operation === 'create') {
      await notifyStaff(req.payload, {
        title: 'New lead',
        body: `${label} submitted a contact inquiry`,
        type: 'lead',
        href: `/admin/collections/contact-messages/${record.id}`,
      })
    }

    if (slug === 'job-applications' && operation === 'create') {
      await notifyStaff(req.payload, {
        title: 'New job application',
        body: `${label} applied`,
        type: 'application',
        href: `/admin/collections/job-applications/${record.id}`,
      })
    }

    if (slug === 'interviews' && operation === 'create') {
      await notifyStaff(req.payload, {
        title: 'Interview scheduled',
        body: label,
        type: 'interview',
        href: `/admin/collections/interviews/${record.id}`,
      })
    }

    if (action === 'published') {
      await notifyStaff(req.payload, {
        title: 'Content published',
        body: `${slug}: ${label}`,
        type: 'publish',
        href: `/admin/collections/${slug}/${record.id}`,
      })
    }

    if (slug === 'media' && operation === 'create') {
      await notifyStaff(req.payload, {
        title: 'Media uploaded',
        body: label,
        type: 'media',
        href: `/admin/collections/media/${record.id}`,
      })
    }

    return doc
  }
}

export function trackActivityDelete(collectionSlug: string): CollectionAfterDeleteHook {
  return async ({ doc, req, collection }) => {
    const record = doc as unknown as Record<string, unknown>
    await writeActivity(req.payload, {
      summary: `deleted · ${collectionSlug || collection?.slug} · ${docLabel(record)}`,
      action: 'deleted',
      collectionSlug: collectionSlug || collection?.slug || 'unknown',
      documentId: String(record.id),
      actorId: req.user?.id,
    })
  }
}
