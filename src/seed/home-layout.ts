/** Home page sections, in order. Shared by the seed and `scripts/content/streamline-home.ts`. */
export const HOME_LAYOUT = [
  {
    blockType: 'storyHero' as const,
    brand: 'Xelarvis',
    eyebrow: 'Artificial Intelligence · Data Science · IT Consulting',
    heading: 'Engineering Intelligence. Transforming Business.',
    subheading:
      'XELARVIS combines Artificial Intelligence, Data Science and IT Consulting to help organizations turn complex data and technology challenges into measurable business outcomes.',
    ctaLabel: 'Explore Our Capabilities',
    ctaHref: '/services',
    secondaryCtaLabel: 'Talk to XELARVIS',
    secondaryCtaHref: '/contact?intent=business',
  },
  {
    blockType: 'storyChallenge' as const,
    eyebrow: 'Business problems',
    heading: 'Organizations are facing three connected challenges.',
    items: [
      {
        title: 'Data complexity',
        body: 'Disconnected data makes decision-making slow.',
      },
      {
        title: 'AI adoption',
        body: 'Organizations struggle to move AI from experimentation into production.',
      },
      {
        title: 'Technology modernization',
        body: 'Legacy systems limit scalability, security and innovation.',
      },
    ],
  },
  {
    blockType: 'storySolution' as const,
    eyebrow: 'What we do',
    heading: 'XELARVIS connects strategy, data, AI and technology execution.',
    chapters: [
      {
        title: 'Artificial Intelligence',
        body: 'Build and deploy intelligent systems using machine learning, generative AI, computer vision, NLP and AI agents.',
      },
      {
        title: 'Data Science & Analytics',
        body: 'Turn complex data into predictions, insights and decisions through advanced analytics, machine learning and business intelligence.',
      },
      {
        title: 'IT Consulting & Digital Transformation',
        body: 'Modernize technology ecosystems through architecture, cloud, software engineering, automation and digital transformation.',
      },
      {
        title: 'Data Engineering & Cloud',
        body: 'Design scalable data architectures, lakes, warehouses, pipelines, and MLOps infrastructure on the cloud.',
      },
      {
        title: 'Healthcare & Clinical Data Science',
        body: 'Clinical SAS programming, CDISC standards and analytics for life sciences and care delivery teams.',
      },
    ],
  },
  {
    blockType: 'storySolutions' as const,
    eyebrow: 'Solutions',
    heading: 'Solutions for the problems enterprises bring us.',
    subheading:
      'Nine solution areas, from enterprise AI and automation to data platforms and clinical intelligence.',
  },
  {
    blockType: 'storyProcess' as const,
    eyebrow: 'How we deliver',
    heading: 'From business problem to measurable results.',
    steps: [
      {
        title: 'Discover',
        description: 'Understand the business problem, stakeholders, and success criteria.',
      },
      {
        title: 'Strategize',
        description: 'Define the AI, data and technology roadmap aligned to outcomes.',
      },
      {
        title: 'Design',
        description: 'Architect scalable solutions, data flows, and governance.',
      },
      {
        title: 'Build',
        description: 'Develop models, platforms, and applications with quality built in.',
      },
      {
        title: 'Deploy',
        description: 'Ship to production with monitoring and operational readiness.',
      },
      {
        title: 'Optimize',
        description: 'Track results, tune performance, and expand what works.',
      },
    ],
  },
  {
    blockType: 'storyCases' as const,
    eyebrow: 'Representative work',
    heading: 'Anonymized examples of the work we take on.',
  },
  {
    blockType: 'storyTechOrbit' as const,
    eyebrow: 'Technology',
    heading: 'The tools we deliver with.',
    subheading:
      'Cloud, data, machine learning and engineering platforms we use to put systems into production.',
  },
  {
    blockType: 'storyCta' as const,
    heading: "Let's solve your next data, AI or technology challenge.",
    subheading:
      'Tell us what you are working on and we will set up a conversation with the right specialists.',
    ctaLabel: 'Talk to XELARVIS',
    ctaHref: '/contact?intent=business',
  },
]

export type HomeBlock = (typeof HOME_LAYOUT)[number]

/** Copy fields the streamline script overwrites on existing CMS blocks; other edits are kept. */
export const HOME_COPY_FIELDS: Partial<Record<HomeBlock['blockType'], string[]>> = {
  storySolution: ['eyebrow'],
  storySolutions: ['heading', 'subheading'],
  storyProcess: ['eyebrow'],
  storyCases: ['eyebrow', 'heading'],
  storyTechOrbit: ['heading', 'subheading'],
  storyCta: ['subheading'],
}
