"use client"

import { motion } from "framer-motion"

const stats = [
  { label: "Active Players", value: "12.5K+", icon: "👥" },
  { label: "Total Winnings", value: "$2.4M", icon: "💰" },
  { label: "Games Played", value: "450K+", icon: "🎮" },
  { label: "Avg Game Time", value: "4m 32s", icon: "⏱️" },
]

export default function Stats() {
  return (
    <section id="stats" className="px-8 py-24 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="border border-indigo-500/20 bg-gradient-to-br from-slate-900/60 to-indigo-900/20 rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <div className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-2">
              {stat.value}
            </div>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
