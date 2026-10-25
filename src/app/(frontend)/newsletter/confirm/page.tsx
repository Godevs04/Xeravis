import type { Metadata } from 'next'

import { StatusMessage } from '@/components/ui/StatusMessage'
import { confirmSubscription } from '@/lib/newsletter'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Confirm subscription',
  description: 'Confirm your Xelarvis newsletter subscription.',
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<{ token?: string }> }

export default async function ConfirmSubscriptionPage({ searchParams }: Props) {
  const { token = '' } = await searchParams
  const result = await confirmSubscription(token).catch(() => 'invalid' as const)

  if (result === 'ok') {
    return (
      <StatusMessage
        eyebrow="Subscription confirmed"
        title="You're on the list."
        description="Thanks for confirming. You'll receive Xelarvis updates on AI, data and digital transformation. You can unsubscribe at any time from any email."
        primary={{ href: '/insights', label: 'Browse insights' }}
      />
    )
  }

  return (
    <StatusMessage
      eyebrow="Link not valid"
      title="We couldn't confirm this subscription."
      description="The link may be incomplete or expired. Please subscribe again from the website footer."
      primary={{ href: '/', label: 'Back to homepage' }}
    />
  )
}
