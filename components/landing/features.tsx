"use client"

import { Swords, Trophy, Coins, BarChart3, Target, Zap } from "lucide-react"

const features = [
  {
    icon: Swords,
    title: "Real-Time Multiplayer",
    description: "Compete against players worldwide with instant turn resolution and live updates.",
    color: 'var(--color-player-1)',
  },
  {
    icon: Trophy,
    title: "Ranked Leaderboard",
    description: "Climb the global ranks and earn badges for your strategic prowess.",
    color: 'var(--color-accent-amber)',
  },
  {
    icon: Coins,
    title: "Blockchain Rewards",
    description: "Win games and earn real cryptocurrency rewards instantly to your wallet.",
    color: 'var(--color-success)',
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track your stats, analyze patterns, and improve your gameplay with detailed insights.",
    color: 'var(--color-player-2)',
  },
  {
    icon: Target,
    title: "Custom Tournaments",
    description: "Organize tournaments with friends or join community-run competitive events.",
    color: 'var(--color-warning)',
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-100ms move latency powered by optimized backend infrastructure.",
    color: 'var(--color-accent-blue)',
  },
]

export default function Features() {
  return (
    <section id="features" className="px-8 py-24 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          Packed with Power
        </h2>
        <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
          Everything you need to dominate the competition
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <div
              key={i}
              className="card border hover:border-accent-blue transition-all group"
            >
              <div
                className="w-14 h-14 rounded-lg border-2 flex items-center justify-center mb-4"
                style={{
                  backgroundColor: `${feature.color}15`,
                  borderColor: feature.color,
                }}
              >
                <Icon
                  className="w-7 h-7"
                  style={{ color: feature.color }}
                  strokeWidth={2}
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-[var(--color-text-secondary)]">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
