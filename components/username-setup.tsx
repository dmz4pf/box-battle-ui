"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface UsernameSetupProps {
  onSubmit: (username: string) => void
  address: string
}

export default function UsernameSetup({ onSubmit, address }: UsernameSetupProps) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    if (username.trim().length > 20) {
      setError("Username must be less than 20 characters")
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores")
      return
    }

    localStorage.setItem(`username_${address}`, username.trim())
    onSubmit(username.trim())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 via-indigo-950 to-slate-950 p-6 flex items-center justify-center">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-black mb-4 bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            Welcome to BoxBattle!
          </motion.h1>
          <motion.p
            className="text-lg text-purple-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Create your player name
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-2">
              Player Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError("")
              }}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border-2 border-purple-500/30 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-all"
              maxLength={20}
              autoFocus
            />
            {error && (
              <motion.p
                className="text-red-400 text-sm mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
            <p className="text-xs text-slate-400 mt-2">
              3-20 characters • Letters, numbers, and underscores only
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
            <p className="text-xs text-slate-400 mb-1">Connected Wallet</p>
            <p className="text-sm text-purple-300 font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold hover:from-cyan-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={username.trim().length < 3}
          >
            Continue
          </motion.button>
        </form>

        <motion.p
          className="text-center mt-6 text-sm text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your name will be visible to other players
        </motion.p>
      </motion.div>
    </div>
  )
}
