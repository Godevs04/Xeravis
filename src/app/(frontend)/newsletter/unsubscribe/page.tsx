import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { StatusMessage } from '@/components/ui/StatusMessage'
import { unsubscribe } from '@/lib/newsletter'
import { isWellFormedToken } from '@/lib/tokens'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: 'Unsubscribe from Xelarvis emails.',
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<{ token?: string; done?: string }> }

async function unsubscribeAction(formData: FormData) {
  'use server'
  const token = String(formData.get('token') || '')
  const result = await unsubscribe(token).catch(() => 'invalid' as const)
  redirect(
    `/newsletter/unsubscribe?token=${encodeURIComponent(token)}&done=${result === 'ok' ? '1' : '0'}`,
  )
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token = '', done } = await searchParams

  if (done === '1') {
    return (
      <StatusMessage
        eyebrow="Unsubscribed"
        title="You've been unsubscribed."
        description="You won't receive any more emails from this list. Changed your mind? You can subscribe again from the website footer."
        primary={{ href: '/', label: 'Back to homepage' }}
      />
    )
  }

  if (!isWellFormedToken(token) || done === '0') {
    return (
      <StatusMessage
        eyebrow="Link not valid"
        title="We couldn't find this subscription."
        description="The link may be incomplete. Reply to any of our emails and we'll remove you manually."
        primary={{ href: '/', label: 'Back to homepage' }}
      />
    )
  }

  return (
    <StatusMessage
      eyebrow="Email preferences"
      title="Unsubscribe from Xelarvis emails?"
      description="You'll stop receiving newsletters and job alerts at this address."
    >
      <form action={unsubscribeAction} className="mt-8">
        <input type="hidden" name="token" value={token} />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--color-accent)] px-6 text-sm font-semibold text-[color:var(--color-on-accent)] shadow-[var(--shadow-hover)]"
        >
          Unsubscribe
        </button>
      </form>
    </StatusMessage>
  )
}
