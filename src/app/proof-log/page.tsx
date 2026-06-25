"use client"

import { WalletGate } from "@/components/WalletGate"
import { Card } from "@/components/ui/Card"
import { PageLoading, EmptyState } from "@/components/ui/LoadingSpinner"
import { Button } from "@/components/ui/Button"
import { formatRelativeTime } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Activity, ChevronLeft, ChevronRight } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  dapp: { name: string; approved: boolean }
}

export default function ProofLogPage() {
  return (
    <WalletGate>
      <ProofLogContent />
    </WalletGate>
  )
}

function ProofLogContent() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const perPage = 20

  useEffect(() => {
    setLoading(true)
    fetch(`/api/proof-log?page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        setLogs(d.logs || [])
        setTotal(d.total || 0)
      })
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(Math.min(total, 200) / perPage)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary-dark flex items-center gap-2">
          <Activity size={20} className="text-primary" />
          Proof Log
        </h1>
        <p className="text-text-secondary-dark text-sm mt-1">
          Recent dApp visits tracked through this directory. No personal data stored.
        </p>
      </div>

      {loading ? (
        <PageLoading />
      ) : logs.length === 0 ? (
        <EmptyState
          title="No clicks yet"
          description="Activity will appear here as dApps are visited."
          icon={<Activity size={40} />}
        />
      ) : (
        <>
          <div className="space-y-1">
            {logs.map((log, i) => (
              <div
                key={log.id}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-surface-dark border border-border-dark"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary-dark/50 font-mono w-5 text-right">
                    {(page - 1) * perPage + i + 1}
                  </span>
                  <span className="text-sm text-text-primary-dark font-medium">{log.dapp.name}</span>
                </div>
                <span className="text-xs text-text-secondary-dark">{formatRelativeTime(log.timestamp)}</span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                <ChevronLeft size={14} /> Previous
              </Button>
              <span className="text-sm text-text-secondary-dark">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                Next <ChevronRight size={14} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
