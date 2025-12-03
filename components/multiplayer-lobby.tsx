"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Copy, Check, AlertCircle } from "lucide-react"
import { useAccount, useSwitchChain } from "wagmi"
import { somniaTestnet } from "@/lib/wagmi-config"

interface MultiplayerLobbyProps {
  onJoinGame: (gameId: bigint) => void
  onCreateGame: () => void
  onBack?: () => void
  playerAddress: string
  createdGameId?: bigint
  isWaitingForOpponent?: boolean
  gridSize: number
  onGridSizeChange: (size: number) => void
  isJoining?: boolean
  isJoinPending?: boolean
}

export default function MultiplayerLobby({
  onJoinGame,
  onCreateGame,
  onBack,
  playerAddress,
  createdGameId,
  isWaitingForOpponent,
  gridSize,
  onGridSizeChange,
  isJoining,
  isJoinPending,
}: MultiplayerLobbyProps) {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create")
  const [gameIdInput, setGameIdInput] = useState("")
  const [copied, setCopied] = useState(false)
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()

  const isOnSomniaTestnet = chain?.id === somniaTestnet.id

  const handleSwitchNetwork = () => {
    switchChain({ chainId: somniaTestnet.id })
  }

  const handleCopyGameId = () => {
    if (createdGameId) {
      navigator.clipboard.writeText(createdGameId.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleJoinGame = () => {
    if (!gameIdInput) return
    try {
      const gameId = BigInt(gameIdInput)
      onJoinGame(gameId)
    } catch (error) {
      console.error("Invalid game ID:", error)
    }
  }

  // Show waiting screen for Player 2 (joining)
  if (isJoining && createdGameId !== undefined) {
    console.log('[MultiplayerLobby] Player 2 - Waiting for game to start')
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6">
        <motion.div
          className="text-center max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-6 border-4 border-purple-400 border-t-cyan-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <h2 className="text-3xl font-bold text-purple-300 mb-4">Joined Game #{createdGameId.toString()}!</h2>
          <p className="text-purple-400 text-lg mb-4">Waiting for game to start...</p>
          <p className="text-sm text-purple-500">The game will begin shortly</p>
        </motion.div>
      </div>
    )
  }

  // Show waiting screen for Player 1 (created game)
  if (isWaitingForOpponent && createdGameId !== undefined && !isJoining) {
    console.log('[MultiplayerLobby] Player 1 - Showing waiting screen. Game ID:', createdGameId)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6">
        <motion.div
          className="text-center max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-6 border-4 border-purple-400 border-t-cyan-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <h2 className="text-3xl font-bold text-purple-300 mb-4">Waiting for Player 2...</h2>

          <div className="bg-slate-800 border border-purple-500 rounded-lg p-6 mb-6">
            <p className="text-sm text-purple-400 mb-2">Share this Game ID:</p>
            <div className="bg-slate-900 border border-cyan-500/50 rounded-lg p-4 mb-4">
              <p className="text-5xl font-mono font-bold text-cyan-400">{createdGameId.toString()}</p>
            </div>
            <button
              onClick={handleCopyGameId}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Game ID
                </>
              )}
            </button>
            <p className="text-xs text-purple-400 mt-3">
              Player 2 should enter this ID in the "Join Game" tab
            </p>
          </div>

          <p className="text-purple-400 text-sm mb-2">Your wallet:</p>
          <p className="text-sm font-mono text-cyan-400">{playerAddress}</p>

          {onBack && (
            <button
              onClick={onBack}
              className="mt-6 text-purple-300 hover:text-white transition-colors text-sm"
            >
              Cancel and go back
            </button>
          )}
        </motion.div>
      </div>
    )
  }

  console.log('[MultiplayerLobby] Showing create/join tabs')
  console.log('[MultiplayerLobby] Current chain:', chain?.name, 'ID:', chain?.id)
  console.log('[MultiplayerLobby] Is on Somnia?', isOnSomniaTestnet)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 via-indigo-950 to-slate-950 p-6">
      <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Network Warning */}
        {!isOnSomniaTestnet && (
          <motion.div
            className="mb-6 bg-red-500/20 border-2 border-red-500 rounded-xl p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-red-300">Wrong Network!</h3>
            </div>
            <p className="text-red-200 mb-4">
              You're currently on <strong>{chain?.name || "Unknown Network"}</strong>. You must switch to <strong>Somnia Testnet</strong> to play multiplayer.
            </p>
            <button
              onClick={handleSwitchNetwork}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Switch to Somnia Testnet
            </button>
          </motion.div>
        )}

        {/* Back Button */}
        {onBack && (
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-all mb-8"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Mode Selection</span>
          </motion.button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            On-Chain Matches
          </h1>
          <p className="text-purple-300">Play with real players and earn rewards</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-purple-500">
          {["create", "join"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab as "create" | "join")}
              className={`px-6 py-3 font-bold capitalize transition-all ${
                activeTab === tab ? "text-cyan-400 border-b-2 border-cyan-400" : "text-purple-400 hover:text-purple-300"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {tab} Game
            </motion.button>
          ))}
        </div>

        {/* Create Game Tab */}
        {activeTab === "create" && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Create New Game</h3>

              {/* Grid Size Selector */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-300 mb-3">Select Grid Size</h4>
                <div className="grid grid-cols-4 gap-3">
                  {[3, 4, 5, 6].map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => onGridSizeChange(size)}
                      className={`py-3 px-4 rounded-lg font-bold transition-all ${
                        gridSize === size
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-2 border-cyan-300 shadow-lg shadow-cyan-500/50"
                          : "bg-slate-800/50 text-purple-300 border-2 border-purple-500/30 hover:border-purple-400"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-xl font-black">{size}×{size}</div>
                      <div className="text-xs mt-1">{(size-1)*(size-1)} boxes</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-purple-300 mb-2">Entry Fee</p>
                  <p className="text-2xl font-bold text-cyan-400">0.01 STT</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-purple-300 mb-2">Winner Prize</p>
                  <p className="text-2xl font-bold text-yellow-400">0.02 STT</p>
                </div>
              </div>

              <motion.button
                onClick={() => {
                  if (!isOnSomniaTestnet) {
                    alert('⚠️ Please switch to Somnia Testnet first!')
                    return
                  }
                  console.log('[Lobby] Create Game button clicked')
                  onCreateGame()
                }}
                disabled={!isOnSomniaTestnet}
                className={`w-full font-bold py-3 rounded-lg transition-all ${
                  isOnSomniaTestnet
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
                whileHover={isOnSomniaTestnet ? { scale: 1.02 } : {}}
                whileTap={isOnSomniaTestnet ? { scale: 0.98 } : {}}
              >
                Create Game & Wait for Opponent
              </motion.button>

              <p className="text-xs text-purple-400 mt-3 text-center">
                After creating, you'll get a Game ID to share with Player 2
              </p>

              <p className="text-xs text-yellow-400 mt-2 text-center">
                ⚠️ Make sure your wallet is connected to Somnia Testnet and has STT tokens
              </p>
            </div>
          </motion.div>
        )}

        {/* Join Game Tab */}
        {activeTab === "join" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Join Existing Game</h3>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-purple-300 mb-2">Entry Fee</p>
                  <p className="text-2xl font-bold text-cyan-400">0.01 STT</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-purple-300 mb-2">Winner Prize</p>
                  <p className="text-2xl font-bold text-yellow-400">0.02 STT</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">Enter Game ID</label>
                <div className="flex gap-2">
                  <Input
                    value={gameIdInput}
                    onChange={(e) => setGameIdInput(e.target.value)}
                    placeholder="Enter Game ID from Player 1"
                    className="bg-slate-800 border-purple-500 text-white placeholder-purple-500/50"
                    disabled={isJoinPending}
                  />
                  <Button
                    onClick={() => {
                      if (!isOnSomniaTestnet) {
                        alert('⚠️ Please switch to Somnia Testnet first!')
                        return
                      }
                      handleJoinGame()
                    }}
                    disabled={!gameIdInput || !isOnSomniaTestnet || isJoinPending}
                    className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                  >
                    {isJoinPending ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        Joining...
                      </div>
                    ) : (
                      "Join Game"
                    )}
                  </Button>
                </div>
                <p className="text-xs text-purple-400 mt-2">
                  {isJoinPending
                    ? "⏳ Please confirm the transaction in your wallet..."
                    : "Player 1 will share their Game ID with you"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Your Wallet Info */}
        <motion.div
          className="mt-8 p-4 bg-slate-800 border border-purple-500 rounded-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-purple-400">Connected Wallet</p>
          <p className="text-lg font-bold text-cyan-400">{playerAddress}</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
