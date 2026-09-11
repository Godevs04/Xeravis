import type { MegaMenuItem } from '@/components/layout/MegaMenu'
import {
  DIFFERENTIATORS,
  HEALTHCARE_SPECIALTY,
  HOW_WE_THINK,
  LEADERSHIP,
  MISSION,
  RESEARCH,
  TECHNOLOGY_BRIDGE,
  VISION,
  WHO_WE_ARE,
  toBulletSections,
} from '@/lib/about-content'

export const ABOUT_MEGA: MegaMenuItem[] = [
  {
    label: 'Who We Are',
    href: '/about/company-overview',
    description: 'Philosophy behind our capabilities — not a services catalog.',
  },
  {
    label: 'Vision & Mission',
    href: '/about/vision-mission',
    description: 'Why we exist and where we are headed.',
  },
  {
    label: 'What Makes Us Different',
    href: '/about/why-xelarvis',
    description: 'Business-model differentiators that matter in delivery.',
  },
  {
    label: 'How We Think',
    href: '/about/our-approach',
    description: 'Principles that guide every engagement.',
  },
  {
    label: 'Research Meets Engineering',
    href: '/about/research-philosophy',
    description: 'Research with a path to production.',
  },
  {
    label: 'Domain Expertise',
    href: '/about/domain-expertise',
    description: 'Healthcare & clinical data as a specialty practice.',
  },
  {
    label: 'Company Facts',
    href: '/about/global-presence',
    description: 'Verified company information only.',
  },
  {
    label: 'Leadership',
    href: '/about/leadership',
    description: 'Published leadership profiles from the CMS.',
  },
]

export const RESEARCH_MEGA: MegaMenuItem[] = [
  {
    label: 'Overview',
    href: '/ai-research-lab',
    description: 'AI research with practical engineering.',
  },
  {
    label: 'Research Areas',
    href: '/ai-research-lab/research-areas',
    description: 'Focus domains across AI and applied science.',
  },
  {
    label: 'Publications',
    href: '/ai-research-lab/publications',
    description: 'Papers, notes, and research outputs.',
  },
  {
    label: 'Innovation Projects',
    href: '/ai-research-lab/innovation-projects',
    description: 'Applied experiments and prototypes.',
  },
  {
    label: 'Open Source',
    href: '/ai-research-lab/open-source',
    description: 'Community tools and contributions.',
  },
  {
    label: 'Collaborations',
    href: '/ai-research-lab/collaborations',
    description: 'Partners in academia and industry.',
  },
  {
    label: 'Technologies',
    href: '/technologies',
    description: 'AI, cloud, and data stack.',
  },
]

export const INSIGHTS_MEGA: MegaMenuItem[] = [
  {
    label: 'Insights Hub',
    href: '/insights',
    description: 'All perspectives in one place.',
  },
  {
    label: 'Case Studies',
    href: '/case-studies',
    description: 'Selected delivery outcomes.',
  },
  {
    label: 'Blogs',
    href: '/insights/blogs',
    description: 'Articles from our practice.',
  },
  {
    label: 'White Papers',
    href: '/insights/white-papers',
    description: 'In-depth technical briefs.',
  },
  {
    label: 'News',
    href: '/insights/news',
    description: 'Company and industry updates.',
  },
  {
    label: 'Reports & Research Briefs',
    href: '/insights/reports',
    description: 'Summaries and research digests.',
  },
  {
    label: 'Resources',
    href: '/insights/resources',
    description: 'Guides and downloadable materials.',
  },
]

export type ContentPageDef = {
  slug: string
  path: string
  eyebrow: string
  title: string
  subtitle: string
  sections: { heading: string; body: string; bullets?: string[] }[]
}

