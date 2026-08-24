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
