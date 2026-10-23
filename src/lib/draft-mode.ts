import { draftMode } from 'next/headers'

/** Safe outside a request (build-time static generation, scripts): returns false there. */
export async function isDraftMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}
