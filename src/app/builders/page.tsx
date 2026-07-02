"use client"

import { WalletGate } from "@/components/WalletGate"
import { Card } from "@/components/ui/Card"
import { SkeletonGrid, EmptyState } from "@/components/ui/LoadingSpinner"
import { useEffect, useState } from "react"
import { Trophy, BarChart2, Boxes, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface Builder {
  handle: string
  totalDapps: number
  totalClicks: number
  latestDapp: string
  xUrl: string
}

export default function BuildersPage() {
  return (
    <WalletGate>
      <BuildersContent />
    </WalletGate>
  )
}

function BuildersContent() {
  const [builders, setBuilders] = useState<Builder[]>([])
  const [totalBuilders, setTotalBuilders] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/builders")
      .then((r) => r.json())
      .then((d) => {
        setBuilders(d.builders || [])
        setTotalBuilders(d.totalBuilders || 0)
      })
      .finally(() => setLoading(false))
  }, [])

  const top3 = builders.slice(0, 3)
  const rest = builders.slice(3)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
          <Trophy size={13} />
          Builder Leaderboard
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-dark tracking-tight">
          Builder Leaderboard
        </h1>
        <p className="text-text-secondary-dark max-w-xl mx-auto text-sm sm:text-base">
          Ranked by community impact — total clicks across all dApps built on Ritual.
        </p>
        {!loading && (
          <p className="text-sm text-text-muted-dark">
            <span className="text-primary font-semibold">{totalBuilders}</span> builders have shipped dApps on Ritual
          </p>
        )}
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : builders.length === 0 ? (
        <EmptyState
          title="No builders yet"
          description="Once dApps are submitted and approved, builders will appear here."
          icon={<Trophy size={40} />}
        />
      ) : (
        <>
          {/* Podium — Top 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {top3.map((b, i) => (
              <PodiumCard key={b.handle} builder={b} rank={i + 1} />
            ))}
          </div>

          {/* Rank 4-100 table */}
          {rest.length > 0 && (
            <Card className="overflow-hidden">
              <div className="divide-y divide-border-dark">
                {rest.map((b, i) => (
                  <div
                    key={b.handle}
                    className="flex items-center gap-4 px-4 sm:px-5 py-3.5 hover:bg-surface-dark-2/60 transition-colors group"
                  >
                    <span className="w-8 text-sm font-bold tabular-nums text-text-secondary-dark shrink-0">
                      #{i + 4}
                    </span>
                    <a
                      href={b.xUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-0 flex items-center gap-1.5 text-text-primary-dark font-medium text-sm hover:text-primary transition-colors truncate"
                    >
                      @{b.handle}
                      <ExternalLink size={11} className="opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
                    </a>
                    <span className="hidden sm:block text-xs text-text-secondary-dark truncate max-w-[160px]">
                      {b.latestDapp}
                    </span>
                    <div className="flex items-center gap-1 text-text-secondary-dark shrink-0 w-16 justify-end">
                      <Boxes size={12} />
                      <span className="text-sm font-medium tabular-nums text-text-primary-dark">{b.totalDapps}</span>
                    </div>
                    <div className="flex items-center gap-1 text-text-secondary-dark shrink-0 w-20 justify-end">
                      <BarChart2 size={12} />
                      <span className="text-sm font-semibold tabular-nums text-text-primary-dark">
                        {b.totalClicks.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function PodiumCard({ builder, rank }: { builder: Builder; rank: number }) {
  const isFirst = rank === 1
  return (
    <Card
      className={cn(
        "p-5 space-y-4 relative overflow-hidden",
        isFirst && "border-primary/40 shadow-glow sm:order-2 sm:-translate-y-2",
        rank === 2 && "sm:order-1",
        rank === 3 && "sm:order-3"
      )}
      glow={isFirst}
    >
      {isFirst && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      )}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-2xl font-black tabular-nums",
            rank === 1 && "text-primary",
            rank === 2 && "text-text-secondary-dark",
            rank === 3 && "text-amber-600"
          )}
        >
          #{rank}
        </span>
        {isFirst && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md bg-primary/15 text-primary border border-primary/30">
            🏆 Top Builder
          </span>
        )}
      </div>
      <div>
        <a
          href={builder.xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold text-text-primary-dark hover:text-primary transition-colors inline-flex items-center gap-1.5"
        >
          @{builder.handle}
          <ExternalLink size={13} className="opacity-50" />
        </a>
        {builder.latestDapp && (
          <p className="text-xs text-text-muted-dark mt-1">Latest: {builder.latestDapp}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-dark">
        <div>
          <p className="text-xl font-bold text-text-primary-dark tabular-nums">{builder.totalDapps}</p>
          <p className="text-[11px] text-text-muted-dark">dApps shipped</p>
        </div>
        <div>
          <p className="text-xl font-bold text-primary tabular-nums">{builder.totalClicks.toLocaleString()}</p>
          <p className="text-[11px] text-text-muted-dark">total clicks</p>
        </div>
      </div>
    </Card>
  )
}
