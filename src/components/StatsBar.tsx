import { Card } from "./ui/Card"

interface Stat {
  label: string
  value: number | string
  description?: string
}

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <Card key={s.label} className="p-4 text-center">
          <div className="text-2xl font-bold text-text-primary-dark tabular-nums">
            {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
          </div>
          <div className="text-xs text-text-secondary-dark mt-1">{s.label}</div>
        </Card>
      ))}
    </div>
  )
}
