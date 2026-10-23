import { RESUME_FOLDER } from '../src/payload/access'
import { bootPayload } from './testing/shared'

/**
 * Moves every media file attached to a job application into the private resumes folder,
 * so anonymous visitors can no longer list or download it. Dry run unless `--apply`.
 */
async function main() {
  const apply = process.argv.includes('--apply')
  const payload = await bootPayload()

  const resumeIds = new Set<string>()
  let page = 1
  for (;;) {
    const batch = await payload.find({
      collection: 'job-applications',
      depth: 0,
      limit: 200,
      page,
      overrideAccess: true,
    })
    for (const application of batch.docs) {
      if (application.resume) resumeIds.add(String(application.resume))
    }
    if (!batch.hasNextPage) break
    page += 1
  }

  let moved = 0
  for (const id of resumeIds) {
    const media = await payload
      .findByID({ collection: 'media', id, depth: 0, overrideAccess: true })
      .catch(() => null)
    if (!media || media.folder === RESUME_FOLDER) continue
    moved += 1
    process.stdout.write(`${apply ? 'moving' : 'would move'} ${media.filename}\n`)
    if (apply) {
      await payload.update({
        collection: 'media',
        id,
        data: { folder: RESUME_FOLDER },
        overrideAccess: true,
      })
    }
  }

  process.stdout.write(
    `${resumeIds.size} resumes referenced, ${moved} ${apply ? 'moved' : 'to move (re-run with --apply)'}\n`,
  )
  process.exit(0)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
  process.exit(1)
})
