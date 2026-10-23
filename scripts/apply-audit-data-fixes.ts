import { GATED_FOLDER, RESUME_FOLDER } from '../src/payload/access'
import { bootPayload } from './testing/shared'

/**
 * One-off content fixes from the website audit. Dry run unless `--apply`.
 * - WEB-022: career slug `sr` -> `sr-developer-engineer` (next.config.ts redirects the old URL).
 * - WEB-010: files of existing gated downloads move to the private gated-downloads folder.
 */
const SLUG_RENAMES = [{ collection: 'careers', from: 'sr', to: 'sr-developer-engineer' }] as const

async function main() {
  const apply = process.argv.includes('--apply')
  const payload = await bootPayload()
  const log = (line: string) => process.stdout.write(`${line}\n`)
  log(apply ? 'APPLYING' : 'DRY RUN (pass --apply to write)')

  for (const { collection, from, to } of SLUG_RENAMES) {
    const { docs } = await payload.find({
      collection,
      where: { slug: { equals: from } },
      depth: 0,
      limit: 1,
      overrideAccess: true,
    })
    const doc = docs[0]
    if (!doc) {
      log(`${collection}/${from}: not found (already renamed?)`)
      continue
    }
    log(`${collection}/${from}: ${apply ? 'renaming' : 'would rename'} to ${to}`)
    if (apply) {
      await payload.update({
        collection,
        id: doc.id,
        data: { slug: to },
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
    }
  }

  const gated = await payload.find({
    collection: 'downloads',
    where: { gated: { equals: true } },
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })
  for (const download of gated.docs) {
    const fileId = typeof download.file === 'object' ? download.file?.id : download.file
    if (!fileId) continue
    const media = await payload
      .findByID({ collection: 'media', id: fileId, depth: 0, overrideAccess: true })
      .catch(() => null)
    if (!media || media.folder === GATED_FOLDER || media.folder === RESUME_FOLDER) continue
    log(`media/${media.filename}: ${apply ? 'moving' : 'would move'} to ${GATED_FOLDER}`)
    if (apply) {
      await payload.update({
        collection: 'media',
        id: fileId,
        data: { folder: GATED_FOLDER },
        overrideAccess: true,
      })
    }
  }

  log('done')
  process.exit(0)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
  process.exit(1)
})
