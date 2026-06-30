---
name: Wallet error handling
description: Graceful handling of EIP-1193 wallet authorization errors in WalletGate
---

**Problem:** Browser wallet extensions throw "not been authorized" errors when the Replit preview URL changes (new session) or the extension hasn't granted permission yet. These crashed the app with unhandled rejections.

**Solution:** `isAuthError()` helper in `WalletGate.tsx` catches:
- EIP-1193 code `4100` (unauthorized)
- EIP-1193 code `4001` (user rejected)
- Messages containing: "not been authorized", "not authorized", "unauthorized", "disconnected", "no provider"

When caught → set `reconnectNeeded = true` → render "Refresh Your Connection" UI with Reconnect button.

**Applies to:** `connect()`, `sendTransaction()`, `switchChain()` — all wrapped in try/catch.

**Why:** Extension errors come from chrome-extension:// scope and cannot be prevented in app code; must be caught and soft-failed.
