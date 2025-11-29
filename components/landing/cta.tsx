"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="px-8 py-24 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-3xl rounded-2xl"></div>
        <div className="relative border border-indigo-500/30 bg-gradient-to-br from-slate-900/80 to-indigo-900/40 rounded-2xl p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Compete?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of strategic players battling for glory and real cryptocurrency rewards. Your first match is
            on us.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/game">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all"
              >
                Launch Game
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border border-indigo-500/50 text-indigo-300 rounded-full font-bold text-lg hover:bg-indigo-900/20 transition-all"
            >
              Join Community
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
