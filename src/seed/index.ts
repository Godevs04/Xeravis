import { config as loadEnv } from 'dotenv'
import { getPayload, type Payload } from 'payload'

import { logger } from '../lib/logger'
import { SEED_INDUSTRIES, SEED_SERVICES, SEED_SOLUTIONS, SEED_TECHNOLOGIES } from './content'
import {
  INDUSTRY_TIER_MAP,
  SERVICE_INDUSTRY_MAP,
  SERVICE_SOLUTION_MAP,
  SOLUTION_INDUSTRY_MAP,
  SOLUTION_TECHNOLOGY_MAP,
} from './relations'

loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

const log = logger.child('seed')

const richParagraph = (text: string) => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'paragraph' as const,
        children: [{ type: 'text' as const, text, version: 1 as const }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1 as const,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1 as const,
  },
})

async function upsertBySlug(
  payload: Payload,
  collection:
    | 'services'
    | 'solutions'
    | 'industries'
    | 'technologies'
    | 'careers'
    | 'blogs'
    | 'pages'
    | 'departments',
  slug: string,
  data: Record<string, unknown>,
) {
  const withStatus = !['technologies', 'departments'].includes(collection)
  const found = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
    draft: withStatus ? true : undefined,
  })

  const payloadData = withStatus ? { ...data, slug, _status: 'published' } : { ...data, slug }

  if (found.totalDocs === 0) {
    await payload.create({
      collection,
      data: payloadData as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    log.success(`${collection}: created ${slug}`)
    return
  }

  await payload.update({
    collection,
    id: found.docs[0].id,
    data: payloadData as never,
    overrideAccess: true,
    draft: withStatus ? false : undefined,
    context: { disableRevalidate: true },
  })
  log.success(`${collection}: updated ${slug}`)
}

async function seed() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) {
    log.error('Missing DATABASE_URI or PAYLOAD_SECRET in environment.')
    process.exit(1)
  }

  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  const adminEmail = process.env.PAYLOAD_ADMIN_EMAIL || 'admin@xelarvis.in'
  const adminPassword = process.env.PAYLOAD_ADMIN_PASSWORD || 'ChangeMeNow123!'

  const existingUsers = await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
        roles: ['super-admin'],
      },
      overrideAccess: true,
    })
    log.success(`Created admin user: ${adminEmail}`)
  } else {
    log.info('Users exist — skipping admin creation')
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Xelarvis Technologies',
      tagline: 'Artificial Intelligence, Data Science & IT Consulting',
      social: {
        linkedin: 'https://www.linkedin.com/company/xelarvis',
        twitter: 'https://x.com/xelarvis_ai',
        github: '',
        youtube: '',
      },
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      primaryLinks: [
        { label: 'About', href: '/about', mega: 'about' },
        { label: 'Capabilities', href: '/services', mega: 'services' },
        { label: 'Solutions', href: '/solutions', mega: 'solutions' },
        { label: 'Industries', href: '/industries', mega: 'industries' },
        { label: 'Research', href: '/ai-research-lab', mega: 'research' },
        { label: 'Insights', href: '/insights', mega: 'insights' },
        { label: 'Careers', href: '/careers', mega: 'none' },
      ],
      cta: { label: 'Contact', href: '/contact' },
      ctaLabel: 'Contact',
      ctaHref: '/contact',
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        {
          title: 'About',
          links: [
            { label: 'About', href: '/about' },
            { label: 'Our Approach', href: '/about/our-approach' },
            { label: 'Research', href: '/ai-research-lab' },
            { label: 'Collaborations', href: '/ai-research-lab/collaborations' },
            { label: 'Careers', href: '/careers' },
            { label: 'Contact', href: '/contact' },
          ],
        },
        {
          title: 'Capabilities',
          links: [
            { label: 'All capabilities', href: '/services' },
            { label: 'Solutions', href: '/solutions' },
            { label: 'Industries', href: '/industries' },
            { label: 'Technologies', href: '/technologies' },
            { label: 'Case Studies', href: '/case-studies' },
          ],
        },
        {
          title: 'Insights',
          links: [
            { label: 'Insights Hub', href: '/insights' },
            { label: 'Blogs', href: '/insights/blogs' },
            { label: 'Reports', href: '/insights/reports' },
            { label: 'White Papers', href: '/insights/white-papers' },
          ],
        },
      ],
      showNewsletter: true,
      copyright: 'XELARVIS PRIVATE LIMITED. All rights reserved.',
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'contact-details',
    data: {
      email: 'hello@xelarvis.in',
      phone: '+91 00000 00000',
      whatsapp: '',
      hours: 'Mon–Fri, 9:30–18:30 IST',
      mapEmbedUrl: '',
      mapEmbed: '',
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'social-media',
    data: {
      linkedin: 'https://www.linkedin.com/company/xelarvis',
      twitter: 'https://x.com/xelarvis_ai',
      github: '',
      youtube: '',
      instagram: '',
      facebook: '',
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'office-locations',
    data: {
      locations: [
        {
          name: 'Headquarters',
          address: 'India',
          city: 'Hyderabad',
          country: 'India',
          hours: 'Mon–Fri, 9:30–18:30 IST',
        },
      ],
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'seo-defaults',
    data: {
      titleTemplate: '%s · Xelarvis Technologies',
      defaultDescription:
        'XELARVIS combines Artificial Intelligence, Data Science and IT Consulting to help organisations turn complex data and technology challenges into measurable business outcomes—with specialized expertise in Healthcare & Life Sciences.',
      twitterHandle: '@xelarvis_ai',
    },
    overrideAccess: true,
  })

  const techIds = new Map<string, string>()
  for (const [index, tech] of SEED_TECHNOLOGIES.entries()) {
    await upsertBySlug(payload, 'technologies', tech.slug, {
      title: tech.title,
      category: tech.category,
      description: tech.description,
      featured: index < 8,
      order: index + 1,
    })
    const found = await payload.find({
      collection: 'technologies',
      where: { slug: { equals: tech.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.docs[0]?.id) techIds.set(tech.title, String(found.docs[0].id))
  }

  const keepTechSlugs = new Set(SEED_TECHNOLOGIES.map((t) => t.slug as string))
  const clinicalTechSlugs = new Set([
    'sas',
    'cdisc',
    'sdtm',
    'adam',
    'tlf',
    'cdisc-standards',
    'pinnacle-21',
  ])
  const allTechs = await payload.find({
    collection: 'technologies',
    limit: 200,
    overrideAccess: true,
  })
  for (const doc of allTechs.docs) {
    const slug = String(doc.slug)
    if (keepTechSlugs.has(slug)) continue
    if (!clinicalTechSlugs.has(slug)) continue
    await payload.update({
      collection: 'technologies',
      id: doc.id,
      data: {
        featured: false,
        category: 'other',
        description:
          'Clinical capability content—not listed in the engineering technology catalog.',
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    log.info(`technologies: demoted clinical catalog entry ${slug}`)
  }

  const serviceIds = new Map<string, string>()
  for (const [index, service] of SEED_SERVICES.entries()) {
    const relatedTech = service.techLabels
      .map((label) => techIds.get(label))
      .filter(Boolean) as string[]

    await upsertBySlug(payload, 'services', service.slug, {
      title: service.title,
      summary: service.summary,
      icon: service.icon,
      challenges: service.challenges,
      body: richParagraph(service.body),
      process: service.process.map((step) => ({ ...step })),
      benefits: service.benefits.map((b) => ({ ...b })),
      technologies: relatedTech,
      featured: true,
      order: index + 1,
    })
    const found = await payload.find({
      collection: 'services',
      where: { slug: { equals: service.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.docs[0]?.id) serviceIds.set(service.slug, String(found.docs[0].id))
  }

  const keepServiceSlugs = new Set(SEED_SERVICES.map((s) => s.slug as string))
  const allServices = await payload.find({
    collection: 'services',
    limit: 100,
    overrideAccess: true,
    draft: true,
  })
  for (const doc of allServices.docs) {
    if (!keepServiceSlugs.has(String(doc.slug)) && doc._status === 'published') {
      await payload.update({
        collection: 'services',
        id: doc.id,
        data: {
          title: doc.title,
          slug: doc.slug,
          summary: doc.summary,
          body: doc.body,
          featured: false,
          _status: 'draft',
        },
        overrideAccess: true,
        draft: false,
        context: { disableRevalidate: true },
      })
      log.info(`services: unpublished legacy ${doc.slug}`)
    }
  }

  const industryIds = new Map<string, string>()
  for (const [index, industry] of SEED_INDUSTRIES.entries()) {
    await upsertBySlug(payload, 'industries', industry.slug, {
      title: industry.title,
      summary: industry.summary,
      challenges: industry.summary,
      approach: richParagraph(industry.summary),
      tier: INDUSTRY_TIER_MAP[industry.slug] ?? '3',
      featured: (INDUSTRY_TIER_MAP[industry.slug] ?? '3') === '1',
      order: index + 1,
    })
    const found = await payload.find({
      collection: 'industries',
      where: { slug: { equals: industry.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.docs[0]?.id) industryIds.set(industry.slug, String(found.docs[0].id))
  }

  const keepIndustrySlugs = new Set(SEED_INDUSTRIES.map((i) => i.slug as string))
  const allIndustries = await payload.find({
    collection: 'industries',
    limit: 100,
    overrideAccess: true,
    draft: true,
  })
  for (const doc of allIndustries.docs) {
    if (!keepIndustrySlugs.has(String(doc.slug)) && doc._status === 'published') {
      await payload.update({
        collection: 'industries',
        id: doc.id,
        data: {
          title: doc.title,
          slug: doc.slug,
          summary: doc.summary,
          featured: false,
          _status: 'draft',
        },
        overrideAccess: true,
        draft: false,
        context: { disableRevalidate: true },
      })
      log.info(`industries: unpublished legacy ${doc.slug}`)
    }
  }

  const solutionIds = new Map<string, string>()
  for (const [index, solution] of SEED_SOLUTIONS.entries()) {
    const relatedTech = (SOLUTION_TECHNOLOGY_MAP[solution.slug] ?? solution.techLabels ?? [])
      .map((label) => techIds.get(label))
      .filter(Boolean) as string[]

    await upsertBySlug(payload, 'solutions', solution.slug, {
      title: solution.title,
      summary: solution.summary,
      body: richParagraph(solution.summary),
      businessChallenges: solution.businessChallenges.map((c) => ({ ...c })),
      whoIsThisFor: solution.whoIsThisFor,
      technologies: relatedTech,
      featured: true,
      order: index + 1,
    })
    const found = await payload.find({
      collection: 'solutions',
      where: { slug: { equals: solution.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.docs[0]?.id) solutionIds.set(solution.slug, String(found.docs[0].id))
  }

  // Wire bidirectional Service ↔ Solution ↔ Industry relationships
  for (const [serviceSlug, solutionSlugs] of Object.entries(SERVICE_SOLUTION_MAP)) {
    const serviceId = serviceIds.get(serviceSlug)
    if (!serviceId) continue
    const relatedSolutions = solutionSlugs
      .map((s) => solutionIds.get(s))
      .filter(Boolean) as string[]
    const relatedIndustries = (SERVICE_INDUSTRY_MAP[serviceSlug] || [])
      .map((s) => industryIds.get(s))
      .filter(Boolean) as string[]
    await payload.update({
      collection: 'services',
      id: serviceId,
      data: { relatedSolutions, relatedIndustries },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  }

  for (const [solutionSlug, industrySlugs] of Object.entries(SOLUTION_INDUSTRY_MAP)) {
    const solutionId = solutionIds.get(solutionSlug)
    if (!solutionId) continue
    const relatedIndustries = industrySlugs
      .map((s) => industryIds.get(s))
      .filter(Boolean) as string[]
    const relatedServices = Object.entries(SERVICE_SOLUTION_MAP)
      .filter(([, sols]) => sols.includes(solutionSlug))
      .map(([svc]) => serviceIds.get(svc))
      .filter(Boolean) as string[]
    await payload.update({
      collection: 'solutions',
      id: solutionId,
      data: { relatedIndustries, relatedServices },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  }

  for (const [industrySlug, industryId] of industryIds.entries()) {
    const relatedServices = Object.entries(SERVICE_INDUSTRY_MAP)
      .filter(([, inds]) => inds.includes(industrySlug))
      .map(([svc]) => serviceIds.get(svc))
      .filter(Boolean) as string[]
    const relatedSolutions = Object.entries(SOLUTION_INDUSTRY_MAP)
      .filter(([, inds]) => inds.includes(industrySlug))
      .map(([sol]) => solutionIds.get(sol))
      .filter(Boolean) as string[]
    await payload.update({
      collection: 'industries',
      id: industryId,
      data: { relatedServices, relatedSolutions },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  }

  log.info('Wired service ↔ solution ↔ industry relationships')

  const keepSolutionSlugs = new Set(SEED_SOLUTIONS.map((s) => s.slug as string))
  const allSolutions = await payload.find({
    collection: 'solutions',
    limit: 100,
    overrideAccess: true,
    draft: true,
  })
  for (const doc of allSolutions.docs) {
    if (!keepSolutionSlugs.has(String(doc.slug)) && doc._status === 'published') {
      await payload.update({
        collection: 'solutions',
        id: doc.id,
        data: {
          title: doc.title,
          slug: doc.slug,
          summary: doc.summary,
          body: doc.body,
          featured: false,
          _status: 'draft',
        },
        overrideAccess: true,
        draft: false,
        context: { disableRevalidate: true },
      })
      log.info(`solutions: unpublished legacy ${doc.slug}`)
    }
  }

  const homeLayout = [
    {
      blockType: 'storyHero' as const,
      brand: 'Xelarvis',
      eyebrow: 'Artificial Intelligence · Data Science · IT Consulting',
      heading: 'Engineering Intelligence. Transforming Business.',
      subheading:
        'XELARVIS combines Artificial Intelligence, Data Science and IT Consulting to help organizations turn complex data and technology challenges into measurable business outcomes.',
      ctaLabel: 'Explore Our Capabilities',
      ctaHref: '/services',
      secondaryCtaLabel: 'Talk to XELARVIS',
      secondaryCtaHref: '/contact?intent=business',
    },
    {
      blockType: 'storyChallenge' as const,
      eyebrow: 'Business problems',
      heading: 'Organizations are facing three connected challenges.',
      items: [
        {
          title: 'Data complexity',
          body: 'Disconnected data makes decision-making slow.',
        },
        {
          title: 'AI adoption',
          body: 'Organizations struggle to move AI from experimentation into production.',
        },
        {
          title: 'Technology modernization',
          body: 'Legacy systems limit scalability, security and innovation.',
        },
      ],
    },
    {
      blockType: 'storySolution' as const,
      eyebrow: 'What XELARVIS does',
      heading: 'XELARVIS connects strategy, data, AI and technology execution.',
      chapters: [
        {
          title: 'Artificial Intelligence',
          body: 'Build and deploy intelligent systems using machine learning, generative AI, computer vision, NLP and AI agents.',
        },
        {
          title: 'Data Science & Analytics',
          body: 'Turn complex data into predictions, insights and decisions through advanced analytics, machine learning and business intelligence.',
        },
        {
          title: 'IT Consulting & Digital Transformation',
          body: 'Modernize technology ecosystems through architecture, cloud, software engineering, automation and digital transformation.',
        },
        {
          title: 'Data Engineering & Cloud',
          body: 'Design scalable data architectures, lakes, warehouses, pipelines, and MLOps infrastructure on the cloud.',
        },
        {
          title: 'Healthcare & Clinical Data Science',
          body: 'Specialized clinical SAS, CDISC standards, and analytics for regulated life sciences and care delivery.',
        },
      ],
    },
    {
      blockType: 'storyCapabilities' as const,
      eyebrow: 'Capabilities',
      heading: 'How we help — five practice areas.',
      subheading:
        'Capabilities are how we work. Solutions are the business problems we solve across AI, data, consulting, and healthcare specialty programs.',
    },
    {
      blockType: 'storySolutions' as const,
      eyebrow: 'Solutions',
      heading: 'What we solve — outcome themes for enterprise programs.',
      subheading:
        'Nine solution areas package our capabilities into business-ready programs — from enterprise AI and automation to data platforms and clinical intelligence.',
    },
    {
      blockType: 'storyTechOrbit' as const,
      eyebrow: 'Technology',
      heading: 'A constellation, not a checklist.',
      subheading:
        'Hover the orbit. Each node is a capability we put into production for enterprise and industry teams.',
    },
    {
      blockType: 'storyProof' as const,
      eyebrow: 'Credibility',
      heading: 'Clarity, evidence and governed delivery.',
      stats: [
        { label: 'Core services', value: '5' },
        { label: 'Solution areas', value: '9' },
        { label: 'Delivery pillars', value: 'AI · Data · IT' },
        { label: 'Specialty', value: 'Healthcare' },
      ],
    },
    {
      blockType: 'storyCases' as const,
      eyebrow: 'Evidence',
      heading: 'Representative engagements and delivery patterns.',
    },
    {
      blockType: 'storyProcess' as const,
      eyebrow: 'XELARVIS Delivery Framework',
      heading: 'From business problem to measurable results.',
      steps: [
        {
          title: 'Discover',
          description: 'Understand the business problem, stakeholders, and success criteria.',
        },
        {
          title: 'Strategize',
          description: 'Define the AI, data and technology roadmap aligned to outcomes.',
        },
        {
          title: 'Design',
          description: 'Architect scalable solutions, data flows, and governance.',
        },
        {
          title: 'Build',
          description: 'Develop models, platforms, and applications with quality built in.',
        },
        {
          title: 'Deploy',
          description: 'Ship to production with monitoring and operational readiness.',
        },
        {
          title: 'Optimize',
          description: 'Measure outcomes, refine performance, and expand what works.',
        },
      ],
    },
    {
      blockType: 'storyPresence' as const,
      eyebrow: 'Trust',
      heading: 'Consulting + engineering for enterprise buyers.',
    },
    {
      blockType: 'storyCta' as const,
      heading: "Let's solve your next data, AI or technology challenge.",
      subheading:
        'Talk with XELARVIS about AI, data science, IT consulting, data platforms or healthcare specialty programs.',
      ctaLabel: 'Talk to XELARVIS',
      ctaHref: '/contact?intent=business',
    },
  ]

  await upsertBySlug(payload, 'pages', 'home', {
    title: 'Home',
    layout: homeLayout,
  })

  const aboutLayout = [
    {
      blockType: 'aboutPreview' as const,
      heading: 'About XELARVIS',
      body: 'XELARVIS is an AI, Data Science and IT Consulting company focused on helping organizations turn data and technology into measurable business value—with specialized expertise in Healthcare & Life Sciences.',
      cta: {
        label: 'Company overview',
        href: '/about/company-overview',
        style: 'secondary' as const,
      },
    },
    {
      blockType: 'missionVision' as const,
      heading: 'Vision & Mission',
      missionTitle: 'Mission',
      missionBody:
        'Help organisations turn complex data and technology challenges into measurable outcomes through Artificial Intelligence, Data Science and IT Consulting.',
      visionTitle: 'Vision',
      visionBody:
        'Be a trusted partner for AI, data and technology transformation across industries—with depth where regulated and research-intensive work demands it.',
    },
    {
      blockType: 'valuesGrid' as const,
      heading: 'What makes us different',
      subheading: 'Research-driven. Engineering-led. Outcome-focused. Industry-aware.',
      values: [
        {
          title: 'Research-driven',
          description: 'Methods grounded in evaluation, responsible AI and continuous learning.',
        },
        {
          title: 'Engineering-led',
          description: 'Architecture, build and operate disciplines that survive production.',
        },
        {
          title: 'Outcome-focused',
          description: 'Clear path from problem to solution to measurable business value.',
        },
        {
          title: 'Industry-aware',
          description:
            'Enterprise delivery across sectors, with specialized Healthcare & Life Sciences expertise.',
        },
      ],
    },
    {
      blockType: 'teamGrid' as const,
      heading: 'Leadership',
    },
    {
      blockType: 'ctaBand' as const,
      heading: 'Work with us',
      subheading: 'Explore open roles or start a project conversation.',
      ctaLabel: 'Contact',
      ctaHref: '/contact',
    },
  ]

  await upsertBySlug(payload, 'pages', 'about', {
    title: 'About',
    layout: aboutLayout,
  })

  for (const legal of [
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      heading: 'Privacy Policy',
      body: 'This privacy policy describes how XELARVIS PRIVATE LIMITED collects and uses information. Update this page in the CMS with your final legal copy.',
    },
    {
      slug: 'terms',
      title: 'Terms & Conditions',
      heading: 'Terms & Conditions',
      body: 'These terms govern use of the XELARVIS website. Replace this placeholder with counsel-approved terms in the CMS.',
    },
  ]) {
    await upsertBySlug(payload, 'pages', legal.slug, {
      title: legal.title,
      layout: [
        { blockType: 'hero', heading: legal.heading, subheading: legal.body },
        { blockType: 'richText', content: richParagraph(legal.body) },
      ],
    })
  }

  const deptFound = await payload.find({
    collection: 'departments',
    where: { slug: { equals: 'artificial-intelligence' } },
    limit: 1,
    overrideAccess: true,
  })
  let aiDeptId = deptFound.docs[0]?.id
  if (!aiDeptId) {
    const dept = await payload.create({
      collection: 'departments',
      data: {
        title: 'Artificial Intelligence',
        slug: 'artificial-intelligence',
        description: 'AI engineering and research roles.',
        order: 1,
      },
      overrideAccess: true,
    })
    aiDeptId = dept.id
  }

  const clinicalDeptFound = await payload.find({
    collection: 'departments',
    where: { slug: { equals: 'clinical-data-science' } },
    limit: 1,
    overrideAccess: true,
  })
  let clinicalDeptId = clinicalDeptFound.docs[0]?.id
  if (!clinicalDeptId) {
    const dept = await payload.create({
      collection: 'departments',
      data: {
        title: 'Clinical Data Science',
        slug: 'clinical-data-science',
        description: 'Clinical programming and healthcare analytics.',
        order: 2,
      },
      overrideAccess: true,
    })
    clinicalDeptId = dept.id
  }

  await upsertBySlug(payload, 'careers', 'data-scientist', {
    title: 'Data Scientist',
    department: 'Artificial Intelligence',
    departmentRef: aiDeptId,
    office: 'Hyderabad / Remote',
    location: 'Hyderabad / Remote',
    type: 'full-time',
    workMode: 'hybrid',
    experienceRequired: '0–2 Years',
    openings: 2,
    postedAt: new Date().toISOString(),
    aboutRole:
      'Develop predictive models, perform statistical analysis, build ML pipelines, collaborate with engineers, and communicate findings to stakeholders.',
    description: richParagraph(
      'Join XELARVIS to apply statistics and machine learning to real business problems across AI, analytics and consulting programs.',
    ),
    requirements: richParagraph(
      'Python, SQL, statistics, machine learning fundamentals, and Pandas / Scikit-learn. Nice to have: PyTorch, cloud platforms, MLOps, NLP.',
    ),
    responsibilities: [
      { item: 'Develop predictive models' },
      { item: 'Perform statistical analysis' },
      { item: 'Build ML pipelines' },
      { item: 'Collaborate with engineers' },
      { item: 'Communicate findings' },
    ],
    requiredSkills: [
      { item: 'Python' },
      { item: 'SQL' },
      { item: 'Statistics' },
      { item: 'Machine Learning' },
      { item: 'Pandas / Scikit-learn' },
    ],
    preferredSkills: [{ item: 'PyTorch' }, { item: 'Cloud' }, { item: 'MLOps' }, { item: 'NLP' }],
    qualifications:
      "Bachelor's or Master's degree in Computer Science, Data Science, Statistics, Mathematics, or related field.",
    benefits: [
      { item: 'Flexible work' },
      { item: 'Learning budget' },
      { item: 'Mentorship' },
      { item: 'Research exposure' },
    ],
    relatedServices: [
      serviceIds.get('data-science-advanced-analytics'),
      serviceIds.get('artificial-intelligence-ai-research'),
    ].filter(Boolean),
    relatedSolutions: [
      solutionIds.get('predictive-analytics-solutions'),
      solutionIds.get('business-intelligence-solutions'),
    ].filter(Boolean),
    active: true,
  })

  await upsertBySlug(payload, 'careers', 'ai-engineer', {
    title: 'AI Engineer',
    department: 'Artificial Intelligence',
    departmentRef: aiDeptId,
    office: 'Hyderabad / Remote',
    location: 'Hyderabad / Remote',
    type: 'full-time',
    workMode: 'hybrid',
    experienceRequired: '2–5 Years',
    openings: 2,
    postedAt: new Date().toISOString(),
    aboutRole:
      'Design AI models, develop APIs, train ML models, deploy solutions, and collaborate with clients across healthcare and enterprise programs.',
    description: richParagraph(
      'Join XELARVIS to build production AI systems spanning generative AI, NLP, and intelligent automation.',
    ),
    requirements: richParagraph(
      'Strong Python, machine learning fundamentals, SQL, cloud platforms, and Git. Preferred: TensorFlow, LangChain, Azure AI, Docker.',
    ),
    responsibilities: [
      { item: 'Design AI models' },
      { item: 'Develop APIs' },
      { item: 'Train ML models' },
      { item: 'Deploy solutions' },
      { item: 'Collaborate with clients' },
    ],
    requiredSkills: [
      { item: 'Python' },
      { item: 'Machine Learning' },
      { item: 'SQL' },
      { item: 'Cloud Platforms' },
      { item: 'Git' },
    ],
    preferredSkills: [
      { item: 'TensorFlow' },
      { item: 'LangChain' },
      { item: 'Azure AI' },
      { item: 'Docker' },
    ],
    qualifications:
      "Bachelor's or Master's degree in Computer Science, Data Science, AI, Statistics, or related field.",
    benefits: [
      { item: 'Flexible work' },
      { item: 'Learning budget' },
      { item: 'Paid leave' },
      { item: 'Research opportunities' },
    ],
    relatedServices: [
      serviceIds.get('artificial-intelligence-ai-research'),
      serviceIds.get('data-engineering-cloud-solutions'),
    ].filter(Boolean),
    relatedSolutions: [
      solutionIds.get('enterprise-ai-solutions'),
      solutionIds.get('ai-agents'),
      solutionIds.get('custom-ai-products'),
    ].filter(Boolean),
    active: true,
  })

  await upsertBySlug(payload, 'careers', 'clinical-sas-programmer', {
    title: 'Clinical SAS Programmer',
    department: 'Clinical Data Science',
    departmentRef: clinicalDeptId,
    office: 'Hyderabad / Hybrid',
    location: 'Hyderabad / Hybrid',
    type: 'full-time',
    workMode: 'hybrid',
    experienceRequired: '3–6 Years',
    openings: 1,
    postedAt: new Date().toISOString(),
    aboutRole:
      'Develop SDTM/ADaM datasets, TLFs, and validated clinical programming deliverables for regulatory submissions.',
    description: richParagraph(
      'Support pharmaceutical and biotechnology clients with CDISC-aligned statistical programming and quality control.',
    ),
    requirements: richParagraph(
      'Hands-on SAS experience with SDTM/ADaM, TLF programming, and QC. Familiarity with Pinnacle 21 and clinical trial data preferred.',
    ),
    responsibilities: [
      { item: 'SDTM and ADaM development' },
      { item: 'TLF programming' },
      { item: 'QC programming' },
      { item: 'Define.xml support' },
      { item: 'Collaborate with biostatistics and data management' },
    ],
    requiredSkills: [{ item: 'SAS' }, { item: 'SDTM' }, { item: 'ADaM' }, { item: 'SQL' }],
    preferredSkills: [{ item: 'Pinnacle 21' }, { item: 'Python' }, { item: 'R' }],
    qualifications:
      "Bachelor's or Master's in Statistics, Life Sciences, Computer Science, or related field.",
    benefits: [
      { item: 'Flexible work' },
      { item: 'Learning budget' },
      { item: 'Healthcare domain exposure' },
    ],
    relatedServices: [serviceIds.get('clinical-data-science-healthcare-ai')].filter(Boolean),
    relatedSolutions: [solutionIds.get('healthcare-clinical-intelligence')].filter(Boolean),
    relatedIndustries: [
      industryIds.get('healthcare-life-sciences'),
      industryIds.get('pharmaceutical'),
    ].filter(Boolean),
    active: true,
  })

  const authorFound = await payload.find({ collection: 'authors', limit: 1, overrideAccess: true })
  let authorId = authorFound.docs[0]?.id
  if (!authorId) {
    const author = await payload.create({
      collection: 'authors',
      data: {
        name: 'Xelarvis Editorial',
        role: 'AI & Healthcare Practice',
        bio: 'Insights from the XELARVIS delivery and research practice.',
      },
      overrideAccess: true,
    })
    authorId = author.id
  }

  const catFound = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'ai-healthcare' } },
    limit: 1,
    overrideAccess: true,
  })
  let categoryId = catFound.docs[0]?.id
  if (!categoryId) {
    const category = await payload.create({
      collection: 'categories',
      data: { title: 'AI & Healthcare', slug: 'ai-healthcare' },
      overrideAccess: true,
    })
    categoryId = category.id
  }

  await upsertBySlug(payload, 'blogs', 'engineering-intelligent-healthcare-ai', {
    title: 'Engineering Intelligent Healthcare AI',
    excerpt:
      'Practical patterns for combining clinical data science, CDISC standards, and production AI safely.',
    content: richParagraph(
      'Healthcare AI succeeds when clinical standards, data quality, and model governance stay aligned. XELARVIS builds solutions that are research-informed and deployment-ready.',
    ),
    insightType: 'blog',
    author: authorId,
    categories: [categoryId],
    publishedAt: new Date().toISOString(),
    featured: true,
  })

  await upsertBySlug(payload, 'blogs', 'clinical-data-standards-primer', {
    title: 'Clinical Data Standards Primer',
    excerpt:
      'A practical overview of SDTM, ADaM, and validated deliverables for clinical research teams.',
    content: richParagraph(
      'CDISC standards help life sciences organizations produce consistent, submission-ready clinical datasets. This primer outlines how XELARVIS approaches SDTM, ADaM, and QC.',
    ),
    insightType: 'white-paper',
    author: authorId,
    categories: [categoryId],
    publishedAt: new Date().toISOString(),
  })

  log.success('Seed complete.')
  process.exit(0)
}

seed().catch((error) => {
  log.error(error)
  process.exit(1)
})
