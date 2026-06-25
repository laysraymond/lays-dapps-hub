"use client"

import { WalletGate } from "@/components/WalletGate"
import { StatsBar } from "@/components/StatsBar"
import { DappCard } from "@/components/DappCard"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { PageLoading, EmptyState } from "@/components/ui/LoadingSpinner"
import { CATEGORIES } from "@/lib/utils"
import { useEffect, useState, useCallback } from "react"
import { Search, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

interface Dapp {
  id: string
  name: string
  url: string
  creatorHandle?: string | null
  category: string
  description?: string | null
  status: "verified" | "unverified" | "reported"
  clickCount: number
}

interface Stats {
  total: number
  verified: number
  reported: number
  clicksToday: number
}

export default function HomePage() {
  return (
    <WalletGate>
      <HomeContent />
    </WalletGate>
  )
}

function HomeContent() {
  const [dapps, setDapps] = useState<Dapp[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    fetch("/api/dapps/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== "all") params.set("category", category)
    if (debouncedSearch) params.set("search", debouncedSearch)
    fetch(`/api/dapps?${params}`)
      .then((r) => r.json())
      .then((d) => setDapps(d.dapps || []))
      .finally(() => setLoading(false))
  }, [category, debouncedSearch])

  const statsData = stats
    ? [
        { label: "Total dApps", value: stats.total },
        { label: "Verified", value: stats.verified },
        { label: "Clicks Today", value: stats.clicksToday },
        { label: "Reported", value: stats.reported },
      ]
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center py-8 space-y-3">
        <h1 className="text-4xl sm:text-5xl font-bold text-text-primary-dark tracking-tight">
          Lays Dapps Hub
        </h1>
        <p className="text-text-secondary-dark text-lg max-w-xl mx-auto">
          Community-curated directory of dApps, tools, and games on the Ritual ecosystem.
        </p>
        <p className="text-xs text-text-secondary-dark/60">
          Community Hub — not an official Ritual Foundation product
        </p>
      </div>

      {/* Stats */}
      {stats && <StatsBar stats={statsData} />}

      {/* Top Weekly Leaderboard */}
      <TopWeekly />

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-dark" />
            <input
              type="text"
              placeholder="Search dapps, tools, games…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-dark-2 border border-border-dark rounded-md pl-9 pr-3 py-2 text-sm text-text-primary-dark placeholder:text-text-secondary-dark/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md border transition-colors",
                category === c.value
                  ? "bg-primary text-white border-primary"
                  : "bg-surface-dark-2 text-text-secondary-dark border-border-dark hover:border-primary/40 hover:text-text-primary-dark"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dapp grid */}
      {loading ? (
        <PageLoading />
      ) : dapps.length === 0 ? (
        <EmptyState
          title="No dApps found"
          description="Try adjusting your search or category filter."
          icon={<LayoutGrid size={40} />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dapps.map((d) => (
            <DappCard key={d.id} {...d} />
          ))}
        </div>
      )}
    </div>
  )
}

function TopWeekly() {
  const [dapps, setDapps] = useState<(Dapp & { weeklyClicks: number })[]>([])

  useEffect(() => {
    fetch("/api/leaderboard?mode=weekly")
      .then((r) => r.json())
      .then((d) => setDapps((d.dapps || []).slice(0, 10)))
      .catch(console.error)
  }, [])

  if (!dapps.length) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary-dark">🔥 Top This Week</h2>
        <a href="/leaderboard" className="text-sm text-primary hover:underline">View all →</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {dapps.slice(0, 5).map((d, i) => (
          <DappCard key={d.id} {...d} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}
