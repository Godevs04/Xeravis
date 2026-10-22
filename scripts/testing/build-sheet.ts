/**
 * Merges docs/testing/results/{core,pipelines,roles,manual}.json into docs/testing/test-cases.csv
 * and prints a per-module summary for test-report.md.
 *
 *   npm run test:sheet
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

type CaseResult = {
  id: string
  module: string
  area: string
  scenario: string
  preconditions: string
  steps: string
  data: string
  expected: string
  actual: string
  status: string
  severity: string
  testedAt: string
}

const RESULTS_DIR = 'docs/testing/results'
const OUTPUT = 'docs/testing/test-cases.csv'

const SOURCES = [
  { file: 'core.json', method: 'Automated (REST + rendered HTML)' },
  { file: 'pipelines.json', method: 'Automated (REST + rendered HTML)' },
  { file: 'roles.json', method: 'Automated (per-role sessions)' },
  { file: 'manual.json', method: 'Manual (browser)' },
]

const COLUMNS = [
  'Test ID',
  'Module',
  'Area / URL',
  'Scenario',
  'Preconditions',
  'Steps',
  'Test data',
  'Expected result',
  'Actual result',
  'Status',
  'Severity',
  'Method',
  'Tested at',
]

const csvCell = (value: string) => `"${value.replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`

async function main() {
  const rows: string[][] = []
  const seen = new Set<string>()
  const summary = new Map<string, { total: number; pass: number }>()

  for (const source of SOURCES) {
    const cases = JSON.parse(
      await readFile(path.join(RESULTS_DIR, source.file), 'utf8'),
    ) as CaseResult[]
    for (const c of cases) {
      // Every automated phase starts with the same login check; keep it once
      const key = `${c.id}|${c.scenario}`
      if (seen.has(key)) continue
      seen.add(key)
      rows.push([
        c.id,
        c.module,
        c.area,
        c.scenario,
        c.preconditions,
        c.steps,
        c.data,
        c.expected,
        c.actual,
        c.status,
        c.severity,
        source.method,
        c.testedAt,
      ])
      const group = c.module.split(' / ')[0]
      const entry = summary.get(group) || { total: 0, pass: 0 }
      entry.total += 1
      if (c.status === 'Pass') entry.pass += 1
      summary.set(group, entry)
    }
  }

  const csv = [COLUMNS, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')
  await writeFile(OUTPUT, `${csv}\n`)

  const lines = [...summary.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .map(([group, s]) => `| ${group} | ${s.total} | ${s.pass} | ${s.total - s.pass} |`)
  const total = rows.length
  const passed = rows.filter((r) => r[9] === 'Pass').length
  process.stdout.write(
    `${OUTPUT}: ${total} cases, ${passed} passed, ${total - passed} not passed\n\n`,
  )
  process.stdout.write(`| Module | Cases | Pass | Fail |\n|---|---|---|---|\n${lines.join('\n')}\n`)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
  process.exit(1)
})
