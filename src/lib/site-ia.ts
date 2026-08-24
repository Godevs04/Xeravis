import type { MegaMenuItem } from '@/components/layout/MegaMenu'

export const ABOUT_MEGA: MegaMenuItem[] = [
  {
    label: 'Company Overview',
    href: '/about/company-overview',
    description: 'Who we are and what we deliver.',
  },
  {
    label: 'Vision & Mission',
    href: '/about/vision-mission',
    description: 'Our purpose and long-term direction.',
  },
  {
    label: 'Leadership',
    href: '/about/leadership',
    description: 'The people guiding XELARVIS.',
  },
  {
    label: 'Technology & Innovation',
    href: '/about/technology-innovation',
    description: 'How we build and advance technology.',
  },
  {
    label: 'Our Approach',
    href: '/about/our-approach',
    description: 'Delivery principles from discovery to production.',
  },
  {
    label: 'Research Philosophy',
    href: '/about/research-philosophy',
    description: 'Research that ships with rigor and responsibility.',
  },
  {
    label: 'Why XELARVIS',
    href: '/about/why-xelarvis',
    description: 'What makes our partnership different.',
  },
  {
    label: 'Global Presence',
    href: '/about/global-presence',
    description: 'Where we work and collaborate.',
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
    eyebrow: 'About Us',
    title: 'About XELARVIS',
    subtitle:
      'XELARVIS is an AI, Data Science and IT Consulting company focused on helping organizations turn data and technology into measurable business value—with specialized expertise in Healthcare & Life Sciences.',
    sections: [
      {
        heading: 'What we do',
        body: 'We help organizations solve complex data and technology challenges through three primary pillars: Artificial Intelligence, Data Science & Analytics, and IT Consulting & Digital Transformation. Healthcare & Life Sciences is a specialized practice—not our lead brand identity.',
        bullets: [
          'Artificial Intelligence — machine learning, generative AI, agents, NLP, and computer vision',
          'Data Science & Analytics — modeling, forecasting, BI, and decision intelligence',
          'IT Consulting & Digital Transformation — architecture, modernization, cloud, and engineering',
          'Specialty: Healthcare & Clinical Data Science — clinical programming, analytics, and regulated AI',
        ],
      },
      {
        heading: 'How we work',
        body: 'Engagements follow a clear path from problem to production: research and discovery, strategy, design, build, deploy, and continuous optimization. Senior practitioners stay accountable across the lifecycle so solutions are accurate, secure, and operable.',
      },
      {
        heading: 'What makes us different',
        body: 'We combine research rigor with consulting-led delivery—closer in craft to enterprise AI and technology consulting organizations than to a typical software agency.',
        bullets: [
          'Research-driven — methods grounded in evaluation and continuous learning',
          'Engineering-led — architecture and delivery that survive production',
          'Outcome-focused — a credible path from problem to measurable business value',
          'Industry-aware — enterprise delivery across sectors, with depth in Healthcare & Life Sciences',
        ],
      },
    ],
  },
  {
    slug: 'vision-mission',
    path: '/about/vision-mission',
    eyebrow: 'About Us',
    title: 'Vision & Mission',
    subtitle: 'Guiding how XELARVIS builds intelligent, scalable, and trustworthy technology.',
    sections: [
      {
        heading: 'Vision',
        body: 'Be a trusted partner for AI, data and technology transformation across industries—with depth where regulated and research-intensive work demands it.',
      },
      {
        heading: 'Mission',
        body: 'Help organisations turn complex data and technology challenges into measurable outcomes through Artificial Intelligence, Data Science and IT Consulting.',
      },
    ],
  },
  {
    slug: 'leadership',
    path: '/about/leadership',
    eyebrow: 'About Us',
    title: 'Leadership',
    subtitle: 'Senior practitioners who combine research depth with delivery discipline.',
    sections: [
      {
        heading: 'How we lead',
        body: 'XELARVIS leadership emphasizes clarity, accountable ownership, and research-informed engineering. Our leaders stay close to client outcomes — from discovery through production.',
        bullets: [
          'Hands-on architecture and delivery oversight',
          'Ethics, quality, and governance in AI and data work',
          'Mentorship and continuous learning culture',
        ],
      },
    ],
  },
  {
    slug: 'technology-innovation',
    path: '/about/technology-innovation',
    eyebrow: 'About Us',
    title: 'Technology & Innovation',
    subtitle:
      'We invest in modern stacks, applied research, and engineering practices that turn ideas into production systems.',
    sections: [
      {
        heading: 'How we innovate',
        body: 'XELARVIS advances technology through a dual track: applied AI research and enterprise-grade engineering. We evaluate emerging methods, validate them with clear metrics, and productize what proves reliable in real workflows.',
        bullets: [
          'AI, ML, generative AI, agents, and intelligent automation',
          'Data science, analytics platforms, and decision intelligence',
          'Cloud-native data engineering, platforms, and MLOps',
          'IT consulting, application modernization, and secure enterprise software',
          'Specialty depth in clinical data science and healthcare analytics where required',
        ],
      },
      {
        heading: 'From lab to production',
        body: 'Innovation is measured by outcomes — accuracy, governance readiness, operability, and business value — not demos. Successful prototypes move into governed delivery with monitoring and continuous improvement.',
      },
    ],
  },
  {
    slug: 'our-approach',
    path: '/about/our-approach',
    eyebrow: 'XELARVIS Delivery Framework',
    title: 'Our Approach',
    subtitle: 'A consulting + engineering methodology from business problem to measurable results.',
    sections: [
      {
        heading: '01 — Discover',
        body: 'Understand the business problem, stakeholders, constraints, and success criteria.',
      },
      {
        heading: '02 — Strategize',
        body: 'Define the AI, data and technology roadmap aligned to outcomes and readiness.',
      },
      {
        heading: '03 — Design',
        body: 'Architect scalable solutions, data flows, governance, and delivery plans.',
      },
      {
        heading: '04 — Build',
        body: 'Develop models, platforms, and applications with quality and security built in.',
      },
      {
        heading: '05 — Deploy',
        body: 'Ship to production with monitoring, documentation, and operational readiness.',
      },
      {
        heading: '06 — Optimize',
        body: 'Measure outcomes, refine performance, and expand what works across the organization.',
      },
    ],
  },
  {
    slug: 'research-philosophy',
    path: '/about/research-philosophy',
    eyebrow: 'About Us',
    title: 'Research Philosophy',
    subtitle: 'Research with rigor, ethics, and a path to real-world impact.',
    sections: [
      {
        heading: 'What guides our research',
        body: 'XELARVIS treats research as a disciplined practice: define the question, evaluate methods honestly, document assumptions, and ship only what meets quality and safety bars.',
        bullets: [
          'Evidence over hype — evaluate models with clear metrics',
          'Responsible AI — bias, privacy, safety, and human oversight',
          'Production path — methods that transfer into governed delivery',
          'Domain depth where it matters — including healthcare as a specialty',
          'Open collaboration — academia, industry, and open source where appropriate',
        ],
      },
      {
        heading: 'Impact orientation',
        body: 'We publish and share methods that help teams adopt AI safely in enterprise and regulated environments, while keeping a direct line from research insights to client delivery.',
      },
    ],
  },
  {
    slug: 'why-xelarvis',
    path: '/about/why-xelarvis',
    eyebrow: 'About Us',
    title: 'Why XELARVIS',
    subtitle:
      'Enterprise buyers look for clarity, evidence, expertise, governance, and a credible path from problem to measurable outcome.',
    sections: [
      {
        heading: 'What sets us apart',
        body: 'We combine research-driven methods with practical engineering so solutions are accurate, governed, and ready for production—without overstating scale or inventing credentials.',
        bullets: [
          'Clarity — honest positioning across AI, data science, and IT consulting',
          'Evidence — rigorous evaluation and delivery you can inspect',
          'Expertise — practitioners who stay accountable from strategy to optimize',
          'Governance — responsible AI, security, and quality built into delivery',
          'Specialty depth — Healthcare & Clinical Data Science when regulated work demands it',
          'End-to-end path — Discover → Strategize → Design → Build → Deploy → Optimize',
        ],
      },
    ],
  },
  {
    slug: 'global-presence',
    path: '/about/global-presence',
    eyebrow: 'About Us',
    title: 'Global Presence',
    subtitle:
      'Collaborating with teams and clients across regions while staying rooted in delivery excellence.',
    sections: [
      {
        heading: 'Where we work',
        body: 'XELARVIS supports organizations across industries—without positioning healthcare as the only market we serve. Delivery hubs and remote collaboration models connect client teams with our practitioners.',
        bullets: [
          'Banks and financial services',
          'Manufacturers and industrial operators',
          'Retail and e-commerce organizations',
          'Technology companies',
          'Healthcare organizations',
          'Pharmaceutical companies',
          'Universities and research institutions',
          'Government and public-sector programs',
        ],
      },
    ],
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
    'TLF Automation',
    'Clinical Analytics',
    'Clinical Data Management',
    'Healthcare AI',
    'Real-World Data Analytics',
    'Clinical Research Analytics',
    'Regulatory Data Standards',
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
      'Banking & Financial Services',
      'Manufacturing',
      'Retail & E-Commerce',
      'Enterprise Technology',
      'Healthcare & Life Sciences',
      'Education & Research',
    ],
    outcomes: [
      'Faster path from AI pilots to production systems',
      'Clear evaluation criteria and responsible-AI controls',
      'Measurable operational or decision improvements',
      'Maintainable model lifecycle with ownership transfer',
    ],
    relatedSolutions: [
      { label: 'Enterprise AI', href: '/solutions/enterprise-ai-solutions' },
      { label: 'Intelligent Automation', href: '/solutions/intelligent-automation' },
      { label: 'Custom AI Products', href: '/solutions/custom-ai-products' },
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
      'Enterprise Technology',
      'Banking & Financial Services',
      'Manufacturing',
      'Retail & E-Commerce',
      'Government & Public Sector',
      'Healthcare & Life Sciences',
    ],
    outcomes: [
      'Clear modernization priorities tied to business outcomes',
      'More maintainable, secure application landscapes',
      'Faster, safer release cycles through DevOps practices',
      'Reduced operational risk from legacy systems',
    ],
    relatedSolutions: [
      { label: 'Application Modernization', href: '/solutions/application-modernization' },
      { label: 'Data Platforms', href: '/solutions/data-platforms' },
      { label: 'Intelligent Automation', href: '/solutions/intelligent-automation' },
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
      'Banking & Financial Services',
      'Manufacturing',
      'Retail & E-Commerce',
      'Enterprise Technology',
      'Pharmaceutical & Biotechnology',
      'Education & Research',
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
      { label: 'Enterprise AI', href: '/solutions/enterprise-ai-solutions' },
    ],
  },
  'clinical-data-science-healthcare-ai': {
    deliverables: [
      'Clinical study assessment and CDISC-aligned plans',
      'SDTM and ADaM datasets with validation artifacts',
      'TLF programming and automation packages',
      'Clinical and real-world analytics dashboards',
      'Governed healthcare AI prototypes where appropriate',
    ],
    industries: [
      'Pharmaceutical',
      'Biotechnology',
      'CROs and clinical research',
      'Hospitals and healthcare providers',
      'Medical devices',
      'Health technology',
    ],
    outcomes: [
      'Submission-ready clinical data packages',
      'Faster, more consistent TLF and analytics cycles',
      'Stronger quality and standards alignment',
      'Safe adoption of AI in regulated research workflows',
    ],
    relatedSolutions: [
      {
        label: 'Healthcare & Clinical Intelligence',
        href: '/solutions/healthcare-clinical-intelligence',
      },
      { label: 'Predictive Analytics', href: '/solutions/predictive-analytics-solutions' },
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
