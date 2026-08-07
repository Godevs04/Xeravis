export const BRAND = {
  name: 'Xelarvis Technologies',
  tagline: 'Data Science, AI & Healthcare',
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
    title: 'Data Science & Advanced Analytics',
    slug: 'data-science-advanced-analytics',
    summary:
      'Transform data into actionable insights with predictive analytics, BI, statistical modeling, and visualization.',
    icon: 'BarChart3',
  },
  {
    id: '2',
    title: 'Artificial Intelligence & AI Research',
    slug: 'artificial-intelligence-ai-research',
    summary:
      'Develop intelligent systems using machine learning, generative AI, computer vision, NLP, and AI agents.',
    icon: 'Sparkles',
  },
  {
    id: '3',
    title: 'Clinical Data Science & Healthcare AI',
    slug: 'clinical-data-science-healthcare-ai',
    summary:
      'Clinical SAS, CDISC standards, healthcare analytics, and AI-powered research solutions for regulated care.',
    icon: 'HeartPulse',
  },
  {
    id: '4',
    title: 'IT Consulting & Digital Transformation',
    slug: 'it-consulting-digital-transformation',
    summary:
      'Modernize operations through technology consulting, software engineering, cloud adoption, and automation.',
    icon: 'Briefcase',
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
    title: 'Enterprise AI Solutions',
    slug: 'enterprise-ai-solutions',
    summary: 'Production AI systems aligned to business workflows and governance.',
  },
  {
    id: '2',
    title: 'AI Agents & Intelligent Automation',
    slug: 'ai-agents-intelligent-automation',
    summary: 'Autonomous and assisted agents plus AI-powered process automation.',
  },
  {
    id: '3',
    title: 'Healthcare AI Platforms',
    slug: 'healthcare-ai-platforms',
    summary: 'Clinical and healthcare platforms that improve research and care outcomes.',
  },
  {
    id: '4',
    title: 'Predictive Analytics Solutions',
    slug: 'predictive-analytics-solutions',
    summary: 'Forecasting and risk models that anticipate outcomes.',
  },
  {
    id: '5',
    title: 'Business Intelligence Solutions',
    slug: 'business-intelligence-solutions',
    summary: 'Executive dashboards and reporting that turn data into decisions.',
  },
  {
    id: '6',
    title: 'Custom Software Solutions',
    slug: 'custom-software-solutions',
    summary: 'Enterprise applications engineered for security, scale, and longevity.',
  },
  {
    id: '7',
    title: 'AI-Powered Digital Products',
    slug: 'ai-powered-digital-products',
    summary: 'Productized AI experiences for customer, research, and operations workflows.',
  },
  {
    id: '8',
    title: 'Clinical Research Solutions',
    slug: 'clinical-research-solutions',
    summary: 'CDISC-aligned programming, TLFs, and research analytics.',
  },
]

export const FALLBACK_CASE_STUDIES = [
  {
    id: '1',
    title: 'Healthcare AI clinical intelligence platform',
    slug: 'healthcare-ai-clinical-intelligence',
    client: 'Regional health network',
    challenge: 'Hospitals lacked unified patient intelligence across clinical systems.',
    outcome: 'AI-powered clinical analytics with 98% prediction accuracy and 3× faster reporting.',
    industry: 'Healthcare',
    metrics: [
      { value: '98%', label: 'Prediction accuracy' },
      { value: '45%', label: 'Less manual effort' },
      { value: '3×', label: 'Faster reporting' },
    ],
    technologies: ['Python', 'Azure', 'AI', 'Power BI'],
    timeline: '14 weeks',
  },
  {
    id: '2',
    title: 'Global payments platform modernization',
    slug: 'global-payments-modernization',
    client: 'Leading fintech',
    challenge: 'Legacy monolith limiting release velocity and compliance reporting.',
    outcome: 'Cloud-native architecture with 3× faster deployments and improved audit readiness.',
    industry: 'Fintech',
    metrics: [
      { value: '3×', label: 'Deployment speed' },
      { value: '70%', label: 'Infra cost down' },
      { value: '99.9%', label: 'Availability' },
    ],
    technologies: ['Next.js', 'Kubernetes', 'AWS', 'Docker'],
    timeline: '20 weeks',
  },
  {
    id: '3',
    title: 'Clinical trial analytics modernization',
    slug: 'clinical-trial-analytics',
    client: 'Life sciences partner',
    challenge: 'Fragmented trial data slowing submission-ready analytics.',
    outcome:
      'CDISC-aligned pipelines processing 120M+ records with 40% operational efficiency gains.',
    industry: 'Life sciences',
    metrics: [
      { value: '120M', label: 'Records processed' },
      { value: '40%', label: 'Ops efficiency' },
      { value: '2×', label: 'Faster cycles' },
    ],
    technologies: ['SAS', 'Python', 'CDISC', 'Spark'],
    timeline: '18 weeks',
  },
  {
    id: '4',
    title: 'Production-grade enterprise AI agents',
    slug: 'enterprise-ai-agents',
    client: 'Global enterprise',
    challenge: 'Models impressed demos but stalled before regulated production.',
    outcome: 'Grounded LLM workflows with evaluation, observability, and human oversight.',
    industry: 'Enterprise AI',
    metrics: [
      { value: '4×', label: 'Time to value' },
      { value: '99%', label: 'Eval pass rate' },
      { value: '24/7', label: 'Monitoring' },
    ],
    technologies: ['LangChain', 'OpenAI', 'Python', 'Cloud'],
    timeline: '12 weeks',
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
      'Advance data science, AI, and healthcare technology by delivering reliable, secure, and future-ready solutions.',
    visionTitle: 'Vision',
    visionBody: 'Be a trusted global partner for data science, AI research, and Healthcare AI.',
  },
  {
    blockType: 'valuesGrid',
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
