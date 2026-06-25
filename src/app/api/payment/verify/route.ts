import { NextRequest, NextResponse } from "next/server"
import { createPublicClient, http, parseEther } from "viem"
import { ritualChain, FEE_RECEIVER_ADDRESS } from "@/lib/chain"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

const publicClient = createPublicClient({
  chain: ritualChain,
  transport: http("https://rpc.ritualfoundation.org"),
})

export async function POST(req: NextRequest) {
  try {
    const { txHash, address } = await req.json()

    if (!txHash || !address) {
      return NextResponse.json({ ok: false, error: "Missing txHash or address" }, { status: 400 })
    }

    // Fetch and verify the transaction on-chain
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash })

    if (!receipt || receipt.status !== "success") {
      return NextResponse.json({ ok: false, error: "Transaction not confirmed" }, { status: 400 })
    }

    // Get transaction details to check value
    const tx = await publicClient.getTransaction({ hash: txHash })

    const toAddress = tx.to?.toLowerCase()
    const expectedReceiver = FEE_RECEIVER_ADDRESS.toLowerCase()

    if (toAddress !== expectedReceiver) {
      return NextResponse.json({ ok: false, error: "Invalid recipient" }, { status: 400 })
    }

    const requiredValue = parseEther("0.001")
    if (tx.value < requiredValue) {
      return NextResponse.json({ ok: false, error: "Insufficient payment amount" }, { status: 400 })
    }

    // Set session
    const session = await getSession()
    const sessionId = randomUUID()
    session.hasPaid = true
    session.sessionId = sessionId
    session.address = address.toLowerCase()
    await session.save()

    // Log payment (fire and forget)
    await prisma.paidAccess.create({
      data: {
        address: address.toLowerCase(),
        txHash,
        sessionId,
      },
    }).catch(() => {})

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Payment verify error:", err)
    return NextResponse.json({ ok: false, error: "Verification failed" }, { status: 500 })
  }
}
