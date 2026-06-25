import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dapp = await prisma.dapp.findUnique({ where: { id } })

  if (!dapp || !dapp.approved) {
    return NextResponse.redirect(new URL("/", _req.url))
  }

  // Increment clickCount and log
  await Promise.all([
    prisma.dapp.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    }),
    prisma.clickLog.create({
      data: { dappId: id },
    }),
  ])

  return NextResponse.redirect(dapp.url, 302)
}
