"use client"

import { motion } from "framer-motion"
import { Volume2, Settings, Wallet } from "lucide-react"
import { useAccount, useConnect, useDisconnect, useConnectors } from "wagmi"
import { useState } from "react"

interface HeaderProps {
  timer: number
}

export default function Header({ timer }: HeaderProps) {
  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const connectors = useConnectors()
  const [showConnectModal, setShowConnectModal] = useState(false)

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId)
    if (connector) {
      connect({ connector })
      setShowConnectModal(false)
    }
  }

  return (
    <header className="border-b-2 border-purple-500/50 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 backdrop-blur-md py-4 px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
        >
          <img src="/boxbattle-logo.svg" alt="BoxBattle Logo" className="w-10 h-10" />
          <div className="text-3xl font-black">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              BOXBATTLE ⚡
            </span>
          </div>
        </motion.div>

        {/* Center: Prize Pool */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.08 }}
        >
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-400/50 border-2 border-yellow-300 animate-pulse-glow">
            <span className="text-white font-black text-sm">💎 0.02 STT Prize</span>
          </div>
        </motion.div>

        {/* Right: Wallet, Timer and Controls */}
        <div className="flex items-center gap-4">
          {/* Wallet Button */}
          {isConnected ? (
            <motion.button
              onClick={() => disconnect()}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400 font-mono text-sm text-green-300 font-bold flex items-center gap-2 hover:bg-green-500/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet size={16} />
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setShowConnectModal(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400 font-bold text-sm text-purple-300 flex items-center gap-2 hover:bg-purple-500/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet size={16} />
              Connect Wallet
            </motion.button>
          )}

          <motion.div
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400 font-mono text-sm text-cyan-300 font-bold"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {minutes}:{seconds.toString().padStart(2, "0")}
          </motion.div>
          <motion.button
            className="p-2 hover:bg-purple-500/30 rounded-lg transition-colors text-purple-300 hover:text-purple-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Volume2 size={20} />
          </motion.button>
          <motion.button
            className="p-2 hover:bg-purple-500/30 rounded-lg transition-colors text-purple-300 hover:text-purple-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={20} />
          </motion.button>
        </div>
      </div>

      {/* Connect Wallet Modal */}
      {showConnectModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowConnectModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-slate-900 to-purple-900 border-2 border-purple-500 rounded-2xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
            <p className="text-sm text-purple-300 mb-6">Choose how you want to connect</p>

            <div className="space-y-3">
              {connectors.map((connector) => {
                // Check if this is an injected provider (browser extension wallet)
                const isInjected = connector.type === 'injected' || connector.id.includes('injected')

                // Get wallet name from connector
                let walletName = connector.name
                let walletDescription = 'Connect to your wallet'

                // Special handling for common injected wallets
                if (isInjected) {
                  if (walletName.toLowerCase().includes('metamask')) {
                    walletDescription = 'MetaMask browser extension'
                  } else if (walletName.toLowerCase().includes('zerion')) {
                    walletDescription = 'Zerion browser extension'
                  } else if (walletName.toLowerCase().includes('rabby')) {
                    walletDescription = 'Rabby browser extension'
                  } else if (walletName.toLowerCase().includes('rainbow')) {
                    walletDescription = 'Rainbow browser extension'
                  } else if (walletName.toLowerCase().includes('coinbase')) {
                    walletDescription = 'Coinbase Wallet extension'
                  } else {
                    walletDescription = 'Browser extension wallet'
                  }
                }

                return (
                  <motion.button
                    key={connector.id}
                    onClick={() => handleConnect(connector.id)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400 rounded-lg text-left hover:bg-purple-500/30 hover:border-purple-300 transition-all group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Wallet size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold text-lg">{walletName}</p>
                        <p className="text-xs text-purple-300">{walletDescription}</p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Supported wallets note */}
            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">Supported Browser Wallets:</p>
              <div className="flex flex-wrap gap-2">
                {["MetaMask", "Rabby", "Zerion", "Rainbow", "Coinbase", "Trust"].map((wallet) => (
                  <span key={wallet} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                    {wallet}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowConnectModal(false)}
              className="w-full mt-4 px-6 py-3 border border-slate-600 rounded-lg text-slate-400 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </header>
  )
}
