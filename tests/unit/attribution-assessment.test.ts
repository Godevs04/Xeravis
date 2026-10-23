import { describe, expect, it } from 'vitest'

import { scoreAssessment, QUESTIONS } from '@/lib/ai-readiness'
import { attributionFromFormData, attributionFromLocation } from '@/lib/attribution'

describe('attributionFromLocation', () => {
  it('captures UTM tags, landing page and external referrer', () => {
    const out = attributionFromLocation(
      'https://xelarvis.in/services?utm_source=linkedin&utm_campaign=q4',
      'https://www.google.com/search?q=ai',
    )
    expect(out).toEqual({
      landingPage: '/services',
      utmSource: 'linkedin',
      utmCampaign: 'q4',
      referrer: 'https://www.google.com/search',
    })
  })

  it('ignores same-site and malformed referrers', () => {
    const sameSite = attributionFromLocation('https://xelarvis.in/', 'https://xelarvis.in/blog')
    expect(sameSite.referrer).toBeUndefined()
    expect(attributionFromLocation('https://xelarvis.in/', 'not a url').referrer).toBeUndefined()
  })
})

describe('attributionFromFormData', () => {
  it('reads attr_ fields and trims them', () => {
    const fd = new FormData()
    fd.set('attr_utmSource', '  newsletter ')
    fd.set('attr_unknown', 'x')
    expect(attributionFromFormData(fd)).toEqual({ utmSource: 'newsletter' })
  })

  it('returns undefined when nothing was captured', () => {
    expect(attributionFromFormData(new FormData())).toBeUndefined()
  })
})

describe('scoreAssessment', () => {
  const all = (value: number) => Object.fromEntries(QUESTIONS.map((q) => [q.id, value]))

  it('scores the maximum as Leading', () => {
    const result = scoreAssessment(all(3))
    expect(result.overall).toBe(100)
    expect(result.level.label).toBe('Leading')
  })

  it('scores no answers as Exploring with two focus areas', () => {
    const result = scoreAssessment({})
    expect(result.overall).toBe(0)
    expect(result.level.label).toBe('Exploring')
    expect(result.focus).toHaveLength(2)
  })

  it('ignores out-of-range answers', () => {
    expect(scoreAssessment(all(99)).overall).toBe(0)
  })

  it('puts the weakest dimension first in focus', () => {
    const answers = all(3)
    for (const q of QUESTIONS.filter((q) => q.dimension === 'governance')) answers[q.id] = 0
    expect(scoreAssessment(answers).focus[0]).toBe('governance')
  })
})
