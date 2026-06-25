import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ADMIN_WALLET_ADDRESS } from "@/lib/chain"

function verifyAdmin(req: NextRequest) {
  const addr = req.headers.get("x-wallet-address")?.toLowerCase()
  return addr === ADMIN_WALLET_ADDRESS
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { dapp: { select: { name: true, url: true, status: true } } },
  })

  return NextResponse.json({ reports })
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { id, resolved } = await req.json()
  const report = await prisma.report.update({
    where: { id },
    data: { resolved },
  })

  return NextResponse.json({ report })
}
