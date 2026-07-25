import config from '@payload-config'
import { getPayload as getPayloadClient } from 'payload'
import type { Payload } from 'payload'

let cached: Payload | null = null
let pending: Promise<Payload> | null = null

export function resetPayloadCache() {
  cached = null
  pending = null
}

export async function getPayload(): Promise<Payload> {
  if (cached) return cached
  if (!pending) {
    pending = getPayloadClient({ config })
      .then((payload) => {
        cached = payload
        return payload
      })
      .finally(() => {
        pending = null
      })
  }
  return pending
}
