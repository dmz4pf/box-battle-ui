"use client"

import { motion } from "framer-motion"

interface MoveHistoryProps {
  moves: string[]
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <motion.div
      className="text-xs text-slate-400 space-y-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <p className="text-slate-500 font-semibold mb-2">Recent Moves</p>
      {moves.length === 0 ? (
        <p className="text-slate-500">Waiting for first move...</p>
      ) : (
        moves.map((move, i) => (
          <motion.p
            key={i}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {move}
          </motion.p>
        ))
      )}
    </motion.div>
  )
}
