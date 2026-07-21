import { Box, Brain, Cloud, Code, icons, Layers, LucideIcon, Shield, Workflow } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  cloud: Cloud,
  code: Code,
  brain: Brain,
  workflow: Workflow,
  shield: Shield,
  layers: Layers,
  box: Box,
}

export function getLucideIcon(name?: string | null): LucideIcon {
  if (!name) return Box
  const normalized = name.trim().toLowerCase()
  if (iconMap[normalized]) return iconMap[normalized]

  const pascal = normalized
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  const dynamic = (icons as Record<string, LucideIcon>)[pascal]
  return dynamic ?? Box
}
