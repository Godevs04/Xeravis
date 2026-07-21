import config from '@payload-config'
import { getPayload as getPayloadClient } from 'payload'
import type { Payload } from 'payload'

let cached: Payload | null = null

export async function getPayload(): Promise<Payload> {
  if (cached) return cached
  cached = await getPayloadClient({ config })
  return cached
}
