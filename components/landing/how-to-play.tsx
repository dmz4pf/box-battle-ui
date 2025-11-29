"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Draw Lines",
    description: "Click between dots to draw lines. You can only draw lines to adjacent dots on a 5x5 grid.",
  },
  {
    number: "02",
    title: "Complete Boxes",
    description: "Complete the fourth side of a box to claim it. Your color fills the box and you score a point.",
  },
  {
    number: "03",
    title: "Score Points",
    description: "Each completed box = 1 point. Complete boxes earn you another turn immediately.",
  },
  {
    number: "04",
    title: "Win & Earn",
    description:
      "First player to win the most boxes takes the prize. Earnings are instantly transferred to your wallet.",
  },
]

export default function HowToPlay() {
  return (
    <section id="how-to-play" className="px-8 py-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          How to Play
        </h2>
        <p className="text-slate-300 text-lg">Master the rules in minutes, compete for a lifetime</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="border border-indigo-500/20 bg-gradient-to-br from-slate-900/60 to-indigo-900/20 rounded-xl p-8 hover:border-indigo-500/50 transition-all"
          >
            <div className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-4">
              {step.number}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-slate-300 leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
