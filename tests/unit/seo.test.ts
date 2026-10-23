import { describe, expect, it } from 'vitest'

import { clampDescription, formatPageTitle } from '@/lib/seo'

describe('clampDescription', () => {
  it('pads short descriptions with the brand line', () => {
    const out = clampDescription('Short text')
    expect(out.startsWith('Short text.')).toBe(true)
    expect(out).toContain('Xelarvis')
  })

  it('truncates long descriptions on a word boundary with an ellipsis', () => {
    const out = clampDescription('word '.repeat(80))
    expect(out.length).toBeLessThanOrEqual(158)
    expect(out.endsWith('…')).toBe(true)
    expect(out).not.toMatch(/\s…$/)
  })

  it('collapses whitespace', () => {
    const text =
      'A   description\n\nwith   lots of    spacing that is long enough to pass the minimum.'
    expect(clampDescription(text)).not.toMatch(/\s{2,}/)
  })
})

describe('formatPageTitle', () => {
  it('falls back to the brand title', () => {
    expect(formatPageTitle()).toContain('Xelarvis')
  })

  it('does not append the brand twice', () => {
    expect(formatPageTitle('About Xelarvis')).toBe('About Xelarvis')
  })
})
