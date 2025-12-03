"use client"

import { User, Trophy, Clock, Zap } from "lucide-react"
import { useEffect, useRef } from "react"
import { animateCardReveal } from "@/lib/animations"

interface PlayerCardProps {
  playerNum: number
  score: number
  isActive: boolean
  address: string
}

export default function PlayerCard({ playerNum, score, isActive, address }: PlayerCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isPlayer1 = playerNum === 1
  const playerColor = isPlayer1 ? '#3B82F6' : '#EF4444'
  const playerColorLight = isPlayer1 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)'
  const playerColorBorder = isPlayer1 ? 'rgba(59, 130, 246, 0.5)' : 'rgba(239, 68, 68, 0.5)'

  // Animate card entrance
  useEffect(() => {
    if (cardRef.current) {
      animateCardReveal(cardRef.current, playerNum === 2 ? 0.1 : 0)
    }
  }, [playerNum])

  return (
    <div
      ref={cardRef}
      className="relative transition-all duration-300"
      style={{
        opacity: 0, // Will be animated by GSAP
      }}
    >
      {/* Active glow effect */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-2xl blur-xl transition-opacity duration-500"
          style={{
            background: playerColor,
            opacity: 0.2,
            zIndex: -1,
          }}
        />
      )}

      {/* Main card */}
      <div
        className={`
          relative rounded-2xl p-6 transition-all duration-300
          ${isActive ? 'scale-[1.02]' : 'scale-100'}
        `}
        style={{
          background: 'linear-gradient(135deg, #131829 0%, #1E2139 100%)',
          border: `2px solid ${isActive ? playerColorBorder : 'rgba(148, 163, 184, 0.2)'}`,
          boxShadow: isActive
            ? `0 8px 32px ${playerColor}40, 0 0 0 1px ${playerColorBorder}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`
            : '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Active badge */}
        {isActive && (
          <div
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            style={{
              background: playerColor,
              color: 'white',
              boxShadow: `0 4px 12px ${playerColor}60`,
            }}
          >
            <Zap className="w-3 h-3" fill="white" />
            <span>Active</span>
          </div>
        )}

        {/* Player Icon with larger, more prominent design */}
        <div className="flex items-center justify-center mb-6">
          <div
            className="relative w-20 h-20 rounded-xl flex items-center justify-center border-2 transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${playerColorLight} 0%, transparent 100%)`,
              borderColor: isActive ? playerColor : playerColorBorder,
              boxShadow: isActive ? `0 0 20px ${playerColor}40` : 'none',
            }}
          >
            <User
              className="w-10 h-10 transition-transform duration-300"
              style={{
                color: playerColor,
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
              strokeWidth={2.5}
            />
            {/* Corner accent */}
            <div
              className="absolute top-0 right-0 w-3 h-3 rounded-bl-lg"
              style={{
                background: playerColor,
                opacity: 0.6,
              }}
            />
          </div>
        </div>

        {/* Player Label with better styling */}
        <div className="text-center mb-6">
          <p
            className="text-sm font-bold uppercase tracking-widest mb-1"
            style={{ color: playerColor }}
          >
            Player {playerNum}
          </p>
          <div
            className="w-12 h-0.5 mx-auto rounded-full"
            style={{ backgroundColor: playerColor, opacity: 0.3 }}
          />
        </div>

        {/* Score - Larger and more prominent */}
        <div
          className="relative text-center mb-6 p-6 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${playerColorLight} 0%, transparent 100%)`,
            border: `1px solid ${playerColorBorder}`,
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy
              className="w-7 h-7"
              style={{ color: playerColor }}
              strokeWidth={2}
            />
            <p
              className="text-6xl font-black tabular-nums"
              style={{
                color: playerColor,
                textShadow: `0 2px 10px ${playerColor}40`,
              }}
            >
              {score}
            </p>
          </div>
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: playerColor, opacity: 0.7 }}
          >
            Boxes Claimed
          </p>
        </div>

        {/* Wallet Address with better styling */}
        <div
          className="mb-5 px-4 py-3 rounded-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }}
        >
          <p className="text-center text-[10px] text-[var(--color-text-tertiary)] mb-1 uppercase tracking-wider font-semibold">
            Wallet
          </p>
          <p className="text-center text-xs font-mono text-[var(--color-text-secondary)] truncate">
            {address}
          </p>
        </div>

        {/* Turn Indicator with enhanced design */}
        <div
          className={`
            py-3 px-4 rounded-lg text-center text-sm font-bold uppercase tracking-wide
            transition-all duration-300
          `}
          style={{
            background: isActive
              ? `linear-gradient(135deg, ${playerColor} 0%, ${playerColor}CC 100%)`
              : 'rgba(148, 163, 184, 0.1)',
            color: isActive ? 'white' : 'var(--color-text-tertiary)',
            border: `1px solid ${isActive ? playerColor : 'rgba(148, 163, 184, 0.2)'}`,
            boxShadow: isActive ? `0 4px 12px ${playerColor}40` : 'none',
          }}
        >
          <div className="flex items-center justify-center gap-2">
            {isActive ? (
              <>
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: 'white',
                    boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                  }}
                />
                <span>Your Turn</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                <span>Waiting...</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
