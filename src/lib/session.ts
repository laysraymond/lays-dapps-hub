import { getIronSession, IronSession } from "iron-session"
import { cookies } from "next/headers"

export interface SessionData {
  sessionId?: string
  hasPaid?: boolean
  address?: string
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || "lays-dapps-hub-secret-key-change-in-prod-32chars",
  cookieName: "lays_dapps_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // No maxAge = true session cookie (cleared when browser closes)
  },
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}
