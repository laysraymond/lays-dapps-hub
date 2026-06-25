import { createConfig, http } from "wagmi"
import { ritualChain } from "./chain"

export const wagmiConfig = createConfig({
  chains: [ritualChain],
  transports: {
    [ritualChain.id]: http("https://rpc.ritualfoundation.org"),
  },
  ssr: true,
})
