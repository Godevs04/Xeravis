const CLINICAL_SLUGS = new Set(['sas', 'cdisc', 'sdtm', 'adam'])

/** Technologies shown on /technologies (clinical standards live on the healthcare pages). */
export function isEngineeringStack(item: { slug: string; category?: string | null }) {
  const cat = (item.category || '').toLowerCase()
  return cat !== 'clinical' && !CLINICAL_SLUGS.has(item.slug)
}
