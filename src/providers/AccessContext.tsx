"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

interface AccessContextValue {
  hasPaid: boolean
  setHasPaid: (v: boolean) => void
  checkAccess: () => Promise<boolean>
}

const AccessContext = createContext<AccessContextValue>({
  hasPaid: false,
  setHasPaid: () => {},
  checkAccess: async () => false,
})

export function AccessProvider({ children }: { children: ReactNode }) {
  const [hasPaid, setHasPaid] = useState(false)

  const checkAccess = useCallback(async () => {
    try {
      const res = await fetch("/api/session/check")
      const data = await res.json()
      const paid = !!data.hasPaid
      setHasPaid(paid)
      return paid
    } catch {
      return false
    }
  }, [])

  return (
    <AccessContext.Provider value={{ hasPaid, setHasPaid, checkAccess }}>
      {children}
    </AccessContext.Provider>
  )
}

export const useAccess = () => useContext(AccessContext)
