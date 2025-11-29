"use client"

import { motion } from "framer-motion"

interface WinnerOverlayProps {
  winner: "player1" | "player2"
  scores: { player1: number; player2: number }
  onPlayAgain: () => void
  isPlayerOne: boolean
  player1Name?: string
  player2Name?: string
  gameMode: "ai" | "multiplayer"
}

export default function WinnerOverlay({
  winner,
  scores,
  onPlayAgain,
  isPlayerOne,
  player1Name = "Player 1",
  player2Name = "Player 2",
  gameMode
}: WinnerOverlayProps) {
  const didWin = (isPlayerOne && winner === "player1") || (!isPlayerOne && winner === "player2")
  const winnerName = winner === "player1" ? player1Name : player2Name
  const myScore = isPlayerOne ? scores.player1 : scores.player2
  const opponentScore = isPlayerOne ? scores.player2 : scores.player1

  const bgGradient = didWin ? "from-green-600 to-emerald-800" : "from-red-600 to-red-800"
  const glowColor = didWin ? "shadow-green-500/50" : "shadow-red-500/50"

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={`text-center p-12 rounded-3xl bg-gradient-to-br ${bgGradient} border-2 ${glowColor} border-opacity-30 ${glowColor} max-w-md shadow-2xl`}
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {/* Confetti effect for winner */}
        {didWin && Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${Math.random() > 0.5 ? "bg-yellow-300" : "bg-white"}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
            }}
          />
        ))}

        <motion.h2
          className="text-5xl font-black text-white mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
        >
          {didWin ? "🎉 YOU WON! 🎉" : "💔 YOU LOST 💔"}
        </motion.h2>

        <p className="text-white/90 text-xl mb-6 font-bold">
          {didWin
            ? `You defeated ${gameMode === "ai" ? "the AI" : winnerName}!`
            : `${gameMode === "ai" ? "AI" : winnerName} won this round!`
          }
        </p>

        <div className="bg-black/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-white/70 mb-2">Final Score</p>
          <div className="text-3xl font-bold text-white">
            {myScore} - {opponentScore}
          </div>
          <p className="text-xs text-white/60 mt-1">
            {isPlayerOne ? "You" : player1Name} vs {isPlayerOne ? (gameMode === "ai" ? "AI" : player2Name) : "You"}
          </p>
        </div>

        {didWin && (
          <div className="bg-black/30 rounded-lg p-4 mb-8">
            <p className="text-sm text-white/70 mb-2">Prize Claimed</p>
            <p className="text-2xl font-bold text-yellow-300">💎 0.02 STT</p>
          </div>
        )}

        <div className="space-y-3">
          <motion.button
            className="w-full py-3 rounded-lg bg-white text-slate-900 font-bold hover:bg-white/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
          >
            Play Again
          </motion.button>

          <motion.button
            className="w-full py-3 rounded-lg bg-white/20 text-white font-bold hover:bg-white/30 transition-colors border border-white/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
          >
            Back to Menu
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