export const ABOUT_PAGES: ContentPageDef[] = [
  {
    slug: 'company-overview',
    path: '/about/company-overview',
    eyebrow: 'About',
    title: WHO_WE_ARE.title,
    subtitle: WHO_WE_ARE.intro,
    sections: [
      {
        heading: 'What we stand for',
        body: WHO_WE_ARE.span,
      },
      ...WHO_WE_ARE.pillars.map((pillar) => ({
        heading: pillar.title,
        body: pillar.description,
      })),
      {
        heading: 'Explore further',
        body: 'The Services page explains our five capabilities in depth. About introduces the philosophy — then links you there.',
      },
    ],
  },
  {
    slug: 'vision-mission',
    path: '/about/vision-mission',
    eyebrow: 'About',
    title: 'Vision & Mission',
    subtitle: 'Why XELARVIS exists and how we measure progress.',
    sections: [
      {
        heading: MISSION.title,
        body: `${MISSION.statement} ${MISSION.detail}`,
      },
      {
        heading: 'Positioning',
        body: MISSION.positioning,
      },
      {
        heading: VISION.title,
        body: VISION.statement,
      },
    ],
  },
  {
    slug: 'why-xelarvis',
    path: '/about/why-xelarvis',
    eyebrow: 'About',
    title: 'What Makes XELARVIS Different',
    subtitle:
      'Differentiators tied to our business model — not generic innovation or excellence claims.',
    sections: toBulletSections(DIFFERENTIATORS),
  },
  {
    slug: 'our-approach',
    path: '/about/our-approach',
    eyebrow: 'About',
    title: 'How We Think',
    subtitle: 'Principles that guide how XELARVIS approaches complex technology challenges.',
    sections: toBulletSections(HOW_WE_THINK),
  },
  {
    slug: 'research-philosophy',
    path: '/about/research-philosophy',
    eyebrow: 'About',
    title: RESEARCH.title,
    subtitle: RESEARCH.body,
    sections: [
      {
        heading: 'About → Research → Capabilities → Solutions',
        body: 'Research informs how we evaluate, govern and deploy AI — without turning About into a research catalog. Explore the research lab for methods, publications and collaborations.',
      },
    ],
  },
  {
    slug: 'domain-expertise',
    path: '/about/domain-expertise',
    eyebrow: 'About',
    title: HEALTHCARE_SPECIALTY.title,
    subtitle: HEALTHCARE_SPECIALTY.body,
    sections: [
      {
        heading: 'Specialty, not the whole brand',
        body: HEALTHCARE_SPECIALTY.note,
      },
    ],
  },
  {
    slug: 'technology-innovation',
    path: '/about/technology-innovation',
    eyebrow: 'About',
    title: TECHNOLOGY_BRIDGE.title,
    subtitle: TECHNOLOGY_BRIDGE.body,
    sections: [
      {
        heading: 'Where technology belongs',
        body: 'Technology stacks are contextual — surfaced on Services and Solutions pages from the master catalog, not as a logo wall on About.',
      },
    ],
  },
  {
    slug: 'global-presence',
    path: '/about/global-presence',
    eyebrow: 'About',
    title: 'Verified Company Facts',
    subtitle: 'Only substantiated information — no placeholder counters or inflated claims.',
    sections: [
      {
        heading: 'Company',
        body: 'XELARVIS Private Limited',
      },
      {
        heading: 'Headquarters',
        body: 'Hyderabad, India',
      },
      {
        heading: 'Focus',
        body: 'AI • Data • Technology • Healthcare',
      },
      {
        heading: 'Practice scope',
        body: 'Five core capabilities, nine solution areas, and industry programs across sectors including healthcare, financial services, manufacturing, and technology — linked from Capabilities, Solutions, and Industries hubs.',
      },
    ],
  },
  {
    slug: 'leadership',
    path: '/about/leadership',
    eyebrow: 'About',
    title: LEADERSHIP.title,
    subtitle: LEADERSHIP.intro,
    sections: [],
  },
]

