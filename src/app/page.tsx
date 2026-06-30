"use client"

import { WalletGate } from "@/components/WalletGate"
import { StatsBar } from "@/components/StatsBar"
import { DappCard } from "@/components/DappCard"
import { PageLoading, SkeletonGrid, EmptyState } from "@/components/ui/LoadingSpinner"
import { CATEGORIES } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Search, LayoutGrid, Sparkles } from "lucide-react"
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
    <div className="relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-grid opacity-100" />
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-radial-glow" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Hero */}
        <div className="text-center pt-6 pb-4 space-y-5 animate-fade-in">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs font-medium text-primary">
            <Sparkles size={11} />
            Ritual Community Directory
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary-dark tracking-tight leading-tight">
            Discover the{" "}
            <span className="text-primary relative">
              Ritual
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            </span>{" "}
            Ecosystem
          </h1>

          <p className="text-text-secondary-dark text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore community-built applications, tools, games, infrastructure, and AI-powered experiences built on Ritual.
          </p>

          {/* Live stat badges */}
          {stats && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-surface-dark border border-border-dark rounded-full px-3 py-1.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-text-secondary-dark">{stats.total} dApps</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-dark border border-border-dark rounded-full px-3 py-1.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-verified" />
                <span className="text-text-secondary-dark">{stats.verified} Verified</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-dark border border-border-dark rounded-full px-3 py-1.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-text-secondary-dark">Community Driven</span>
              </div>
            </div>
          )}
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="animate-fade-in-delay-1">
            <StatsBar stats={statsData} />
          </div>
        )}

        {/* Top Weekly */}
        <TopWeekly />

        {/* Section divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border-dark" />
          <span className="text-xs text-text-muted-dark font-medium uppercase tracking-widest">All dApps</span>
          <div className="flex-1 h-px bg-border-dark" />
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted-dark" />
            <input
              type="text"
              placeholder="Search dapps, tools, games…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-dark border border-border-dark rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary-dark placeholder:text-text-muted-dark focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-lg border transition-all duration-150",
                  category === c.value
                    ? "bg-primary text-bg-dark border-primary shadow-glow-sm font-semibold"
                    : "bg-surface-dark text-text-muted-dark border-border-dark hover:border-border-dark-2 hover:text-text-secondary-dark"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dapp grid */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : dapps.length === 0 ? (
          <EmptyState
            title="No dApps found"
            description="Try adjusting your search or category filter."
            icon={<LayoutGrid size={36} />}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
            {dapps.map((d) => (
              <DappCard key={d.id} {...d} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TopWeekly() {
  const [dapps, setDapps] = useState<(Dapp & { weeklyClicks: number })[]>([])

  useEffect(() => {
    fetch("/api/leaderboard?mode=weekly")
      .then((r) => r.json())
      .then((d) => setDapps((d.dapps || []).slice(0, 5)))
      .catch(console.error)
  }, [])

  if (!dapps.length) return null

  return (
    <div className="space-y-4 animate-fade-in-delay-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🔥</span>
          <h2 className="text-base font-semibold text-text-primary-dark">Top This Week</h2>
        </div>
        <a href="/leaderboard" className="text-xs text-primary hover:text-primary-light transition-colors font-medium">
          View all →
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {dapps.map((d, i) => (
          <DappCard key={d.id} {...d} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}
