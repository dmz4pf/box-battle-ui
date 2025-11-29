"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wallet } from "lucide-react"
import Link from "next/link"
import { useAccount, useConnect, useDisconnect, useConnectors } from "wagmi"

interface GameModeSelectorProps {
  onSelectMode: (mode: "ai" | "multiplayer") => void
  gridSize?: number
  onGridSizeChange?: (size: number) => void
}

export default function GameModeSelector({ onSelectMode, gridSize, onGridSizeChange }: GameModeSelectorProps) {
  const [hoveredMode, setHoveredMode] = useState<"ai" | "multiplayer" | null>(null)
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const connectors = useConnectors()
  const [showConnectModal, setShowConnectModal] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId)
    if (connector) {
      connect({ connector })
      setShowConnectModal(false)
    }
  }

  if (!mounted) return null

  const modes = [
    {
      id: "ai",
      title: "Play vs AI",
      description: "Challenge our intelligent computer opponent",
      icon: "🤖",
      color: "from-cyan-500 to-blue-600",
      accent: "cyan",
    },
    {
      id: "multiplayer" as const,
      title: "Play On-Chain",
      description: "Compete with another player on the blockchain",
      icon: "⛓️",
      color: "from-purple-500 to-pink-600",
      accent: "purple",
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 via-indigo-950 to-slate-950 p-6">
        {/* Top Bar with Back Button and Connect Wallet */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <motion.button
              className="flex items-center gap-2 text-purple-300 hover:text-white transition-all"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              <span className="font-semibold">Back to Home</span>
            </motion.button>
          </Link>

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
        </div>

      <div className="flex items-center justify-center">
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="text-center mb-16">
          <motion.h1
            className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            BOXBATTLE
          </motion.h1>
          <motion.p
            className="text-lg text-purple-300 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Choose Your Opponent
          </motion.p>
        </div>



        {/* Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, x: mode.id === "ai" ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              onMouseEnter={() => setHoveredMode(mode.id as "ai" | "multiplayer")}
              onMouseLeave={() => setHoveredMode(null)}
            >
              <motion.div
                className={`relative overflow-hidden rounded-2xl p-8 cursor-pointer h-full`}
                style={{
                  background: `linear-gradient(135deg, rgba(${mode.id === "ai" ? "0, 217, 255" : "168, 85, 247"}, 0.1) 0%, rgba(${mode.id === "ai" ? "59, 130, 246" : "236, 72, 153"}, 0.1) 100%)`,
                  border: `2px solid rgba(${mode.id === "ai" ? "0, 217, 255" : "168, 85, 247"}, ${hoveredMode === mode.id ? 0.6 : 0.3})`,
                }}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Animated background glow */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${mode.color} opacity-0 blur-2xl`}
                  animate={{
                    opacity: hoveredMode === mode.id ? 0.2 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ zIndex: -1 }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className="text-6xl mb-4 text-center"
                    animate={{
                      scale: hoveredMode === mode.id ? 1.2 : 1,
                      rotate: hoveredMode === mode.id ? 5 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {mode.icon}
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-white mb-2 text-center">{mode.title}</h2>

                  {/* Description */}
                  <p className="text-purple-300 text-center text-sm mb-6">{mode.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-8 text-xs text-purple-200">
                    {mode.id === "ai" && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400">✓</span> Adjustable difficulty
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400">✓</span> Learn and improve
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400">✓</span> Play anytime
                        </div>
                      </>
                    )}
                    {mode.id === "multiplayer" && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400">✓</span> Real player matches
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400">✓</span> On-chain records
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400">✓</span> Earn rewards
                        </div>
                      </>
                    )}
                  </div>

                  {/* Button */}
                  <Button
                    onClick={() => onSelectMode(mode.id as "ai" | "multiplayer")}
                    className={`w-full font-bold py-2 rounded-lg transition-all ${
                      mode.id === "ai"
                        ? "bg-cyan-500 hover:bg-cyan-600 text-black"
                        : "bg-purple-500 hover:bg-purple-600 text-white"
                    }`}
                  >
                    {mode.id === "ai" ? "Challenge AI" : "Find Player"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

          {/* Footer note */}
          <motion.p
            className="text-center mt-12 text-purple-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Both modes support cross-platform play and blockchain verification
          </motion.p>
        </motion.div>
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