/** Sub-capabilities surfaced as in-page chips on service detail pages (client brief nesting). */
export const SERVICE_CAPABILITIES: Record<string, string[]> = {
  'artificial-intelligence-ai-research': [
    'AI Strategy & Advisory',
    'Machine Learning',
    'Generative AI',
    'Large Language Models',
    'AI Agents',
    'Natural Language Processing',
    'Computer Vision',
    'Predictive AI',
    'Responsible AI',
    'AI Evaluation & Governance',
    'MLOps / AI Engineering',
  ],
  'data-science-advanced-analytics': [
    'Data Strategy',
    'Exploratory Data Analysis',
    'Statistical Modeling',
    'Predictive Analytics',
    'Machine Learning',
    'Forecasting',
    'Customer Analytics',
    'Risk Analytics',
    'Optimization',
    'Business Intelligence',
    'Data Visualization',
    'Decision Intelligence',
  ],
  'it-consulting-digital-transformation': [
    'IT Strategy',
    'Digital Transformation',
    'Enterprise Architecture',
    'Application Modernization',
    'Software Engineering',
    'Cloud Transformation',
    'Technology Advisory',
    'API & Integration',
    'DevOps',
    'Automation',
    'Legacy Modernization',
  ],
  'data-engineering-cloud-solutions': [
    'Data Architecture',
    'Data Lakes',
    'Data Warehouses',
    'Data Pipelines',
    'ETL/ELT',
    'Big Data',
    'Cloud Data Platforms',
    'Data Governance',
    'Data Quality',
    'MLOps Infrastructure',
  ],
  'clinical-data-science-healthcare-ai': [
    'Clinical SAS Programming',
    'SDTM',
    'ADaM',
    'Tables, Listings & Figures (TLF)',
    'Clinical Data Analytics',
    'Clinical Data Management',
    'Healthcare AI',
    'Real-World Data Analytics',
    'Clinical Research Analytics',
    'CDISC-Aligned Data Standards',
  ],
}

/**
 * Extra service-page content (deliverables / industries / outcomes / related solutions)
 * keyed by the five stable service slugs.
 */
export const SERVICE_PAGE_EXTRAS: Record<
  string,
  {
    deliverables: string[]
    industries: string[]
    outcomes: string[]
    relatedSolutions: { label: string; href: string }[]
  }
