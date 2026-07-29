export const colors = {
  primary: '#0F172A',
  secondary: '#475569',
  accent: '#0D9488',
  accentHover: '#0F766E',
  accentLight: '#22D3EE',
  cyan: '#06B6D4',
  teal: '#0D9488',
  navy: '#0F172A',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  neutral: '#F8FAFC',
  mutedLine: '#E2E8F0',
  muted: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  dark: '#0F172A',
  border: '#E2E8F0',
} as const

export type ColorToken = keyof typeof colors
