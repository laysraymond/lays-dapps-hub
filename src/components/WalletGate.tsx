"use client"

import { useAccount, useConnect, useDisconnect, useSwitchChain, useSendTransaction, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { ritualChain, FEE_RECEIVER_ADDRESS } from "@/lib/chain"
import { Button } from "./ui/Button"
import { Card } from "./ui/Card"
import { useAccess } from "@/providers/AccessContext"
import { useCallback, useEffect, useState } from "react"
import { LoadingSpinner } from "./ui/LoadingSpinner"
import { Wallet, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"

export function WalletGate({ children }: { children: React.ReactNode }) {
  const { address, isConnected, chain } = useAccount()
  const { connectors, connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { hasPaid, setHasPaid, checkAccess } = useAccess()
  const [checked, setChecked] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [txError, setTxError] = useState("")

  const {
    sendTransaction,
    data: txHash,
    isPending: isSending,
    error: sendError,
  } = useSendTransaction()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  // Check session on mount & when connection changes
  useEffect(() => {
    if (!isConnected) {
      setChecked(true)
      return
    }
    checkAccess().then(() => setChecked(true))
  }, [isConnected, checkAccess])

  // After tx confirmed, verify on-chain server-side
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
      .then((d) => {
        if (d.ok) {
          setHasPaid(true)
        } else {
          setTxError(d.error || "Verification failed. Please try again.")
        }
      })
      .catch(() => setTxError("Network error during verification."))
      .finally(() => setVerifying(false))
  }, [isConfirmed, txHash, address, setHasPaid])

  const handlePay = useCallback(() => {
    setTxError("")
    sendTransaction({
      to: FEE_RECEIVER_ADDRESS as `0x${string}`,
      value: parseEther("0.001"),
    })
  }, [sendTransaction])

  const handleDisconnect = useCallback(async () => {
    await fetch("/api/session/clear", { method: "POST" })
    setHasPaid(false)
    disconnect()
  }, [disconnect, setHasPaid])

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Step 1: not connected
  if (!isConnected) {
    const detected = connectors.filter((c) => c.type === "injected" || c.id !== "injected")
    const uniqueConnectors = connectors.filter(
      (c, i, arr) => arr.findIndex((x) => x.name === c.name) === i
    )

    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <Card className="w-full max-w-sm p-6 text-center space-y-5">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
              <Wallet className="text-primary" size={28} />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary-dark mb-1">Connect Your Wallet</h2>
            <p className="text-sm text-text-secondary-dark">
              Connect to access the Lays Dapps Hub directory.
            </p>
          </div>
          <div className="space-y-2">
            {uniqueConnectors.length > 0 ? (
              uniqueConnectors.map((connector) => (
                <Button
                  key={connector.id}
                  variant="secondary"
                  className="w-full"
                  loading={isConnecting}
                  onClick={() => connect({ connector })}
                >
                  {uniqueConnectors.length === 1 ? "Connect Wallet" : `Connect with ${connector.name}`}
                </Button>
              ))
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-text-secondary-dark">No wallet detected. Install one to continue:</p>
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
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium bg-surface-dark-2 border border-border-dark rounded-md text-text-secondary-dark hover:text-text-primary-dark hover:border-primary/40 transition-colors"
                  >
                    <ExternalLink size={14} />
                    Install {w.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    )
  }

  // Step 2: wrong chain
  if (chain?.id !== ritualChain.id) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <Card className="w-full max-w-sm p-6 text-center space-y-5">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-secondary/15 flex items-center justify-center">
              <AlertCircle className="text-secondary" size={28} />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary-dark mb-1">Switch Network</h2>
            <p className="text-sm text-text-secondary-dark">
              This app requires the Ritual Chain (testnet) network.
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => switchChain({ chainId: ritualChain.id })}
          >
            Switch to Ritual Chain
          </Button>
          <button
            className="text-xs text-text-secondary-dark hover:text-text-primary-dark transition-colors"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        </Card>
      </div>
    )
  }

  // Step 3: need to pay
  if (!hasPaid) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <Card className="w-full max-w-sm p-6 space-y-5">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
              <CheckCircle className="text-primary" size={28} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-text-primary-dark mb-1">Session Access Fee</h2>
            <p className="text-sm text-text-secondary-dark leading-relaxed">
              This session requires a <span className="text-text-primary-dark font-medium">0.001 RITUAL</span> access fee (testnet token, no real monetary value) — this is an anti-spam step that also helps support ongoing updates to the dapp directory. You&apos;ll need to pay again next time you visit or reconnect.
            </p>
          </div>

          {(isSending || isConfirming || verifying) && (
            <div className="flex items-center gap-2 text-sm text-text-secondary-dark bg-surface-dark-2 rounded-md p-3">
              <LoadingSpinner size="sm" />
              {isSending && "Waiting for wallet confirmation…"}
              {isConfirming && "Confirming on-chain…"}
              {verifying && "Verifying payment…"}
            </div>
          )}

          {txError && (
            <div className="text-sm text-reported bg-reported/10 border border-reported/20 rounded-md p-3 flex gap-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {txError}
            </div>
          )}

          {sendError && (
            <div className="text-sm text-reported bg-reported/10 border border-reported/20 rounded-md p-3">
              {sendError.message.slice(0, 100)}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handlePay}
            loading={isSending || isConfirming || verifying}
            disabled={isSending || isConfirming || verifying}
          >
            Pay 0.001 RITUAL
          </Button>
          <button
            className="w-full text-xs text-text-secondary-dark hover:text-text-primary-dark transition-colors"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
