import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "100")

  const where: Record<string, unknown> = { approved: true }
  if (category && category !== "all") where.category = category
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { creatorHandle: { contains: search, mode: "insensitive" } },
    ]
  }

  const [dapps, total] = await Promise.all([
    prisma.dapp.findMany({
      where,
      orderBy: { clickCount: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.dapp.count({ where }),
  ])

  return NextResponse.json({ dapps, total })
}
