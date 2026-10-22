import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { GlobalSlug } from 'payload'

import { bootPayload, GLOBAL_SLUGS, SNAPSHOT_DIR } from './shared'

const SYSTEM_KEYS = new Set(['id', 'globalType', 'createdAt', 'updatedAt'])

/** Restores globals from a snapshot: `npm run test:restore [-- path/to/globals-<stamp>.json]`. */
async function main() {
  const file = process.argv[2] || path.join(SNAPSHOT_DIR, 'globals-latest.json')
  const snapshot = JSON.parse(await readFile(file, 'utf8')) as Record<
    string,
    Record<string, unknown>
  >
  const payload = await bootPayload()

  for (const slug of GLOBAL_SLUGS) {
    const saved = snapshot[slug]
    if (!saved) continue
    const current = (await payload.findGlobal({
      slug: slug as GlobalSlug,
      depth: 0,
      overrideAccess: true,
    })) as unknown as Record<string, unknown>
    const data: Record<string, unknown> = {}
    // Fields added after the snapshot (e.g. a QA announcement message) are cleared explicitly.
    for (const key of Object.keys(current)) if (!SYSTEM_KEYS.has(key)) data[key] = null
    for (const [key, value] of Object.entries(saved)) if (!SYSTEM_KEYS.has(key)) data[key] = value
    await payload.updateGlobal({ slug: slug as GlobalSlug, data, overrideAccess: true, depth: 0 })
    process.stdout.write(`restored ${slug}\n`)
  }

  process.stdout.write(`Globals restored from ${file}\n`)
  process.exit(0)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
  process.exit(1)
})
