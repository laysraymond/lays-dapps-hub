import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return `${seconds}s ago`
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}

export const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "game", label: "Game" },
  { value: "tool", label: "Tool" },
  { value: "identity", label: "Identity" },
  { value: "finance", label: "Finance" },
  { value: "quiz", label: "Quiz" },
  { value: "social", label: "Social" },
  { value: "other", label: "Other" },
] as const

export const CATEGORY_LABELS: Record<string, string> = {
  game: "Game",
  tool: "Tool",
  identity: "Identity",
  finance: "Finance",
  quiz: "Quiz",
  social: "Social",
  other: "Other",
}
