import Link from 'next/link'

import { isDraftMode } from '@/lib/draft-mode'
import { getSiteURL } from '@/lib/utils'

import { LivePreviewRefresh } from './LivePreviewRefresh'

/** Shown only to editors who entered draft mode through the admin Preview button. */
export async function PreviewBanner() {
  if (!(await isDraftMode())) return null
  return (
    <>
      <LivePreviewRefresh serverURL={getSiteURL()} />
      <div
        role="status"
        className="fixed inset-x-0 bottom-0 z-[100] flex items-center justify-center gap-3 bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950"
      >
        <span>Preview mode: you are seeing unpublished drafts.</span>
        <Link href="/api/exit-preview" prefetch={false} className="underline underline-offset-2">
          Exit preview
        </Link>
      </div>
    </>
  )
}