> = {
  'artificial-intelligence-ai-research': {
    deliverables: [
      'AI opportunity assessment and roadmap',
      'Production-ready models and agent workflows',
      'Evaluation harnesses and governance controls',
      'MLOps pipelines with monitoring and retraining paths',
      'Integration into applications, APIs, and platforms',
    ],
    industries: [
      'Technology',
      'Banking & Financial Services',
      'Manufacturing',
      'Retail & E-Commerce',
      'Logistics & Supply Chain',
      'Healthcare & Life Sciences',
    ],
    outcomes: [
      'Faster path from AI pilots to production systems',
      'Clear evaluation criteria and responsible-AI controls',
      'Measurable operational or decision improvements',
      'Maintainable model lifecycle with ownership transfer',
    ],
    relatedSolutions: [
      { label: 'Enterprise AI', href: '/solutions/enterprise-ai-solutions' },
      { label: 'AI Agents', href: '/solutions/ai-agents' },
      { label: 'Custom AI Products', href: '/solutions/custom-ai-products' },
      { label: 'Intelligent Automation', href: '/solutions/intelligent-automation' },
      { label: 'Predictive Analytics', href: '/solutions/predictive-analytics-solutions' },
    ],
  },
  'data-science-advanced-analytics': {
    deliverables: [
      'Data strategy and analytic roadmap',
      'Statistical and ML models tied to KPIs',
      'Forecasting and decision models',
      'BI dashboards and executive reporting layers',
      'Recommendations and enablement for client teams',
    ],
    industries: [
      'Banking & Financial Services',
      'Manufacturing',
      'Retail & E-Commerce',
      'Logistics',
      'Enterprise Technology',
      'Healthcare & Life Sciences',
    ],
    outcomes: [
      'Decisions grounded in trusted metrics and models',
      'Improved forecasting, risk, and customer insight',
      'Shared analytic language across business and data teams',
      'Repeatable modeling patterns clients can extend',
    ],
    relatedSolutions: [
      { label: 'Predictive Analytics', href: '/solutions/predictive-analytics-solutions' },
      { label: 'Business Intelligence', href: '/solutions/business-intelligence-solutions' },
      { label: 'Enterprise AI', href: '/solutions/enterprise-ai-solutions' },
      { label: 'Intelligent Automation', href: '/solutions/intelligent-automation' },
      { label: 'Data Platforms', href: '/solutions/data-platforms' },
    ],
  },
  'it-consulting-digital-transformation': {
    deliverables: [
      'IT strategy and transformation roadmap',
      'Target enterprise architecture',
      'Modernized applications and integration patterns',
      'Cloud and DevOps delivery foundations',
      'Automation and legacy coexistence plans',
    ],
    industries: [
      'Technology',
      'Manufacturing',
      'Retail & E-Commerce',
      'Logistics & Supply Chain',
      'Banking & Financial Services',
    ],
    outcomes: [
      'Clear modernization priorities tied to business outcomes',
      'More maintainable, secure application landscapes',
      'Faster, safer release cycles through DevOps practices',
      'Reduced operational risk from legacy systems',
    ],
    relatedSolutions: [
      { label: 'Application Modernization', href: '/solutions/application-modernization' },
      { label: 'Intelligent Automation', href: '/solutions/intelligent-automation' },
      { label: 'Custom AI Products', href: '/solutions/custom-ai-products' },
      { label: 'Data Platforms', href: '/solutions/data-platforms' },
      { label: 'Enterprise AI', href: '/solutions/enterprise-ai-solutions' },
    ],
  },
  'data-engineering-cloud-solutions': {
    deliverables: [
      'Data architecture and platform design',
      'Lakes, warehouses, and pipeline implementations',
      'ETL/ELT and streaming workloads',
      'Governance, quality, and observability controls',
      'MLOps infrastructure for analytics and AI',
    ],
    industries: [
      'Technology',
      'Banking & Financial Services',
      'Manufacturing',
      'Retail & E-Commerce',
      'Logistics & Supply Chain',
      'Healthcare & Life Sciences',
    ],
    outcomes: [
      'Reliable data foundations for analytics and AI',
      'Lower latency and higher trust in critical datasets',
      'Governed access, lineage, and quality monitoring',
      'Scalable cloud cost and performance posture',
    ],
    relatedSolutions: [
      { label: 'Data Platforms', href: '/solutions/data-platforms' },
      { label: 'Business Intelligence', href: '/solutions/business-intelligence-solutions' },
      { label: 'Predictive Analytics', href: '/solutions/predictive-analytics-solutions' },
      { label: 'Enterprise AI', href: '/solutions/enterprise-ai-solutions' },
      { label: 'Intelligent Automation', href: '/solutions/intelligent-automation' },
    ],
  },
  'clinical-data-science-healthcare-ai': {
    deliverables: [
      'Clinical study assessment and CDISC-aligned plans',
      'SDTM and ADaM datasets with quality-control artifacts',
      'TLF programming and automation packages',
      'Clinical and real-world analytics dashboards',
      'Healthcare AI applications where appropriate',
    ],
    industries: ['Healthcare & Life Sciences', 'Pharmaceutical', 'Biotechnology'],
    outcomes: [
      'High-quality, traceable clinical data and analytics workflows',
      'Faster, more consistent TLF and analytics cycles',
      'Stronger CDISC alignment and quality-control coverage',
      'Responsible adoption of AI in healthcare and clinical workflows',
    ],
    relatedSolutions: [
      {
        label: 'Healthcare & Clinical Intelligence',
        href: '/solutions/healthcare-clinical-intelligence',
      },
      { label: 'Predictive Analytics', href: '/solutions/predictive-analytics-solutions' },
      { label: 'Business Intelligence', href: '/solutions/business-intelligence-solutions' },
      { label: 'Enterprise AI', href: '/solutions/enterprise-ai-solutions' },
      { label: 'Data Platforms', href: '/solutions/data-platforms' },
    ],
  },
}

