"use client"

import { ArrowLeft, GraduationCap, Scale, Trophy, Grid3x3 } from "lucide-react"

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: "easy" | "medium" | "hard") => void
  onBack: () => void
  gridSize: number
  onGridSizeChange: (size: number) => void
}

export default function DifficultySelector({
  onSelectDifficulty,
  onBack,
  gridSize,
  onGridSizeChange
}: DifficultySelectorProps) {
  const difficulties = [
    {
      id: "easy" as const,
      title: "Easy",
      subtitle: "Learning Mode",
      description: "Perfect for beginners. AI makes random moves with occasional mistakes.",
      icon: GraduationCap,
      color: "var(--color-success)",
    },
    {
      id: "medium" as const,
      title: "Medium",
      subtitle: "Balanced",
      description: "A fair challenge. AI uses basic strategy but isn't perfect.",
      icon: Scale,
      color: "var(--color-warning)",
    },
    {
      id: "hard" as const,
      title: "Hard",
      subtitle: "Master Challenge",
      description: "Expert level. AI plays optimally and rarely makes mistakes.",
      icon: Trophy,
      color: "var(--color-player-2)",
    },
  ]

  return (
    <div
      className="min-h-screen p-6 flex items-center justify-center"
      style={{
        background: 'radial-gradient(circle at 50% 30%, #1e2541 0%, #151929 40%, #0f141f 100%)',
        backgroundImage: `
          radial-gradient(circle at 50% 30%, #1e2541 0%, #151929 40%, #0f141f 100%),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 3px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 3px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
      }}
    >
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--color-text-tertiary)] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Select Difficulty
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Choose your AI opponent's skill level
          </p>
        </div>

        {/* Grid Size Selector */}
        <div className="card border-2 border-accent-blue/40 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Grid3x3 className="w-5 h-5 text-accent-blue" />
            <h3 className="text-lg font-semibold text-white">Select Grid Size</h3>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[3, 4, 5, 6].map((size) => (
              <button
                key={size}
                onClick={() => onGridSizeChange(size)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  gridSize === size
                    ? "bg-accent-blue text-bg-primary shadow-lg border-2 border-accent-blue"
                    : "bg-bg-elevated text-[var(--color-text-secondary)] hover:bg-bg-elevated/80"
                }`}
              >
                <div className="text-xl font-bold">{size}×{size}</div>
                <div className="text-xs mt-1">{(size-1)*(size-1)} boxes</div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Cards - Horizontal Button Group */}
        <div className="space-y-4 mb-6">
          {difficulties.map((difficulty) => {
            const Icon = difficulty.icon
            return (
              <button
                key={difficulty.id}
                onClick={() => onSelectDifficulty(difficulty.id)}
                className="card border-2 border-[var(--color-border)] hover:border-[var(--color-accent-blue)] transition-all w-full text-left group"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center border-2 flex-shrink-0"
                    style={{
                      backgroundColor: `${difficulty.color}15`,
                      borderColor: difficulty.color,
                    }}
                  >
                    <Icon
                      className="w-7 h-7"
                      style={{ color: difficulty.color }}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3
                        className="text-xl font-bold"
                        style={{ color: difficulty.color }}
                      >
                        {difficulty.title}
                      </h3>
                      <span className="text-sm text-[var(--color-text-tertiary)]">
                        {difficulty.subtitle}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {difficulty.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex-shrink-0 text-[var(--color-text-tertiary)] group-hover:text-accent-blue transition-colors">
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer tip */}
        <p className="text-center text-[var(--color-text-tertiary)] text-sm">
          You can change difficulty anytime by restarting the game
        </p>
      </div>
    </div>
  )
}
