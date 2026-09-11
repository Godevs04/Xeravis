/**
 * Service-page content from docs/chnageson09sep2026.md —
 * Quick Overview, outcomes, FAQs (service-specific, not generic).
 */

export type ServiceOverview = {
  heroHeadline: string
  whoFor: string
  whyChoose: string
  howDeliver: string
  outcomes: string
  helpItems: string[]
  businessOutcome: string
}

export const SERVICE_OVERVIEW: Record<string, ServiceOverview> = {
  'artificial-intelligence-ai-research': {
    heroHeadline: 'From AI strategy to production-ready intelligence',
    whoFor:
      'CTOs, CIOs, product leaders, data leaders, and organizations moving AI initiatives from experimentation into production.',
    whyChoose:
      'XELARVIS combines AI research, machine learning, generative AI, data science, and engineering to move AI from experimentation to reliable production systems.',
    howDeliver:
      'Business discovery & AI strategy → data preparation → model development → evaluation & responsible AI → deployment with MLOps.',
    outcomes:
      'AI solutions designed for reliability, scalability, responsible deployment, and measurable business impact.',
    helpItems: [
      'Identify and prioritize high-value AI opportunities',
      'Develop machine learning and deep learning solutions',
      'Build generative AI applications and AI agents',
      'Apply NLP and computer vision to real-world workflows',
      'Integrate AI into enterprise applications and platforms',
      'Establish model evaluation, governance, and monitoring',
      'Build MLOps foundations for production AI',
    ],
    businessOutcome:
      'AI solutions designed for reliability, scalability, responsible deployment, and measurable business impact.',
  },
  'data-science-advanced-analytics': {
    heroHeadline: 'Turn data into insight, prediction, and better decisions',
    whoFor:
      'Business, analytics, finance, operations, marketing, and data leaders seeking predictive and decision-support capabilities.',
    whyChoose:
      'XELARVIS combines statistical analysis, machine learning, forecasting, and business intelligence to help organizations understand performance, predict outcomes, and make better decisions.',
    howDeliver:
      'Data strategy → exploratory analysis → modeling & forecasting → BI & visualization → decision support and enablement.',
    outcomes:
      'Trusted analytics that help organizations move from historical reporting to forward-looking decision-making.',
    helpItems: [
      'Develop data and analytics strategies',
      'Explore and assess complex datasets',
      'Build statistical and machine learning models',
      'Develop predictive and forecasting solutions',
      'Analyze customers, operations, risk, and performance',
      'Build executive dashboards and business intelligence',
      'Create decision-support models',
      'Establish repeatable analytical capabilities',
    ],
    businessOutcome:
      'Trusted analytics that help organizations move from historical reporting to forward-looking decision-making.',
  },
  'it-consulting-digital-transformation': {
    heroHeadline: 'Modernize technology with a clear path from strategy to execution',
    whoFor:
      'CIOs, CTOs, technology leaders, and organizations modernizing applications, architecture, cloud platforms, and delivery practices.',
    whyChoose:
      'Consulting-led transformation focused on sustainable, production-ready technology—connecting technology decisions to business priorities.',
    howDeliver:
      'Strategy & architecture → modernization design → engineering & integration → cloud & DevOps → optimize and scale.',
    outcomes:
      'A modern, scalable technology foundation aligned with business priorities and built for long-term change.',
    helpItems: [
      'Define technology and digital transformation strategies',
      'Design enterprise and solution architectures',
      'Modernize legacy applications',
      'Build and integrate enterprise software',
      'Adopt and optimize cloud platforms',
      'Establish DevOps and delivery practices',
      'Automate business and IT processes',
      'Improve application and platform scalability',
    ],
    businessOutcome:
      'A modern, scalable technology foundation aligned with business priorities and built for long-term change.',
  },
  'data-engineering-cloud-solutions': {
    heroHeadline: 'Build the data foundation behind analytics and AI',
    whoFor:
      'Data, analytics, engineering, and technology leaders building scalable data foundations for analytics and AI.',
    whyChoose:
      'XELARVIS designs and implements scalable data platforms that make information reliable, accessible, secure, and ready for analytics and AI.',
    howDeliver:
      'Architecture → lakes/warehouses → pipelines → quality & governance → cloud platforms → MLOps infrastructure.',
    outcomes:
      'Reliable, scalable data foundations that enable analytics, AI, and enterprise decision-making.',
    helpItems: [
      'Design modern data architectures',
      'Build data lakes, lakehouses, and warehouses',
      'Develop scalable ETL and ELT pipelines',
      'Integrate batch and real-time data',
      'Modernize data platforms in the cloud',
      'Improve data quality and governance',
      'Build analytics-ready data foundations',
      'Establish MLOps and AI infrastructure',
    ],
    businessOutcome:
      'Reliable, scalable data foundations that enable analytics, AI, and enterprise decision-making.',
  },
  'clinical-data-science-healthcare-ai': {
    heroHeadline: 'Clinical data, analytics, and technology for life sciences',
    whoFor:
      'Pharmaceutical, biotechnology, CRO, healthcare, and life-sciences organizations managing complex clinical and healthcare data.',
    whyChoose:
      'Healthcare & Clinical Data Science is a specialty at XELARVIS—not our lead brand identity. We apply depth where regulated clinical and life-sciences contexts demand it.',
    howDeliver:
      'Clinical programming → CDISC-aligned workflows → analytics → quality control → responsible healthcare AI where appropriate.',
    outcomes:
      'High-quality, traceable, scalable data and analytics solutions designed for complex healthcare and life-sciences environments.',
    helpItems: [
      'Develop clinical SAS programming solutions',
      'Prepare and transform clinical data using CDISC standards',
      'Support SDTM and ADaM workflows',
      'Automate Tables, Listings, and Figures',
      'Develop clinical and healthcare analytics',
      'Support clinical data management and quality processes',
      'Analyze real-world data where appropriate',
      'Apply AI to healthcare and clinical workflows responsibly',
    ],
    businessOutcome:
      'High-quality, traceable, scalable data and analytics solutions designed for complex healthcare and life-sciences environments.',
  },
}

