import { config as loadEnv } from 'dotenv'
import { getPayload } from 'payload'

loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

import config from '../payload.config'

const richParagraph = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

async function seed() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) {
    console.error('Missing DATABASE_URI or PAYLOAD_SECRET in environment.')
    process.exit(1)
  }

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
        roles: ['admin'],
      },
      overrideAccess: true,
    })
    console.log(`Created admin user: ${adminEmail}`)
  } else {
    console.log('Users exist — skipping admin creation')
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Xelarvis Technologies',
      tagline: 'Engineering Digital Excellence.',
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
        { label: 'Services', href: '/services' },
        { label: 'Industries', href: '/industries' },
        { label: 'Solutions', href: '/solutions' },
        { label: 'Insights', href: '/insights' },
        { label: 'Careers', href: '/careers' },
        { label: 'About', href: '/about' },
      ],
      ctaLabel: 'Talk to us',
      ctaHref: '/contact',
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        {
          title: 'Company',
          links: [
            { label: 'About', href: '/about' },
            { label: 'Careers', href: '/careers' },
            { label: 'Contact', href: '/contact' },
          ],
        },
        {
          title: 'Capabilities',
          links: [
            { label: 'Services', href: '/services' },
            { label: 'Industries', href: '/industries' },
            { label: 'Solutions', href: '/solutions' },
            { label: 'Case Studies', href: '/case-studies' },
          ],
        },
        {
          title: 'Insights',
          links: [
            { label: 'Blog', href: '/blog' },
            { label: 'Insights Hub', href: '/insights' },
          ],
        },
      ],
      showNewsletter: true,
      copyright: 'Xelarvis Technologies. All rights reserved.',
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'contact-details',
    data: {
      email: 'hello@xelarvis.in',
      phone: '+91 00000 00000',
      whatsapp: '',
      mapEmbed: '',
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
          city: 'Chennai',
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
        'Xelarvis Technologies delivers IT consulting, product engineering, cloud, DevOps, and AI solutions for enterprises and growth-stage companies.',
      twitterHandle: '@xelarvis',
    },
    overrideAccess: true,
  })

  const services = [
    {
      title: 'IT Consulting',
      slug: 'it-consulting',
      summary: 'Strategic technology advisory that aligns architecture, delivery, and business outcomes.',
      icon: 'Briefcase',
    },
    {
      title: 'Digital Transformation',
      slug: 'digital-transformation',
      summary: 'Modernize legacy systems and operating models with measurable transformation programs.',
      icon: 'RefreshCw',
    },
    {
      title: 'Product Engineering',
      slug: 'product-engineering',
      summary: 'End-to-end product design and engineering for platforms that scale with your market.',
      icon: 'Boxes',
    },
    {
      title: 'Software Development',
      slug: 'software-development',
      summary: 'Custom enterprise software built with clean architecture and production discipline.',
      icon: 'Code2',
    },
    {
      title: 'Cloud Solutions',
      slug: 'cloud-solutions',
      summary: 'Cloud architecture, migration, and optimization across AWS, Azure, and GCP.',
      icon: 'Cloud',
    },
    {
      title: 'DevOps',
      slug: 'devops',
      summary: 'CI/CD, infrastructure as code, observability, and reliable release engineering.',
      icon: 'GitBranch',
    },
    {
      title: 'AI Solutions',
      slug: 'ai-solutions',
      summary: 'Applied AI and LLM systems that improve operations, products, and decision speed.',
      icon: 'Sparkles',
    },
    {
      title: 'Enterprise Applications',
      slug: 'enterprise-applications',
      summary: 'Mission-critical applications designed for security, compliance, and longevity.',
      icon: 'Building2',
    },
    {
      title: 'UI/UX Design',
      slug: 'ui-ux',
      summary: 'Research-led product interfaces that convert, clarify, and build trust.',
      icon: 'Palette',
    },
    {
      title: 'Staff Augmentation',
      slug: 'staff-augmentation',
      summary: 'Embed senior engineers into your teams with clear ownership and delivery cadence.',
      icon: 'Users',
    },
    {
      title: 'SaaS Development',
      slug: 'saas-development',
      summary: 'Multi-tenant SaaS platforms with billing, identity, and growth-ready foundations.',
      icon: 'Layers',
    },
  ]

  for (const service of services) {
    const found = await payload.find({
      collection: 'services',
      where: { slug: { equals: service.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.totalDocs === 0) {
      await payload.create({
        collection: 'services',
        data: {
          ...service,
          body: richParagraph(service.summary),
          benefits: [
            { title: 'Clear discovery', description: 'Scoped outcomes before execution.' },
            { title: 'Senior delivery', description: 'Practitioners who own architecture and quality.' },
            { title: 'Measurable impact', description: 'KPIs tied to business value, not vanity metrics.' },
          ],
          _status: 'published',
        },
        overrideAccess: true,
      })
      console.log(`Service: ${service.title}`)
    }
  }

  const industries = [
    { title: 'Manufacturing', slug: 'manufacturing', summary: 'Connected operations, ERP modernization, and industrial software.' },
    { title: 'Healthcare', slug: 'healthcare', summary: 'Secure clinical and patient platforms with compliance-first delivery.' },
    { title: 'Education', slug: 'education', summary: 'Learning platforms and campus systems built for scale and accessibility.' },
    { title: 'Logistics', slug: 'logistics', summary: 'Tracking, optimization, and control towers for complex supply chains.' },
    { title: 'Retail', slug: 'retail', summary: 'Omnichannel commerce, inventory intelligence, and customer platforms.' },
    { title: 'Government', slug: 'government', summary: 'Secure digital public services with transparency and reliability.' },
    { title: 'SaaS', slug: 'saas', summary: 'Product engineering partnerships for venture-backed and enterprise SaaS.' },
  ]

  for (const industry of industries) {
    const found = await payload.find({
      collection: 'industries',
      where: { slug: { equals: industry.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.totalDocs === 0) {
      await payload.create({
        collection: 'industries',
        data: {
          ...industry,
          challenges: 'Fragmented systems, slow delivery cycles, and unclear ownership of digital outcomes.',
          approach: richParagraph(industry.summary),
          _status: 'published',
        },
        overrideAccess: true,
      })
      console.log(`Industry: ${industry.title}`)
    }
  }

  const solutions = [
    { title: 'Cloud Modernization', slug: 'cloud-modernization', summary: 'Migrate and optimize workloads for resilience and cost efficiency.' },
    { title: 'AI Operations', slug: 'ai-operations', summary: 'Operationalize AI assistants and automation across business workflows.' },
    { title: 'Platform Engineering', slug: 'platform-engineering', summary: 'Internal developer platforms that accelerate safe delivery.' },
  ]

  for (const solution of solutions) {
    const found = await payload.find({
      collection: 'solutions',
      where: { slug: { equals: solution.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.totalDocs === 0) {
      await payload.create({
        collection: 'solutions',
        data: {
          ...solution,
          body: richParagraph(solution.summary),
          _status: 'published',
        },
        overrideAccess: true,
      })
      console.log(`Solution: ${solution.title}`)
    }
  }

  const home = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    overrideAccess: true,
  })

  if (home.totalDocs === 0) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        layout: [
          {
            blockType: 'hero',
            eyebrow: 'Xelarvis Technologies',
            heading: 'Engineering Digital Excellence.',
            subheading:
              'Enterprise consulting, product engineering, and cloud platforms for organizations that need clarity, speed, and lasting quality.',
            ctaLabel: 'Start a conversation',
            ctaHref: '/contact',
          },
          {
            blockType: 'servicesGrid',
            heading: 'Capabilities that move the business',
            subheading: 'From strategy to production systems — one accountable partner.',
          },
          {
            blockType: 'industriesStrip',
            heading: 'Industries we serve',
            subheading: 'Domain-aware teams for complex operating environments.',
          },
          {
            blockType: 'statsRow',
            heading: 'Built for enterprise outcomes',
            stats: [
              { label: 'Capability areas', value: '11+' },
              { label: 'Engagement models', value: 'Flexible' },
              { label: 'Delivery focus', value: 'Production' },
            ],
          },
          {
            blockType: 'ctaBand',
            heading: 'Ready to engineer what comes next?',
            subheading: 'Tell us about your product, platform, or transformation goals.',
            ctaLabel: 'Talk to an expert',
            ctaHref: '/contact',
          },
        ],
        _status: 'published',
      },
      overrideAccess: true,
    })
    console.log('Created home page')
  }

  for (const legal of [
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      heading: 'Privacy Policy',
      body: 'This privacy policy describes how Xelarvis Technologies collects and uses information. Update this page in the CMS with your final legal copy.',
    },
    {
      slug: 'terms',
      title: 'Terms & Conditions',
      heading: 'Terms & Conditions',
      body: 'These terms govern use of xelarvis.in. Replace this placeholder with counsel-approved terms in the CMS.',
    },
  ]) {
    const found = await payload.find({
      collection: 'pages',
      where: { slug: { equals: legal.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.totalDocs === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          title: legal.title,
          slug: legal.slug,
          layout: [
            {
              blockType: 'hero',
              heading: legal.heading,
              subheading: legal.body,
            },
            {
              blockType: 'richText',
              content: richParagraph(legal.body),
            },
          ],
          _status: 'published',
        },
        overrideAccess: true,
      })
      console.log(`Page: ${legal.title}`)
    }
  }

  const careerFound = await payload.find({
    collection: 'careers',
    where: { slug: { equals: 'senior-fullstack-engineer' } },
    limit: 1,
    overrideAccess: true,
  })
  if (careerFound.totalDocs === 0) {
    await payload.create({
      collection: 'careers',
      data: {
        title: 'Senior Full-Stack Engineer',
        slug: 'senior-fullstack-engineer',
        department: 'Engineering',
        location: 'Remote / India',
        type: 'full-time',
        description: richParagraph(
          'Build enterprise web platforms with Next.js, TypeScript, and cloud-native services. You will own features end-to-end with a senior team.',
        ),
        requirements: richParagraph(
          '5+ years shipping production software. Strong TypeScript. Experience with Next.js or similar React frameworks. Comfort with system design and code review.',
        ),
        active: true,
        _status: 'published',
      },
      overrideAccess: true,
    })
    console.log('Created sample career')
  }

  const authorFound = await payload.find({ collection: 'authors', limit: 1, overrideAccess: true })
  let authorId = authorFound.docs[0]?.id
  if (!authorId) {
    const author = await payload.create({
      collection: 'authors',
      data: {
        name: 'Xelarvis Editorial',
        role: 'Engineering',
        bio: 'Insights from the Xelarvis delivery and architecture practice.',
      },
      overrideAccess: true,
    })
    authorId = author.id
  }

  const catFound = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'engineering' } },
    limit: 1,
    overrideAccess: true,
  })
  let categoryId = catFound.docs[0]?.id
  if (!categoryId) {
    const category = await payload.create({
      collection: 'categories',
      data: { title: 'Engineering', slug: 'engineering' },
      overrideAccess: true,
    })
    categoryId = category.id
  }

  const blogFound = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: 'engineering-for-enterprise-outcomes' } },
    limit: 1,
    overrideAccess: true,
  })
  if (blogFound.totalDocs === 0) {
    await payload.create({
      collection: 'blogs',
      data: {
        title: 'Engineering for Enterprise Outcomes',
        slug: 'engineering-for-enterprise-outcomes',
        excerpt:
          'How disciplined product engineering, cloud foundations, and measurable delivery create durable advantage.',
        content: richParagraph(
          'Enterprise software succeeds when architecture, delivery, and business outcomes stay aligned. At Xelarvis, we treat every engagement as a production system — not a slide deck.',
        ),
        author: authorId,
        categories: [categoryId],
        publishedAt: new Date().toISOString(),
        _status: 'published',
      },
      overrideAccess: true,
    })
    console.log('Created sample blog post')
  }

  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
