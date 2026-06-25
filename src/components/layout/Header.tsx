"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/Button"
import { useAccess } from "@/providers/AccessContext"
import { useCallback, useState } from "react"
import { truncateAddress } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Menu, X, Globe, Github } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/submit", label: "Submit" },
  { href: "/proof-log", label: "Proof Log" },
  { href: "/about", label: "About" },
]

const officialLinks = [
  { href: "https://ritual.net", label: "Website", icon: Globe },
  { href: "https://x.com/ritualnet", label: "X", icon: XIcon },
  { href: "https://discord.com/invite/ritual-net", label: "Discord", icon: DiscordIcon },
  { href: "https://github.com/ritual-net", label: "GitHub", icon: Github },
]

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function DiscordIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.113 18.1.133 18.117a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export function Header() {
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { setHasPaid } = useAccess()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDisconnect = useCallback(async () => {
    await fetch("/api/session/clear", { method: "POST" })
    setHasPaid(false)
    disconnect()
  }, [disconnect, setHasPaid])

  return (
    <header className="sticky top-0 z-40 bg-bg-dark/80 backdrop-blur-md border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-7 h-7">
              <Image src="/logo.png" alt="Ritual" fill sizes="28px" className="object-contain" priority />
            </div>
            <span className="font-semibold text-text-primary-dark text-sm tracking-tight">Lays Dapps Hub</span>
            <span className="hidden sm:inline-block text-[10px] font-medium text-text-secondary-dark bg-surface-dark-2 border border-border-dark px-1.5 py-0.5 rounded-sm">
              Community Hub — unofficial
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  pathname === l.href
                    ? "text-text-primary-dark bg-surface-dark-2"
                    : "text-text-secondary-dark hover:text-text-primary-dark hover:bg-surface-dark-2"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Official links - desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {officialLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={l.label}
                  className="p-1.5 text-text-secondary-dark hover:text-text-primary-dark transition-colors rounded-md hover:bg-surface-dark-2"
                >
                  <l.icon size={15} />
                </a>
              ))}
            </div>

            {/* Wallet */}
            {isConnected && address ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-xs text-text-secondary-dark font-mono bg-surface-dark-2 border border-border-dark px-2 py-1 rounded-md">
                  {truncateAddress(address)}
                </span>
                <Button size="sm" variant="secondary" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => connectors[0] && connect({ connector: connectors[0] })}
              >
                Connect
              </Button>
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden p-1.5 text-text-secondary-dark hover:text-text-primary-dark"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border-dark py-3 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2 text-sm rounded-md transition-colors",
                  pathname === l.href
                    ? "text-text-primary-dark bg-surface-dark-2"
                    : "text-text-secondary-dark hover:text-text-primary-dark hover:bg-surface-dark-2"
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-3 px-3 pt-2 border-t border-border-dark mt-2">
              {officialLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary-dark hover:text-text-primary-dark transition-colors"
                >
                  <l.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
