import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function POST() {
  const session = await getSession()
  session.hasPaid = false
  session.sessionId = undefined
  session.address = undefined
  await session.save()
  return NextResponse.json({ ok: true })
}