export const LAB_PAGES: ContentPageDef[] = [
  {
    slug: 'overview',
    path: '/ai-research-lab',
    eyebrow: 'AI Research Lab',
    title: 'A genuine research lab with a path to production',
    subtitle:
      'XELARVIS AI Research Lab investigates applied AI problems—publications, projects, methodology, datasets/code, and responsible AI—always with a credible transfer into client delivery.',
    sections: [
      {
        heading: 'What the lab does',
        body: 'We treat research as a disciplined practice, not a marketing label. Teams define questions, evaluate methods honestly, document assumptions, and only promote approaches that meet quality and safety bars.',
        bullets: [
          'Publications — papers, technical notes, and methodology briefs',
          'Innovation projects — applied experiments with clear evaluation criteria',
          'Methodology — reproducible evaluation, benchmarks, and responsible-AI review',
          'Datasets & code — reusable harnesses and open contributions where appropriate',
          'Responsible AI — fairness, privacy, safety, and human oversight',
        ],
      },
      {
        heading: 'From research to delivery',
        body: 'Successful ideas transfer into consulting engagements as governed production systems—models, platforms, and evaluation practices client teams can own and extend.',
      },
    ],
  },
  {
    slug: 'research-areas',
    path: '/ai-research-lab/research-areas',
    eyebrow: 'AI Research Lab',
    title: 'Research Areas',
    subtitle:
      'Focus domains spanning foundation models, agents, NLP, vision, decision intelligence, MLOps, and responsible AI—with healthcare as a specialty application area.',
    sections: [
      {
        heading: 'Core areas',
        body: 'Our research agenda is organized around high-impact application domains that support enterprise AI, data science, and technology programs.',
        bullets: [
          'Generative AI, LLMs, and AI agents',
          'Natural language processing and document intelligence',
          'Computer vision and multimodal systems',
          'Predictive modeling and decision intelligence',
          'MLOps, evaluation harnesses, and benchmarks',
          'Responsible AI — bias, privacy, safety, and governance',
          'Specialty: healthcare and clinical intelligence where regulated depth is required',
        ],
      },
    ],
  },
  {
    slug: 'publications',
    path: '/ai-research-lab/publications',
    eyebrow: 'AI Research Lab',
    title: 'Publications',
    subtitle:
      'Papers, white papers, methodology notes, and research briefs that document evidence—not hype.',
    sections: [
      {
        heading: 'Sharing knowledge',
        body: 'We publish practical findings that help teams adopt AI safely in enterprise and regulated environments: evaluation methods, failure modes, governance patterns, and transfer lessons from lab to production.',
        bullets: [
          'Technical notes and research blogs',
          'White papers and methodology briefs',
          'Conference-style write-ups and internal reports when shareable',
          'Links to related Insights content for broader audiences',
        ],
      },
    ],
  },
  {
    slug: 'innovation-projects',
    path: '/ai-research-lab/innovation-projects',
    eyebrow: 'AI Research Lab',
    title: 'Innovation Projects',
    subtitle:
      'Applied experiments that validate new capabilities before full-scale consulting delivery.',
    sections: [
      {
        heading: 'From prototype to product',
        body: 'Innovation projects explore AI assistants, document intelligence, recommendation systems, forecasting prototypes, and automation agents—with explicit success metrics, responsible-AI checks, and a documented path to productionization.',
        bullets: [
          'Scoped experiments with evaluation criteria up front',
          'Reproducible notebooks, datasets, and harnesses where possible',
          'Go / no-go decisions based on evidence, not demos alone',
          'Handoff packages for engineering and client delivery teams',
        ],
      },
    ],
  },
  {
    slug: 'open-source',
    path: '/ai-research-lab/open-source',
    eyebrow: 'AI Research Lab',
    title: 'Open Source & Code',
    subtitle:
      'Datasets, evaluation harnesses, libraries, and documentation that strengthen reliable AI engineering.',
    sections: [
      {
        heading: 'Community contributions',
        body: 'Where appropriate, we contribute tools and patterns that help others build governed AI systems—evaluation harnesses, reference pipelines, documentation, and reusable components.',
        bullets: [
          'Evaluation and benchmarking utilities',
          'Reference MLOps and data pipeline patterns',
          'Documentation for responsible-AI practices',
          'Selective open datasets or synthetic fixtures for reproducible tests',
        ],
      },
    ],
  },
  {
    slug: 'collaborations',
    path: '/ai-research-lab/collaborations',
    eyebrow: 'AI Research Lab',
    title: 'Collaborations',
    subtitle: 'Working with academia, industry, and technology partners on applied research.',
    sections: [
      {
        heading: 'Partners',
        body: 'We collaborate with universities, research institutions, technology partners, and industry teams to advance applied AI—across enterprise domains, with healthcare and life sciences as one specialty area among others.',
        bullets: [
          'University and academic research partnerships',
          'Industry collaborations on applied AI problems',
          'Technology ecosystem partnerships',
          'Joint methodology and publication efforts where appropriate',
        ],
      },
    ],
  },
]

