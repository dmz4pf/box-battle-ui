"use client"

import { motion } from "framer-motion"

const features = [
  {
    icon: "⚔️",
    title: "Real-Time Multiplayer",
    description: "Compete against players worldwide with instant turn resolution and live updates.",
  },
  {
    icon: "🏆",
    title: "Ranked Leaderboard",
    description: "Climb the global ranks and earn badges for your strategic prowess.",
  },
  {
    icon: "💎",
    title: "Blockchain Rewards",
    description: "Win games and earn real cryptocurrency rewards instantly to your wallet.",
  },
  {
    icon: "📊",
    title: "Advanced Analytics",
    description: "Track your stats, analyze patterns, and improve your gameplay with detailed insights.",
  },
  {
    icon: "🎯",
    title: "Custom Tournaments",
    description: "Organize tournaments with friends or join community-run competitive events.",
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "Sub-100ms move latency powered by optimized backend infrastructure.",
  },
]

export default function Features() {
  return (
    <section id="features" className="px-8 py-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Packed with Power
        </h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">Everything you need to dominate the competition</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="border border-indigo-500/20 bg-gradient-to-br from-slate-900/60 to-indigo-900/20 rounded-xl p-6 hover:border-indigo-500/50 transition-all group hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
