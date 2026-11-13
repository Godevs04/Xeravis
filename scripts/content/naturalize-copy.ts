import { FALLBACK_CONTACT } from '../../src/lib/fallback-data'
import { bootPayload } from '../testing/shared'

/**
 * Aligns CMS globals with the cleaned-up copy: official contact details, one legal name in the
 * footer, and an office address that doesn't repeat the country. Dry run unless `--apply`.
 */
const LEGAL_NAME = 'XELARVIS Private Limited'
const OLD_LEGAL_NAMES = /XELARVIS PRIVATE LIMITED|XELARVIS Pvt\.? Ltd\.?|Xelarvis Technologies/g

type Office = { name: string; address: string; city: string; country: string; hours?: string }

async function main() {
  const apply = process.argv.includes('--apply')
  const payload = await bootPayload()
  const log = (line: string) => process.stdout.write(`${line}\n`)
  log(apply ? 'APPLYING' : 'DRY RUN (pass --apply to write)')

  const update = async (slug: 'contact-details' | 'footer' | 'office-locations', data: object) => {
    log(`${slug}: ${apply ? 'updating' : 'would update'} ${JSON.stringify(data)}`)
    if (!apply) return
    await payload.updateGlobal({
      slug,
      data: data as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  }

  const contact = (await payload.findGlobal({ slug: 'contact-details', overrideAccess: true })) as {
    email?: string | null
    phone?: string | null
  }
  if (contact.email !== FALLBACK_CONTACT.email || contact.phone !== FALLBACK_CONTACT.phone) {
    await update('contact-details', {
      email: FALLBACK_CONTACT.email,
      phone: FALLBACK_CONTACT.phone,
    })
  } else {
    log('contact-details: up to date')
  }

  const footer = (await payload.findGlobal({ slug: 'footer', overrideAccess: true })) as {
    copyright?: string | null
  }
  const copyright = footer.copyright?.replace(OLD_LEGAL_NAMES, LEGAL_NAME)
  if (copyright && copyright !== footer.copyright) {
    await update('footer', { copyright })
  } else {
    log('footer: up to date')
  }

  const offices = (await payload.findGlobal({
    slug: 'office-locations',
    overrideAccess: true,
  })) as {
    locations?: Office[] | null
  }
  const locations = offices.locations ?? []
  const fixed = locations.map((office) =>
    office.address.trim() === office.country && office.city === 'Hyderabad'
      ? { ...office, address: 'Hyderabad, Telangana' }
      : office,
  )
  if (JSON.stringify(fixed) !== JSON.stringify(locations)) {
    await update('office-locations', { locations: fixed })
  } else {
    log('office-locations: up to date')
  }

  log('done')
  process.exit(0)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
  process.exit(1)
})
