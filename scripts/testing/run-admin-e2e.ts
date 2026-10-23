import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

import { toSlug } from '../../src/payload/utilities'

import {
  GLOBAL_SLUGS,
  hasTestMarker,
  richParagraph,
  SNAPSHOT_DIR,
  TEST_EMAIL_DOMAIN,
  TEST_ROLES,
  TEST_USER_PASSWORD,
  testUserEmail,
} from './shared'

/**
 * End-to-end admin runner against a running app (default http://localhost:3000).
 *   npm run test:e2e -- --phase=core       content, taxonomies, media, downloads, globals, endpoints, admin pages
 *   npm run test:e2e -- --phase=pipelines  application / lead / newsletter pipelines (after the public forms are submitted)
 *   npm run test:e2e -- --phase=roles      role x collection access matrix
 * Results land in docs/testing/results/<phase>.json and feed build-sheet.ts.
 */

type Json = Record<string, unknown>
type Status = 'Pass' | 'Fail' | 'Blocked'
type Severity = 'Critical' | 'High' | 'Medium' | 'Low'

export type CaseResult = {
  id: string
  module: string
  area: string
  scenario: string
  preconditions: string
  steps: string
  data: string
  expected: string
  actual: string
  status: Status
  severity: Severity
  testedAt: string
}

export type InventoryRow = {
  collection: string
  id: string
  label: string
  slug: string
  state: string
}

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000'
const RESULTS_DIR = 'docs/testing/results'
const phase = (process.argv.find((a) => a.startsWith('--phase='))?.split('=')[1] || 'core') as
  'core' | 'pipelines' | 'roles'

const results: CaseResult[] = []
const inventory: InventoryRow[] = []
const counters: Record<string, number> = {}

function record(
  code: string,
  module: string,
  area: string,
  scenario: string,
  spec: { steps: string; expected: string; data?: string; pre?: string; severity?: Severity },
  ok: boolean | 'blocked',
  actual: string,
) {
  counters[code] = (counters[code] || 0) + 1
  results.push({
    id: `${code}-${String(counters[code]).padStart(3, '0')}`,
    module,
    area,
    scenario,
    preconditions: spec.pre || 'Logged in as super-admin',
    steps: spec.steps,
    data: spec.data || '',
    expected: spec.expected,
    actual,
    status: ok === 'blocked' ? 'Blocked' : ok ? 'Pass' : 'Fail',
    severity: spec.severity || 'Medium',
    testedAt: new Date().toISOString(),
  })
  const mark = ok === 'blocked' ? 'BLOCK' : ok ? 'pass ' : 'FAIL '
  process.stdout.write(`${mark} ${code} ${scenario} -> ${actual}\n`)
}

type HttpOptions = {
  token?: string
  cookie?: string
  json?: unknown
  form?: FormData
  redirect?: RequestRedirect
}

async function http(method: string, url: string, opts: HttpOptions = {}) {
  const headers: Record<string, string> = {}
  if (opts.token) headers.Authorization = `JWT ${opts.token}`
  if (opts.cookie) {
    headers.Cookie = `payload-token=${opts.cookie}`
    // Payload only trusts the session cookie on same-origin requests (CSRF guard)
    headers['Sec-Fetch-Site'] = 'same-origin'
  }
  let body: BodyInit | undefined
  if (opts.json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(opts.json)
  } else if (opts.form) {
    body = opts.form
  }
  const res = await fetch(`${BASE}${url}`, {
    method,
    headers,
    body,
    redirect: opts.redirect || 'follow',
  })
  const text = await res.text()
  let data: Json = {}
  try {
    data = JSON.parse(text) as Json
  } catch {
    data = {}
  }
  return { status: res.status, data, text, headers: res.headers }
}

const doc = (data: Json) => ((data.doc as Json) || data) as Json
const docs = (data: Json) => ((data.docs as Json[]) || []) as Json[]
const errText = (data: Json) =>
  JSON.stringify((data.errors as unknown[]) || data.error || data.message || '').slice(0, 220)

async function login(email: string, password: string) {
  const res = await http('POST', '/api/users/login', { json: { email, password } })
  return typeof res.data.token === 'string' ? res.data.token : ''
}

async function findBySlug(collection: string, slug: string, token: string) {
  const res = await http(
    'GET',
    `/api/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&draft=true&depth=0&limit=1`,
    { token },
  )
  return docs(res.data)[0]
}

async function removeBySlug(collection: string, slug: string, token: string) {
  const existing = await findBySlug(collection, slug, token)
  if (existing) await http('DELETE', `/api/${collection}/${existing.id}`, { token })
}

async function removeWhere(collection: string, query: string, token: string) {
  const res = await http('GET', `/api/${collection}?${query}&depth=0&limit=50`, { token })
  for (const d of docs(res.data)) await http('DELETE', `/api/${collection}/${d.id}`, { token })
}

// Unauthenticated admin requests stream a redirect to /admin/login (or render the login view in
// Payload's minimal template); the user create form also has a password field, so match neither alone
const isLoginPage = (html: string) =>
  /NEXT_REDIRECT;[a-z]+;\/admin\/login/.test(html) ||
  (/name="password"/.test(html) && /template-minimal/.test(html))

async function pageHtml(url: string) {
  const res = await http('GET', url)
  return { status: res.status, html: res.text }
}

/* ------------------------------------------------------------------ fixtures */

async function pngBuffer(color: string) {
  return sharp({ create: { width: 1600, height: 1000, channels: 3, background: color } })
    .png()
    .toBuffer()
}

