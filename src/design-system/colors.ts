export const colors = {
  primary: '#0F172A',
  secondary: '#334155',
  accent: '#2563EB',
  accentHover: '#1D4ED8',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  mutedLine: '#E2E8F0',
  muted: '#64748B',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  dark: '#020617',
} as const

export type ColorToken = keyof typeof colors
