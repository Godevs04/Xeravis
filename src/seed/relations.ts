/**
 * Canonical Service ↔ Solution ↔ Industry relationship matrices
 * from plans/23-08-26_Planchnages.md — used by seed.
 */

/** Service slug → related solution slugs */
export const SERVICE_SOLUTION_MAP: Record<string, string[]> = {
  'artificial-intelligence-ai-research': [
    'enterprise-ai-solutions',
    'custom-ai-products',
    'ai-agents',
    'intelligent-automation',
    'predictive-analytics-solutions',
    'healthcare-clinical-intelligence',
  ],
  'data-science-advanced-analytics': [
    'predictive-analytics-solutions',
    'business-intelligence-solutions',
    'enterprise-ai-solutions',
    'data-platforms',
    'intelligent-automation',
  ],
  'it-consulting-digital-transformation': [
    'application-modernization',
    'data-platforms',
    'intelligent-automation',
    'enterprise-ai-solutions',
  ],
  'data-engineering-cloud-solutions': [
    'data-platforms',
    'enterprise-ai-solutions',
    'business-intelligence-solutions',
    'predictive-analytics-solutions',
    'intelligent-automation',
  ],
  'clinical-data-science-healthcare-ai': [
    'healthcare-clinical-intelligence',
    'enterprise-ai-solutions',
    'predictive-analytics-solutions',
    'data-platforms',
    'intelligent-automation',
  ],
}

/** Service slug → related industry slugs */
export const SERVICE_INDUSTRY_MAP: Record<string, string[]> = {
  'artificial-intelligence-ai-research': [
    'healthcare-life-sciences',
    'banking-finance',
    'manufacturing',
    'retail',
    'enterprise-technology',
    'education',
  ],
  'data-science-advanced-analytics': [
    'banking-finance',
    'manufacturing',
    'retail',
    'logistics',
    'healthcare-life-sciences',
    'enterprise-technology',
  ],
  'it-consulting-digital-transformation': [
    'enterprise-technology',
    'banking-finance',
    'manufacturing',
    'retail',
    'healthcare-life-sciences',
  ],
  'data-engineering-cloud-solutions': [
    'healthcare-life-sciences',
    'banking-finance',
    'manufacturing',
    'retail',
    'enterprise-technology',
    'logistics',
  ],
  'clinical-data-science-healthcare-ai': [
    'healthcare-life-sciences',
    'pharmaceutical',
    'biotechnology',
  ],
}

/** Industry slug → publish tier (1 = primary nav, 3 = gated) */
export const INDUSTRY_TIER_MAP: Record<string, '1' | '2' | '3'> = {
  'healthcare-life-sciences': '1',
  'enterprise-technology': '1',
  'banking-finance': '1',
  manufacturing: '1',
  retail: '2',
  logistics: '2',
  education: '3',
  'government-public-sector': '3',
  'energy-utilities': '3',
  pharmaceutical: '3',
  biotechnology: '3',
}

/** Solution slug → related industry slugs (primary) */
export const SOLUTION_INDUSTRY_MAP: Record<string, string[]> = {
  'enterprise-ai-solutions': [
    'healthcare-life-sciences',
    'banking-finance',
    'manufacturing',
    'enterprise-technology',
  ],
  'ai-agents': ['enterprise-technology', 'banking-finance', 'retail', 'manufacturing'],
  'custom-ai-products': ['enterprise-technology', 'healthcare-life-sciences', 'retail'],
  'predictive-analytics-solutions': [
    'manufacturing',
    'banking-finance',
    'retail',
    'logistics',
    'healthcare-life-sciences',
  ],
  'business-intelligence-solutions': [
    'banking-finance',
    'retail',
    'manufacturing',
    'enterprise-technology',
  ],
  'intelligent-automation': ['banking-finance', 'manufacturing', 'retail', 'enterprise-technology'],
  'data-platforms': [
    'healthcare-life-sciences',
    'banking-finance',
    'manufacturing',
    'enterprise-technology',
  ],
  'application-modernization': [
    'enterprise-technology',
    'banking-finance',
    'manufacturing',
    'retail',
  ],
  'healthcare-clinical-intelligence': [
    'healthcare-life-sciences',
    'pharmaceutical',
    'biotechnology',
  ],
}

/**
 * Canonical service slugs in display order (5 capabilities).
 */
export const CANONICAL_SERVICE_SLUGS = [
  'artificial-intelligence-ai-research',
  'data-science-advanced-analytics',
  'it-consulting-digital-transformation',
  'data-engineering-cloud-solutions',
  'clinical-data-science-healthcare-ai',
] as const

/**
 * Canonical solution slugs in display order (9 programs).
 * Kept in sync with SEED_SOLUTIONS / FALLBACK_SOLUTIONS.
 */
export const CANONICAL_SOLUTION_SLUGS = [
  'enterprise-ai-solutions',
  'intelligent-automation',
  'ai-agents',
  'predictive-analytics-solutions',
  'business-intelligence-solutions',
  'data-platforms',
  'custom-ai-products',
  'healthcare-clinical-intelligence',
  'application-modernization',
] as const

/**
 * Solution → Technology matrix (separate from Service → Technology).
 * Solutions do NOT inherit service technology stacks.
 */
export const SOLUTION_TECHNOLOGY_MAP: Record<string, readonly string[]> = {
  'enterprise-ai-solutions': [
    'Python',
    'PyTorch',
    'TensorFlow',
    'OpenAI',
    'Hugging Face',
    'LangChain',
    'Docker',
    'Kubernetes',
    'AWS',
    'Microsoft Azure',
    'Google Cloud Platform',
  ],
  'ai-agents': [
    'Python',
    'OpenAI',
    'Hugging Face',
    'LangChain',
    'REST APIs',
    'Docker',
    'Kubernetes',
  ],
  'custom-ai-products': [
    'Python',
    'PyTorch',
    'TensorFlow',
    'OpenAI',
    'React',
    'Node.js',
    'REST APIs',
    'Docker',
    'Kubernetes',
    'AWS',
    'Microsoft Azure',
    'Google Cloud Platform',
  ],
  'predictive-analytics-solutions': [
    'Python',
    'R',
    'SQL',
    'Apache Spark',
    'Databricks',
    'Snowflake',
    'Power BI',
    'Tableau',
  ],
  'business-intelligence-solutions': ['SQL', 'Power BI', 'Tableau', 'Snowflake', 'Databricks'],
  'intelligent-automation': [
    'Python',
    'OpenAI',
    'LangChain',
    'REST APIs',
    'Docker',
    'Kubernetes',
    'AWS',
    'Microsoft Azure',
    'Google Cloud Platform',
  ],
  'data-platforms': [
    'Python',
    'SQL',
    'Apache Spark',
    'Apache Kafka',
    'Databricks',
    'Snowflake',
    'AWS',
    'Microsoft Azure',
    'Google Cloud Platform',
    'Docker',
    'Kubernetes',
  ],
  'application-modernization': [
    'Python',
    'React',
    'Node.js',
    'REST APIs',
    'Docker',
    'Kubernetes',
    'AWS',
    'Microsoft Azure',
    'Google Cloud Platform',
  ],
  'healthcare-clinical-intelligence': [
    'SAS',
    'Python',
    'SQL',
    'Power BI',
    'Tableau',
    'CDISC',
    'SDTM',
    'ADaM',
    'TLF',
  ],
}