function buildPdf() {
  const objects = [
    '<</Type/Catalog/Pages 2 0 R>>',
    '<</Type/Pages/Kids[3 0 R]/Count 1>>',
    '<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]>>',
  ]
  let body = '%PDF-1.4\n'
  const offsets: number[] = []
  objects.forEach((obj, i) => {
    offsets.push(body.length)
    body += `${i + 1} 0 obj${obj}endobj\n`
  })
  const xref = body.length
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const o of offsets) body += `${String(o).padStart(10, '0')} 00000 n \n`
  body += `trailer<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(body, 'latin1')
}

const PDF = buildPdf()

/** The root loading.tsx streams pages, so notFound() renders the 404 UI with HTTP 200 + noindex. */
const isNotFoundPage = (page: { status: number; html: string }, title: string) =>
  (page.status === 404 || page.html.includes('Page not found')) && !page.html.includes(title)

async function uploadMedia(
  token: string,
  filename: string,
  bytes: Buffer,
  mime: string,
  fields: Json,
) {
  const form = new FormData()
  form.append('file', new Blob([new Uint8Array(bytes)], { type: mime }), filename)
  form.append('_payload', JSON.stringify(fields))
  return http('POST', '/api/media', { token, form })
}

/* ------------------------------------------------------------------ collections */

type ContentSpec = {
  slug: string
  code: string
  module: string
  label: string
  drafts: boolean
  build: (title: string, slug: string, media: string) => Json
  detail?: (slug: string) => string
  list?: string
  /** Listing renders a fixed canonical catalog (services-catalog / solutions-catalog) */
  curated?: boolean
  tracked?: boolean
}

const CONTENT: ContentSpec[] = [
  {
    slug: 'pages',
    code: 'PAGES',
    module: 'Website / Pages',
    label: 'Page',
    drafts: true,
    build: (title, slug) => ({
      title,
      slug,
      layout: [{ blockType: 'richText', content: richParagraph('TEST-QA page body') }],
    }),
  },
  {
    slug: 'services',
    code: 'SERV',
    module: 'Website / Services',
    label: 'Service',
    drafts: true,
    build: (title, slug, media) => ({
      title,
      slug,
      summary: 'TEST-QA service summary for verification.',
      body: richParagraph('TEST-QA service body'),
      heroImage: media,
      benefits: [{ title: '[TEST] Benefit', description: 'TEST-QA benefit' }],
      process: [{ title: '[TEST] Step', description: 'TEST-QA step' }],
    }),
    detail: (s) => `/services/${s}`,
    list: '/services',
    curated: true,
  },
  {
    slug: 'solutions',
    code: 'SOLN',
    module: 'Website / Solutions',
    label: 'Solution',
    drafts: true,
    build: (title, slug) => ({
      title,
      slug,
      summary: 'TEST-QA solution summary.',
      body: richParagraph('TEST-QA solution body'),
    }),
    detail: (s) => `/solutions/${s}`,
    list: '/solutions',
    curated: true,
  },
  {
    slug: 'industries',
    code: 'IND',
    module: 'Website / Industries',
    label: 'Industry',
    drafts: true,
    build: (title, slug) => ({ title, slug, summary: 'TEST-QA industry summary.', tier: '3' }),
    detail: (s) => `/industries/${s}`,
    list: '/industries',
  },
  {
    slug: 'case-studies',
    code: 'CASE',
    module: 'Insights / Case Studies',
    label: 'Case Study',
    drafts: true,
    build: (title, slug, media) => ({
      title,
      slug,
      client: '[TEST] QA Client Co',
      challenge: 'TEST-QA challenge',
      outcome: 'TEST-QA outcome',
      featuredImage: media,
      metrics: [{ label: 'TEST-QA uplift', value: '42%' }],
    }),
    detail: (s) => `/case-studies/${s}`,
    list: '/case-studies',
  },
  {
    slug: 'blogs',
    code: 'BLOG',
    module: 'Insights / Blogs',
    label: 'Blog',
    drafts: true,
    tracked: true,
    build: (title, slug, media) => ({
      title,
      slug,
      excerpt: 'TEST-QA blog excerpt.',
      content: richParagraph('TEST-QA blog content with enough words to compute reading time.'),
      cover: media,
      insightType: 'blog',
    }),
    detail: (s) => `/blog/${s}`,
    list: '/insights/blogs',
  },
  {
    slug: 'research',
    code: 'RSRCH',
    module: 'Insights / Research',
    label: 'Research',
    drafts: true,
    tracked: true,
    build: (title, slug) => ({
      title,
      slug,
      excerpt: 'TEST-QA research excerpt.',
      content: richParagraph('TEST-QA research content'),
    }),
    detail: (s) => `/research/${s}`,
  },
  {
    slug: 'careers',
    code: 'JOB',
    module: 'Recruitment / Jobs',
    label: 'Job',
    drafts: true,
    tracked: true,
    build: (title, slug) => ({
      title,
      slug,
      location: 'Chennai (TEST-QA)',
      type: 'full-time',
      description: richParagraph('TEST-QA job description'),
      requirements: richParagraph('TEST-QA requirements'),
      responsibilities: [{ item: 'TEST-QA responsibility' }],
      active: true,
    }),
    detail: (s) => `/careers/${s}`,
    list: '/careers',
  },
]

type SimpleSpec = {
  slug: string
  code: string
  module: string
  titleField: string
  build: (title: string, slug: string, media: string, extra: Json) => Json
  updateField: string
  hasSlug?: boolean
}

const SIMPLE: SimpleSpec[] = [
  {
    slug: 'technologies',
    code: 'TECH',
    module: 'Website / Technologies',
    titleField: 'title',
    hasSlug: true,
    build: (t, s, m) => ({ title: t, slug: s, category: 'ai', logo: m }),
    updateField: 'title',
  },
  {
    slug: 'categories',
    code: 'CAT',
    module: 'Insights / Categories',
    titleField: 'title',
    hasSlug: true,
    build: (t, s) => ({ title: t, slug: s }),
    updateField: 'title',
  },
  {
    slug: 'tags',
    code: 'TAG',
    module: 'Insights / Tags',
    titleField: 'title',
    hasSlug: true,
    build: (t, s) => ({ title: t, slug: s }),
    updateField: 'title',
  },
  {
    slug: 'authors',
    code: 'AUTH',
    module: 'Insights / Authors',
    titleField: 'name',
    build: (t, _s, m) => ({ name: t, avatar: m }),
    updateField: 'name',
  },
  {
    slug: 'clients',
    code: 'CLNT',
    module: 'Insights / Clients',
    titleField: 'name',
    build: (t, _s, m) => ({ name: t, logo: m }),
    updateField: 'name',
  },
  {
    slug: 'faqs',
    code: 'FAQ',
    module: 'Insights / FAQs',
    titleField: 'question',
    build: (t) => ({ question: `${t}?`, answer: 'TEST-QA answer' }),
    updateField: 'question',
  },
  {
    slug: 'team-members',
    code: 'TEAM',
    module: 'Insights / Team Members',
    titleField: 'name',
    build: (t, _s, m) => ({ name: t, role: 'TEST-QA Engineer', photo: m }),
    updateField: 'name',
  },
  {
    slug: 'testimonials',
    code: 'TSTM',
    module: 'Insights / Testimonials',
    titleField: 'authorName',
    build: (t) => ({ quote: 'TEST-QA testimonial quote', authorName: t }),
    updateField: 'authorName',
  },
  {
    slug: 'departments',
    code: 'DEPT',
    module: 'Recruitment / Departments',
    titleField: 'title',
    hasSlug: true,
    build: (t, s) => ({ title: t, slug: s }),
    updateField: 'title',
  },
  {
    slug: 'newsletter-campaigns',
    code: 'CMPN',
    module: 'Marketing / Newsletter Campaigns',
    titleField: 'title',
    build: (t) => ({ title: t, subject: 'TEST-QA subject line' }),
    updateField: 'title',
  },
  {
    slug: 'downloads',
    code: 'DWNL',
    module: 'Insights / Downloads',
    titleField: 'title',
    hasSlug: true,
    build: (t, s, _m, extra) => ({ title: t, slug: s, file: extra.pdf, gated: false }),
    updateField: 'title',
  },
]

/* ------------------------------------------------------------------ phases */

async function adminPagesRender(token: string, ids: Record<string, string>) {
  const collections = [
    ...CONTENT.map((c) => c.slug),
    ...SIMPLE.map((s) => s.slug),
    'media',
    'job-applications',
    'interviews',
    'contact-messages',
    'form-submissions',
    'newsletter-subscribers',
    'users',
    'notifications',
    'activity-logs',
    'analytics-events',
  ]
  const urls: Array<[string, string]> = [['Dashboard', '/admin']]
  for (const c of collections) {
    urls.push([`${c} list`, `/admin/collections/${c}`])
    if (!['job-applications', 'contact-messages', 'newsletter-subscribers'].includes(c)) {
      urls.push([`${c} create`, `/admin/collections/${c}/create`])
    }
    if (ids[c]) urls.push([`${c} edit`, `/admin/collections/${c}/${ids[c]}`])
  }
  for (const g of GLOBAL_SLUGS) urls.push([`global ${g}`, `/admin/globals/${g}`])
  for (const w of [
    'recruitment',
    'crm',
    'analytics',
    'newsletter',
    'seo',
    'ai',
    'media',
    'activity',
  ]) {
    urls.push([`workspace ${w}`, `/admin/workspace/${w}`])
  }
  urls.push(['Account', '/admin/account'])

  for (const [label, url] of urls) {
    const res = await http('GET', url, { cookie: token })
    const crashed =
      /Application error|Internal Server Error|__next_error__|NEXT_NOT_FOUND|data-next-error-message/.test(
        res.text,
      )
    const loginShown = isLoginPage(res.text)
    record(
      'ADMUI',
      'Admin UI / Page render',
      url,
      `${label} renders`,
      {
        steps: `GET ${url} with an authenticated admin session`,
        expected: 'HTTP 200, admin shell rendered, no error boundary',
        severity: 'High',
      },
      res.status === 200 && !crashed && !loginShown,
      `HTTP ${res.status}${crashed ? ' (error markers in HTML)' : ''}${loginShown ? ' (login form shown)' : ''}`,
    )
  }
}

async function runContent(token: string, mediaId: string) {
  const keepIds: Record<string, string> = {}

  for (const spec of CONTENT) {
    const keeperSlug = `test-qa-${spec.slug}`
    const title = `[TEST] QA ${spec.label}`
    await removeBySlug(spec.slug, keeperSlug, token)
    await removeBySlug(spec.slug, `${keeperSlug}-delete`, token)
    await removeBySlug(spec.slug, toSlug(`[TEST] QA ${spec.label} Dup`), token)

    // Validation: required fields
    const empty = await http('POST', `/api/${spec.slug}`, { token, json: { _status: 'published' } })
    record(
      spec.code,
      spec.module,
      `/admin/collections/${spec.slug}/create`,
      'Publishing with required fields empty is rejected',
      {
        steps: 'Create a document with no fields and try to publish',
        expected: 'HTTP 400 with field validation errors',
      },
      empty.status === 400,
      `HTTP ${empty.status} ${errText(empty.data)}`,
    )

    // Create draft
    const created = await http('POST', `/api/${spec.slug}?draft=true`, {
      token,
      json: { ...spec.build(title, keeperSlug, mediaId), _status: 'draft' },
    })
    const id = String(doc(created.data).id || '')
    record(
      spec.code,
      spec.module,
      `/admin/collections/${spec.slug}/create`,
      'Create draft with all main fields and relationships',
      {
        steps: 'Fill title, slug, required body fields, media relation; Save draft',
        data: `${title} / ${keeperSlug}`,
        expected: 'HTTP 201, _status draft',
        severity: 'High',
      },
      created.status === 201 && doc(created.data)._status === 'draft',
      `HTTP ${created.status} status=${String(doc(created.data)._status)} ${created.status >= 400 ? errText(created.data) : ''}`,
    )
    if (!id) continue
    keepIds[spec.slug] = id
    inventory.push({
      collection: spec.slug,
      id,
      label: title,
      slug: keeperSlug,
      state: 'published',
    })

    // Draft hidden publicly
    const anonDraft = await http('GET', `/api/${spec.slug}?where[slug][equals]=${keeperSlug}`)
    record(
      spec.code,
      spec.module,
      `/api/${spec.slug}`,
      'Draft is not visible to anonymous visitors',
      { steps: 'Query the REST API without a session', expected: '0 documents', severity: 'High' },
      docs(anonDraft.data).length === 0,
      `${docs(anonDraft.data).length} documents`,
    )
    if (spec.detail) {
      const page = await pageHtml(spec.detail(keeperSlug))
      record(
        spec.code,
        spec.module,
        spec.detail(keeperSlug),
        'Draft detail page is not public',
        {
          steps: `Open ${spec.detail(keeperSlug)} logged out`,
          expected: 'Not-found page (noindex); draft title not exposed',
          severity: 'High',
        },
        isNotFoundPage(page, title),
        `HTTP ${page.status}, ${page.html.includes(title) ? 'TITLE EXPOSED' : 'not-found page shown'}`,
      )
    }

    // Update creates a version
    const updated = await http('PATCH', `/api/${spec.slug}/${id}?draft=true`, {
      token,
      json: { title: `${title} v2`, _status: 'draft' },
    })
    const versions = await http(
      'GET',
      `/api/${spec.slug}/versions?where[parent][equals]=${id}&limit=50&depth=0`,
      { token },
    )
    record(
      spec.code,
      spec.module,
      `/admin/collections/${spec.slug}/${id}/versions`,
      'Editing a draft records version history',
      { steps: 'Change the title and save draft; open Versions', expected: '>= 2 versions' },
      updated.status === 200 && Number(versions.data.totalDocs || 0) >= 2,
      `update HTTP ${updated.status}, versions=${String(versions.data.totalDocs)}`,
    )
    record(
      spec.code,
      spec.module,
      `/api/${spec.slug}/${id}`,
      'Editing only the title keeps the existing slug (URL stays stable)',
      {
        steps: 'PATCH { title } without slug',
        expected: `slug stays ${keeperSlug}`,
        severity: 'High',
      },
      doc(updated.data).slug === keeperSlug,
      `slug=${String(doc(updated.data).slug)}`,
    )

    // Publish
    const published = await http('PATCH', `/api/${spec.slug}/${id}`, {
      token,
      json: { title, _status: 'published' },
    })
    record(
      spec.code,
      spec.module,
      `/admin/collections/${spec.slug}/${id}`,
      'Publish the document',
      { steps: 'Click Publish changes', expected: 'HTTP 200, _status published', severity: 'High' },
      published.status === 200 && doc(published.data)._status === 'published',
      `HTTP ${published.status} status=${String(doc(published.data)._status)}`,
    )

    const anonPub = await http('GET', `/api/${spec.slug}?where[slug][equals]=${keeperSlug}`)
    record(
      spec.code,
      spec.module,
      `/api/${spec.slug}`,
      'Published document is readable anonymously',
      { steps: 'Query the REST API without a session', expected: '1 document' },
      docs(anonPub.data).length === 1,
      `${docs(anonPub.data).length} documents`,
    )

    if (spec.detail) {
      const page = await pageHtml(spec.detail(keeperSlug))
      record(
        spec.code,
        spec.module,
        spec.detail(keeperSlug),
        'Published detail page renders on the website',
        {
          steps: `Open ${spec.detail(keeperSlug)} logged out`,
          expected: 'HTTP 200 and the TEST title in the HTML',
          severity: 'High',
        },
        page.status === 200 && page.html.includes('QA'),
        `HTTP ${page.status}, title ${page.html.includes('QA') ? 'present' : 'missing'}`,
      )
    }
    if (spec.list) {
      const page = await pageHtml(spec.list)
      const listed = page.html.includes(`/${keeperSlug}`)
      record(
        spec.code,
        spec.module,
        spec.list,
        spec.curated
          ? 'Listing stays curated to the canonical catalog (new entries reachable by URL/search)'
          : 'Published document appears in the public listing',
        {
          steps: `Open ${spec.list}`,
          expected: spec.curated
            ? 'HTTP 200; TEST record not listed (by design: CANONICAL slugs only)'
            : 'Listing contains the TEST record',
          severity: spec.curated ? 'Low' : 'Medium',
        },
        page.status === 200 && (spec.curated ? !listed : listed),
        `HTTP ${page.status}, link ${listed ? 'present' : 'missing'}`,
      )
    }

    if (spec.tracked) {
      const logs = await http(
        'GET',
        `/api/activity-logs?where[documentId][equals]=${id}&limit=20&depth=0`,
        { token },
      )
      const actions = docs(logs.data).map((d) => String(d.action))
      record(
        spec.code,
        spec.module,
        '/admin/workspace/activity',
        'Create and publish are written to the activity log',
        { steps: 'Open Activity after publishing', expected: 'created and published entries' },
        actions.includes('created') && actions.includes('published'),
        `actions: ${actions.join(', ') || 'none'}`,
      )
    }

    // Unique slug
    const dup = await http('POST', `/api/${spec.slug}?draft=true`, {
      token,
      json: { ...spec.build(`${title} duplicate`, keeperSlug, mediaId), _status: 'draft' },
    })
    record(
      spec.code,
      spec.module,
      `/admin/collections/${spec.slug}/create`,
      'Duplicate slug is rejected',
      {
        steps: `Create another document with slug ${keeperSlug}`,
        expected: 'HTTP 400 (slug unique)',
      },
      dup.status === 400,
      `HTTP ${dup.status} ${errText(dup.data)}`,
    )
    if (dup.status === 201) await http('DELETE', `/api/${spec.slug}/${doc(dup.data).id}`, { token })

    // Auto slug from title
    const auto = await http('POST', `/api/${spec.slug}?draft=true`, {
      token,
      json: {
        ...spec.build(`[TEST] QA ${spec.label} Dup`, '', mediaId),
        slug: undefined,
        _status: 'draft',
      },
    })
    const autoSlug = String(doc(auto.data).slug || '')
    const expectedSlug = toSlug(`[TEST] QA ${spec.label} Dup`)
    record(
      spec.code,
      spec.module,
      `/admin/collections/${spec.slug}/create`,
      'Slug is generated from the title when left empty',
      {
        steps: 'Create with title and an empty slug',
        data: `[TEST] QA ${spec.label} Dup`,
        expected: `slug ${expectedSlug}`,
      },
      auto.status === 201 && autoSlug === expectedSlug,
      `HTTP ${auto.status} slug=${autoSlug || errText(auto.data)}`,
    )
    if (auto.status === 201)
      await http('DELETE', `/api/${spec.slug}/${doc(auto.data).id}`, { token })

    // Delete flow
    const throwaway = await http('POST', `/api/${spec.slug}`, {
      token,
      json: {
        ...spec.build(`${title} Delete`, `${keeperSlug}-delete`, mediaId),
        _status: 'published',
      },
    })
    const tid = String(doc(throwaway.data).id || '')
    const del = tid ? await http('DELETE', `/api/${spec.slug}/${tid}`, { token }) : { status: 0 }
    const after = tid
      ? await http('GET', `/api/${spec.slug}/${tid}?draft=true`, { token })
      : { status: 0 }
    let pageGone = true
    if (spec.detail && tid) {
      pageGone = isNotFoundPage(
        await pageHtml(spec.detail(`${keeperSlug}-delete`)),
        `${title} Delete`,
      )
    }
    record(
      spec.code,
      spec.module,
      `/admin/collections/${spec.slug}`,
      'Delete removes the document and its public page',
      {
        steps: 'Create + publish a throwaway, delete it, reopen it and its public URL',
        expected: 'DELETE 200, GET 404, public URL shows the not-found page',
        severity: 'High',
      },
      del.status === 200 && after.status === 404 && pageGone,
      `create ${throwaway.status}, delete ${del.status}, reopen ${after.status}, public ${pageGone ? '404' : 'still live'}`,
    )
  }
  return keepIds
}

async function runSimple(token: string, mediaId: string, pdfId: string) {
  const ids: Record<string, string> = {}
  for (const spec of SIMPLE) {
    const title = `[TEST] QA ${spec.module.split('/ ')[1]}`
    const slug = `test-qa-${spec.slug}`
    if (spec.hasSlug) {
      await removeBySlug(spec.slug, slug, token)
      await removeBySlug(spec.slug, `${slug}-delete`, token)
    } else {
      await removeWhere(
        spec.slug,
        `where[${spec.titleField}][contains]=${encodeURIComponent('[TEST]')}`,
        token,
      )
    }

    const empty = await http('POST', `/api/${spec.slug}`, { token, json: {} })
    record(
      spec.code,
      spec.module,
      `/admin/collections/${spec.slug}/create`,
      'Saving with required fields empty is rejected',
      { steps: 'Create with no fields', expected: 'HTTP 400 validation errors' },
      empty.status === 400,
      `HTTP ${empty.status} ${errText(empty.data)}`,
    )

    const created = await http('POST', `/api/${spec.slug}`, {
      token,
      json: spec.build(title, slug, mediaId, { pdf: pdfId }),
    })
    const id = String(doc(created.data).id || '')
    record(
      spec.code,
      spec.module,
      `/admin/collections/${spec.slug}/create`,
      'Create with required fields and relations',
      { steps: 'Fill the form and Save', data: title, expected: 'HTTP 201', severity: 'High' },
      created.status === 201,
      `HTTP ${created.status} ${created.status >= 400 ? errText(created.data) : ''}`,
    )
    if (!id) continue
    ids[spec.slug] = id
    inventory.push({
      collection: spec.slug,
      id,
      label: title,
      slug: spec.hasSlug ? slug : '',
      state: 'saved',
    })

    const upd = await http('PATCH', `/api/${spec.slug}/${id}`, {
      token,
      json: { [spec.updateField]: `${title} (edited)` },
    })
    const reread = await http('GET', `/api/${spec.slug}/${id}?depth=0`, { token })
    record(
      spec.code,
      spec.module,
      `/admin/collections/${spec.slug}/${id}`,
      'Edit and save persists the change',
      { steps: `Change ${spec.updateField} and Save, reload`, expected: 'Value persisted' },
      upd.status === 200 && String(reread.data[spec.updateField]).includes('(edited)'),
      `HTTP ${upd.status}, value=${String(reread.data[spec.updateField]).slice(0, 60)}`,
    )
    await http('PATCH', `/api/${spec.slug}/${id}`, {
      token,
      json: { [spec.updateField]: spec.slug === 'faqs' ? `${title}?` : title },
    })

    if (spec.hasSlug) {
      const dup = await http('POST', `/api/${spec.slug}`, {
        token,
        json: spec.build(`${title} dup`, slug, mediaId, { pdf: pdfId }),
      })
      record(
        spec.code,
        spec.module,
        `/admin/collections/${spec.slug}/create`,
        'Duplicate slug is rejected',
        { steps: `Create another with slug ${slug}`, expected: 'HTTP 400' },
        dup.status === 400,
        `HTTP ${dup.status}`,
      )
      if (dup.status === 201)
        await http('DELETE', `/api/${spec.slug}/${doc(dup.data).id}`, { token })
    }

    const throwaway = await http('POST', `/api/${spec.slug}`, {
      token,
      json: spec.build(`${title} Delete`, `${slug}-delete`, mediaId, { pdf: pdfId }),
    })
    const tid = String(doc(throwaway.data).id || '')
    const del = tid ? await http('DELETE', `/api/${spec.slug}/${tid}`, { token }) : { status: 0 }
    const after = tid ? await http('GET', `/api/${spec.slug}/${tid}`, { token }) : { status: 0 }
    record(
      spec.code,
      spec.module,
      `/admin/collections/${spec.slug}`,
      'Delete removes the document',
      { steps: 'Create a throwaway, delete it, reopen it', expected: 'DELETE 200 then GET 404' },
      del.status === 200 && after.status === 404,
      `create ${throwaway.status}, delete ${del.status}, reopen ${after.status}`,
    )
  }
  return ids
}

async function runMedia(token: string) {
  // Resumes uploaded through the public apply form belong to the pipelines phase
  await removeWhere(
    'media',
    `where[filename][like]=test-qa-&where[folder][not_equals]=resumes`,
    token,
  )
  const png = await uploadMedia(
    token,
    'test-qa-hero.png',
    await pngBuffer('#0d9488'),
    'image/png',
    {
      alt: '[TEST] QA hero image',
      folder: 'hero',
      tags: [{ tag: 'TEST-QA' }],
    },
  )
  const image = doc(png.data)
  const sizes = (image.sizes as Record<string, { url?: string | null }>) || {}
  const generated = Object.values(sizes).filter((s) => s?.url).length
  record(
    'MEDIA',
    'Media / Library',
    '/admin/collections/media/create',
    'Upload a PNG image with alt, folder and tags',
    {
      steps: 'Upload 1600x1000 PNG, set alt/folder/tag, Save',
      data: 'test-qa-hero.png',
      expected: 'HTTP 201 and resized variants generated',
      severity: 'High',
    },
    png.status === 201 && generated >= 3,
    `HTTP ${png.status}, sizes with url: ${generated}/${Object.keys(sizes).length} ${png.status >= 400 ? errText(png.data) : ''}`,
  )

  const fileRes = image.url ? await fetch(new URL(String(image.url), BASE)) : null
  record(
    'MEDIA',
    'Media / Library',
    String(image.url || ''),
    'Uploaded file URL is served',
    { steps: 'Open the media URL', expected: 'HTTP 200 image' },
    Boolean(fileRes && fileRes.status === 200),
    `HTTP ${fileRes?.status ?? 'n/a'}`,
  )

  const pdf = await uploadMedia(token, 'test-qa-brochure.pdf', PDF, 'application/pdf', {
    alt: '[TEST] QA brochure PDF',
    folder: 'documents',
  })
  record(
    'MEDIA',
    'Media / Library',
    '/admin/collections/media/create',
    'Upload a PDF document',
    { steps: 'Upload a PDF with alt text', data: 'test-qa-brochure.pdf', expected: 'HTTP 201' },
    pdf.status === 201,
    `HTTP ${pdf.status} ${pdf.status >= 400 ? errText(pdf.data) : ''}`,
  )

  const noAlt = await uploadMedia(
    token,
    'test-qa-noalt.png',
    await pngBuffer('#1e293b'),
    'image/png',
    {},
  )
  record(
    'MEDIA',
    'Media / Library',
    '/admin/collections/media/create',
    'Upload without alt text is rejected',
    { steps: 'Upload an image leaving alt empty', expected: 'HTTP 400 (alt required)' },
    noAlt.status === 400,
    `HTTP ${noAlt.status}`,
  )
  if (noAlt.status === 201) await http('DELETE', `/api/media/${doc(noAlt.data).id}`, { token })

  const bad = await uploadMedia(
    token,
    'test-qa-script.sh',
    Buffer.from('#!/bin/sh\necho test'),
    'application/x-sh',
    { alt: '[TEST] QA bad type' },
  )
  record(
    'MEDIA',
    'Media / Library',
    '/admin/collections/media/create',
    'Disallowed file type is rejected',
    {
      steps: 'Upload a .sh script',
      expected: 'HTTP 400 (mime type not allowed)',
      severity: 'High',
    },
    bad.status === 400,
    `HTTP ${bad.status}`,
  )
  if (bad.status === 201) await http('DELETE', `/api/media/${doc(bad.data).id}`, { token })

  const id = String(image.id || '')
  if (id) {
    inventory.push({
      collection: 'media',
      id,
      label: '[TEST] QA hero image',
      slug: 'test-qa-hero.png',
      state: 'saved',
    })
    const logs = await http('GET', `/api/activity-logs?where[documentId][equals]=${id}&depth=0`, {
      token,
    })
    record(
      'MEDIA',
      'Media / Library',
      '/admin/workspace/activity',
      'Upload is logged as activity',
      { steps: 'Upload, then open Activity', expected: 'An "upload" activity entry' },
      docs(logs.data).some((d) => d.action === 'upload'),
      `actions: ${
        docs(logs.data)
          .map((d) => String(d.action))
          .join(', ') || 'none'
      }`,
    )
  }
  const pdfId = String(doc(pdf.data).id || '')
  if (pdfId) {
    inventory.push({
      collection: 'media',
      id: pdfId,
      label: '[TEST] QA brochure PDF',
      slug: 'test-qa-brochure.pdf',
      state: 'saved',
    })
  }
  return { mediaId: id, pdfId }
}

async function runDownloads(token: string, downloadId: string) {
  if (!downloadId) return
  const before = Number(
    (await http('GET', `/api/downloads/${downloadId}?depth=0`, { token })).data.downloadCount || 0,
  )
  const open = await http('GET', '/api/download/test-qa-downloads', { redirect: 'manual' })
  await new Promise((r) => setTimeout(r, 1500))
  const afterCount = Number(
    (await http('GET', `/api/downloads/${downloadId}?depth=0`, { token })).data.downloadCount || 0,
  )
  record(
    'DWNL',
    'Insights / Downloads',
    '/api/download/test-qa-downloads',
    'Public download redirects to the file and counts it',
    { steps: 'Open the download URL logged out', expected: '307/302 redirect, downloadCount +1' },
    [302, 307, 308].includes(open.status) && afterCount === before + 1,
    `HTTP ${open.status}, count ${before} -> ${afterCount}`,
  )

  await http('PATCH', `/api/downloads/${downloadId}`, { token, json: { gated: true } })
  const gated = await http('GET', '/api/download/test-qa-downloads', { redirect: 'manual' })
  const gatedOk = await http(
    'GET',
    `/api/download/test-qa-downloads?email=qa.test%2Bdownload-1${TEST_EMAIL_DOMAIN}`,
    {
      redirect: 'manual',
    },
  )
  record(
    'DWNL',
    'Insights / Downloads',
    '/api/download/test-qa-downloads',
    'Gated download requires an email',
    {
      steps: 'Mark gated; open without and with ?email=',
      expected: '401 without email, redirect with email',
    },
    gated.status === 401 && [302, 307, 308].includes(gatedOk.status),
    `without ${gated.status}, with ${gatedOk.status}`,
  )
  const missing = await http('GET', '/api/download/test-qa-does-not-exist', { redirect: 'manual' })
  record(
    'DWNL',
    'Insights / Downloads',
    '/api/download/test-qa-does-not-exist',
    'Unknown download slug returns 404',
    { steps: 'Open a non-existent slug', expected: 'HTTP 404', severity: 'Low' },
    missing.status === 404,
    `HTTP ${missing.status}`,
  )
}

async function runEndpoints(token: string) {
  const search = await http('GET', `/api/admin/search?q=${encodeURIComponent('[TEST] QA')}`, {
    token,
  })
  const found = ((search.data.results as Json[]) || []).length
  record(
    'HDR',
    'Admin header / Command palette',
    '/api/admin/search',
    'Command palette search finds TEST records',
    {
      steps: 'Open the command palette (Cmd+K) and type "[TEST] QA"',
      expected: 'Results from several collections',
    },
    search.status === 200 && found > 0,
    `HTTP ${search.status}, ${found} results`,
  )
  const anonSearch = await http('GET', '/api/admin/search?q=test')
  record(
    'HDR',
    'Admin header / Command palette',
    '/api/admin/search',
    'Search requires a session',
    {
      pre: 'Logged out',
      steps: 'Call the search API logged out',
      expected: 'HTTP 401',
      severity: 'High',
    },
    anonSearch.status === 401,
    `HTTP ${anonSearch.status}`,
  )

  const notes = await http('GET', '/api/admin/notifications', { token })
  record(
    'HDR',
    'Admin header / Notifications',
    '/api/admin/notifications',
    'Notification bell lists my notifications',
    { steps: 'Open the bell', expected: 'HTTP 200 with items and unread count' },
    notes.status === 200 && Array.isArray(notes.data.items),
    `HTTP ${notes.status}, items=${((notes.data.items as unknown[]) || []).length}, unread=${String(notes.data.unread)}`,
  )
  const first = ((notes.data.items as Json[]) || [])[0]
  if (first) {
    const one = await http('POST', '/api/admin/notifications', { token, json: { id: first.id } })
    record(
      'HDR',
      'Admin header / Notifications',
      '/api/admin/notifications',
      'Mark one notification as read',
      { steps: 'Click a notification', expected: 'HTTP 200 ok' },
      one.status === 200,
      `HTTP ${one.status}`,
    )
  }
  const all = await http('POST', '/api/admin/notifications', { token, json: { markAll: true } })
  const recheck = await http('GET', '/api/admin/notifications', { token })
  record(
    'HDR',
    'Admin header / Notifications',
    '/api/admin/notifications',
    'Mark all as read clears the unread badge',
    { steps: 'Click "Mark all read"', expected: 'unread = 0' },
    all.status === 200 && Number(recheck.data.unread) === 0,
    `HTTP ${all.status}, unread now ${String(recheck.data.unread)}`,
  )

  const event = await http('POST', '/api/analytics/event', {
    json: { type: 'pageview', path: '/test-qa-analytics', meta: { tag: 'TEST-QA' } },
  })
  const badEvent = await http('POST', '/api/analytics/event', {
    json: { type: 'hack', path: '/test-qa' },
  })
  record(
    'ANLT',
    'Analytics / Events',
    '/api/analytics/event',
    'Pageview events are recorded and unknown types rejected',
    { pre: 'Logged out', steps: 'POST a pageview, then an invalid type', expected: '200 then 400' },
    event.status === 200 && badEvent.status === 400,
    `pageview ${event.status}, invalid ${badEvent.status}`,
  )

  const openapi = await http('GET', '/api/openapi')
  record(
    'API',
    'Developer / API docs',
    '/api/openapi',
    'OpenAPI document is served',
    {
      pre: 'Logged out',
      steps: 'GET /api/openapi; open /docs/api',
      expected: 'HTTP 200 JSON with paths',
      severity: 'Low',
    },
    openapi.status === 200 && Boolean(openapi.data.paths),
    `HTTP ${openapi.status}`,
  )
  const docsPage = await pageHtml('/docs/api')
  record(
    'API',
    'Developer / API docs',
    '/docs/api',
    'API docs page renders',
    { pre: 'Logged out', steps: 'Open /docs/api', expected: 'HTTP 200', severity: 'Low' },
    docsPage.status === 200,
    `HTTP ${docsPage.status}`,
  )

  const siteSearch = await pageHtml(`/search?q=${encodeURIComponent('QA Blog')}`)
  record(
    'SRCH',
    'Website / Site search',
    '/search?q=QA Blog',
    'Published TEST blog is found by site search',
    {
      pre: 'TEST blog published',
      steps: 'Search "QA Blog" on /search',
      expected: 'Result links to /blog/test-qa-blogs',
    },
    siteSearch.status === 200 && siteSearch.html.includes('test-qa-blogs'),
    `HTTP ${siteSearch.status}, ${siteSearch.html.includes('test-qa-blogs') ? 'found' : 'not found'}`,
  )

  const failedLogin = await http('POST', '/api/users/login', {
    json: { email: `nobody${TEST_EMAIL_DOMAIN}`, password: 'wrong-password' },
  })
  record(
    'AUTH',
    'System / Authentication',
    '/admin/login',
    'Wrong credentials are rejected',
    {
      pre: 'Logged out',
      steps: 'Log in with an unknown email',
      expected: 'HTTP 401',
      severity: 'High',
    },
    failedLogin.status === 401,
    `HTTP ${failedLogin.status}`,
  )
  const anonAdmin = await http('GET', '/admin/collections/blogs', { redirect: 'manual' })
  record(
    'AUTH',
    'System / Authentication',
    '/admin/collections/blogs',
    'Admin pages redirect to login when logged out',
    {
      pre: 'Logged out',
      steps: 'Open an admin list URL',
      expected: 'Redirect to /admin/login',
      severity: 'High',
    },
    [302, 303, 307].includes(anonAdmin.status) || anonAdmin.text.includes('login'),
    `HTTP ${anonAdmin.status} ${anonAdmin.headers.get('location') || ''}`,
  )
}

type GlobalCheck = {
  slug: string
  code: string
  edit: (current: Json) => Json
  verifyUrl?: string
  marker: string
}

const GLOBAL_CHECKS: GlobalCheck[] = [
  {
    slug: 'site-settings',
    code: 'GSITE',
    edit: () => ({ tagline: '[TEST] QA tagline' }),
    verifyUrl: '/',
    marker: '[TEST] QA tagline',
  },
  {
    slug: 'navigation',
    code: 'GNAV',
    edit: (c) => ({
      primaryLinks: [
        ...((c.primaryLinks as Json[]) || []),
        { label: '[TEST] QA Link', href: '/careers' },
      ],
    }),
    verifyUrl: '/',
    marker: '[TEST] QA Link',
  },
  {
    slug: 'footer',
    code: 'GFOOT',
    edit: () => ({ copyright: '[TEST] QA copyright' }),
    verifyUrl: '/',
    marker: '[TEST] QA copyright',
  },
  {
    slug: 'contact-details',
    code: 'GCONT',
    edit: () => ({ hours: '[TEST] QA hours' }),
    verifyUrl: '/contact',
    marker: '[TEST] QA hours',
  },
  {
    slug: 'office-locations',
    code: 'GOFF',
    edit: (c) => ({
      locations: [
        ...((c.locations as Json[]) || []),
        {
          name: '[TEST] QA Office',
          city: 'Test City',
          country: 'India',
          address: 'TEST-QA street 1',
        },
      ],
    }),
    verifyUrl: '/contact',
    marker: '[TEST] QA Office',
  },
  {
    slug: 'social-media',
    code: 'GSOC',
    edit: () => ({ github: 'https://github.com/test-qa-xelarvis' }),
    verifyUrl: '/contact',
    marker: 'github.com/test-qa-xelarvis',
  },
  {
    slug: 'seo-defaults',
    code: 'GSEO',
    edit: () => ({ defaultDescription: '[TEST] QA default description' }),
    verifyUrl: '/',
    marker: '[TEST] QA default description',
  },
  {
    slug: 'announcement-bar',
    code: 'GANN',
    edit: () => ({
      enabled: true,
      message: '[TEST] QA announcement',
      ctaLabel: 'TEST-QA',
      ctaLink: '/careers',
    }),
    verifyUrl: '/',
    marker: '[TEST] QA announcement',
  },
  {
    slug: 'cookie-banner',
    code: 'GCOOK',
    edit: () => ({ enabled: true, message: '[TEST] QA cookie message' }),
    verifyUrl: '/',
    marker: '[TEST] QA cookie message',
  },
  {
    slug: 'analytics',
    code: 'GANL',
    edit: () => ({ googleAnalyticsId: 'G-TESTQA0001' }),
    verifyUrl: '/',
    marker: 'G-TESTQA0001',
  },
]

async function runGlobals(token: string) {
  const snapshot = JSON.parse(
    await readFile(path.join(SNAPSHOT_DIR, 'globals-latest.json'), 'utf8'),
  ) as Record<string, Json>
  const SYSTEM = new Set(['id', 'globalType', 'createdAt', 'updatedAt'])

  for (const check of GLOBAL_CHECKS) {
    const current = (await http('GET', `/api/globals/${check.slug}?depth=0`, { token })).data
    const anon = await http('GET', `/api/globals/${check.slug}?depth=0`)
    record(
      check.code,
      `Settings / ${check.slug}`,
      `/api/globals/${check.slug}`,
      'Global is publicly readable',
      {
        pre: 'Logged out',
        steps: 'GET the global REST endpoint',
        expected: 'HTTP 200',
        severity: 'Low',
      },
      anon.status === 200,
      `HTTP ${anon.status}`,
    )

    const save = await http('POST', `/api/globals/${check.slug}`, {
      token,
      json: check.edit(current),
    })
    record(
      check.code,
      `Settings / ${check.slug}`,
      `/admin/globals/${check.slug}`,
      'Edit and save the global',
      {
        steps: 'Change a field to a [TEST] value and Save',
        data: check.marker,
        expected: 'HTTP 200',
        severity: 'High',
      },
      save.status === 200,
      `HTTP ${save.status} ${save.status >= 400 ? errText(save.data) : ''}`,
    )

    if (check.verifyUrl) {
      await new Promise((r) => setTimeout(r, 800))
      const page = await pageHtml(check.verifyUrl)
      const shown =
        page.html.includes(check.marker) || page.html.includes(check.marker.replace(/&/g, '&amp;'))
      record(
        check.code,
        `Settings / ${check.slug}`,
        check.verifyUrl,
        'Saved value is reflected on the website',
        {
          steps: `Reload ${check.verifyUrl} after saving`,
          expected: `"${check.marker}" visible on the page`,
          severity: 'Medium',
        },
        shown,
        shown ? 'value rendered' : 'value NOT rendered on the website',
      )
    }

    // Restore immediately from the snapshot (clear any keys the edit introduced)
    const latest = (await http('GET', `/api/globals/${check.slug}?depth=0`, { token })).data
    const data: Json = {}
    for (const key of Object.keys(latest)) if (!SYSTEM.has(key)) data[key] = null
    for (const [key, value] of Object.entries(snapshot[check.slug] || {})) {
      if (!SYSTEM.has(key)) data[key] = value
    }
    const restore = await http('POST', `/api/globals/${check.slug}`, { token, json: data })
    const page = check.verifyUrl ? await pageHtml(check.verifyUrl) : { html: '' }
    record(
      check.code,
      `Settings / ${check.slug}`,
      `/admin/globals/${check.slug}`,
      'Restore original value from snapshot',
      {
        steps: 'npm run test:restore (or re-save original values)',
        expected: 'HTTP 200, TEST value gone',
      },
      restore.status === 200 && !page.html.includes(check.marker),
      `HTTP ${restore.status}, marker ${page.html.includes(check.marker) ? 'still present' : 'gone'}`,
    )
  }
}

/* ---------------------------------------------------------------- pipelines */

async function runPipelines(token: string) {
  const appEmail = `qa.test+career-1${TEST_EMAIL_DOMAIN}`
  const appRes = await http(
    'GET',
    `/api/job-applications?where[email][equals]=${encodeURIComponent(appEmail)}&depth=0&limit=1`,
    { token },
  )
  const app = docs(appRes.data)[0]
  record(
    'APP',
    'Recruitment / Applications',
    '/careers/test-qa-careers',
    'Application submitted on the website lands in the admin',
    {
      pre: 'Public apply form submitted with qa.test+career-1@xelarvis.test',
      steps: 'Open Recruitment > Applications',
      expected: 'Application exists with status new, resume and applicationId',
      severity: 'Critical',
    },
    Boolean(app && app.resume && app.applicationId),
    app ? `found ${String(app.applicationId)} status=${String(app.status)}` : 'not found',
  )

  if (app?.resume) {
    const resume = doc(
      (await http('GET', `/api/media/${String(app.resume)}?depth=0`, { token })).data,
    )
    const fileUrl = `/api/media/file/${encodeURIComponent(String(resume.filename))}`
    const anonFile = await http('GET', fileUrl)
    const staffFile = await http('GET', fileUrl, { token })
    const anonList = await http('GET', `/api/media?where[id][equals]=${String(app.resume)}&depth=0`)
    record(
      'APP',
      'Recruitment / Applications',
      '/api/media/file/<resume>',
      'Candidate resumes are private to recruiting staff',
      {
        steps: 'Fetch the resume file and media record without a session, then as super-admin',
        expected: 'Anonymous: file 403 and not listed; super-admin: file 200; folder = resumes',
        severity: 'Critical',
      },
      anonFile.status === 403 &&
        docs(anonList.data).length === 0 &&
        staffFile.status === 200 &&
        resume.folder === 'resumes',
      `anon file ${anonFile.status}, anon listed ${docs(anonList.data).length}, staff file ${staffFile.status}, folder ${String(resume.folder)}`,
    )
  }

  const adminCreate = await http('POST', '/api/job-applications', {
    token,
    json: { name: '[TEST] x', email: appEmail },
  })
  record(
    'APP',
    'Recruitment / Applications',
    '/admin/collections/job-applications',
    'Applications cannot be created from the admin',
    { steps: 'POST to job-applications as super-admin', expected: 'HTTP 403', severity: 'Low' },
    adminCreate.status === 403,
    `HTTP ${adminCreate.status}`,
  )

  if (app) {
    inventory.push({
      collection: 'job-applications',
      id: String(app.id),
      label: String(app.name),
      slug: String(app.applicationId),
      state: 'hired',
    })
    const statuses = [
      'under-review',
      'shortlisted',
      'interview-scheduled',
      'technical-assessment',
      'final-interview',
      'offered',
      'hired',
    ]
    const failures: string[] = []
    for (const status of statuses) {
      const res = await http('PATCH', `/api/job-applications/${app.id}`, {
        token,
        json: { status },
      })
      if (res.status !== 200 || doc(res.data).status !== status)
        failures.push(`${status}:${res.status}`)
    }
    record(
      'APP',
      'Recruitment / Applications',
      `/admin/collections/job-applications/${String(app.id)}`,
      'Move the application through every pipeline stage',
      {
        steps: `Set status ${statuses.join(' -> ')}`,
        expected: 'Each save HTTP 200',
        severity: 'High',
      },
      failures.length === 0,
      failures.length ? failures.join(', ') : 'all stages saved',
    )
    const logs = await http(
      'GET',
      `/api/activity-logs?where[documentId][equals]=${String(app.id)}&limit=50&depth=0`,
      { token },
    )
    const changes = docs(logs.data).filter((d) => d.action === 'status-change').length
    record(
      'APP',
      'Recruitment / Applications',
      '/admin/workspace/activity',
      'Every status change is logged',
      { steps: 'Open Activity', expected: `>= ${statuses.length} status-change entries` },
      changes >= statuses.length,
      `${changes} status-change entries`,
    )
    for (const status of ['rejected', 'withdrawn']) {
      const res = await http('PATCH', `/api/job-applications/${app.id}`, {
        token,
        json: { status },
      })
      record(
        'APP',
        'Recruitment / Applications',
        `/admin/collections/job-applications/${String(app.id)}`,
        `Terminal status "${status}" can be set`,
        { steps: `Set status ${status}`, expected: 'HTTP 200' },
        res.status === 200,
        `HTTP ${res.status}`,
      )
    }
    await http('PATCH', `/api/job-applications/${app.id}`, {
      token,
      json: { status: 'interview-scheduled' },
    })

    const notif = await http(
      'GET',
      `/api/notifications?where[type][equals]=application&sort=-createdAt&limit=5&depth=0`,
      { token },
    )
    record(
      'APP',
      'Recruitment / Applications',
      '/admin (bell)',
      'Staff are notified of the new application',
      {
        steps: 'Open the notification bell',
        expected: '"New job application" notification',
        severity: 'High',
      },
      docs(notif.data).some((d) => String(d.body).includes('QA')),
      `${docs(notif.data).length} recent application notifications`,
    )

    // Interview
    await removeWhere('interviews', `where[title][contains]=${encodeURIComponent('[TEST]')}`, token)
    const me = await http('GET', '/api/users/me', { token })
    const meId = (me.data.user as Json | undefined)?.id
    const interview = await http('POST', '/api/interviews', {
      token,
      json: {
        title: '[TEST] QA Technical interview',
        application: app.id,
        job: app.career,
        scheduledAt: new Date(Date.now() + 2 * 86400000).toISOString(),
        mode: 'video',
        meetingLink: 'https://meet.example.com/test-qa',
        interviewers: meId ? [meId] : [],
      },
    })
    const iid = String(doc(interview.data).id || '')
    record(
      'INTV',
      'Recruitment / Interviews',
      '/admin/collections/interviews/create',
      'Schedule an interview for the TEST application',
      {
        steps: 'Create interview with application, job, date, mode, interviewer',
        expected: 'HTTP 201',
        severity: 'High',
      },
      interview.status === 201,
      `HTTP ${interview.status} ${interview.status >= 400 ? errText(interview.data) : ''}`,
    )
    if (iid) {
      inventory.push({
        collection: 'interviews',
        id: iid,
        label: '[TEST] QA Technical interview',
        slug: '',
        state: 'completed',
      })
      const missing = await http('POST', '/api/interviews', {
        token,
        json: { title: '[TEST] QA missing fields' },
      })
      record(
        'INTV',
        'Recruitment / Interviews',
        '/admin/collections/interviews/create',
        'Interview without application/date is rejected',
        { steps: 'Save with only a title', expected: 'HTTP 400' },
        missing.status === 400,
        `HTTP ${missing.status}`,
      )
      const outcome = await http('PATCH', `/api/interviews/${iid}`, {
        token,
        json: { outcome: 'completed' },
      })
      record(
        'INTV',
        'Recruitment / Interviews',
        `/admin/collections/interviews/${iid}`,
        'Record the interview outcome',
        { steps: 'Set outcome Completed and Save', expected: 'HTTP 200' },
        outcome.status === 200,
        `HTTP ${outcome.status}`,
      )
    }
  }

  // Leads
  const leadEmail = `qa.test+lead-1${TEST_EMAIL_DOMAIN}`
  const leadRes = await http(
    'GET',
    `/api/contact-messages?where[email][equals]=${encodeURIComponent(leadEmail)}&depth=0&limit=1`,
    { token },
  )
  const lead = docs(leadRes.data)[0]
  record(
    'LEAD',
    'Sales CRM / Leads',
    '/contact',
    'Contact form submission becomes a lead',
    {
      pre: 'Public contact form submitted with qa.test+lead-1@xelarvis.test',
      steps: 'Open Sales CRM > Leads',
      expected: 'Lead exists with status new',
      severity: 'Critical',
    },
    Boolean(lead),
    lead ? `found, status=${String(lead.status)}` : 'not found',
  )
  const honeypot = await http(
    'GET',
    `/api/contact-messages?where[email][equals]=${encodeURIComponent(`qa.test+honeypot${TEST_EMAIL_DOMAIN}`)}&depth=0`,
    { token },
  )
  record(
    'LEAD',
    'Sales CRM / Leads',
    '/contact',
    'Honeypot-filled submission is discarded',
    {
      pre: 'Contact form submitted with the hidden "website" field filled',
      steps: 'Search leads',
      expected: 'No lead stored',
      severity: 'High',
    },
    docs(honeypot.data).length === 0,
    `${docs(honeypot.data).length} stored`,
  )
  if (lead) {
    inventory.push({
      collection: 'contact-messages',
      id: String(lead.id),
      label: String(lead.name),
      slug: '',
      state: 'won',
    })
    const me = await http('GET', '/api/users/me', { token })
    const meId = (me.data.user as Json | undefined)?.id
    const failures: string[] = []
    for (const status of ['assigned', 'meeting', 'proposal', 'won']) {
      const res = await http('PATCH', `/api/contact-messages/${lead.id}`, {
        token,
        json: {
          status,
          assignee: meId,
          dealValue: 125000,
          nextFollowUp: new Date(Date.now() + 86400000).toISOString(),
          activityNotes: [{ note: `TEST-QA moved to ${status}` }],
        },
      })
      if (res.status !== 200) failures.push(`${status}:${res.status} ${errText(res.data)}`)
    }
    record(
      'LEAD',
      'Sales CRM / Leads',
      `/admin/collections/contact-messages/${String(lead.id)}`,
      'Move the lead through the pipeline with assignee, deal value and notes',
      {
        steps: 'assigned -> meeting -> proposal -> won, add note each step',
        expected: 'Each save HTTP 200',
        severity: 'High',
      },
      failures.length === 0,
      failures.length ? failures.join('; ') : 'all stages saved',
    )
    const lost = await http('PATCH', `/api/contact-messages/${lead.id}`, {
      token,
      json: { status: 'lost' },
    })
    await http('PATCH', `/api/contact-messages/${lead.id}`, { token, json: { status: 'won' } })
    record(
      'LEAD',
      'Sales CRM / Leads',
      `/admin/collections/contact-messages/${String(lead.id)}`,
      'Lead can be marked lost and reopened',
      { steps: 'Set Lost, then back to Won', expected: 'HTTP 200' },
      lost.status === 200,
      `HTTP ${lost.status}`,
    )
    const notif = await http(
      'GET',
      `/api/notifications?where[type][equals]=lead&sort=-createdAt&limit=5&depth=0`,
      { token },
    )
    record(
      'LEAD',
      'Sales CRM / Leads',
      '/admin (bell)',
      'Staff are notified of the new lead',
      { steps: 'Open the bell', expected: '"New lead" notification' },
      docs(notif.data).some((d) => String(d.body).includes('QA')),
      `${docs(notif.data).length} recent lead notifications`,
    )
  }

  // Form submissions (admin-only inbox)
  // `data` is JSON and not text-queryable, so filter archived submissions to TEST ones client-side
  const archived = await http(
    'GET',
    '/api/form-submissions?where[status][equals]=archived&depth=0&limit=100',
    { token },
  )
  for (const d of docs(archived.data).filter(hasTestMarker)) {
    await http('DELETE', `/api/form-submissions/${String(d.id)}`, { token })
  }
  const fs = await http('POST', '/api/form-submissions', {
    token,
    json: {
      type: 'contact',
      data: { tag: 'TEST-QA', email: `qa.test+form-1${TEST_EMAIL_DOMAIN}` },
      status: 'new',
    },
  })
  const fsId = String(doc(fs.data).id || '')
  const fsUpd = fsId
    ? await http('PATCH', `/api/form-submissions/${fsId}`, { token, json: { status: 'reviewed' } })
    : { status: 0 }
  record(
    'FORM',
    'Sales CRM / Form submissions',
    '/admin/collections/form-submissions',
    'Create and review a form submission',
    { steps: 'Create with JSON data, set Reviewed', expected: '201 then 200' },
    fs.status === 201 && fsUpd.status === 200,
    `create ${fs.status}, review ${fsUpd.status}`,
  )
  if (fsId)
    inventory.push({
      collection: 'form-submissions',
      id: fsId,
      label: 'TEST-QA contact JSON',
      slug: '',
      state: 'reviewed',
    })

  // Newsletter
  const subEmail = `qa.test+newsletter-1${TEST_EMAIL_DOMAIN}`
  const subRes = await http(
    'GET',
    `/api/newsletter-subscribers?where[email][equals]=${encodeURIComponent(subEmail)}&depth=0`,
    { token },
  )
  const sub = docs(subRes.data)[0]
  record(
    'NEWS',
    'Marketing / Newsletter',
    '/ (footer signup)',
    'Website signup creates a subscriber (once)',
    {
      pre: 'Footer newsletter form submitted twice with qa.test+newsletter-1@xelarvis.test',
      steps: 'Open Marketing > Subscribers',
      expected: 'Exactly one active subscriber',
      severity: 'High',
    },
    docs(subRes.data).length === 1 && sub?.status === 'active',
    `${docs(subRes.data).length} rows, status=${String(sub?.status)}`,
  )
  if (sub) {
    inventory.push({
      collection: 'newsletter-subscribers',
      id: String(sub.id),
      label: subEmail,
      slug: '',
      state: 'active',
    })
    const unsub = await http('PATCH', `/api/newsletter-subscribers/${sub.id}`, {
      token,
      json: { status: 'unsubscribed' },
    })
    const resub = await http('PATCH', `/api/newsletter-subscribers/${sub.id}`, {
      token,
      json: { status: 'active' },
    })
    record(
      'NEWS',
      'Marketing / Newsletter',
      `/admin/collections/newsletter-subscribers/${String(sub.id)}`,
      'Unsubscribe and re-activate a subscriber',
      { steps: 'Set status Unsubscribed, then back to Active', expected: 'HTTP 200 for both' },
      unsub.status === 200 && resub.status === 200,
      `unsubscribe ${unsub.status}, re-activate ${resub.status}`,
    )
  }
  const exp = await http('GET', '/api/admin/newsletter/export', { token })
  record(
    'NEWS',
    'Marketing / Newsletter',
    '/api/admin/newsletter/export',
    'CSV export includes subscribers',
    { steps: 'Newsletter workspace > Export CSV', expected: 'text/csv containing the TEST email' },
    exp.status === 200 && exp.text.includes(subEmail),
    `HTTP ${exp.status}, ${exp.text.includes(subEmail) ? 'contains' : 'missing'} TEST email`,
  )
  const anonExp = await http('GET', '/api/admin/newsletter/export')
  record(
    'NEWS',
    'Marketing / Newsletter',
    '/api/admin/newsletter/export',
    'CSV export requires a session',
    { pre: 'Logged out', steps: 'Call export logged out', expected: 'HTTP 401', severity: 'High' },
    anonExp.status === 401,
    `HTTP ${anonExp.status}`,
  )

  // Workspaces reflect data
  for (const [w, marker] of [
    ['recruitment', 'QA'],
    ['crm', 'Won'],
    ['newsletter', 'ubscriber'],
    ['activity', 'QA'],
  ] as const) {
    const res = await http('GET', `/admin/workspace/${w}`, { cookie: token })
    record(
      'WKSP',
      `Workspace / ${w}`,
      `/admin/workspace/${w}`,
      `${w} workspace renders with live data`,
      { steps: `Open /admin/workspace/${w}`, expected: `HTTP 200 and "${marker}" in the view` },
      res.status === 200 && res.text.includes(marker),
      `HTTP ${res.status}, ${res.text.includes(marker) ? 'data shown' : 'marker missing'}`,
    )
  }
}

/* --------------------------------------------------------------------- roles */

type Role = (typeof TEST_ROLES)[number]
const ALL: Role[] = [...TEST_ROLES]
const CONTENT_ROLES: Role[] = ['administrator', 'editor', 'content-manager', 'marketing']
const ADMIN_EDITOR: Role[] = ['administrator', 'editor']
const CAREER_ROLES: Role[] = ['administrator', 'recruiter', 'editor']
const MARKETING_ROLES: Role[] = ['administrator', 'marketing', 'editor']
const ADMIN_ONLY: Role[] = ['administrator']

type Matrix = { create: Role[]; read: Role[]; update: Role[]; delete: Role[] }
const CONTENT_MATRIX: Matrix = {
  create: CONTENT_ROLES,
  read: ALL,
  update: CONTENT_ROLES,
  delete: ADMIN_EDITOR,
}

const ROLE_MATRIX: Record<string, Matrix> = {
  pages: CONTENT_MATRIX,
  services: CONTENT_MATRIX,
  solutions: CONTENT_MATRIX,
  industries: CONTENT_MATRIX,
  'case-studies': CONTENT_MATRIX,
  blogs: CONTENT_MATRIX,
  research: CONTENT_MATRIX,
  technologies: CONTENT_MATRIX,
  categories: CONTENT_MATRIX,
  tags: CONTENT_MATRIX,
  authors: CONTENT_MATRIX,
  clients: CONTENT_MATRIX,
  faqs: CONTENT_MATRIX,
  'team-members': CONTENT_MATRIX,
  testimonials: CONTENT_MATRIX,
  downloads: { create: MARKETING_ROLES, read: ALL, update: MARKETING_ROLES, delete: ADMIN_EDITOR },
  careers: { create: CAREER_ROLES, read: ALL, update: CAREER_ROLES, delete: ADMIN_EDITOR },
  departments: { create: CAREER_ROLES, read: ALL, update: CAREER_ROLES, delete: ADMIN_EDITOR },
  'newsletter-campaigns': {
    create: MARKETING_ROLES,
    read: ALL,
    update: MARKETING_ROLES,
    delete: ADMIN_ONLY,
  },
  'form-submissions': {
    create: ADMIN_EDITOR,
    read: ADMIN_EDITOR,
    update: ADMIN_EDITOR,
    delete: ADMIN_EDITOR,
  },
}

async function runRoles(adminToken: string) {
  const media = await http('GET', `/api/media?where[filename][like]=test-qa-hero&depth=0&limit=1`, {
    token: adminToken,
  })
  const pdf = await http(
    'GET',
    `/api/media?where[filename][like]=test-qa-brochure&depth=0&limit=1`,
    { token: adminToken },
  )
  const mediaId = String(docs(media.data)[0]?.id || '')
  const pdfId = String(docs(pdf.data)[0]?.id || '')
  const builders: Record<string, (t: string, s: string) => Json> = {}
  for (const c of CONTENT)
    builders[c.slug] = (t, s) => ({ ...c.build(t, s, mediaId), _status: 'draft' })
  for (const s of SIMPLE) builders[s.slug] = (t, sl) => s.build(t, sl, mediaId, { pdf: pdfId })
  builders['form-submissions'] = () => ({
    type: 'contact',
    data: { tag: 'TEST-QA' },
    status: 'new',
  })
  const resume = docs(
    (
      await http(
        'GET',
        `/api/media?where[folder][equals]=resumes&where[filename][like]=test-qa&depth=0&limit=1`,
        { token: adminToken },
      )
    ).data,
  )[0]
  const resumeUrl = resume ? `/api/media/file/${encodeURIComponent(String(resume.filename))}` : ''

  for (const role of TEST_ROLES) {
    const token = await login(testUserEmail(role), TEST_USER_PASSWORD)
    record(
      'ROLE',
      `Roles / ${role}`,
      '/admin/login',
      `${role} can log in`,
      {
        pre: 'npm run test:users',
        steps: `Log in as ${testUserEmail(role)}`,
        expected: 'Token issued',
        severity: 'Critical',
      },
      Boolean(token),
      token ? 'logged in' : 'login failed',
    )
    if (!token) continue

    for (const [collection, matrix] of Object.entries(ROLE_MATRIX)) {
      const slug = `test-qa-role-${role}-${collection}`.slice(0, 110)
      const title = `[TEST] QA role ${role} ${collection}`
      const build = builders[collection]
      const issues: string[] = []

      const created = await http(
        'POST',
        `/api/${collection}${CONTENT.some((c) => c.slug === collection) ? '?draft=true' : ''}`,
        {
          token,
          json: build(title, slug),
        },
      )
      const canCreate = matrix.create.includes(role)
      if (canCreate !== (created.status === 201))
        issues.push(`create ${created.status} (expected ${canCreate ? 201 : 403})`)

      const list = await http('GET', `/api/${collection}?limit=1&depth=0`, { token })
      const canRead = matrix.read.includes(role)
      if (canRead !== (list.status === 200))
        issues.push(`read ${list.status} (expected ${canRead ? 200 : 403})`)

      // Admin-owned target for update / delete
      const target = await http(
        'POST',
        `/api/${collection}${CONTENT.some((c) => c.slug === collection) ? '?draft=true' : ''}`,
        {
          token: adminToken,
          json: build(`${title} target`, `${slug}-t`),
        },
      )
      const targetId = String(doc(target.data).id || '')
      if (targetId) {
        const field =
          collection === 'form-submissions'
            ? 'status'
            : (SIMPLE.find((s) => s.slug === collection)?.updateField ?? 'title')
        const value =
          collection === 'form-submissions'
            ? 'reviewed'
            : collection === 'faqs'
              ? `${title} upd?`
              : `${title} upd`
        const upd = await http(
          'PATCH',
          `/api/${collection}/${targetId}${CONTENT.some((c) => c.slug === collection) ? '?draft=true' : ''}`,
          {
            token,
            json: { [field]: value },
          },
        )
        const canUpdate = matrix.update.includes(role)
        if (canUpdate !== (upd.status === 200))
          issues.push(`update ${upd.status} (expected ${canUpdate ? 200 : 403})`)
        const del = await http('DELETE', `/api/${collection}/${targetId}`, { token })
        const canDelete = matrix.delete.includes(role)
        if (canDelete !== (del.status === 200))
          issues.push(`delete ${del.status} (expected ${canDelete ? 200 : 403})`)
        if (del.status !== 200)
          await http('DELETE', `/api/${collection}/${targetId}`, { token: adminToken })
      } else {
        issues.push(`could not prepare target (${target.status})`)
      }
      if (created.status === 201)
        await http('DELETE', `/api/${collection}/${doc(created.data).id}`, { token: adminToken })

      record(
        'ROLE',
        `Roles / ${role}`,
        `/admin/collections/${collection}`,
        `${role}: create/read/update/delete on ${collection} follow the access policy`,
        {
          pre: `Logged in as ${testUserEmail(role)}`,
          steps: 'Create, list, edit and delete a record',
          expected: `C:${canCreate ? 'yes' : 'no'} R:${canRead ? 'yes' : 'no'} U:${matrix.update.includes(role) ? 'yes' : 'no'} D:${matrix.delete.includes(role) ? 'yes' : 'no'}`,
          severity: 'High',
        },
        issues.length === 0,
        issues.length ? issues.join('; ') : 'matches policy',
      )
    }

    // Publishing rights
    const PUBLISHERS: Record<string, Role[]> = {
      blogs: ['administrator', 'editor', 'marketing'],
      careers: ['administrator', 'editor', 'recruiter'],
    }
    for (const [collection, publishers] of Object.entries(PUBLISHERS)) {
      if (!ROLE_MATRIX[collection].create.includes(role)) continue
      const slug = `test-qa-role-${role}-${collection}-pub`
      const res = await http('POST', `/api/${collection}`, {
        token,
        json: { ...builders[collection](`[TEST] QA publish ${role}`, slug), _status: 'published' },
      })
      const status = String(doc(res.data)._status)
      const expected = publishers.includes(role) ? 'published' : 'draft'
      record(
        'ROLE',
        `Roles / ${role}`,
        `/admin/collections/${collection}/create`,
        `${role}: publishing ${collection} results in "${expected}"`,
        {
          pre: `Logged in as ${testUserEmail(role)}`,
          steps: 'Create and click Publish',
          expected: `_status ${expected}`,
          severity: 'High',
        },
        status === expected,
        `HTTP ${res.status}, _status=${status}`,
      )
      if (res.status === 201)
        await http('DELETE', `/api/${collection}/${doc(res.data).id}`, { token: adminToken })
    }

    // Users: only admins manage users; only self visible otherwise
    const users = await http('GET', '/api/users?limit=50&depth=0', { token })
    const visible = docs(users.data).length
    const isAdminRole = role === 'administrator'
    record(
      'ROLE',
      `Roles / ${role}`,
      '/admin/collections/users',
      `${role}: user list visibility`,
      {
        pre: `Logged in as ${testUserEmail(role)}`,
        steps: 'Open Users',
        expected: isAdminRole ? 'All users' : 'Only self',
        severity: 'High',
      },
      isAdminRole ? visible > 1 : visible === 1,
      `${visible} users visible`,
    )
    const newUser = await http('POST', '/api/users', {
      token,
      json: {
        email: `qa.test+created-by-${role}${TEST_EMAIL_DOMAIN}`,
        password: TEST_USER_PASSWORD,
        roles: ['viewer'],
      },
    })
    record(
      'ROLE',
      `Roles / ${role}`,
      '/admin/collections/users/create',
      `${role}: creating users`,
      {
        pre: `Logged in as ${testUserEmail(role)}`,
        steps: 'Create a viewer user',
        expected: isAdminRole ? 'HTTP 201' : 'HTTP 403',
        severity: 'Critical',
      },
      isAdminRole ? newUser.status === 201 : newUser.status === 403,
      `HTTP ${newUser.status}`,
    )
    if (newUser.status === 201) {
      const del = await http('DELETE', `/api/users/${doc(newUser.data).id}`, { token })
      record(
        'ROLE',
        `Roles / ${role}`,
        '/admin/collections/users',
        `${role}: deleting users is reserved to super-admin`,
        {
          pre: `Logged in as ${testUserEmail(role)}`,
          steps: 'Delete the user just created',
          expected: 'HTTP 403',
          severity: 'High',
        },
        del.status === 403,
        `HTTP ${del.status}`,
      )
      if (del.status !== 200)
        await http('DELETE', `/api/users/${doc(newUser.data).id}`, { token: adminToken })
    }
    const me = await http('GET', '/api/users/me', { token })
    const myId = (me.data.user as Json | undefined)?.id
    const escalate = await http('PATCH', `/api/users/${String(myId)}`, {
      token,
      json: { roles: ['super-admin'] },
    })
    const after = await http('GET', `/api/users/${String(myId)}?depth=0`, { token: adminToken })
    const roles = (after.data.roles as string[]) || []
    record(
      'ROLE',
      `Roles / ${role}`,
      '/admin/account',
      `${role}: cannot grant themselves super-admin`,
      {
        pre: `Logged in as ${testUserEmail(role)}`,
        steps: 'PATCH own roles to super-admin',
        expected: isAdminRole
          ? 'HTTP 403, roles unchanged'
          : 'Roles field ignored, roles unchanged',
        severity: 'Critical',
      },
      (isAdminRole ? escalate.status === 403 : true) && !roles.includes('super-admin'),
      `HTTP ${escalate.status}, roles=${roles.join(',')}`,
    )
    if (roles.includes('super-admin')) {
      await http('PATCH', `/api/users/${String(myId)}`, {
        token: adminToken,
        json: { roles: [role] },
      })
    }

    // Leads, applications, subscribers (created from the website only)
    const leads = await http('GET', '/api/contact-messages?limit=1&depth=0', { token })
    record(
      'ROLE',
      `Roles / ${role}`,
      '/admin/collections/contact-messages',
      `${role}: can view leads`,
      {
        pre: `Logged in as ${testUserEmail(role)}`,
        steps: 'Open Leads',
        expected: 'HTTP 200 (staffRead)',
      },
      leads.status === 200,
      `HTTP ${leads.status}`,
    )
    const leadDoc = docs(
      (
        await http(
          'GET',
          `/api/contact-messages?where[email][contains]=${encodeURIComponent(TEST_EMAIL_DOMAIN)}&limit=1&depth=0`,
          { token: adminToken },
        )
      ).data,
    )[0]
    if (leadDoc) {
      const upd = await http('PATCH', `/api/contact-messages/${String(leadDoc.id)}`, {
        token,
        json: { company: `TEST-QA by ${role}` },
      })
      const allowed = ['administrator', 'editor'].includes(role)
      record(
        'ROLE',
        `Roles / ${role}`,
        `/admin/collections/contact-messages/${String(leadDoc.id)}`,
        `${role}: updating leads`,
        {
          pre: `Logged in as ${testUserEmail(role)}`,
          steps: 'Edit the TEST lead',
          expected: allowed ? 'HTTP 200' : 'HTTP 403',
        },
        allowed ? upd.status === 200 : upd.status === 403,
        `HTTP ${upd.status}`,
      )
    }
    const apps = await http('GET', '/api/job-applications?limit=1&depth=0', { token })
    const canSeeApps = CAREER_ROLES.includes(role)
    record(
      'ROLE',
      `Roles / ${role}`,
      '/admin/collections/job-applications',
      `${role}: access to job applications`,
      {
        pre: `Logged in as ${testUserEmail(role)}`,
        steps: 'Open Applications',
        expected: canSeeApps ? 'HTTP 200' : 'HTTP 403',
        severity: 'High',
      },
      canSeeApps ? apps.status === 200 : apps.status === 403,
      `HTTP ${apps.status}`,
    )
    const searchApps = await http('GET', `/api/admin/search?q=${encodeURIComponent('QA')}`, {
      token,
    })
    const leaked = ((searchApps.data.results as Json[]) || []).some((r) =>
      String(r.href).includes('/collections/job-applications/'),
    )
    record(
      'ROLE',
      `Roles / ${role}`,
      '/api/admin/search',
      `${role}: command palette respects collection access`,
      {
        pre: `Logged in as ${testUserEmail(role)}`,
        steps: 'Search "QA" in the command palette',
        expected: canSeeApps ? 'May include applications' : 'No job applications in results',
        severity: 'High',
      },
      canSeeApps || !leaked,
      leaked ? 'job applications returned' : 'no restricted results',
    )
    if (resumeUrl) {
      const resumeRes = await http('GET', resumeUrl, { token })
      record(
        'ROLE',
        `Roles / ${role}`,
        resumeUrl,
        `${role}: candidate resume download`,
        {
          pre: `Logged in as ${testUserEmail(role)}`,
          steps: 'Open a candidate resume file',
          expected: canSeeApps ? 'HTTP 200' : 'HTTP 403',
          severity: 'Critical',
        },
        canSeeApps ? resumeRes.status === 200 : resumeRes.status === 403,
        `HTTP ${resumeRes.status}`,
      )
    }
    const exportRes = await http('GET', '/api/admin/newsletter/export', { token })
    const canExport = MARKETING_ROLES.includes(role)
    record(
      'ROLE',
      `Roles / ${role}`,
      '/api/admin/newsletter/export',
      `${role}: newsletter CSV export`,
      {
        pre: `Logged in as ${testUserEmail(role)}`,
        steps: 'Download subscriber CSV',
        expected: canExport ? 'HTTP 200' : 'HTTP 403',
        severity: 'High',
      },
      canExport ? exportRes.status === 200 : exportRes.status === 403,
      `HTTP ${exportRes.status}`,
    )

    // Notifications ownership
    const foreign = await http(
      'GET',
      `/api/notifications?where[user][not_equals]=${String(myId)}&limit=1&depth=0`,
      { token: adminToken },
    )
    const target = docs(foreign.data)[0]
    if (target) {
      const tamper = await http('PATCH', `/api/notifications/${String(target.id)}`, {
        token,
        json: { read: !target.read },
      })
      record(
        'ROLE',
        `Roles / ${role}`,
        '/api/notifications',
        `${role}: cannot modify another user's notification`,
        {
          pre: `Logged in as ${testUserEmail(role)}`,
          steps: "PATCH someone else's notification",
          expected: 'HTTP 403/404',
          severity: 'Medium',
        },
        isAdminRole || [403, 404].includes(tamper.status),
        `HTTP ${tamper.status}`,
      )
      if (tamper.status === 200) {
        await http('PATCH', `/api/notifications/${String(target.id)}`, {
          token: adminToken,
          json: { read: target.read },
        })
      }
    }

    for (const w of ['recruitment', 'crm']) {
      const res = await http('GET', `/admin/workspace/${w}`, { cookie: token })
      record(
        'ROLE',
        `Roles / ${role}`,
        `/admin/workspace/${w}`,
        `${role}: ${w} workspace loads`,
        {
          pre: `Logged in as ${testUserEmail(role)}`,
          steps: `Open /admin/workspace/${w}`,
          expected: 'HTTP 200, not bounced to login',
          severity: 'Low',
        },
        res.status === 200 && !isLoginPage(res.text),
        `HTTP ${res.status}${isLoginPage(res.text) ? ' (login form shown)' : ''}`,
      )
    }
  }
}

