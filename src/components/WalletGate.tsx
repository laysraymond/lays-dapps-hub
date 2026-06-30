"use client"

import { useAccount, useConnect, useDisconnect, useSwitchChain, useSendTransaction, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { ritualChain, FEE_RECEIVER_ADDRESS } from "@/lib/chain"
import { Button } from "./ui/Button"
import { useAccess } from "@/providers/AccessContext"
import { useCallback, useEffect, useState } from "react"
import { LoadingSpinner } from "./ui/LoadingSpinner"
import { Wallet, AlertCircle, CheckCircle, RefreshCw, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

function isAuthError(err: unknown): boolean {
  if (!err) return false
  const msg = (err as Error)?.message?.toLowerCase() ?? ""
  const code = (err as { code?: number })?.code
  return (
    code === 4100 ||
    code === 4001 ||
    msg.includes("not been authorized") ||
    msg.includes("not authorized") ||
    msg.includes("unauthorized") ||
    msg.includes("disconnected") ||
    msg.includes("no provider")
  )
}

function GateCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div
        className={cn(
          "w-full max-w-sm bg-surface-dark border border-border-dark rounded-2xl shadow-xl overflow-hidden",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function WalletGate({ children }: { children: React.ReactNode }) {
  const { address, isConnected, chain } = useAccount()
  const { connectors, connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { hasPaid, setHasPaid, checkAccess } = useAccess()
  const [checked, setChecked] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [txError, setTxError] = useState("")
  const [reconnectNeeded, setReconnectNeeded] = useState(false)

  const { sendTransaction, data: txHash, isPending: isSending, error: sendError } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (!isConnected) { setChecked(true); return }
    checkAccess().then(() => setChecked(true)).catch(() => setChecked(true))
  }, [isConnected, checkAccess])

  useEffect(() => {
    if (!isConfirmed || !txHash || !address) return
    setVerifying(true)
    setTxError("")
    fetch("/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txHash, address }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.ok) setHasPaid(true); else setTxError(d.error || "Verification failed. Try again.") })
      .catch(() => setTxError("Network error during verification."))
      .finally(() => setVerifying(false))
  }, [isConfirmed, txHash, address, setHasPaid])

  useEffect(() => {
    if (sendError && isAuthError(sendError)) {
      setReconnectNeeded(true)
    }
  }, [sendError])

  const handlePay = useCallback(() => {
    setTxError("")
    setReconnectNeeded(false)
    try {
      sendTransaction({ to: FEE_RECEIVER_ADDRESS as `0x${string}`, value: parseEther("0.001") })
    } catch (err) {
      if (isAuthError(err)) setReconnectNeeded(true)
      else setTxError("Transaction failed. Please try again.")
    }
  }, [sendTransaction])

  const handleConnect = useCallback((connectorIndex = 0) => {
    setReconnectNeeded(false)
    try {
      if (connectors[connectorIndex]) connect({ connector: connectors[connectorIndex] })
    } catch (err) {
      if (isAuthError(err)) setReconnectNeeded(true)
    }
  }, [connectors, connect])

  const handleSwitchChain = useCallback(() => {
    try {
      switchChain({ chainId: ritualChain.id })
    } catch (err) {
      if (isAuthError(err)) setReconnectNeeded(true)
    }
  }, [switchChain])

  const handleDisconnect = useCallback(async () => {
    try { await fetch("/api/session/clear", { method: "POST" }) } catch {}
    setHasPaid(false)
    setReconnectNeeded(false)
    disconnect()
  }, [disconnect, setHasPaid])

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Reconnect needed overlay
  if (reconnectNeeded) {
    return (
      <GateCard>
        <div className="p-6 space-y-5 text-center">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-unverified/10 border border-unverified/20 flex items-center justify-center">
              <RefreshCw className="text-unverified" size={24} />
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary-dark mb-1">Refresh Your Connection</h2>
            <p className="text-sm text-text-secondary-dark leading-relaxed">
              Your wallet connection needs to be refreshed — please reconnect to continue.
            </p>
          </div>
          <Button className="w-full gap-2" onClick={() => { handleDisconnect(); }}>
            <RefreshCw size={14} />
            Reconnect Wallet
          </Button>
          <button className="text-xs text-text-muted-dark hover:text-text-secondary-dark transition-colors" onClick={() => setReconnectNeeded(false)}>
            Dismiss
          </button>
        </div>
      </GateCard>
    )
  }

  // Step 1: Not connected
  if (!isConnected) {
    const uniqueConnectors = connectors.filter((c, i, arr) => arr.findIndex((x) => x.name === c.name) === i)

    return (
      <GateCard>
        <div className="p-1">
          {/* Emerald top accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-6" />
          <div className="px-5 pb-6 space-y-5 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Wallet className="text-primary" size={28} />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary-dark mb-1.5">Connect Your Wallet</h2>
              <p className="text-sm text-text-secondary-dark leading-relaxed">
                Connect to access the Lays Dapps Hub directory.
              </p>
            </div>
            <div className="space-y-2">
              {uniqueConnectors.length > 0 ? (
                uniqueConnectors.map((connector, i) => (
                  <Button
                    key={connector.id}
                    variant="secondary"
                    className="w-full gap-2"
                    loading={isConnecting}
                    onClick={() => handleConnect(i)}
                  >
                    {uniqueConnectors.length === 1 ? "Connect Wallet" : `Connect ${connector.name}`}
                    <ArrowRight size={13} className="ml-auto opacity-50" />
                  </Button>
                ))
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-text-muted-dark pb-1">No wallet detected. Install one to continue:</p>
                  {[
                    { name: "MetaMask", url: "https://metamask.io/download" },
                    { name: "OKX Wallet", url: "https://www.okx.com/web3" },
                    { name: "Rabby", url: "https://rabby.io" },
                  ].map((w) => (
                    <a
                      key={w.name}
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium bg-surface-dark-2 border border-border-dark rounded-lg text-text-secondary-dark hover:text-text-primary-dark hover:border-primary/30 transition-all"
                    >
                      Install {w.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </GateCard>
    )
  }

  // Step 2: Wrong chain
  if (chain?.id !== ritualChain.id) {
    return (
      <GateCard>
        <div className="p-1">
          <div className="h-px bg-gradient-to-r from-transparent via-unverified/40 to-transparent mb-6" />
          <div className="px-5 pb-6 space-y-5 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-unverified/10 border border-unverified/20 flex items-center justify-center">
                <AlertCircle className="text-unverified" size={28} />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary-dark mb-1.5">Switch Network</h2>
              <p className="text-sm text-text-secondary-dark leading-relaxed">
                This app requires the <span className="text-text-primary-dark font-medium">Ritual Chain</span> testnet network.
              </p>
            </div>
            <Button className="w-full" onClick={handleSwitchChain}>
              Switch to Ritual Chain
            </Button>
            <button className="text-xs text-text-muted-dark hover:text-text-secondary-dark transition-colors" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        </div>
      </GateCard>
    )
  }

  // Step 3: Need to pay
  if (!hasPaid) {
    const isBusy = isSending || isConfirming || verifying

    return (
      <GateCard>
        <div className="p-1">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-6" />
          <div className="px-5 pb-6 space-y-5">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <CheckCircle className="text-primary" size={28} />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-text-primary-dark mb-1.5">Session Access Fee</h2>
              <p className="text-sm text-text-secondary-dark leading-relaxed">
                A one-time <span className="text-text-primary-dark font-semibold">0.001 RITUAL</span> testnet fee per session — anti-spam + supports the directory. No real monetary value.
              </p>
            </div>

            {isBusy && (
              <div className="flex items-center gap-2.5 text-sm text-text-secondary-dark bg-surface-dark-2 border border-border-dark rounded-lg p-3">
                <LoadingSpinner size="sm" />
                <span>
                  {isSending && "Waiting for wallet…"}
                  {isConfirming && "Confirming on-chain…"}
                  {verifying && "Verifying payment…"}
                </span>
              </div>
            )}

            {txError && (
              <div className="text-sm text-reported bg-reported/10 border border-reported/20 rounded-lg p-3 flex gap-2 items-start">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                {txError}
              </div>
            )}

            {sendError && !isAuthError(sendError) && (
              <div className="text-sm text-reported/80 bg-reported/8 border border-reported/15 rounded-lg p-3">
                {sendError.message.slice(0, 120)}
              </div>
            )}

            <Button className="w-full" onClick={handlePay} loading={isBusy} disabled={isBusy}>
              Pay 0.001 RITUAL
            </Button>
            <button className="w-full text-xs text-text-muted-dark hover:text-text-secondary-dark transition-colors text-center" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        </div>
      </GateCard>
    )
  }

  return <>{children}</>
}
