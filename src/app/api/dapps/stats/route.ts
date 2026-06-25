import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [total, verified, reported, clicksToday] = await Promise.all([
    prisma.dapp.count({ where: { approved: true } }),
    prisma.dapp.count({ where: { approved: true, status: "verified" } }),
    prisma.dapp.count({ where: { approved: true, status: "reported" } }),
    prisma.clickLog.count({ where: { timestamp: { gte: todayStart } } }),
  ])

  return NextResponse.json({ total, verified, reported, clicksToday })
}
