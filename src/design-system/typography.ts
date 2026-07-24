export const typography = {
  displayXl: { size: 64, weight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' },
  displayL: { size: 56, weight: 700, lineHeight: 1.12, letterSpacing: '-0.02em' },
  h1: { size: 48, weight: 700, lineHeight: 1.15, letterSpacing: '-0.02em' },
  h2: { size: 40, weight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
  h3: { size: 32, weight: 600, lineHeight: 1.2, letterSpacing: '-0.02em' },
  h4: { size: 24, weight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' },
  h5: { size: 20, weight: 600, lineHeight: 1.3, letterSpacing: '0' },
  h6: { size: 18, weight: 600, lineHeight: 1.35, letterSpacing: '0' },
  bodyLg: { size: 18, weight: 400, lineHeight: 1.6, letterSpacing: '0' },
  body: { size: 16, weight: 400, lineHeight: 1.6, letterSpacing: '0' },
  caption: { size: 14, weight: 500, lineHeight: 1.45, letterSpacing: '0' },
  small: { size: 12, weight: 500, lineHeight: 1.4, letterSpacing: '0' },
} as const

export type TypographyToken = keyof typeof typography

export const proseMaxCh = 65
