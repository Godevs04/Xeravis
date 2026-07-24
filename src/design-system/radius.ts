export const radius = {
  button: 12,
  input: 12,
  card: 20,
  image: 20,
  dialog: 24,
  hero: 32,
  pill: 9999,
} as const

export type RadiusToken = keyof typeof radius

export function radiusPx(token: RadiusToken): string {
  return `${radius[token]}px`
}
