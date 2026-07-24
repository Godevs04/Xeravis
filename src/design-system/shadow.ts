export const shadows = {
  light: '0 1px 2px rgb(15 23 42 / 0.04)',
  medium: '0 4px 12px rgb(15 23 42 / 0.06)',
  large: '0 12px 32px rgb(15 23 42 / 0.08)',
  floating: '0 16px 48px rgb(15 23 42 / 0.12)',
  hover: '0 8px 24px rgb(15 23 42 / 0.10)',
} as const

export type ShadowToken = keyof typeof shadows
