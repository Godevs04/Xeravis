/**
 * Copies every file in the local `media/` folder to Cloudinary, using the same private public IDs
 * the storage adapter serves from. Also lists Media records whose file is missing locally.
 *
 *   npm run media:migrate             # dry run
 *   npm run media:migrate -- --apply  # upload
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { bootPayload } from './testing/shared'

const MEDIA_DIR = 'media'
const apply = process.argv.includes('--apply')

async function main() {
  const { configureCloudinary, isCloudinaryEnabled, uploadToCloudinary } =
    await import('../src/payload/plugins/cloudinaryAdapter')
  if (!isCloudinaryEnabled()) {
    throw new Error('Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET first')
  }
  configureCloudinary()

  const files = (await readdir(MEDIA_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)

  const payload = await bootPayload()
  const media = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })
  const onDisk = new Set(files)
  const missing = media.docs
    .map((doc) => doc.filename)
    .filter((name): name is string => Boolean(name) && !onDisk.has(name as string))

  process.stdout.write(
    `${apply ? 'UPLOADING' : 'DRY RUN (pass --apply to upload)'}: ${files.length} files\n`,
  )
  let uploaded = 0
  for (const name of files) {
    if (!apply) continue
    await uploadToCloudinary(name, await readFile(path.join(MEDIA_DIR, name)))
    uploaded += 1
  }
  if (apply) process.stdout.write(`uploaded ${uploaded} files\n`)
  if (missing.length) {
    process.stdout.write(
      `\n${missing.length} media record(s) have no local file; re-upload them in the admin:\n${missing
        .map((name) => `  - ${name}`)
        .join('\n')}\n`,
    )
  }
  process.exit(0)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
  process.exit(1)
})
