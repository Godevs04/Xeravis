export const shadows = {
  light: '0 4px 18px rgba(79, 70, 229, 0.06)',
  medium: '0 12px 40px rgba(79, 70, 229, 0.1)',
  large: '0 24px 64px rgba(79, 70, 229, 0.14)',
  floating: '0 28px 80px rgba(79, 70, 229, 0.16)',
  hover: '0 18px 52px rgba(109, 94, 249, 0.2)',
} as const

export type ShadowToken = keyof typeof shadows
