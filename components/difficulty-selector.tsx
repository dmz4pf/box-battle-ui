"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: "easy" | "medium" | "hard") => void
  onBack: () => void
  gridSize: number
  onGridSizeChange: (size: number) => void
}

export default function DifficultySelector({ onSelectDifficulty, onBack, gridSize, onGridSizeChange }: DifficultySelectorProps) {
  const difficulties = [
    {
      id: "easy" as const,
      title: "Easy - Learning Mode",
      description: "Perfect for beginners. AI makes random moves with occasional mistakes.",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-400",
      hoverBg: "hover:bg-green-500/30",
    },
    {
      id: "medium" as const,
      title: "Medium - Balanced",
      description: "A fair challenge. AI uses basic strategy but isn't perfect.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-orange-400",
      hoverBg: "hover:bg-orange-500/30",
    },
    {
      id: "hard" as const,
      title: "Hard - Master Challenge",
      description: "Expert level. AI plays optimally and rarely makes mistakes.",
      color: "from-red-500 to-pink-600",
      bgColor: "from-red-500/20 to-pink-500/20",
      borderColor: "border-red-400",
      hoverBg: "hover:bg-red-500/30",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 via-indigo-950 to-slate-950 p-6 flex items-center justify-center">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition-all mb-8"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Back</span>
        </motion.button>

        {/* Title */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            Select Difficulty
          </motion.h1>
          <motion.p
            className="text-lg text-purple-300 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Choose your AI opponent's skill level
          </motion.p>
        </div>

        {/* Grid Size Selector */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/80 border-2 border-purple-500/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 text-center">Select Grid Size</h3>
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
                  <div className="text-2xl font-black">{size}×{size}</div>
                  <div className="text-xs mt-1">{(size-1)*(size-1)} boxes</div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Difficulty Cards */}
        <div className="space-y-4">
          {difficulties.map((difficulty, index) => (
            <motion.button
              key={difficulty.id}
              onClick={() => onSelectDifficulty(difficulty.id)}
              className={`w-full p-6 rounded-2xl bg-gradient-to-r ${difficulty.bgColor} border-2 ${difficulty.borderColor} ${difficulty.hoverBg} transition-all text-left`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.03, x: 10 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${difficulty.color} bg-clip-text text-transparent`}>
                    {difficulty.title}
                  </h3>
                  <p className="text-sm text-slate-300">{difficulty.description}</p>
                </div>
                <motion.div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${difficulty.color} flex items-center justify-center text-2xl`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {difficulty.id === "easy" ? "🎓" : difficulty.id === "medium" ? "⚖️" : "🏆"}
                </motion.div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer tip */}
        <motion.p
          className="text-center mt-8 text-purple-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          You can change difficulty anytime by restarting the game
        </motion.p>
      </motion.div>
    </div>
  )
}
