import { writeFileSync } from 'fs'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

async function main() {
  const out: string[] = []
  const log = (line: string) => {
    out.push(line)
    process.stdout.write(`${line}\n`)
  }

  try {
    const { default: config } = await import('../../payload.config')
    const { getPayload } = await import('payload')
    const payload = await getPayload({ config })

    const collections = payload.config.collections.map((c) => c.slug)
    const globals = payload.config.globals.map((g) => g.slug)

    log(`COLLECTIONS=${collections.length}`)
    log(collections.join(','))
    log(`GLOBALS=${globals.length}`)
    log(globals.join(','))
    log(`MONGODB=${Boolean(payload.db)}`)
    log('PAYLOAD_BOOT_OK')
  } catch (error) {
    log(`ERROR=${error instanceof Error ? error.message : String(error)}`)
  }

  writeFileSync(new URL('./boot-result.log', import.meta.url), out.join('\n') + '\n')
  process.exit(out.some((l) => l.startsWith('ERROR=')) ? 1 : 0)
}

void main()
