/**
 * Canonical Service ↔ Solution ↔ Industry relationship matrices
 * from plans/23-08-26_Planchnages.md — used by seed.
 */

/** Service slug → related solution slugs (docs/chnageson09sep2026.md §15) */
export const SERVICE_SOLUTION_MAP: Record<string, string[]> = {
  'artificial-intelligence-ai-research': [
    'enterprise-ai-solutions',
    'ai-agents',
    'custom-ai-products',
    'intelligent-automation',
    'predictive-analytics-solutions',
  ],
  'data-science-advanced-analytics': [
    'predictive-analytics-solutions',
    'business-intelligence-solutions',
    'enterprise-ai-solutions',
    'intelligent-automation',
    'data-platforms',
  ],
  'it-consulting-digital-transformation': [
    'application-modernization',
    'intelligent-automation',
    'custom-ai-products',
    'data-platforms',
    'enterprise-ai-solutions',
  ],
  'data-engineering-cloud-solutions': [
    'data-platforms',
    'business-intelligence-solutions',
    'predictive-analytics-solutions',
    'enterprise-ai-solutions',
    'intelligent-automation',
  ],
  'clinical-data-science-healthcare-ai': [
    'healthcare-clinical-intelligence',
    'predictive-analytics-solutions',
    'business-intelligence-solutions',
    'enterprise-ai-solutions',
    'data-platforms',
  ],
}

/** Service slug → related industry slugs (docs/chnageson09sep2026.md §14) */
export const SERVICE_INDUSTRY_MAP: Record<string, string[]> = {
  'artificial-intelligence-ai-research': [
    'enterprise-technology',
    'banking-finance',
    'manufacturing',
    'retail',
    'logistics',
    'healthcare-life-sciences',
  ],
  'data-science-advanced-analytics': [
    'banking-finance',
    'manufacturing',
    'retail',
    'logistics',
    'enterprise-technology',
    'healthcare-life-sciences',
  ],
  'it-consulting-digital-transformation': [
    'enterprise-technology',
    'manufacturing',
    'retail',
    'logistics',
    'banking-finance',
  ],
  'data-engineering-cloud-solutions': [
    'enterprise-technology',
    'banking-finance',
    'manufacturing',
    'retail',
    'logistics',
    'healthcare-life-sciences',
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

/** Solution slug → related industry slugs (docs/chnageson09sep2026.md §14) */
export const SOLUTION_INDUSTRY_MAP: Record<string, string[]> = {
  'enterprise-ai-solutions': [
    'enterprise-technology',
    'banking-finance',
    'manufacturing',
    'retail',
    'healthcare-life-sciences',
  ],
  'intelligent-automation': [
    'banking-finance',
    'manufacturing',
    'retail',
    'logistics',
    'enterprise-technology',
  ],
  'ai-agents': ['enterprise-technology', 'banking-finance', 'retail', 'manufacturing'],
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
    'healthcare-life-sciences',
  ],
  'data-platforms': [
    'enterprise-technology',
    'banking-finance',
    'manufacturing',
    'healthcare-life-sciences',
    'retail',
  ],
  'custom-ai-products': ['enterprise-technology', 'healthcare-life-sciences', 'retail'],
  'healthcare-clinical-intelligence': [
    'healthcare-life-sciences',
    'pharmaceutical',
    'biotechnology',
  ],
  'application-modernization': [
    'enterprise-technology',
    'banking-finance',
    'manufacturing',
    'retail',
    'logistics',
  ],
}

/**
 * Solution slug → services that deliver it (docs/chnageson09sep2026.md §15).
 * Prefer this over inverting SERVICE_SOLUTION_MAP so Healthcare is not
 * auto-attached to every AI solution that Healthcare also links to.
 */
export const SOLUTION_SERVICE_MAP: Record<string, string[]> = {
  'enterprise-ai-solutions': [
    'artificial-intelligence-ai-research',
    'data-science-advanced-analytics',
    'data-engineering-cloud-solutions',
    'it-consulting-digital-transformation',
  ],
  'intelligent-automation': [
    'artificial-intelligence-ai-research',
    'it-consulting-digital-transformation',
    'data-engineering-cloud-solutions',
  ],
  'ai-agents': [
    'artificial-intelligence-ai-research',
    'it-consulting-digital-transformation',
    'data-engineering-cloud-solutions',
  ],
  'predictive-analytics-solutions': [
    'data-science-advanced-analytics',
    'artificial-intelligence-ai-research',
    'data-engineering-cloud-solutions',
  ],
  'business-intelligence-solutions': [
    'data-science-advanced-analytics',
    'data-engineering-cloud-solutions',
  ],
  'data-platforms': [
    'data-engineering-cloud-solutions',
    'it-consulting-digital-transformation',
    'data-science-advanced-analytics',
  ],
  'custom-ai-products': [
    'artificial-intelligence-ai-research',
    'it-consulting-digital-transformation',
    'data-engineering-cloud-solutions',
  ],
  'healthcare-clinical-intelligence': [
    'clinical-data-science-healthcare-ai',
    'artificial-intelligence-ai-research',
    'data-science-advanced-analytics',
    'data-engineering-cloud-solutions',
  ],
  'application-modernization': [
    'it-consulting-digital-transformation',
    'data-engineering-cloud-solutions',
    'artificial-intelligence-ai-research',
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
  'healthcare-clinical-intelligence': ['SAS', 'Python', 'SQL', 'Power BI', 'Tableau'],
}
