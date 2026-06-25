import { defineChain } from "viem"

export const ritualChain = defineChain({
  id: 1979,
  name: "Ritual Chain",
  nativeCurrency: { name: "RITUAL", symbol: "RITUAL", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.ritualfoundation.org"] },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.ritualfoundation.org" },
  },
})

export const ADMIN_WALLET_ADDRESS = "0x620b04c69ba313d8cd841a5426646019881aa17c".toLowerCase()
export const FEE_RECEIVER_ADDRESS = "0x620b04c69ba313d8cd841a5426646019881aa17c"
export const ACCESS_FEE_AMOUNT = "0.001"
