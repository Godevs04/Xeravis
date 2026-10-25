export type Dimension = 'data' | 'infrastructure' | 'talent' | 'governance'

export type Question = {
  id: string
  dimension: Dimension
  prompt: string
  options: [string, string, string, string]
}

export const DIMENSIONS: Record<Dimension, { label: string; serviceSlug: string; advice: string }> =
  {
    data: {
      label: 'Data foundations',
      serviceSlug: 'data-engineering-cloud-solutions',
      advice:
        'Consolidate key data into governed, well-documented pipelines before scaling AI use cases.',
    },
    infrastructure: {
      label: 'Platform and infrastructure',
      serviceSlug: 'it-consulting-digital-transformation',
      advice:
        'Standardise cloud, MLOps and deployment paths so models move from notebook to production reliably.',
    },
    talent: {
      label: 'People and skills',
      serviceSlug: 'data-science-advanced-analytics',
      advice:
        'Pair business owners with data and ML practitioners, and build analytics literacy across teams.',
    },
    governance: {
      label: 'Strategy and governance',
      serviceSlug: 'artificial-intelligence-ai-research',
      advice:
        'Tie AI work to measurable outcomes, and set clear policies for risk, privacy and model oversight.',
    },
  }

export const QUESTIONS: Question[] = [
  {
    id: 'data-access',
    dimension: 'data',
    prompt: 'How easily can teams access the data they need for analysis?',
    options: [
      'Data is scattered in spreadsheets and silos',
      'Some central sources, mostly manual extracts',
      'A central warehouse or lake covers most needs',
      'Self-service, governed data products across the business',
    ],
  },
  {
    id: 'data-quality',
    dimension: 'data',
    prompt: 'How much do you trust the quality of your core data?',
    options: [
      'Quality issues are frequent and unmeasured',
      'Known issues, fixed case by case',
      'Quality checks run on key pipelines',
      'Monitored quality with owners and SLAs',
    ],
  },
  {
    id: 'infra-cloud',
    dimension: 'infrastructure',
    prompt: 'What does your analytics and compute platform look like?',
    options: [
      'Mostly local machines and on-premise servers',
      'Some cloud services, used ad hoc',
      'A managed cloud platform for data and analytics',
      'Scalable cloud platform with automated provisioning',
    ],
  },
  {
    id: 'infra-mlops',
    dimension: 'infrastructure',
    prompt: 'How do models or analytics reach production today?',
    options: [
      'They rarely leave a notebook or report',
      'Manual hand-offs to engineering',
      'Repeatable deployment for some use cases',
      'CI/CD, monitoring and retraining for models (MLOps)',
    ],
  },
  {
    id: 'talent-skills',
    dimension: 'talent',
    prompt: 'Which data and AI skills do you have in-house?',
    options: [
      'Little or none',
      'A few analysts or BI developers',
      'A data team with data science capability',
      'Cross-functional data, ML and engineering teams',
    ],
  },
  {
    id: 'talent-adoption',
    dimension: 'talent',
    prompt: 'How do business teams use data in decisions?',
    options: [
      'Mostly intuition and experience',
      'Periodic reports reviewed by managers',
      'Dashboards used in regular decision-making',
      'Data and model outputs embedded in daily workflows',
    ],
  },
  {
    id: 'gov-strategy',
    dimension: 'governance',
    prompt: 'Is there a strategy linking AI to business goals?',
    options: [
      'No defined strategy yet',
      'Interest from leadership, few concrete plans',
      'Prioritised use cases with owners',
      'Funded roadmap with tracked business outcomes',
    ],
  },
  {
    id: 'gov-risk',
    dimension: 'governance',
    prompt: 'How do you manage privacy, security and AI risk?',
    options: [
      'Not formally addressed',
      'Handled case by case',
      'Policies exist for data privacy and access',
      'Responsible AI framework with reviews and monitoring',
    ],
  },
]

export const LEVELS = [
  {
    min: 0,
    label: 'Exploring',
    summary: 'Early days: focus on foundations and one high-value pilot.',
  },
  {
    min: 35,
    label: 'Emerging',
    summary: 'Promising building blocks: standardise data and delivery to scale beyond pilots.',
  },
  {
    min: 60,
    label: 'Scaling',
    summary: 'Solid capability: industrialise MLOps and widen adoption across the business.',
  },
  {
    min: 85,
    label: 'Leading',
    summary: 'Mature practice: optimise, innovate and lead with differentiated AI products.',
  },
] as const

export type Answers = Record<string, number>

export type AssessmentResult = {
  overall: number
  level: (typeof LEVELS)[number]
  dimensions: Array<{ key: Dimension; label: string; score: number }>
  focus: Dimension[]
}

/** Scores answers (0 to 3 each) into 0 to 100 percentages per dimension and overall. */
export function scoreAssessment(answers: Answers): AssessmentResult {
  const totals = new Map<Dimension, { sum: number; count: number }>()
  for (const q of QUESTIONS) {
    const raw = answers[q.id]
    const value = typeof raw === 'number' && raw >= 0 && raw <= 3 ? raw : 0
    const t = totals.get(q.dimension) ?? { sum: 0, count: 0 }
    totals.set(q.dimension, { sum: t.sum + value, count: t.count + 1 })
  }
  const dimensions = (Object.keys(DIMENSIONS) as Dimension[]).map((key) => {
    const t = totals.get(key) ?? { sum: 0, count: 1 }
    return { key, label: DIMENSIONS[key].label, score: Math.round((t.sum / (t.count * 3)) * 100) }
  })
  const overall = Math.round(dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length)
  const level = [...LEVELS].reverse().find((l) => overall >= l.min) ?? LEVELS[0]
  const focus = [...dimensions]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((d) => d.key)
  return { overall, level, dimensions, focus }
}
