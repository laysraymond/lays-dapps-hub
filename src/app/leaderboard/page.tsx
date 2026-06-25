"use client"

import { WalletGate } from "@/components/WalletGate"
import { StatusBadge, Badge } from "@/components/ui/Badge"
import { PageLoading, EmptyState } from "@/components/ui/LoadingSpinner"
import { Button } from "@/components/ui/Button"
import { CATEGORY_LABELS } from "@/lib/utils"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { BarChart2, Trophy } from "lucide-react"

interface LeaderboardDapp {
  id: string
  name: string
  url: string
  creatorHandle?: string | null
  category: string
  status: "verified" | "unverified" | "reported"
  clickCount: number
  weeklyClicks: number | null
}

export default function LeaderboardPage() {
  return (
    <WalletGate>
      <LeaderboardContent />
    </WalletGate>
  )
}

function LeaderboardContent() {
  const [mode, setMode] = useState<"alltime" | "weekly">("weekly")
  const [dapps, setDapps] = useState<LeaderboardDapp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/leaderboard?mode=${mode}`)
      .then((r) => r.json())
      .then((d) => setDapps(d.dapps || []))
      .finally(() => setLoading(false))
  }, [mode])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-dark flex items-center gap-2">
            <Trophy size={22} className="text-secondary" />
            Leaderboard
          </h1>
          <p className="text-sm text-text-secondary-dark mt-1">Most visited dApps through this directory.</p>
        </div>

        <div className="flex border border-border-dark rounded-md overflow-hidden self-start sm:self-auto">
          <button
            onClick={() => setMode("weekly")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              mode === "weekly"
                ? "bg-primary text-white"
                : "bg-surface-dark-2 text-text-secondary-dark hover:text-text-primary-dark"
            )}
          >
            This Week
          </button>
          <button
            onClick={() => setMode("alltime")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              mode === "alltime"
                ? "bg-primary text-white"
                : "bg-surface-dark-2 text-text-secondary-dark hover:text-text-primary-dark"
            )}
          >
            All Time
          </button>
        </div>
      </div>

      {loading ? (
        <PageLoading />
      ) : dapps.length === 0 ? (
        <EmptyState
          title="No data yet"
          description="Clicks will appear here as dApps are visited."
          icon={<BarChart2 size={40} />}
        />
      ) : (
        <div className="space-y-1">
          {dapps.map((d, i) => {
            const clicks = mode === "weekly" ? (d.weeklyClicks ?? 0) : d.clickCount
            return (
              <div
                key={d.id}
                className="flex items-center gap-4 px-4 py-3 rounded-lg bg-surface-dark border border-border-dark hover:border-primary/30 transition-colors group"
              >
                {/* Rank */}
                <span
                  className={cn(
                    "w-7 text-sm font-bold tabular-nums shrink-0",
                    i === 0 && "text-yellow-400",
                    i === 1 && "text-gray-300",
                    i === 2 && "text-amber-600",
                    i > 2 && "text-text-secondary-dark"
                  )}
                >
                  #{i + 1}
                </span>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-text-primary-dark text-sm truncate">{d.name}</span>
                    <StatusBadge status={d.status} />
                    <Badge variant="category">{CATEGORY_LABELS[d.category] || d.category}</Badge>
                  </div>
                  {d.creatorHandle && (
                    <p className="text-xs text-text-secondary-dark mt-0.5">@{d.creatorHandle}</p>
                  )}
                </div>

                {/* Clicks */}
                <div className="flex items-center gap-1 text-text-secondary-dark shrink-0">
                  <BarChart2 size={13} />
                  <span className="text-sm font-semibold tabular-nums text-text-primary-dark">
                    {clicks.toLocaleString()}
                  </span>
                </div>

                {/* Visit */}
                <a
                  href={`/go/${d.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <Button size="sm" variant="secondary">Visit</Button>
                </a>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
