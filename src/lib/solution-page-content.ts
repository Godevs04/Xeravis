/**
 * Solution-page content from docs/chnageson09sep2026.md —
 * How We Deliver, Deliverables, Success Measures, FAQs, clinical standards.
 */

export const SOLUTION_HOW_WE_DELIVER = [
  {
    title: 'Assess',
    description: 'Understand the business problem, data, systems and desired outcome.',
  },
  {
    title: 'Design',
    description: 'Define the solution architecture, operating model and success criteria.',
  },
  {
    title: 'Build',
    description: 'Develop the required AI, analytics, data or technology components.',
  },
  {
    title: 'Integrate',
    description: 'Connect the solution with existing systems, workflows and data.',
  },
  {
    title: 'Validate',
    description: 'Evaluate performance, security, quality, governance and usability.',
  },
  {
    title: 'Deploy',
    description: 'Move the solution into its target production environment.',
  },
  {
    title: 'Optimize',
    description: 'Monitor performance and continuously improve the solution.',
  },
] as const

export type SolutionExtras = {
  heroHeadline: string
  deliverables: string[]
  successMeasures: string[]
  faqs: { question: string; answer: string }[]
  /** Clinical standards shown separately from technology (healthcare only) */
  clinicalStandards?: string[]
  clinicalTooling?: string[]
}

