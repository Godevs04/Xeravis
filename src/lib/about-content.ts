/** Canonical About narrative — shared by /about and About sub-pages (docs/chnagesofSep07.md). */

export const ABOUT_HERO = {
  title: 'Engineering Intelligence for a Data-Driven World',
  subtitle:
    'XELARVIS is an AI, data and technology company focused on helping organizations transform complex data and technology challenges into scalable, measurable solutions.',
  primaryCta: { label: 'Explore Our Capabilities', href: '/services' },
  secondaryCta: { label: 'Work With Us', href: '/contact?intent=business' },
} as const

export const WHO_WE_ARE = {
  title: 'Who We Are',
  intro:
    'XELARVIS brings together artificial intelligence, data science, data engineering and technology consulting to help organizations build smarter, more scalable and data-driven operations.',
  span: 'Our work spans AI solutions, advanced analytics, modern data platforms, digital transformation and healthcare & clinical data science.',
  pillars: [
    {
      title: 'AI & Intelligence',
      description: 'Building intelligent systems that turn data into actionable insight.',
    },
    {
      title: 'Data & Analytics',
      description: 'Creating trusted data foundations and advanced analytical capabilities.',
    },
    {
      title: 'Technology & Transformation',
      description: 'Modernizing technology environments and translating strategy into execution.',
    },
  ],
  cta: { label: 'Explore What We Do', href: '/services' },
} as const

export const MISSION = {
  title: 'Our Mission',
  statement:
    'To make advanced technology practical, intelligent and measurable for organizations solving complex real-world problems.',
  detail:
    'We combine research, engineering and domain expertise to create solutions that move beyond experimentation and deliver meaningful business outcomes.',
  positioning: 'Research → Technology → Business Outcome',
} as const

export const VISION = {
  title: 'Our Vision',
  statement:
    'To build a technology ecosystem where intelligence, data and innovation create measurable progress for organizations and society.',
} as const

export const DIFFERENTIATORS = [
  {
    title: 'Research-to-Production',
    description:
      'We connect experimentation and research with practical technology implementation.',
  },
  {
    title: 'Outcome-Focused',
    description:
      'We focus on measurable business and operational outcomes rather than technology for its own sake.',
  },
  {
    title: 'Cross-Disciplinary',
    description:
      'AI, data engineering, analytics and technology consulting work together rather than as isolated capabilities.',
  },
  {
    title: 'Domain-Aware',
    description:
      'We apply specialized expertise where domain requirements matter, particularly across healthcare and clinical data.',
  },
] as const

export const HOW_WE_THINK = [
  {
    title: 'Start With the Problem',
    description: 'Technology comes after understanding the business challenge.',
  },
  {
    title: 'Build on Trusted Data',
    description: 'Reliable intelligence starts with reliable data.',
  },
  {
    title: 'Use AI Where It Creates Value',
    description:
      'AI should solve a meaningful problem, not simply be added because it is fashionable.',
  },
  {
    title: 'Engineer for Production',
    description: 'Solutions should be scalable, secure and maintainable.',
  },
  {
    title: 'Measure the Outcome',
    description: 'Success should be evaluated through measurable impact.',
  },
] as const

export const RESEARCH = {
  title: 'Research Meets Engineering',
  body: 'XELARVIS explores emerging technologies in artificial intelligence, machine learning, healthcare AI and data science while focusing on their practical application.',
  cta: { label: 'Explore Research & Innovation', href: '/ai-research-lab' },
} as const

export const HEALTHCARE_SPECIALTY = {
  title: 'Domain Expertise Where It Matters',
  body: 'Our healthcare and clinical data capabilities combine data science, statistical programming and clinical data standards to support data-driven healthcare and life-sciences workflows.',
  note: 'Healthcare is a specialized practice within XELARVIS — not the lead identity of the brand. We apply depth where regulated, clinical and life-sciences contexts demand it.',
  cta: {
    label: 'Explore Healthcare & Clinical Data Science',
    href: '/services/clinical-data-science-healthcare-ai',
  },
} as const

export const COMPANY_FACTS_STATIC = {
  company: 'XELARVIS Private Limited',
  headquarters: 'Hyderabad, India',
  focus: 'AI • Data • Technology • Healthcare',
} as const

export const LEADERSHIP = {
  title: 'Leadership',
  intro:
    'Genuine leadership profiles only — name, title, biography, LinkedIn, expertise and research interests where relevant. A small, credible team is better than a decorative executive roster.',
} as const

export const TECHNOLOGY_BRIDGE = {
  title: 'Technology in context',
  body: 'The master technology catalog lives with Services and Solutions — not as a logo wall on About. XELARVIS selects and engineers technologies based on production requirements, governance and measurable outcomes.',
  cta: { label: 'Browse the technology catalog', href: '/technologies' },
} as const

export const CONNECTED_HUBS = [
  { label: 'Capabilities', href: '/services' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Industries', href: '/industries' },
  { label: 'Research', href: '/ai-research-lab' },
  { label: 'Careers', href: '/careers' },
] as const

export const ABOUT_CAPABILITY_ORDER = [
  'artificial-intelligence-ai-research',
  'data-science-advanced-analytics',
  'data-engineering-cloud-solutions',
  'it-consulting-digital-transformation',
  'clinical-data-science-healthcare-ai',
] as const

export const FEATURED_SOLUTION_SLUGS = [
  'enterprise-ai-solutions',
  'predictive-analytics-solutions',
  'intelligent-automation',
  'healthcare-clinical-intelligence',
] as const

export const FEATURED_SOLUTION_LABELS: Record<string, string> = {
  'enterprise-ai-solutions': 'Enterprise AI',
  'predictive-analytics-solutions': 'Predictive Analytics',
  'intelligent-automation': 'Intelligent Automation',
  'healthcare-clinical-intelligence': 'Healthcare & Clinical Intelligence',
}

export const CAREERS_CTA = {
  title: 'Build the Future With Us',
  body: 'We are building a team across AI, data science, engineering, consulting and healthcare technology.',
  cta: { label: 'Explore Careers', href: '/careers' },
} as const

export const FINAL_CTA = {
  title: 'Have a Complex Technology Challenge?',
  body: "Let's explore how AI, data and technology can create measurable value for your organization.",
  cta: { label: 'Start a Conversation', href: '/contact?intent=business' },
} as const

/** Helpers for ContentPage sub-pages */
export function toBulletSections(
  items: readonly { title: string; description: string }[],
): { heading: string; body: string }[] {
  return items.map((item) => ({ heading: item.title, body: item.description }))
}
