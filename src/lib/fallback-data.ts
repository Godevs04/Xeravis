export const BRAND = {
  name: 'Xelarvis Technologies',
  tagline: 'Artificial Intelligence, Data Science & IT Consulting',
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
    { label: 'About', href: '/about', mega: 'about' },
    { label: 'Services', href: '/services', mega: 'services' },
    { label: 'Solutions', href: '/solutions', mega: 'solutions' },
    { label: 'Approach', href: '/about/our-approach', mega: 'none' },
    { label: 'Industries', href: '/industries', mega: 'industries' },
    { label: 'Research & Innovation', href: '/ai-research-lab', mega: 'research' },
    { label: 'Insights', href: '/insights', mega: 'insights' },
    { label: 'Careers', href: '/careers', mega: 'none' },
  ],
  ctaLabel: 'Contact Us',
  ctaHref: '/contact',
}

export const DEFAULT_FOOTER = {
  columns: [
    {
      title: 'About',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Our Approach', href: '/about/our-approach' },
        { label: 'Research & Innovation', href: '/ai-research-lab' },
        { label: 'Collaborations', href: '/ai-research-lab/collaborations' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'All services', href: '/services' },
        { label: 'Industries', href: '/industries' },
        { label: 'Solutions', href: '/solutions' },
        { label: 'Technologies', href: '/technologies' },
      ],
    },
    {
      title: 'Insights',
      links: [
        { label: 'Insights Hub', href: '/insights' },
        { label: 'Case studies', href: '/case-studies' },
        { label: 'Blogs', href: '/insights/blogs' },
        { label: 'Reports', href: '/insights/reports' },
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
    title: 'Artificial Intelligence',
    slug: 'artificial-intelligence-ai-research',
    summary:
      'Applied AI research and production systems—machine learning, generative AI, vision, NLP, and intelligent agents.',
    icon: 'Sparkles',
  },
  {
    id: '2',
    title: 'Data Science & Advanced Analytics',
    slug: 'data-science-advanced-analytics',
    summary:
      'Help organisations turn data into measurable business value through predictive analytics, BI, and decision intelligence.',
    icon: 'BarChart3',
  },
  {
    id: '3',
    title: 'IT Consulting & Digital Transformation',
    slug: 'it-consulting-digital-transformation',
    summary:
      'Enterprise consulting for modernization—architecture, software engineering, cloud adoption, and automation.',
    icon: 'Briefcase',
  },
  {
    id: '4',
    title: 'Data Engineering & Cloud',
    slug: 'data-engineering-cloud-solutions',
    summary:
      'Scalable cloud platforms, data pipelines, AI infrastructure, and enterprise data architectures.',
    icon: 'Cloud',
  },
  {
    id: '5',
    title: 'Healthcare & Clinical Data Science',
    slug: 'clinical-data-science-healthcare-ai',
    summary:
      'Specialized clinical SAS, CDISC standards, and analytics for regulated life sciences and care delivery.',
    icon: 'HeartPulse',
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
    title: 'Banking & Financial Services',
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
    title: 'Retail & E-Commerce',
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
    title: 'Education Technology',
    slug: 'education',
    summary: 'Learning platforms, analytics, and digital transformation for institutions.',
  },
  {
    id: '9',
    title: 'Enterprise Technology',
    slug: 'enterprise-technology',
    summary:
      'Platform modernization, AI adoption, and digital transformation for technology organizations.',
  },
]

export const FALLBACK_SOLUTIONS = [
  {
    id: '1',
    title: 'Enterprise AI',
    slug: 'enterprise-ai-solutions',
    summary: 'Production AI systems aligned to business workflows and governance.',
  },
  {
    id: '2',
    title: 'Intelligent Automation',
    slug: 'intelligent-automation',
    summary: 'Assisted agents and AI-powered process automation for repeatable operations.',
  },
  {
    id: '3',
    title: 'Predictive Analytics',
    slug: 'predictive-analytics-solutions',
    summary: 'Forecasting and risk models that help teams anticipate outcomes.',
  },
  {
    id: '4',
    title: 'Business Intelligence',
    slug: 'business-intelligence-solutions',
    summary: 'Executive dashboards and reporting that turn data into decisions.',
  },
  {
    id: '5',
    title: 'Data Platforms',
    slug: 'data-platforms',
    summary:
      'Modern data foundations—pipelines, warehouses, and governed access for analytics and AI.',
  },
  {
    id: '6',
    title: 'Custom AI Products',
    slug: 'custom-ai-products',
    summary: 'Productized AI experiences for customer, research, and operations workflows.',
  },
  {
    id: '7',
    title: 'Healthcare & Clinical Intelligence',
    slug: 'healthcare-clinical-intelligence',
    summary: 'Specialized analytics and intelligence for clinical research and care delivery.',
  },
  {
    id: '8',
    title: 'Application Modernization',
    slug: 'application-modernization',
    summary:
      'Legacy-to-modern application paths—architecture, cloud adoption, and delivery hardening.',
  },
]

export const FALLBACK_CASE_STUDIES = [
  {
    id: '1',
    title: 'Clinical reporting pipeline for a regional health system',
    slug: 'clinical-reporting-pipeline-regional-health',
    client: 'Regional health system',
    challenge:
      'Fragmented clinical and operational data made routine reporting slow and hard to trust.',
    outcome:
      'Unified analytics pipelines and governed dashboards that shortened reporting cycles and improved data consistency.',
    industry: 'Healthcare',
    metrics: [
      { value: 'Faster', label: 'Reporting cycles' },
      { value: 'Governed', label: 'Data access' },
      { value: 'Clearer', label: 'Operational views' },
    ],
    technologies: ['Python', 'Azure', 'Power BI', 'SQL'],
    timeline: 'Multi-phase engagement',
  },
  {
    id: '2',
    title: 'Predictive maintenance analytics for a mid-market manufacturer',
    slug: 'predictive-maintenance-mid-market-manufacturer',
    client: 'Mid-market manufacturer',
    challenge:
      'Equipment telemetry and maintenance logs sat in silos, limiting early fault detection.',
    outcome:
      'Predictive analytics models and operator-facing views that support proactive maintenance planning.',
    industry: 'Manufacturing',
    metrics: [
      { value: 'Earlier', label: 'Fault signals' },
      { value: 'Shared', label: 'Ops visibility' },
      { value: 'Repeatable', label: 'Model refresh' },
    ],
    technologies: ['Python', 'Spark', 'Cloud', 'Power BI'],
    timeline: 'Pilot to production',
  },
  {
    id: '3',
    title: 'Submission-ready trial analytics for a life sciences sponsor',
    slug: 'trial-analytics-life-sciences-sponsor',
    client: 'Life sciences sponsor',
    challenge:
      'Trial datasets and programming deliverables needed clearer standards alignment for analysis handoff.',
    outcome:
      'CDISC-aligned programming patterns and reviewable analytics packages for study teams.',
    industry: 'Life sciences',
    metrics: [
      { value: 'Aligned', label: 'CDISC patterns' },
      { value: 'Reviewable', label: 'Deliverables' },
      { value: 'Steady', label: 'Handoff cadence' },
    ],
    technologies: ['SAS', 'Python', 'CDISC', 'Pinnacle 21'],
    timeline: 'Study-support engagement',
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
    heading: 'About XELARVIS',
    body: 'XELARVIS is an AI, Data Science and IT Consulting company focused on helping organizations turn data and technology into measurable business value—with specialized expertise in Healthcare & Life Sciences.',
    cta: { label: 'Our Approach', href: '/about/our-approach', style: 'secondary' },
  },
  {
    blockType: 'missionVision',
    heading: 'Vision & Mission',
    missionTitle: 'Mission',
    missionBody:
      'Help organisations turn complex data and technology challenges into measurable outcomes through Artificial Intelligence, Data Science and IT Consulting.',
    visionTitle: 'Vision',
    visionBody:
      'Be a trusted partner for AI, data and technology transformation across industries.',
  },
  {
    blockType: 'valuesGrid',
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
  { label: 'Core services', value: '5' },
  { label: 'Solution areas', value: '8' },
  { label: 'Delivery focus', value: 'Multi-industry' },
  { label: 'Practice pillars', value: 'AI · Data · Technology' },
]
