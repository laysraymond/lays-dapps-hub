import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const VALID_CATEGORIES = ["game", "tool", "identity", "finance", "quiz", "social", "other"]

export async function POST(req: NextRequest) {
  try {
    const { name, url, creatorHandle, category, description } = await req.json()

    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 })
    if (!url?.trim()) return NextResponse.json({ error: "URL is required" }, { status: 400 })
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    // Validate URL
    try {
      const u = new URL(url)
      if (u.protocol !== "https:") {
        return NextResponse.json({ error: "URL must start with https://" }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Check for duplicate URL (case-insensitive)
    const existing = await prisma.dapp.findFirst({
      where: { url: { equals: url.trim(), mode: "insensitive" } },
    })
    if (existing) {
      return NextResponse.json({ error: "This URL is already in the directory" }, { status: 400 })
    }

    if (description && description.length > 200) {
      return NextResponse.json({ error: "Description max 200 chars" }, { status: 400 })
    }

    const dapp = await prisma.dapp.create({
      data: {
        name: name.trim(),
        url: url.trim(),
        creatorHandle: creatorHandle?.trim() || null,
        category,
        description: description?.trim() || null,
        status: "unverified",
        approved: false,
        needsLinkRecheck: false,
      },
    })

    return NextResponse.json({ ok: true, id: dapp.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Submission failed" }, { status: 500 })
  }
}
