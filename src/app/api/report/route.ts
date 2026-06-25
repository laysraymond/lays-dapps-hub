import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { dappId, reason } = await req.json()
    if (!dappId || !reason?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const dapp = await prisma.dapp.findUnique({ where: { id: dappId } })
    if (!dapp) return NextResponse.json({ error: "Dapp not found" }, { status: 404 })

    await prisma.report.create({
      data: { dappId, reason: reason.trim() },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
