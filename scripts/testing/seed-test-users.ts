import { bootPayload, TEST_ROLES, TEST_USER_PASSWORD, testUserEmail } from './shared'

/** Creates (or resets) one `test-qa-<role>@xelarvis.test` user per role for the access matrix. */
async function main() {
  const payload = await bootPayload()

  for (const role of TEST_ROLES) {
    const email = testUserEmail(role)
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })
    const data = { email, password: TEST_USER_PASSWORD, roles: [role] }
    if (existing.docs[0]) {
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
    } else {
      await payload.create({ collection: 'users', data, overrideAccess: true })
    }
    process.stdout.write(`ready ${email}\n`)
  }
  process.exit(0)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
  process.exit(1)
})