export const SERVICE_FAQS: Record<string, { question: string; answer: string }[]> = {
  'artificial-intelligence-ai-research': [
    {
      question: 'How does XELARVIS approach an AI project?',
      answer:
        'We begin with the business problem and success criteria, assess data and technical readiness, design the solution architecture, develop and validate the required AI capabilities, and support production deployment with evaluation and MLOps.',
    },
    {
      question: 'Can XELARVIS integrate AI with existing enterprise systems?',
      answer:
        'Yes. Where appropriate, AI solutions can be integrated with existing applications, APIs, databases, cloud platforms, and business workflows.',
    },
    {
      question: 'What is the difference between Enterprise AI and AI Agents?',
      answer:
        'Enterprise AI covers strategy, architecture, implementation, and governance of AI across an organization. AI Agents are a specific capability designed to perform multi-step tasks using tools, data, and defined controls.',
    },
  ],
  'data-science-advanced-analytics': [
    {
      question: 'How is Data Science different from Business Intelligence?',
      answer:
        'Business Intelligence focuses on trusted reporting and shared metrics. Data Science builds predictive, statistical, and decision-support models that anticipate outcomes and guide action.',
    },
    {
      question: 'What kinds of models does XELARVIS build?',
      answer:
        'We develop statistical models, machine learning models, forecasting and time-series solutions, customer and risk analytics, optimization models, and decision-support systems tied to business KPIs.',
    },
    {
      question: 'How do you ensure analytics are trusted?',
      answer:
        'We emphasize clear metric definitions, data readiness, evaluation criteria, and delivery patterns that business and data teams can inspect and extend.',
    },
  ],
  'it-consulting-digital-transformation': [
    {
      question: 'How does XELARVIS approach digital transformation?',
      answer:
        'We connect technology decisions to business priorities—strategy and architecture first, then modernization, engineering, cloud adoption, and delivery practices that sustain change.',
    },
    {
      question: 'Do you modernize legacy applications incrementally?',
      answer:
        'Yes. We assess current-state systems, define target architecture, and deliver incremental modernization roadmaps so business continuity is preserved while platforms evolve.',
    },
    {
      question: 'What delivery practices do you establish?',
      answer:
        'We help establish DevOps, API and integration patterns, automation, and cloud practices that improve release velocity, security, and operability.',
    },
  ],
  'data-engineering-cloud-solutions': [
    {
      question: 'What does a data platform engagement typically include?',
      answer:
        'Architecture, lakes and warehouses, scalable pipelines, quality and governance, cloud platform adoption, and foundations for analytics and AI workloads.',
    },
    {
      question: 'Can you support both batch and real-time data?',
      answer:
        'Yes. We design for batch and streaming patterns—including Kafka-based pipelines where real-time access is required.',
    },
    {
      question: 'How does this relate to AI and analytics?',
      answer:
        'Reliable data foundations are required for trustworthy analytics and production AI. This service builds the infrastructure those programs depend on.',
    },
  ],
  'clinical-data-science-healthcare-ai': [
    {
      question: 'Is Healthcare the primary brand of XELARVIS?',
      answer:
        'No. Healthcare & Clinical Data Science is a specialized practice. The primary brand remains Artificial Intelligence, Data Science, and IT Consulting.',
    },
    {
      question: 'What clinical standards do you work with?',
      answer:
        'We support CDISC-aligned clinical data workflows including SDTM and ADaM, and Tables, Listings & Figures (TLF), with defined quality-control processes.',
    },
    {
      question: 'Do you claim formal system validation for every engagement?',
      answer:
        'We describe CDISC-aligned workflows and quality-control processes precisely. Formal validated-system claims are only made when they match the actual delivery scope of an engagement.',
    },
  ],
}
