import { HOME_COPY_FIELDS, HOME_LAYOUT } from '../../src/seed/home-layout'
import { bootPayload } from '../testing/shared'

/**
 * Brings the CMS home layout to the 8-section order in `src/seed/home-layout.ts`.
 * Existing blocks keep their edits (only HOME_COPY_FIELDS are overwritten); missing blocks are
 * added from the defaults; blocks not in the layout are dropped. Dry run unless `--apply`.
 */
type Block = { blockType: string; id?: string | null; [key: string]: unknown }

function nextLayout(current: Block[]) {
  return HOME_LAYOUT.map((defaults) => {
    const existing = current.find((block) => block.blockType === defaults.blockType)
    if (!existing) return { ...defaults } as Block
    const merged: Block = { ...existing }
    for (const field of HOME_COPY_FIELDS[defaults.blockType] ?? []) {
      merged[field] = (defaults as Record<string, unknown>)[field]
    }
    return merged
  })
}

function signature(blocks: Block[]) {
  return JSON.stringify(blocks.map((block) => ({ ...block, id: undefined })))
}

async function main() {
  const apply = process.argv.includes('--apply')
  const payload = await bootPayload()
  const log = (line: string) => process.stdout.write(`${line}\n`)
  log(apply ? 'APPLYING' : 'DRY RUN (pass --apply to write)')

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })
  const home = docs[0] as { id: string; layout?: Block[] | null } | undefined
  if (!home) {
    log('pages/home: not found — run the seed first')
    process.exit(1)
  }

  const current = home.layout ?? []
  const next = nextLayout(current)
  log(`current: ${current.map((b) => b.blockType).join(' → ')}`)
  log(`target:  ${next.map((b) => b.blockType).join(' → ')}`)

  if (signature(current) === signature(next)) {
    log('pages/home: already streamlined')
  } else if (apply) {
    await payload.update({
      collection: 'pages',
      id: home.id,
      data: { layout: next, _status: 'published' } as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    log('pages/home: updated')
  } else {
    log('pages/home: would update')
  }

  log('done')
  process.exit(0)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
  process.exit(1)
})