export const SOLUTION_EXTRAS: Record<string, SolutionExtras> = {
  'enterprise-ai-solutions': {
    heroHeadline: 'Move AI from experimentation to measurable business value',
    deliverables: [
      'AI opportunity assessment',
      'Use-case prioritization',
      'AI architecture',
      'Prototype / PoC',
      'Production implementation',
      'Governance framework',
      'Monitoring approach',
    ],
    successMeasures: [
      'Production adoption',
      'Model performance',
      'User adoption',
      'Workflow efficiency',
      'Business KPI improvement',
    ],
    faqs: [
      {
        question: 'What is the difference between Enterprise AI and AI Agents?',
        answer:
          'Enterprise AI covers the broader strategy, architecture, implementation and governance of AI across an organization. AI Agents are a specific type of AI capability designed to perform multi-step tasks using tools, data and defined controls.',
      },
      {
        question: 'How does XELARVIS approach an AI project?',
        answer:
          'We begin with the business problem and success criteria, assess data and technical readiness, design the solution architecture, develop and validate the required AI capabilities, and support production deployment.',
      },
      {
        question: 'Can XELARVIS integrate AI with existing enterprise systems?',
        answer:
          'Yes. Where appropriate, AI solutions can be integrated with existing applications, APIs, databases, cloud platforms and business workflows.',
      },
    ],
  },
  'intelligent-automation': {
    heroHeadline: 'Automate repetitive work while keeping people in control',
    deliverables: [
      'Process discovery and automation assessment',
      'Workflow automation',
      'AI-assisted operations',
      'Document and information processing',
      'API-based system integration',
      'Human-in-the-loop workflows',
      'Monitoring and exception handling',
    ],
    successMeasures: [
      'Manual effort reduction',
      'Process cycle time',
      'Exception rate',
      'Workflow consistency',
      'Operational scalability',
    ],
    faqs: [
      {
        question: 'How is Intelligent Automation different from AI Agents?',
        answer:
          'Intelligent Automation combines process automation, AI, integration and workflow. AI Agents are autonomous or semi-autonomous systems capable of reasoning, tool use and task execution. They can support automation but are not the same thing.',
      },
      {
        question: 'Do you keep humans in the loop?',
        answer:
          'Yes. We design escalation paths, exception handling and oversight so automation improves consistency without removing accountability.',
      },
      {
        question: 'What kinds of processes are a good fit?',
        answer:
          'High-volume or repetitive workflows with clear rules, disconnected systems, document-heavy handoffs, and processes that benefit from AI-assisted decision support.',
      },
    ],
  },
  'ai-agents': {
    heroHeadline: 'Build intelligent systems that can reason, act, and escalate',
    deliverables: [
      'AI agent strategy and use-case assessment',
      'Agent architecture',
      'Tool and API integration',
      'Retrieval-augmented generation',
      'Multi-step workflow orchestration',
      'Human-in-the-loop controls',
      'Agent evaluation and monitoring',
      'Security and access controls',
    ],
    successMeasures: [
      'Task completion rate',
      'Escalation quality',
      'Cycle time reduction',
      'Control effectiveness',
      'Employee productivity',
    ],
    faqs: [
      {
        question: 'How do AI Agents differ from traditional RPA?',
        answer:
          'Agents combine language models, tools, business rules, APIs and human oversight to plan and execute multi-step work—not only brittle scripted UI automation.',
      },
      {
        question: 'How do you control agent behavior?',
        answer:
          'Through defined tool access, evaluation, monitoring, security controls and escalation when human judgment is required.',
      },
      {
        question: 'Which service delivers AI Agents?',
        answer:
          'Artificial Intelligence is the primary service, with supporting engineering and data capabilities as needed.',
      },
    ],
  },
  'predictive-analytics-solutions': {
    heroHeadline: 'Turn historical data into forward-looking decisions',
    deliverables: [
      'Predictive modeling',
      'Forecasting and time-series analysis',
      'Customer and churn analytics',
      'Risk modeling',
      'Demand forecasting',
      'Anomaly detection',
      'Scenario analysis',
      'Model monitoring and performance evaluation',
    ],
    successMeasures: [
      'Forecast accuracy',
      'Early-warning lead time',
      'Planning quality',
      'Decision turnaround',
      'Model monitoring health',
    ],
    faqs: [
      {
        question: 'How is Predictive Analytics different from BI reporting?',
        answer:
          'BI explains what happened with trusted metrics. Predictive Analytics forecasts what is likely to happen next using statistical and machine learning models.',
      },
      {
        question: 'What data is required to start?',
        answer:
          'Sufficient historical data, clear KPIs, and an understanding of the decision the model should support. We assess readiness before modeling.',
      },
      {
        question: 'Which services support this solution?',
        answer:
          'Primarily Data Science & Advanced Analytics and Artificial Intelligence, with Data Engineering & Cloud for scalable data foundations.',
      },
    ],
  },
  'business-intelligence-solutions': {
    heroHeadline: 'Create one trusted view of business performance',
    deliverables: [
      'BI strategy and roadmap',
      'KPI and metric definition',
      'Data modeling',
      'Executive dashboards',
      'Operational dashboards',
      'Self-service analytics',
      'Reporting automation',
      'BI governance',
    ],
    successMeasures: [
      'Reporting cycle time',
      'Dashboard adoption',
      'KPI consistency',
      'Data freshness',
      'Decision turnaround time',
    ],
    faqs: [
      {
        question: 'Why do teams still struggle when they already have dashboards?',
        answer:
          'Often definitions conflict, sources are fragmented, and reporting remains manual. We focus on trusted metrics, modeling and governance—not more disconnected charts.',
      },
      {
        question: 'Which tools do you work with?',
        answer:
          'Common stacks include SQL, Power BI, Tableau, Snowflake and Databricks, selected for the outcome rather than as a vendor checklist.',
      },
      {
        question: 'Which services deliver BI solutions?',
        answer: 'Data Science & Advanced Analytics and Data Engineering & Cloud.',
      },
    ],
  },
  'data-platforms': {
    heroHeadline: 'Build the data foundation for analytics and AI',
    deliverables: [
      'Data architecture',
      'Platform design',
      'Pipelines',
      'Data models',
      'Cloud infrastructure',
      'Governance framework',
      'Documentation',
    ],
    successMeasures: [
      'Data availability',
      'Pipeline reliability',
      'Data quality',
      'Processing latency',
      'Platform scalability',
    ],
    faqs: [
      {
        question: 'What problems do data platforms solve?',
        answer:
          'Scattered data, fragile pipelines, weak governance, slow access to trusted data, and infrastructure that cannot support analytics and AI workloads.',
      },
      {
        question: 'Do you support lakehouse and warehouse patterns?',
        answer:
          'Yes. We design lakes, lakehouses and warehouses with batch and real-time processing as required.',
      },
      {
        question: 'Which service is primary?',
        answer:
          'Data Engineering & Cloud, supported by IT Consulting and Data Science where architecture and analytics readiness require it.',
      },
    ],
  },
  'custom-ai-products': {
    heroHeadline: 'Build AI products around the way your organization works',
    deliverables: [
      'AI product strategy',
      'Product and solution architecture',
      'AI/ML model development',
      'Generative AI applications',
      'AI-powered web applications',
      'API and enterprise integration',
      'Cloud deployment',
      'Monitoring and optimization',
    ],
    successMeasures: [
      'Product-market fit signals',
      'Workflow adoption',
      'Model usefulness',
      'Release reliability',
      'Operational ownership',
    ],
    faqs: [
      {
        question: 'When should we build a custom AI product instead of buying a tool?',
        answer:
          'When off-the-shelf tools cannot fit specialized workflows, proprietary data, customer experiences or domain requirements that need to be engineered into a product.',
      },
      {
        question: 'What do you actually deliver?',
        answer:
          'Purpose-built AI capabilities combined with applications, APIs, data and infrastructure—not a model demo in isolation.',
      },
      {
        question: 'Which services support Custom AI Products?',
        answer:
          'Artificial Intelligence and IT Consulting & Digital Transformation, with Data Engineering & Cloud as supporting capability.',
      },
    ],
  },
  'healthcare-clinical-intelligence': {
    heroHeadline: 'Turn complex clinical and healthcare data into reliable intelligence',
    deliverables: [
      'Clinical SAS programming',
      'CDISC-aligned data workflows',
      'SDTM and ADaM support',
      'Tables, Listings, and Figures',
      'Clinical and healthcare analytics',
      'Clinical reporting automation',
      'Data quality and QC support',
      'Healthcare AI use cases where appropriate',
    ],
    successMeasures: [
      'Workflow efficiency',
      'Consistency and traceability',
      'Analytics turnaround',
      'Quality-control coverage',
      'Scalability of clinical delivery',
    ],
    clinicalStandards: ['CDISC', 'SDTM', 'ADaM', 'TLF'],
    clinicalTooling: ['Pinnacle 21'],
    faqs: [
      {
        question: 'Is Healthcare the lead identity of XELARVIS?',
        answer:
          'No. Healthcare & Clinical Intelligence is a specialty solution. The primary brand remains AI, Data Science and IT Consulting.',
      },
      {
        question: 'How do you describe clinical standards work?',
        answer:
          'We support CDISC-aligned clinical data workflows and quality-control processes. We avoid broad “validated” or “submission-ready” claims unless they match the specific engagement scope.',
      },
      {
        question: 'Which service is primary?',
        answer:
          'Healthcare & Clinical Data Science, with Artificial Intelligence, Data Science and Data Engineering as supporting capabilities when relevant.',
      },
    ],
  },
  'application-modernization': {
    heroHeadline: 'Modernize legacy applications without losing business continuity',
    deliverables: [
      'Current-state assessment',
      'Modernization roadmap',
      'Target architecture',
      'Migration plan',
      'Refactored applications',
      'API layer',
      'Cloud deployment',
    ],
    successMeasures: [
      'Maintainability',
      'Release frequency',
      'Integration reliability',
      'Cloud readiness',
      'Technical risk reduction',
    ],
    faqs: [
      {
        question: 'Can modernization be incremental?',
        answer:
          'Yes. We favor incremental roadmaps—assessment, architecture, API modernization, modularization and cloud migration—so critical systems keep running.',
      },
      {
        question: 'What problems does this solve?',
        answer:
          'Aging applications, monoliths, brittle integrations, high maintenance overhead, limited scalability, security constraints and slow delivery.',
      },
      {
        question: 'Which service is primary?',
        answer:
          'IT Consulting & Digital Transformation, supported by Data Engineering & Cloud and Artificial Intelligence where relevant.',
      },
    ],
  },
}

/** Clinical standards are not shown as “technologies” on healthcare solution pages. */
export const CLINICAL_STANDARD_SLUGS = new Set(['cdisc', 'sdtm', 'adam', 'tlf', 'pinnacle-21'])
