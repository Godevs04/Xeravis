import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { bootPayload, GLOBAL_SLUGS, SNAPSHOT_DIR } from './shared'

/** Saves every global (depth 0) so QA edits can be rolled back with `npm run test:restore`. */
async function main() {
  const payload = await bootPayload()
  const snapshot: Record<string, unknown> = {}

  for (const slug of GLOBAL_SLUGS) {
    snapshot[slug] = await payload.findGlobal({ slug, depth: 0, overrideAccess: true })
  }

  await mkdir(SNAPSHOT_DIR, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const file = path.join(SNAPSHOT_DIR, `globals-${stamp}.json`)
  await writeFile(file, `${JSON.stringify(snapshot, null, 2)}\n`)
  await writeFile(
    path.join(SNAPSHOT_DIR, 'globals-latest.json'),
    `${JSON.stringify(snapshot, null, 2)}\n`,
  )

  process.stdout.write(`Snapshot of ${GLOBAL_SLUGS.length} globals written to ${file}\n`)
  process.exit(0)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
  process.exit(1)
})
