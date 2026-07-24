export const BRAND = {
  name: 'Xelarvis Technologies',
  tagline: 'Engineering Digital Excellence.',
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
    { label: 'Solutions', href: '/solutions', mega: 'solutions' },
    { label: 'Services', href: '/services', mega: 'services' },
    { label: 'Industries', href: '/industries', mega: 'industries' },
    { label: 'Insights', href: '/insights', mega: 'none' },
    { label: 'Careers', href: '/careers', mega: 'none' },
    { label: 'About', href: '/about', mega: 'none' },
  ],
  ctaLabel: "Let's Talk",
  ctaHref: '/contact?intent=project',
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
    title: 'Cloud & Platform Engineering',
    slug: 'cloud-platform-engineering',
    summary:
      'Modernize infrastructure with secure, scalable cloud platforms built for enterprise workloads.',
    icon: 'cloud',
  },
  {
    id: '2',
    title: 'Custom Software Development',
    slug: 'custom-software-development',
    summary:
      'Design and deliver mission-critical applications with clean architecture and long-term maintainability.',
    icon: 'code',
  },
  {
    id: '3',
    title: 'Data & AI Solutions',
    slug: 'data-ai-solutions',
    summary:
      'Turn data into decisions with pipelines, analytics, and production-grade AI integrations.',
    icon: 'brain',
  },
  {
    id: '4',
    title: 'DevOps & SRE',
    slug: 'devops-sre',
    summary:
      'Accelerate delivery with CI/CD, observability, and reliability practices that scale with your teams.',
    icon: 'workflow',
  },
  {
    id: '5',
    title: 'Cybersecurity',
    slug: 'cybersecurity',
    summary:
      'Protect applications and infrastructure with security-by-design across the software lifecycle.',
    icon: 'shield',
  },
  {
    id: '6',
    title: 'Digital Transformation',
    slug: 'digital-transformation',
    summary:
      'Align technology roadmaps with business outcomes through pragmatic modernization programs.',
    icon: 'layers',
  },
]

export const FALLBACK_INDUSTRIES = [
  {
    id: '1',
    title: 'Financial Services',
    slug: 'financial-services',
    summary: 'Regulated platforms, payment systems, and data platforms for financial institutions.',
  },
  {
    id: '2',
    title: 'Healthcare',
    slug: 'healthcare',
    summary: 'Secure patient-facing and clinical systems with compliance-aware engineering.',
  },
  {
    id: '3',
    title: 'Manufacturing',
    slug: 'manufacturing',
    summary: 'Connected operations, supply chain visibility, and industrial IoT at scale.',
  },
  {
    id: '4',
    title: 'Retail & E-commerce',
    slug: 'retail-ecommerce',
    summary: 'High-performance storefronts, omnichannel experiences, and fulfillment integrations.',
  },
]

export const FALLBACK_SOLUTIONS = [
  {
    id: '1',
    title: 'Cloud Modernization',
    slug: 'cloud-modernization',
    summary: 'Migrate and refactor legacy systems onto cloud-native foundations.',
  },
  {
    id: '2',
    title: 'Enterprise AI Ops',
    slug: 'enterprise-ai-ops',
    summary: 'Operationalize AI with governance, monitoring, and secure model deployment.',
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

export const FALLBACK_JOBS = [
  {
    id: '1',
    title: 'Senior Full-Stack Engineer',
    slug: 'senior-full-stack-engineer',
    department: 'Engineering',
    location: 'Remote / India',
    type: 'full-time',
    active: true,
  },
  {
    id: '2',
    title: 'Cloud Solutions Architect',
    slug: 'cloud-solutions-architect',
    department: 'Consulting',
    location: 'Hybrid',
    type: 'full-time',
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
