"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="px-8 py-24 md:py-32 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8"
      >
        <div className="inline-block px-4 py-2 bg-indigo-900/30 border border-indigo-500/50 rounded-full">
          <span className="text-indigo-300 text-sm font-medium">The Ultimate Web3 Strategy Game</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
          Master the Grid.
          <br />
          Claim Your Prize.
        </h1>

        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Experience the ultimate competitive Dots and Boxes game with real-time multiplayer, blockchain rewards, and a
          thriving community of strategic players.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/game">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all"
            >
              Start Playing
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border border-indigo-500/50 text-indigo-300 rounded-full font-bold text-lg hover:bg-indigo-900/20 transition-all"
          >
            Watch Demo
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl rounded-2xl"></div>
          <div className="relative border border-indigo-500/30 rounded-xl p-2 bg-gradient-to-br from-slate-900/80 to-indigo-900/40">
            <div className="bg-slate-900 rounded-lg p-8 min-h-96 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <div className="text-4xl mb-2">🎮</div>
                <p>Game Preview Coming Soon</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
