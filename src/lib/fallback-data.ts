export const BRAND = {
  name: 'Xelarvis Technologies',
  tagline: 'Engineering Intelligent Solutions for Healthcare, AI, and Digital Transformation',
  domain: 'xelarvis.in',
} as const

export const UNSPLASH = {
  office:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=80',
  team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=80',
  servers:
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2400&q=80',
} as const

export const DEFAULT_NAV = {
  primaryLinks: [
    { label: 'Services', href: '/services', mega: 'services' },
    { label: 'Solutions', href: '/solutions', mega: 'solutions' },
    { label: 'Technologies', href: '/technologies', mega: 'none' },
    { label: 'Industries', href: '/industries', mega: 'industries' },
    { label: 'Insights', href: '/insights', mega: 'insights' },
    { label: 'Careers', href: '/careers', mega: 'none' },
    { label: 'Company', href: '/about', mega: 'company' },
  ],
  ctaLabel: 'Contact Us',
  ctaHref: '/contact',
}

export const DEFAULT_FOOTER = {
  columns: [
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'CMS Login', href: '/admin' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'All services', href: '/services' },
        { label: 'Industries', href: '/industries' },
        { label: 'Solutions', href: '/solutions' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Insights', href: '/insights' },
        { label: 'Blog', href: '/blog' },
        { label: 'Case studies', href: '/case-studies' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy policy', href: '/privacy-policy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ],
  showNewsletter: true,
  copyright: `© ${new Date().getFullYear()} Xelarvis Technologies. All rights reserved.`,
}

export const FALLBACK_SERVICES = [
  {
    id: '1',
    title: 'Artificial Intelligence & AI Research',
    slug: 'artificial-intelligence-ai-research',
    summary:
      'Develop intelligent systems using machine learning, generative AI, computer vision, NLP, and AI agents.',
    icon: 'Sparkles',
  },
  {
    id: '2',
    title: 'Data Science & Advanced Analytics',
    slug: 'data-science-advanced-analytics',
    summary:
      'Transform data into actionable insights with predictive analytics, BI, statistical modeling, and visualization.',
    icon: 'BarChart3',
  },
  {
    id: '3',
    title: 'IT Consulting & Digital Transformation',
    slug: 'it-consulting-digital-transformation',
    summary:
      'Modernize operations through technology consulting, software engineering, cloud adoption, and automation.',
    icon: 'Briefcase',
  },
  {
    id: '4',
    title: 'Clinical Data Science & Healthcare AI',
    slug: 'clinical-data-science-healthcare-ai',
    summary:
      'Clinical SAS, CDISC standards, healthcare analytics, and AI-powered research solutions.',
    icon: 'HeartPulse',
  },
  {
    id: '5',
    title: 'Data Engineering & Cloud Solutions',
    slug: 'data-engineering-cloud-solutions',
    summary:
      'Design scalable cloud platforms, data pipelines, AI infrastructure, and enterprise data architectures.',
    icon: 'Cloud',
  },
]

export const FALLBACK_INDUSTRIES = [
  {
    id: '1',
    title: 'Healthcare & Life Sciences',
    slug: 'healthcare-life-sciences',
    summary: 'Clinical research, pharmaceutical, biotechnology, medical devices, and hospitals.',
  },
  {
    id: '2',
    title: 'Pharmaceutical',
    slug: 'pharmaceutical',
    summary: 'Regulatory-ready analytics, clinical programming, and R&D intelligence.',
  },
  {
    id: '3',
    title: 'Biotechnology',
    slug: 'biotechnology',
    summary: 'Data platforms and AI for discovery, trials, and translational research.',
  },
  {
    id: '4',
    title: 'Banking & Finance',
    slug: 'banking-finance',
    summary: 'Risk analytics, fraud detection, and intelligent automation.',
  },
  {
    id: '5',
    title: 'Manufacturing',
    slug: 'manufacturing',
    summary: 'Predictive maintenance, quality analytics, and connected operations.',
  },
  {
    id: '6',
    title: 'Retail',
    slug: 'retail',
    summary: 'Customer intelligence, forecasting, and recommendation systems.',
  },
  {
    id: '7',
    title: 'Logistics',
    slug: 'logistics',
    summary: 'Supply chain analytics and optimization.',
  },
  {
    id: '8',
    title: 'Education',
    slug: 'education',
    summary: 'Learning platforms, analytics, and digital transformation for institutions.',
  },
]

export const FALLBACK_SOLUTIONS = [
  {
    id: '1',
    title: 'Healthcare Solutions',
    slug: 'healthcare-solutions',
    summary: 'Clinical and healthcare platforms that improve research and care outcomes.',
  },
  {
    id: '2',
    title: 'Enterprise AI Solutions',
    slug: 'enterprise-ai-solutions',
    summary: 'Production AI systems aligned to business workflows and governance.',
  },
  {
    id: '3',
    title: 'Business Intelligence',
    slug: 'business-intelligence',
    summary: 'Executive dashboards and reporting that turn data into decisions.',
  },
  {
    id: '4',
    title: 'Predictive Analytics',
    slug: 'predictive-analytics',
    summary: 'Forecasting and risk models that anticipate outcomes.',
  },
  {
    id: '5',
    title: 'Intelligent Automation',
    slug: 'intelligent-automation',
    summary: 'Automate processes with AI-assisted workflows and integrations.',
  },
  {
    id: '6',
    title: 'AI Agents',
    slug: 'ai-agents',
    summary: 'Autonomous and assisted agents for research, support, and operations.',
  },
  {
    id: '7',
    title: 'Clinical Research Solutions',
    slug: 'clinical-research-solutions',
    summary: 'CDISC-aligned programming, TLFs, and research analytics.',
  },
  {
    id: '8',
    title: 'Custom Software Solutions',
    slug: 'custom-software-solutions',
    summary: 'Enterprise applications engineered for security, scale, and longevity.',
  },
]

export const FALLBACK_CASE_STUDIES = [
  {
    id: '1',
    title: 'Global payments platform modernization',
    slug: 'global-payments-modernization',
    client: 'Leading fintech',
    challenge: 'Legacy monolith limiting release velocity and compliance reporting.',
    outcome: 'Cloud-native architecture with 3x faster deployments and improved audit readiness.',
  },
]

export const FALLBACK_BLOG_POSTS = [
  {
    id: '1',
    title: 'Building reliable platforms for regulated industries',
    slug: 'reliable-platforms-regulated-industries',
    excerpt:
      'Practical patterns for compliance, observability, and change management in enterprise software.',
    publishedAt: '2025-06-01',
  },
]

export const FALLBACK_ABOUT_BLOCKS = [
  {
    blockType: 'aboutPreview',
    heading: 'About the Company',
    body: 'We help organizations transform complex data into intelligent solutions through innovative technologies, research-driven methodologies, and scalable digital platforms.',
    cta: { label: 'Why XELARVIS', href: '/about/why-xelarvis', style: 'secondary' },
  },
  {
    blockType: 'missionVision',
    heading: 'Vision & Mission',
    missionTitle: 'Mission',
    missionBody:
      'Bridge healthcare, artificial intelligence, and enterprise technology by delivering reliable, secure, and future-ready solutions.',
    visionTitle: 'Vision',
    visionBody:
      'Be a trusted global partner for intelligent healthcare, AI research, and digital transformation.',
  },
  {
    blockType: 'valuesGrid',
    heading: 'Why XELARVIS',
    subheading: 'What makes our partnership different.',
    values: [
      {
        title: 'Healthcare + AI depth',
        description: 'Clinical data science and healthcare AI alongside enterprise engineering.',
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
    blockType: 'teamGrid',
    heading: 'Leadership',
  },
  {
    blockType: 'ctaBand',
    heading: 'Work with us',
    subheading: 'Explore open roles or start a project conversation.',
    ctaLabel: 'Contact',
    ctaHref: '/contact',
  },
] as const

export const FALLBACK_JOBS = [
  {
    id: '1',
    title: 'AI Engineer',
    slug: 'ai-engineer',
    department: 'Artificial Intelligence',
    location: 'Hyderabad / Remote',
    type: 'full-time',
    workMode: 'hybrid',
    experienceRequired: '2–5 Years',
    openings: 2,
    active: true,
  },
  {
    id: '2',
    title: 'Clinical SAS Programmer',
    slug: 'clinical-sas-programmer',
    department: 'Clinical Data Science',
    location: 'Hyderabad / Hybrid',
    type: 'full-time',
    workMode: 'hybrid',
    experienceRequired: '3–6 Years',
    openings: 1,
    active: true,
  },
]

export const FALLBACK_OFFICES = {
  locations: [
    {
      name: 'Headquarters',
      address: 'Technology Park, Phase 2',
      city: 'Bangalore',
      country: 'India',
      hours: 'Mon–Fri, 9:00–18:00 IST',
    },
  ],
}

export const FALLBACK_CONTACT = {
  email: 'hello@xelarvis.in',
  phone: '+91 00000 00000',
}

export const FALLBACK_STATS = [
  { label: 'Years of experience', value: '10+' },
  { label: 'Projects delivered', value: '120+' },
  { label: 'Countries served', value: '12' },
  { label: 'Happy clients', value: '40+' },
  { label: 'Support', value: '24/7' },
  { label: 'Technology partners', value: '25+' },
]
