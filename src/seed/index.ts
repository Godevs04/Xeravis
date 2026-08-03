import { config as loadEnv } from 'dotenv'
import { getPayload, type Payload } from 'payload'

import { logger } from '../lib/logger'
import { SEED_INDUSTRIES, SEED_SERVICES, SEED_SOLUTIONS, SEED_TECHNOLOGIES } from './content'

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
      tagline: 'Data Science, AI, and Healthcare AI for enterprise and life sciences',
      social: {
        linkedin: 'https://linkedin.com/company/xelarvis',
        twitter: 'https://x.com/xelarvis',
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
        { label: 'Services', href: '/services', mega: 'services' },
        { label: 'Solutions', href: '/solutions', mega: 'solutions' },
        { label: 'Technologies', href: '/technologies', mega: 'none' },
        { label: 'Industries', href: '/industries', mega: 'industries' },
        { label: 'Research & Innovation', href: '/ai-research-lab', mega: 'research' },
        { label: 'Insights', href: '/insights', mega: 'insights' },
        { label: 'Careers', href: '/careers', mega: 'none' },
        { label: 'About', href: '/about', mega: 'about' },
      ],
      cta: { label: 'Contact Us', href: '/contact' },
      ctaLabel: 'Contact Us',
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
            { label: 'Research & Innovation', href: '/ai-research-lab' },
            { label: 'Collaborations', href: '/ai-research-lab/collaborations' },
            { label: 'Careers', href: '/careers' },
            { label: 'Contact', href: '/contact' },
          ],
        },
        {
          title: 'Capabilities',
          links: [
            { label: 'Services', href: '/services' },
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
      linkedin: 'https://linkedin.com/company/xelarvis',
      twitter: 'https://x.com/xelarvis',
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
        'XELARVIS PRIVATE LIMITED delivers IT consulting, AI research, clinical data science, analytics, and cloud solutions for healthcare and enterprise organizations.',
      twitterHandle: '@xelarvis',
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

  for (const [index, industry] of SEED_INDUSTRIES.entries()) {
    await upsertBySlug(payload, 'industries', industry.slug, {
      title: industry.title,
      summary: industry.summary,
      challenges: industry.summary,
      approach: richParagraph(industry.summary),
      featured: index < 4,
      order: index + 1,
    })
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

  for (const [index, solution] of SEED_SOLUTIONS.entries()) {
    const relatedTech = solution.techLabels
      .map((label) => techIds.get(label))
      .filter(Boolean) as string[]

    await upsertBySlug(payload, 'solutions', solution.slug, {
      title: solution.title,
      summary: solution.summary,
      body: richParagraph(solution.summary),
      technologies: relatedTech,
      featured: index < 4,
      order: index + 1,
    })
  }

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
      eyebrow: 'Data Science · AI · Healthcare',
      heading: 'Intelligence that survives the real world.',
      subheading:
        'We lead with data science, AI, and Healthcare AI — clinical intelligence and enterprise platforms that operators trust, not demos that fade.',
      ctaLabel: "Let's Talk",
      ctaHref: '/contact',
      secondaryCtaLabel: 'Explore solutions',
      secondaryCtaHref: '/solutions',
    },
    {
      blockType: 'storyChallenge' as const,
      eyebrow: 'The challenge',
      heading: 'Most digital programs look finished. Few feel inevitable.',
      items: [
        {
          title: 'Fragmented clinical & enterprise data',
          body: 'Signals live in silos. Decisions wait on spreadsheets.',
        },
        {
          title: 'AI without operational grounding',
          body: 'Models that impress demos but stall in regulated reality.',
        },
        {
          title: 'Transformation without craft',
          body: 'Generic platforms. Generic outcomes. Forgotten brands.',
        },
      ],
    },
    {
      blockType: 'storySolution' as const,
      eyebrow: 'The solution',
      heading: 'One practice where research, regulation, and delivery meet.',
      chapters: [
        {
          title: 'Intelligence that ships',
          body: 'We design AI and analytics systems that survive audits, scale in production, and move real clinical and enterprise decisions.',
        },
        {
          title: 'Healthcare-first engineering',
          body: 'CDISC, SAS, and regulated workflows sit beside modern cloud and LLM stacks — not as afterthoughts.',
        },
        {
          title: 'One narrative, many surfaces',
          body: 'From research lab to delivery cockpit, every capability connects to a measurable outcome for your teams.',
        },
      ],
    },
    {
      blockType: 'storyCapabilities' as const,
      eyebrow: 'Capabilities',
      heading: 'What we bring to the table.',
      subheading:
        'AI research, data science, IT consulting, clinical data science, and cloud platforms — scroll sideways to explore.',
    },
    {
      blockType: 'storyTechOrbit' as const,
      eyebrow: 'Technology',
      heading: 'A constellation, not a checklist.',
      subheading:
        'Hover the orbit. Each node is a capability we put into production for healthcare, AI, and enterprise delivery.',
    },
    {
      blockType: 'storyProof' as const,
      eyebrow: 'Proof',
      heading: 'Why Fortune-facing teams trust Xelarvis.',
      stats: [
        { label: 'Core services', value: '5' },
        { label: 'Industries served', value: '8' },
        { label: 'Solution areas', value: '8' },
        { label: 'Infrastructure availability', value: '99.9', suffix: '%' },
        { label: 'Projects delivered', value: '120', suffix: '+' },
        { label: 'Enterprise clients', value: '40', suffix: '+' },
      ],
    },
    {
      blockType: 'storyCases' as const,
      eyebrow: 'Success stories',
      heading: 'Engineering solutions that deliver measurable outcomes.',
    },
    {
      blockType: 'storyProcess' as const,
      eyebrow: 'The Engineering Journey',
      heading: 'From business problem to measurable results.',
      steps: [
        {
          title: 'Business Problem',
          description:
            'Every engagement starts with a real constraint — not a technology preference.',
        },
        {
          title: 'Discovery',
          description: 'Workshops and research turn the problem into a shared, actionable frame.',
        },
        {
          title: 'Solution Architecture',
          description:
            'The blueprint assembles — AI, cloud, and APIs designed to survive production.',
        },
        {
          title: 'Development',
          description: 'Code appears. Components connect. Tests run. Operators stay in the loop.',
        },
        {
          title: 'Cloud Infrastructure',
          description:
            'Secure, observable infrastructure — Kubernetes, monitoring, and hardened controls.',
        },
        {
          title: 'Business Results',
          description:
            'The system pays for itself — measurable ROI, performance, cost, and growth.',
        },
      ],
    },
    {
      blockType: 'storyPresence' as const,
      eyebrow: 'Client stories',
      heading: 'Trusted by leaders building the future.',
    },
    {
      blockType: 'storyCta' as const,
      heading: 'Ready for the next intelligent chapter?',
      subheading: 'Tell us about your AI, clinical, analytics, or transformation goals.',
      ctaLabel: 'Schedule a Consultation',
      ctaHref: '/contact',
    },
  ]

  await upsertBySlug(payload, 'pages', 'home', {
    title: 'Home',
    layout: homeLayout,
  })

  const aboutLayout = [
    {
      blockType: 'aboutPreview' as const,
      heading: 'About the Company',
      body: 'We help organizations transform complex data into intelligent solutions through innovative technologies, research-driven methodologies, and scalable digital platforms. Our mission is to bridge the gap between healthcare, artificial intelligence, and enterprise technology.',
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
        'Advance data science, AI, and healthcare technology by delivering reliable, secure, and future-ready solutions.',
      visionTitle: 'Vision',
      visionBody: 'Be a trusted global partner for data science, AI research, and Healthcare AI.',
    },
    {
      blockType: 'valuesGrid' as const,
      heading: 'Why XELARVIS',
      subheading: 'What makes our partnership different.',
      values: [
        {
          title: 'Data Science + AI + Healthcare',
          description: 'Clinical data science and Healthcare AI alongside applied AI research.',
        },
        {
          title: 'Research-driven',
          description: 'Methods grounded in evaluation, standards, and continuous learning.',
        },
        {
          title: 'Senior ownership',
          description: 'Practitioners accountable from discovery through production.',
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
