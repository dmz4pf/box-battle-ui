/**
 * Environment configuration with validation
 * This file centralizes all environment variables and provides safe defaults
 */

export const ENV = {
  // Smart Contract Address
  GAME_CONTRACT_ADDRESS: (process.env.NEXT_PUBLIC_GAME_CONTRACT || '0xDB3CB1af42f41d91e06DeABA286b0918A3422dFe') as `0x${string}`,

  // WebSocket URL - auto-detect based on environment
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || (
    typeof window !== 'undefined'
      ? window.location.hostname === 'localhost'
        ? 'ws://localhost:8080'
        : 'wss://box-battle-ui-production.up.railway.app'
      : 'ws://localhost:8080'
  ),

  // Network Configuration
  CHAIN_ID: 50312, // Somnia Testnet
  RPC_URL: 'https://dream-rpc.somnia.network',

  // Feature Flags
  ENABLE_SOUND: true,
  ENABLE_ANALYTICS: false,
} as const

// Log configuration on startup (client-side only)
if (typeof window !== 'undefined') {
  console.log('[ENV] Configuration loaded:', {
    contractAddress: ENV.GAME_CONTRACT_ADDRESS,
    wsUrl: ENV.WS_URL,
    chainId: ENV.CHAIN_ID,
  })
}
