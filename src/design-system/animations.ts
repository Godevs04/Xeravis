export const animations = {
  duration: {
    fast: 200,
    base: 300,
    slow: 500,
  },
  ease: {
    standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  },
} as const

export function durationMs(token: keyof typeof animations.duration): string {
  return `${animations.duration[token]}ms`
}
