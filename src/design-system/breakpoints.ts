export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type BreakpointToken = keyof typeof breakpoints

export const layout = {
  container: 1280,
  section: 1200,
  prose: 720,
  gutter: 32,
  sectionPadY: 120,
  touchMin: 44,
} as const
