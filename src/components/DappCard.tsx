"use client"

import { StatusBadge, Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import { Card } from "./ui/Card"
import { ExternalLink, Flag, BarChart2 } from "lucide-react"
import { CATEGORY_LABELS } from "@/lib/utils"
import { useState } from "react"
import { Modal } from "./ui/Modal"
import { Textarea } from "./ui/Input"

interface DappCardProps {
  id: string
  name: string
  url: string
  creatorHandle?: string | null
  category: string
  description?: string | null
  status: "verified" | "unverified" | "reported"
  clickCount: number
  rank?: number
}

export function DappCard({ id, name, creatorHandle, category, description, status, clickCount, rank }: DappCardProps) {
  const [reportOpen, setReportOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [reporting, setReporting] = useState(false)
  const [reported, setReported] = useState(false)

  const handleReport = async () => {
    if (!reason.trim()) return
    setReporting(true)
    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dappId: id, reason }),
    })
    setReporting(false)
    setReported(true)
    setTimeout(() => setReportOpen(false), 1500)
  }

  return (
    <>
      <Card className="flex flex-col h-full">
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0">
              {rank && (
                <span className="text-xs font-mono text-text-secondary-dark/60 mt-0.5 w-5 shrink-0">#{rank}</span>
              )}
              <div className="min-w-0">
                <h3 className="font-semibold text-text-primary-dark text-sm leading-snug truncate">{name}</h3>
                {creatorHandle && (
                  <p className="text-xs text-text-secondary-dark mt-0.5">@{creatorHandle}</p>
                )}
              </div>
            </div>
            <StatusBadge status={status} />
          </div>

          {description && (
            <p className="text-xs text-text-secondary-dark leading-relaxed line-clamp-2">{description}</p>
          )}

          <div className="flex items-center gap-2 mt-auto">
            <Badge variant="category">{CATEGORY_LABELS[category] || category}</Badge>
            <span className="flex items-center gap-1 text-xs text-text-secondary-dark ml-auto">
              <BarChart2 size={11} />
              {clickCount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="px-4 pb-4 flex items-center gap-2">
          <a
            href={`/go/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button size="sm" className="w-full gap-1.5">
              <ExternalLink size={13} />
              Visit
            </Button>
          </a>
          <button
            onClick={() => setReportOpen(true)}
            title="Report this dapp"
            className="p-1.5 text-text-secondary-dark hover:text-reported transition-colors rounded-md hover:bg-reported/10"
          >
            <Flag size={14} />
          </button>
        </div>
      </Card>

      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title={`Report: ${name}`}>
        {reported ? (
          <p className="text-sm text-verified text-center py-2">Report submitted. Thank you.</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary-dark">Describe the issue with this dapp.</p>
            <Textarea
              placeholder="e.g. broken link, suspicious content, phishing…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
            <Button className="w-full" onClick={handleReport} loading={reporting} disabled={!reason.trim()}>
              Submit Report
            </Button>
          </div>
        )}
      </Modal>
    </>
  )
}
