export const colors = {
  primary: '#17171c',
  secondary: '#4a4a58',
  accent: '#6d5ef9',
  accentHover: '#5546e8',
  accentLight: '#a18cff',
  indigo: '#4f46e5',
  lavender: '#efeaff',
  background: '#f6f3ff',
  surface: 'rgba(255, 255, 255, 0.7)',
  mutedLine: 'rgba(23, 23, 28, 0.08)',
  muted: '#6e6e7c',
  success: '#22c55e',
  warning: '#F59E0B',
  danger: '#ef4444',
  dark: '#17171c',
} as const

export type ColorToken = keyof typeof colors
