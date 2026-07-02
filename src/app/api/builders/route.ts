import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const dapps = await prisma.dapp.findMany({
    where: { approved: true, creatorHandle: { not: null } },
    select: { creatorHandle: true, clickCount: true, createdAt: true, name: true },
    orderBy: { createdAt: "desc" },
  })

  const byHandle = new Map<
    string,
    { totalDapps: number; totalClicks: number; latestDapp: string; latestDate: Date }
  >()

  for (const d of dapps) {
    const handle = (d.creatorHandle || "").replace(/^@/, "").trim()
    if (!handle) continue
    const existing = byHandle.get(handle)
    if (!existing) {
      byHandle.set(handle, {
        totalDapps: 1,
        totalClicks: d.clickCount,
        latestDapp: d.name,
        latestDate: d.createdAt,
      })
    } else {
      existing.totalDapps += 1
      existing.totalClicks += d.clickCount
      if (d.createdAt > existing.latestDate) {
        existing.latestDapp = d.name
        existing.latestDate = d.createdAt
      }
    }
  }

  const builders = Array.from(byHandle.entries()).map(([handle, v]) => ({
    handle,
    totalDapps: v.totalDapps,
    totalClicks: v.totalClicks,
    latestDapp: v.latestDapp,
    xUrl: `https://x.com/${handle}`,
  }))

  const sorted = builders
    .sort((a, b) => b.totalClicks - a.totalClicks || b.totalDapps - a.totalDapps)
    .slice(0, 100)

  return NextResponse.json({ builders: sorted, totalBuilders: builders.length })
}
