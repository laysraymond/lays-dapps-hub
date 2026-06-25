"use client"

import { useAccount, useConnect } from "wagmi"
import { ADMIN_WALLET_ADDRESS } from "@/lib/chain"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import { Badge, StatusBadge } from "@/components/ui/Badge"
import { PageLoading, EmptyState } from "@/components/ui/LoadingSpinner"
import { Select } from "@/components/ui/Input"
import { CATEGORY_LABELS, formatRelativeTime } from "@/lib/utils"
import { useEffect, useState, useCallback } from "react"
import { Shield, Check, X, CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminDapp {
  id: string
  name: string
  url: string
  creatorHandle?: string | null
  category: string
  status: "verified" | "unverified" | "reported"
  approved: boolean
  flaggedForReview: boolean
  needsLinkRecheck: boolean
  clickCount: number
  createdAt: string
  _count: { reports: number }
}

interface AdminReport {
  id: string
  reason: string
  resolved: boolean
  createdAt: string
  dapp: { name: string; url: string; status: string }
}

type Tab = "pending" | "all" | "reports"

export default function AdminPage() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <Card className="w-full max-w-sm p-6 text-center space-y-4">
          <Shield size={32} className="text-primary mx-auto" />
          <h2 className="font-semibold text-text-primary-dark">Admin Access</h2>
          <p className="text-sm text-text-secondary-dark">Connect with the admin wallet to access this panel.</p>
          <div className="space-y-2">
            {connectors.filter((c, i, a) => a.findIndex((x) => x.name === c.name) === i).map((c) => (
              <Button key={c.id} variant="secondary" className="w-full" onClick={() => connect({ connector: c })}>
                Connect with {c.name}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  if (address?.toLowerCase() !== ADMIN_WALLET_ADDRESS) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <Card className="w-full max-w-sm p-6 text-center space-y-3">
          <AlertTriangle size={32} className="text-reported mx-auto" />
          <h2 className="font-semibold text-text-primary-dark">Access Denied</h2>
          <p className="text-sm text-text-secondary-dark">This wallet does not have admin access.</p>
        </Card>
      </div>
    )
  }

  return <AdminPanel address={address} />
}

function AdminPanel({ address }: { address: string }) {
  const [tab, setTab] = useState<Tab>("pending")
  const [dapps, setDapps] = useState<AdminDapp[]>([])
  const [reports, setReports] = useState<AdminReport[]>([])
  const [loading, setLoading] = useState(true)

  const headers = { "x-wallet-address": address, "Content-Type": "application/json" }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [dRes, rRes] = await Promise.all([
        fetch("/api/admin/dapps", { headers }),
        fetch("/api/admin/reports", { headers }),
      ])
      const [dData, rData] = await Promise.all([dRes.json(), rRes.json()])
      setDapps(dData.dapps || [])
      setReports(rData.reports || [])
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => { fetchData() }, [fetchData])

  const patchDapp = async (id: string, data: Record<string, unknown>) => {
    await fetch("/api/admin/dapps", {
      method: "PATCH",
      headers,
      body: JSON.stringify({ id, ...data }),
    })
    fetchData()
  }

  const deleteDapp = async (id: string) => {
    if (!confirm("Delete this dapp permanently?")) return
    await fetch("/api/admin/dapps", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ id }),
    })
    fetchData()
  }

  const resolveReport = async (id: string) => {
    await fetch("/api/admin/reports", {
      method: "PATCH",
      headers,
      body: JSON.stringify({ id, resolved: true }),
    })
    fetchData()
  }

  const pending = dapps.filter((d) => !d.approved)
  const openReports = reports.filter((r) => !r.resolved)

  const tabs = [
    { id: "pending" as Tab, label: "Pending", count: pending.length },
    { id: "all" as Tab, label: "All dApps", count: dapps.length },
    { id: "reports" as Tab, label: "Reports", count: openReports.length },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-primary" />
        <h1 className="text-2xl font-bold text-text-primary-dark">Admin Panel</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-dark gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2",
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary-dark hover:text-text-primary-dark"
            )}
          >
            {t.label}
            {t.count > 0 && (
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                t.id === "reports" ? "bg-reported/20 text-reported" : "bg-primary/20 text-primary"
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? <PageLoading /> : (
        <>
          {/* Pending Tab */}
          {tab === "pending" && (
            pending.length === 0 ? (
              <EmptyState title="No pending submissions" icon={<CheckCircle size={40} />} />
            ) : (
              <div className="space-y-2">
                {pending.map((d) => (
                  <DappRow key={d.id} dapp={d} onApprove={() => patchDapp(d.id, { approved: true })} onReject={() => deleteDapp(d.id)} onPatch={patchDapp} />
                ))}
              </div>
            )
          )}

          {/* All dApps Tab */}
          {tab === "all" && (
            <div className="space-y-2">
              {dapps.map((d) => (
                <DappRow key={d.id} dapp={d} onApprove={() => patchDapp(d.id, { approved: true })} onReject={() => deleteDapp(d.id)} onPatch={patchDapp} />
              ))}
            </div>
          )}

          {/* Reports Tab */}
          {tab === "reports" && (
            reports.length === 0 ? (
              <EmptyState title="No reports" icon={<CheckCircle size={40} />} />
            ) : (
              <div className="space-y-2">
                {reports.map((r) => (
                  <Card key={r.id} className={cn(r.resolved && "opacity-60")}>
                    <CardContent className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary-dark">{r.dapp.name}</p>
                          <p className="text-sm text-text-secondary-dark">{r.reason}</p>
                          <p className="text-xs text-text-secondary-dark/60">{formatRelativeTime(r.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {r.resolved ? (
                            <Badge variant="verified">Resolved</Badge>
                          ) : (
                            <Button size="sm" onClick={() => resolveReport(r.id)}>
                              <Check size={13} /> Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}

function DappRow({ dapp, onApprove, onReject, onPatch }: {
  dapp: AdminDapp
  onApprove: () => void
  onReject: () => void
  onPatch: (id: string, data: Record<string, unknown>) => void
}) {
  const statusOpts = [
    { value: "verified", label: "Verified" },
    { value: "unverified", label: "Unverified" },
    { value: "reported", label: "Reported" },
  ]

  return (
    <Card className={cn(!dapp.approved && "border-secondary/20")}>
      <CardContent className="py-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-text-primary-dark text-sm">{dapp.name}</span>
              <StatusBadge status={dapp.status} />
              {!dapp.approved && <Badge variant="unverified">Pending</Badge>}
              {dapp.needsLinkRecheck && <Badge variant="default">Recheck</Badge>}
              {dapp.flaggedForReview && <Badge variant="default">Flagged</Badge>}
              {dapp._count.reports > 0 && <Badge variant="reported">{dapp._count.reports} reports</Badge>}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <a href={dapp.url} target="_blank" rel="noopener noreferrer" className="text-xs text-text-secondary-dark hover:text-primary truncate max-w-xs">{dapp.url}</a>
              {dapp.creatorHandle && <span className="text-xs text-text-secondary-dark">@{dapp.creatorHandle}</span>}
              <span className="text-xs text-text-secondary-dark">{CATEGORY_LABELS[dapp.category]}</span>
              <span className="text-xs text-text-secondary-dark">{dapp.clickCount} clicks</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <select
              value={dapp.status}
              onChange={(e) => onPatch(dapp.id, { status: e.target.value })}
              className="bg-surface-dark-2 border border-border-dark rounded-md px-2 py-1 text-xs text-text-primary-dark focus:outline-none focus:border-primary"
            >
              {statusOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              onClick={() => onPatch(dapp.id, { flaggedForReview: !dapp.flaggedForReview })}
              className={cn("text-xs px-2 py-1 rounded-md border transition-colors",
                dapp.flaggedForReview
                  ? "bg-secondary/15 border-secondary/30 text-secondary"
                  : "bg-surface-dark-2 border-border-dark text-text-secondary-dark hover:text-text-primary-dark"
              )}
            >
              {dapp.flaggedForReview ? "Unflag" : "Flag"}
            </button>
            {!dapp.approved && (
              <Button size="sm" onClick={onApprove}>
                <Check size={12} /> Approve
              </Button>
            )}
            {dapp.approved && (
              <Button size="sm" variant="secondary" onClick={() => onPatch(dapp.id, { approved: false })}>
                Unapprove
              </Button>
            )}
            <Button size="sm" variant="danger" onClick={onReject}>
              <X size={12} /> Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
