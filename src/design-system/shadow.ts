export const shadows = {
  light: '0 4px 16px rgba(15, 23, 42, 0.04)',
  medium: '0 12px 32px rgba(15, 23, 42, 0.06)',
  large: '0 24px 56px rgba(15, 23, 42, 0.08)',
  floating: '0 28px 64px rgba(15, 23, 42, 0.1)',
  hover: '0 18px 40px rgba(13, 148, 136, 0.14)',
} as const

export type ShadowToken = keyof typeof shadows
