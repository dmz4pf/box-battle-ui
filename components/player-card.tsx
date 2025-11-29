"use client"

import { motion } from "framer-motion"

interface PlayerCardProps {
  playerNum: number
  score: number
  isActive: boolean
  address: string
}

export default function PlayerCard({ playerNum, score, isActive, address }: PlayerCardProps) {
  const isPlayer1 = playerNum === 1
  const bgColor = isPlayer1 ? "from-cyan-500 to-blue-600" : "from-pink-500 to-red-600"
  const glowColor = isPlayer1 ? "shadow-cyan-400/50" : "shadow-pink-400/50"
  const borderColor = isPlayer1 ? "border-cyan-400" : "border-pink-400"
  const activeBorder = isActive ? borderColor : "border-slate-600"

  return (
    <motion.div
      className={`p-6 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 ${activeBorder} bg-gradient-to-br ${isPlayer1 ? "from-cyan-900/40 to-blue-900/20" : "from-pink-900/40 to-red-900/20"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isPlayer1 ? 0.3 : 0.4 }}
      whileHover={{ scale: 1.05, rotate: 1 }}
    >
      {/* Avatar */}
      <motion.div
        className={`w-16 h-16 rounded-full bg-gradient-to-br ${bgColor} flex items-center justify-center mb-4 mx-auto ${glowColor} shadow-lg`}
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <span className="text-2xl font-bold text-white">{isPlayer1 ? "🔵" : "🔴"}</span>
      </motion.div>

      {/* Player Label */}
      <p className="text-center text-slate-300 text-xs uppercase tracking-widest mb-2 font-black">Player {playerNum}</p>

      {/* Score */}
      <motion.div
        className="text-center mb-4"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.15 }}
      >
        <p className={`text-6xl font-black bg-gradient-to-r ${bgColor} bg-clip-text text-transparent`}>{score}</p>
        <p className="text-xs text-slate-400 mt-1 font-bold">POINTS</p>
      </motion.div>

      {/* Wallet Address */}
      <p className="text-center text-xs font-mono text-slate-400 mb-4 break-all">{address}</p>

      {/* Active Indicator */}
      <motion.div
        animate={isActive ? { opacity: [0.5, 1, 0.5], scale: [1, 1.02, 1] } : { opacity: 0.3 }}
        transition={{ duration: 1.5, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
        className={`py-2 rounded-lg text-center text-sm font-black text-white bg-gradient-to-r ${bgColor}`}
      >
        {isActive ? "► YOUR TURN" : "⏸ WAITING..."}
      </motion.div>
    </motion.div>
  )
}
