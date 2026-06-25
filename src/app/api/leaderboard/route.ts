import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get("mode") || "alltime" // "alltime" | "weekly"

  if (mode === "weekly") {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)
    weekStart.setHours(0, 0, 0, 0)

    // Get click counts from ClickLog for the past week, grouped by dapp
    const weeklyClicks = await prisma.clickLog.groupBy({
      by: ["dappId"],
      where: { timestamp: { gte: weekStart } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 50,
    })

    const dappIds = weeklyClicks.map((c) => c.dappId)
    const dapps = await prisma.dapp.findMany({
      where: { id: { in: dappIds }, approved: true },
    })

    const dappMap = new Map(dapps.map((d) => [d.id, d]))
    const result = weeklyClicks
      .map((c) => {
        const dapp = dappMap.get(c.dappId)
        if (!dapp) return null
        return { ...dapp, weeklyClicks: c._count.id }
      })
      .filter(Boolean)

    return NextResponse.json({ dapps: result })
  }

  // All-time by clickCount
  const dapps = await prisma.dapp.findMany({
    where: { approved: true },
    orderBy: { clickCount: "desc" },
    take: 50,
  })

  return NextResponse.json({ dapps: dapps.map((d) => ({ ...d, weeklyClicks: null })) })
}
