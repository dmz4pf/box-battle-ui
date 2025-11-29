"use client"

import { motion } from "framer-motion"

interface GridSizeSelectorProps {
  onSelectSize: (size: 3 | 4 | 5 | 6) => void
  onBack: () => void
}

export default function GridSizeSelector({ onSelectSize, onBack }: GridSizeSelectorProps) {
  const sizes = [
    {
      size: 3 as const,
      title: "3x3 Grid",
      description: "Quick games • 4 boxes • Perfect for beginners",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-400",
      hoverBg: "hover:bg-green-500/30",
      icon: "🎮",
    },
    {
      size: 4 as const,
      title: "4x4 Grid",
      description: "Standard games • 9 boxes • Balanced challenge",
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-400",
      hoverBg: "hover:bg-blue-500/30",
      icon: "🎯",
    },
    {
      size: 5 as const,
      title: "5x5 Grid",
      description: "Extended games • 16 boxes • Strategic depth",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-orange-400",
      hoverBg: "hover:bg-orange-500/30",
      icon: "🏆",
    },
    {
      size: 6 as const,
      title: "6x6 Grid",
      description: "Championship • 25 boxes • Expert level",
      color: "from-red-500 to-pink-600",
      bgColor: "from-red-500/20 to-pink-500/20",
      borderColor: "border-red-400",
      hoverBg: "hover:bg-red-500/30",
      icon: "👑",
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
          <span>←</span>
          <span className="font-semibold">Back</span>
        </motion.button>

        {/* Title */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            Select Grid Size
          </motion.h1>
          <motion.p
            className="text-lg text-purple-300 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Choose the size of your battlefield
          </motion.p>
        </div>

        {/* Size Cards */}
        <div className="space-y-4">
          {sizes.map((item, index) => (
            <motion.button
              key={item.size}
              onClick={() => onSelectSize(item.size)}
              className={`w-full p-6 rounded-2xl bg-gradient-to-r ${item.bgColor} border-2 ${item.borderColor} ${item.hoverBg} transition-all text-left`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.03, x: 10 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300">{item.description}</p>
                </div>
                <motion.div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
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
          Larger grids mean longer, more strategic games
        </motion.p>
      </motion.div>
    </div>
  )
}