/* ---------------------------------------------------------------------- main */

async function main() {
  const adminEmail = process.env.PAYLOAD_ADMIN_EMAIL || 'admin@xelarvis.in'
  const adminPassword = process.env.PAYLOAD_ADMIN_PASSWORD || 'ChangeMeNow123!'
  const token = await login(adminEmail, adminPassword)
  if (!token) throw new Error('Super-admin login failed')
  record(
    'AUTH',
    'System / Authentication',
    '/admin/login',
    'Super-admin can log in',
    {
      pre: 'Logged out',
      steps: 'Log in with the .env.local admin',
      expected: 'Token issued',
      severity: 'Critical',
    },
    true,
    'logged in',
  )

  if (phase === 'core') {
    const { mediaId, pdfId } = await runMedia(token)
    const contentIds = await runContent(token, mediaId)
    const simpleIds = await runSimple(token, mediaId, pdfId)
    await runDownloads(token, simpleIds.downloads)
    await runEndpoints(token)
    await runGlobals(token)
    await adminPagesRender(token, { ...contentIds, ...simpleIds, media: mediaId })
  } else if (phase === 'pipelines') {
    await runPipelines(token)
  } else {
    await runRoles(token)
  }

  await mkdir(RESULTS_DIR, { recursive: true })
  await writeFile(path.join(RESULTS_DIR, `${phase}.json`), `${JSON.stringify(results, null, 2)}\n`)
  await writeFile(
    path.join(RESULTS_DIR, `${phase}-inventory.json`),
    `${JSON.stringify(inventory, null, 2)}\n`,
  )
  const failed = results.filter((r) => r.status !== 'Pass').length
  process.stdout.write(
    `\n${results.length} cases, ${results.length - failed} passed, ${failed} failed/blocked\n`,
  )
  process.exit(0)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
  process.exit(1)
})
