"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Wallet } from "lucide-react"
import { useAccount, useConnect, useDisconnect, useConnectors } from "wagmi"
import { useState } from "react"

export default function Navigation() {
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
    <>
      <nav className="flex items-center justify-between px-8 py-6 border-b border-indigo-900/30 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">⚡</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            BoxBattle
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-300 hover:text-white transition">
            Features
          </a>
          <a href="#how-to-play" className="text-slate-300 hover:text-white transition">
            How to Play
          </a>
          <a href="#stats" className="text-slate-300 hover:text-white transition">
            Leaderboard
          </a>
        </div>

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

          <Link href="/game">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
              Play Now
            </button>
          </Link>
        </div>
      </nav>

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
                const isInjected = connector.type === 'injected' || connector.id.includes('injected')
                let walletName = connector.name
                let walletDescription = 'Connect to your wallet'

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
    </>
  )
}
