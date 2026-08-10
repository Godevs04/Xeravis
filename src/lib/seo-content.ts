/**
 * GEO / AEO content helpers — factual, answer-first copy for machines and humans.
 * Does not replace CMS copy; supplements pages with structured answers.
 */

export type FaqItem = { question: string; answer: string }

export type RelatedLink = { label: string; href: string; description?: string }

export const DEFAULT_SERVICE_FAQS: FaqItem[] = [
  {
    question: 'What does Xelarvis specialize in?',
    answer:
      'Xelarvis is an Artificial Intelligence, Data Science, and IT Consulting company that helps organisations turn complex data and technology challenges into measurable business outcomes—with specialized expertise in Healthcare & Life Sciences.',
  },
  {
    question: 'Who should choose Xelarvis?',
    answer:
      'Enterprise technology leaders, CTOs, CIOs, data and analytics teams, and organisations modernising platforms or adopting AI—especially where governance, production delivery, and domain depth matter. Healthcare & Life Sciences is a specialty practice.',
  },
  {
    question: 'How long does a typical engagement take?',
    answer:
      'Discovery and architecture typically take 2–6 weeks. Delivery timelines depend on scope; many programs ship an initial production milestone in 8–16 weeks, then iterate.',
  },
  {
    question: 'How secure are Xelarvis platforms?',
    answer:
      'Security is designed for enterprise and regulated environments: access control, auditability, encryption in transit and at rest, evaluation of AI systems, and alignment with applicable compliance requirements.',
  },
  {
    question: 'Do you build custom software?',
    answer:
      'Yes. Xelarvis designs and builds custom AI systems, data platforms, cloud architectures, and enterprise software tailored to client workflows, integration needs, and governance constraints.',
  },
]

export function serviceFaqsFor(title: string, summary: string): FaqItem[] {
  const name = title.trim()
  return [
    {
      question: `What is ${name}?`,
      answer: summary,
    },
    {
      question: `Who is ${name} for?`,
      answer: `${name} is for healthcare organizations, life sciences teams, and enterprises that need reliable AI, data, or cloud capabilities with measurable operational outcomes.`,
    },
    {
      question: `Why choose Xelarvis for ${name}?`,
      answer: `Xelarvis combines data science, AI, and healthcare expertise so ${name} can move from concept into audited, production systems.`,
    },
    ...DEFAULT_SERVICE_FAQS.slice(2),
  ]
}

export function quickAnswerForService(title: string, summary: string) {
  return {
    who: 'Xelarvis Technologies (XELARVIS PRIVATE LIMITED)',
    what: title,
    summary,
    forWhom:
      'Healthcare executives, CTOs, CIOs, Healthcare IT leaders, enterprise buyers, and research organizations',
    why: 'Production-grade AI and cloud engineering with healthcare and enterprise delivery depth',
    how: 'Discovery → architecture → build → validate → deploy → operate',
  }
}

export function relatedLinksForService(slug: string): RelatedLink[] {
  const base: RelatedLink[] = [
    {
      label: 'Case studies',
      href: '/case-studies',
      description: 'Outcomes from healthcare AI and enterprise delivery programs',
    },
    {
      label: 'Technologies',
      href: '/technologies',
      description: 'AI, cloud, clinical, and data stack we put into production',
    },
    {
      label: 'AI Research Lab',
      href: '/ai-research-lab',
      description: 'Research areas, publications, and innovation projects',
    },
    {
      label: 'Insights',
      href: '/insights',
      description: 'Articles, white papers, and industry analysis',
    },
    {
      label: 'Careers',
      href: '/careers',
      description: 'Join engineering and research teams at Xelarvis',
    },
    {
      label: 'Contact',
      href: '/contact?intent=business',
      description: 'Talk with architects about fit, scope, and timeline',
    },
  ]

  if (slug.includes('healthcare') || slug.includes('clinical') || slug.includes('ai')) {
    base.unshift({
      label: 'Healthcare industry',
      href: '/industries/healthcare',
      description: 'How we serve hospitals and life sciences organizations',
    })
  }

  return base
}

export function relatedLinksForCaseStudy(): RelatedLink[] {
  return [
    { label: 'Services', href: '/services', description: 'Capabilities used across engagements' },
    { label: 'Solutions', href: '/solutions', description: 'Packaged delivery themes' },
    { label: 'Insights', href: '/insights', description: 'Deeper analysis and reports' },
    { label: 'Contact', href: '/contact', description: 'Discuss a similar initiative' },
  ]
}

export function relatedLinksForArticle(): RelatedLink[] {
  return [
    { label: 'Services', href: '/services' },
    { label: 'Case studies', href: '/case-studies' },
    { label: 'Research', href: '/ai-research-lab' },
    { label: 'White papers', href: '/insights/white-papers' },
  ]
}

/** Static sitemap paths beyond the core list. */
export const EXTRA_STATIC_ROUTES = [
  '/technologies',
  '/search',
  '/about/company-overview',
  '/about/vision-mission',
  '/about/leadership',
  '/about/why-xelarvis',
  '/about/global-presence',
  '/about/technology-innovation',
  '/about/our-approach',
  '/about/research-philosophy',
  '/ai-research-lab',
  '/ai-research-lab/research-areas',
  '/ai-research-lab/innovation-projects',
  '/ai-research-lab/publications',
  '/ai-research-lab/collaborations',
  '/ai-research-lab/open-source',
  '/insights/blogs',
  '/insights/news',
  '/insights/white-papers',
  '/insights/resources',
  '/insights/reports',
  '/docs/api',
] as const
