"use client"

import { useEffect, useRef, useState } from "react"

interface Stat {
  label: string
  value: number | string
  description?: string
  icon?: string
}

function AnimatedCount({ target }: { target: number }) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  useEffect(() => {
    const duration = 900
    const startVal = 0

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(startVal + (target - startVal) * ease))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target])

  return <>{display.toLocaleString()}</>
}

const STAT_ICONS: Record<string, string> = {
  "Total dApps": "◈",
  "Verified": "✦",
  "Clicks Today": "◎",
  "Reported": "⚑",
}

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="relative bg-surface-dark border border-border-dark rounded-xl p-5 text-center overflow-hidden group hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {/* Icon */}
          <div className="text-primary/50 text-xs font-mono mb-2 group-hover:text-primary/70 transition-colors">
            {STAT_ICONS[s.label] ?? "◆"}
          </div>

          <div className="text-2xl font-bold text-text-primary-dark tabular-nums tracking-tight">
            {typeof s.value === "number" ? (
              <AnimatedCount target={s.value} />
            ) : (
              s.value
            )}
          </div>
          <div className="text-xs text-text-muted-dark mt-1 font-medium">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
