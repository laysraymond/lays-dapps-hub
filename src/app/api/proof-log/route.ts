import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = 20

  const logs = await prisma.clickLog.findMany({
    orderBy: { timestamp: "desc" },
    take: Math.min(limit, 200),
    skip: (page - 1) * limit,
    include: { dapp: { select: { name: true, approved: true } } },
  })

  const total = await prisma.clickLog.count()

  return NextResponse.json({ logs, total })
}
