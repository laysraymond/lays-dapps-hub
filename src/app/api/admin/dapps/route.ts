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

  const dapps = await prisma.dapp.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { reports: { where: { resolved: false } } } } },
  })

  return NextResponse.json({ dapps })
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { id, ...data } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const dapp = await prisma.dapp.update({
    where: { id },
    data,
  })

  return NextResponse.json({ dapp })
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.dapp.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