export const HIRING_STEPS = [
  {
    title: 'Application Submission',
    description: 'Submit your profile, resume, and responses through our careers form.',
  },
  {
    title: 'Application Review',
    description: 'Our recruitment team screens for role fit, skills, and experience.',
  },
  {
    title: 'HR Screening',
    description: 'A short conversation about your background, interests, and logistics.',
  },
  {
    title: 'Technical Assessment',
    description: 'Role-dependent exercise or take-home to evaluate practical skills.',
  },
  {
    title: 'Technical Interview',
    description: 'Deep dive with practitioners on problem-solving and craft.',
  },
  {
    title: 'Manager / Final Interview',
    description: 'Alignment on scope, collaboration style, and growth path.',
  },
  {
    title: 'Offer & Background Verification',
    description: 'Written offer and standard verification steps.',
  },
  {
    title: 'Onboarding',
    description: 'Welcome, tooling access, and a structured ramp into your team.',
  },
] as const

export const WHY_JOIN = [
  'Work on AI, data science, and IT consulting programs',
  'Research-driven environment with a path to production',
  'Learning, certifications, and development support',
  'Internship and graduate pathways',
  'Flexible work opportunities',
  'Global collaboration across industries',
  'Career growth and mentorship',
  'Inclusive workplace — healthcare specialty available where roles require it',
] as const

export const LIFE_AT_XELARVIS = {
  title: 'Life at XELARVIS',
  body: 'A collaborative culture where engineers, analysts, researchers, and consultants solve meaningful problems in AI, data science, and IT consulting—with mentorship, learning support, and room to grow. Healthcare & clinical work is available as a specialty track, not the only path.',
  bullets: [
    'Cross-functional teams spanning AI, analytics, data engineering, and consulting',
    'Continuous learning through projects, reviews, and certifications',
    'Inclusive workplace with flexible work opportunities',
    'Clear ownership and recognition for business impact',
  ],
} as const

export const GRADUATE_PROGRAMS = {
  title: 'Graduate Programs',
  body: 'Structured pathways for early-career talent to build depth in AI, analytics, data platforms, and enterprise technology consulting with mentorship and real project exposure.',
  bullets: [
    'Rotations and guided onboarding into delivery teams',
    'Mentorship from senior practitioners',
    'Hands-on work on production and research projects',
    'Clear growth milestones into full-time roles',
  ],
} as const

/**
 * Contact interest areas for the marketing form / contact page chips.
 *
 * Existing ContactMessages / submitContact allowed values:
 *   business | research | career | general | project | partnership
 *
 * Mapping choices:
 *   - AI & Machine Learning → `business` (keeps /contact?intent=business links working)
 *   - Research / Partnership / Careers / General → existing select values
 *
 * New values below are NOT yet in ContactMessages.options or submitContact's
 * Intent union — add (or remapped) in:
 *   - src/payload/collections/ContactMessages.ts (intent options)
 *   - src/actions/contact.ts (Intent type + allowed list)
 *   - regenerate payload types after schema change
 *
 *   data-science | it-consulting | digital-transformation |
 *   data-engineering | healthcare
 *
 * Until updated, submitContact coerces those unknown intents to `general`
 * (the form subject field still records the raw value).
 */
export const CONTACT_INTENTS = [
  {
    value: 'business',
    label: 'AI & Machine Learning',
    description: 'Models, generative AI, agents, and production AI programs.',
  },
  {
    value: 'data-science',
    label: 'Data Science & Analytics',
    description: 'Modeling, forecasting, BI, and decision intelligence.',
  },
  {
    value: 'it-consulting',
    label: 'IT Consulting',
    description: 'Strategy, architecture, and enterprise technology programs.',
  },
  {
    value: 'digital-transformation',
    label: 'Digital Transformation',
    description: 'Modernization roadmaps and technology-led change.',
  },
  {
    value: 'data-engineering',
    label: 'Data Engineering',
    description: 'Platforms, pipelines, cloud data foundations, and MLOps.',
  },
  {
    value: 'healthcare',
    label: 'Healthcare / Clinical Data Science',
    description: 'Clinical programming, CDISC, and healthcare analytics specialty.',
  },
  {
    value: 'research',
    label: 'Research Collaboration',
    description: 'Academic, industry, and lab collaborations.',
  },
  {
    value: 'partnership',
    label: 'Partnership',
    description: 'Technology partners, alliances, and co-delivery.',
  },
  {
    value: 'career',
    label: 'Careers',
    description: 'Roles, internships, and graduate programs.',
  },
  {
    value: 'general',
    label: 'General enquiry',
    description: 'Other questions and media enquiries.',
  },
] as const
