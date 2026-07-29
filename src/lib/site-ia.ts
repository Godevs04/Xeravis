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
    description: 'Focus domains across AI and healthcare.',
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
]

export const INSIGHTS_MEGA: MegaMenuItem[] = [
  {
    label: 'Insights Hub',
    href: '/insights',
    description: 'All perspectives in one place.',
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
    title: 'Engineering Intelligent Solutions for Healthcare, AI, and Digital Transformation',
    subtitle:
      'XELARVIS PRIVATE LIMITED is an IT Consulting and Artificial Intelligence Research company delivering innovative solutions in AI, Machine Learning, Data Science, Healthcare Analytics, Clinical Data Science, Cloud Technologies, and Enterprise Software Development.',
    sections: [
      {
        heading: 'About the Company',
        body: 'XELARVIS PRIVATE LIMITED is an IT Consulting and Artificial Intelligence Research Company specializing in Healthcare AI, Clinical Data Science, Machine Learning, Data Science, Advanced Analytics, and Enterprise Software Solutions. We help organizations transform complex data into intelligent solutions through innovative technologies, research-driven methodologies, and scalable digital platforms.',
      },
      {
        heading: 'Our Mission',
        body: 'Our mission is to bridge the gap between healthcare, artificial intelligence, and enterprise technology by delivering reliable, secure, and future-ready solutions.',
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
        body: 'To be a trusted global partner for intelligent healthcare, AI research, and digital transformation — enabling organizations to turn data into lasting competitive advantage.',
      },
      {
        heading: 'Mission',
        body: 'Bridge healthcare, artificial intelligence, and enterprise technology with reliable, secure, and future-ready solutions that accelerate innovation and improve outcomes.',
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
          'Ethics and quality in AI and clinical data work',
          'Mentorship and continuous learning culture',
        ],
      },
    ],
  },
  {
    slug: 'why-xelarvis',
    path: '/about/why-xelarvis',
    eyebrow: 'About Us',
    title: 'Why XELARVIS',
    subtitle: 'A partner built for durable outcomes in AI, healthcare, and enterprise technology.',
    sections: [
      {
        heading: 'What sets us apart',
        body: 'We combine research-driven methods with practical engineering so solutions are accurate, compliant, and ready for production.',
        bullets: [
          'Deep expertise in Healthcare AI and Clinical Data Science',
          'End-to-end delivery from strategy to cloud deployment',
          'Transparent process and senior ownership',
          'Modern stacks selected for maintainability and scale',
          'Focus on measurable business and research outcomes',
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
        body: 'XELARVIS supports clients across pharmaceutical, biotechnology, healthcare, finance, manufacturing, retail, logistics, and education — with delivery hubs and remote collaboration models.',
        bullets: [
          'India headquarters with distributed delivery teams',
          'Partnerships with research and industry organizations',
          'Flexible engagement for global programs',
        ],
      },
    ],
  },
]

export const LAB_PAGES: ContentPageDef[] = [
  {
    slug: 'overview',
    path: '/ai-research-lab',
    eyebrow: 'AI Research Lab',
    title: 'Research that ships',
    subtitle:
      'XELARVIS AI Research Lab explores machine learning, generative AI, NLP, computer vision, and healthcare AI — always with a path to production.',
    sections: [
      {
        heading: 'What we do',
        body: 'We investigate applied AI problems, validate approaches with rigorous evaluation, and transfer successful ideas into client solutions and open collaboration.',
      },
    ],
  },
  {
    slug: 'research-areas',
    path: '/ai-research-lab/research-areas',
    eyebrow: 'AI Research Lab',
    title: 'Research Areas',
    subtitle:
      'Focus domains spanning foundation models, clinical intelligence, and enterprise automation.',
    sections: [
      {
        heading: 'Core areas',
        body: 'Our research agenda is organized around high-impact application domains.',
        bullets: [
          'Generative AI and AI Agents',
          'Natural Language Processing and Medical NLP',
          'Computer Vision',
          'Healthcare Predictive Analytics',
          'MLOps and responsible AI',
        ],
      },
    ],
  },
  {
    slug: 'publications',
    path: '/ai-research-lab/publications',
    eyebrow: 'AI Research Lab',
    title: 'Publications',
    subtitle: 'Selected notes, white papers, and research outputs from our practice.',
    sections: [
      {
        heading: 'Sharing knowledge',
        body: 'We publish practical research findings and methodology notes that help teams adopt AI safely in regulated and enterprise environments. Explore Insights for related articles and white papers.',
      },
    ],
  },
  {
    slug: 'innovation-projects',
    path: '/ai-research-lab/innovation-projects',
    eyebrow: 'AI Research Lab',
    title: 'Innovation Projects',
    subtitle: 'Applied experiments that validate new capabilities before full-scale delivery.',
    sections: [
      {
        heading: 'From prototype to product',
        body: 'Innovation projects explore AI assistants, clinical document intelligence, recommendation systems, and automation — with clear evaluation criteria and a path to productionization.',
      },
    ],
  },
  {
    slug: 'open-source',
    path: '/ai-research-lab/open-source',
    eyebrow: 'AI Research Lab',
    title: 'Open Source',
    subtitle: 'Contributing tools and patterns that strengthen the broader AI ecosystem.',
    sections: [
      {
        heading: 'Community',
        body: 'Where appropriate, we contribute libraries, evaluation harnesses, and documentation that help others build reliable AI systems.',
      },
    ],
  },
  {
    slug: 'collaborations',
    path: '/ai-research-lab/collaborations',
    eyebrow: 'AI Research Lab',
    title: 'Collaborations',
    subtitle: 'Working with academia, industry, and healthcare innovators.',
    sections: [
      {
        heading: 'Partners',
        body: 'We collaborate with universities, research institutions, CROs, and technology partners to advance healthcare AI and enterprise intelligence.',
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
  'Work on AI and Healthcare projects',
  'Research-driven environment',
  'Learning and certification support',
  'Flexible work opportunities',
  'Global collaboration',
  'Career growth and mentorship',
  'Modern technologies',
  'Inclusive workplace',
] as const
