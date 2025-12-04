import { http, createConfig } from 'wagmi'
import { defineChain } from 'viem'
import { injected, walletConnect, coinbaseWallet, metaMask } from 'wagmi/connectors'

// Define Somnia Testnet chain
export const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://shannon-explorer.somnia.network',
    },
  },
  testnet: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

// Create connectors array
const connectors = [
  injected({
    target: 'metaMask',
  }),
  injected({
    target() {
      return {
        id: 'zerion',
        name: 'Zerion',
        provider: typeof window !== 'undefined' && (window as any).ethereum?.isZerion
          ? (window as any).ethereum
          : undefined,
      }
    },
  }),
  injected({
    target() {
      return {
        id: 'rabby',
        name: 'Rabby Wallet',
        provider: typeof window !== 'undefined' && (window as any).ethereum?.isRabby
          ? (window as any).ethereum
          : undefined,
      }
    },
  }),
  injected({
    target() {
      return {
        id: 'trust',
        name: 'Trust Wallet',
        provider: typeof window !== 'undefined' && (window as any).ethereum?.isTrust
          ? (window as any).ethereum
          : undefined,
      }
    },
  }),
  injected({
    target() {
      return {
        id: 'rainbow',
        name: 'Rainbow',
        provider: typeof window !== 'undefined' && (window as any).ethereum?.isRainbow
          ? (window as any).ethereum
          : undefined,
      }
    },
  }),
  coinbaseWallet({
    appName: 'BoxBattle',
  }),
  injected({
    target() {
      return {
        id: 'injected',
        name: 'Browser Wallet',
        provider: typeof window !== 'undefined' ? (window as any).ethereum : undefined,
      }
    },
  }),
]

// Add WalletConnect if we have a project ID
const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
if (wcProjectId && wcProjectId !== 'YOUR_PROJECT_ID') {
  connectors.splice(1, 0, walletConnect({
    projectId: wcProjectId,
    showQrModal: true,
    metadata: {
      name: 'BoxBattle',
      description: 'The Ultimate Web3 Strategy Game',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://boxbattle.app',
      icons: ['https://boxbattle.app/icon.png']
    }
  }))
}

export const config = createConfig({
  chains: [somniaTestnet],
  connectors,
  transports: {
    [somniaTestnet.id]: http('https://dream-rpc.somnia.network', {
      timeout: 60000, // 60 second timeout (Somnia RPC can be slow)
      retryCount: 5,   // More retries
      retryDelay: 2000, // Wait 2s between retries
    }),
  },
})

export const GAME_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_GAME_CONTRACT || '0xDB3CB1af42f41d91e06DeABA286b0918A3422dFe') as `0x${string}`
