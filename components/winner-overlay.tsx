"use client"

import { useEffect, useRef } from "react"
import { Trophy, TrendingUp, TrendingDown, Coins, RotateCcw, Home } from "lucide-react"
import { gsap } from "gsap"

interface WinnerOverlayProps {
  winner: "player1" | "player2" | "draw"
  scores: { player1: number; player2: number }
  onPlayAgain: () => void
  onBackToMenu?: () => void
  isPlayerOne: boolean
  player1Name?: string
  player2Name?: string
  gameMode: "ai" | "multiplayer"
}

export default function WinnerOverlay({
  winner,
  scores,
  onPlayAgain,
  onBackToMenu,
  isPlayerOne,
  player1Name = "Player 1",
  player2Name = "Player 2",
  gameMode
}: WinnerOverlayProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const trophyRef = useRef<HTMLDivElement>(null)

  const isDraw = winner === "draw"
  const didWin = !isDraw && ((isPlayerOne && winner === "player1") || (!isPlayerOne && winner === "player2"))
  const winnerName = winner === "player1" ? player1Name : winner === "player2" ? player2Name : "Draw"
  const myScore = isPlayerOne ? scores.player1 : scores.player2
  const opponentScore = isPlayerOne ? scores.player2 : scores.player1

  const statusColor = isDraw ? 'var(--color-text-secondary)' : (didWin ? 'var(--color-success)' : 'var(--color-error)')
  const StatusIcon = isDraw ? Trophy : (didWin ? TrendingUp : TrendingDown)

  useEffect(() => {
    if (!backdropRef.current || !contentRef.current || !trophyRef.current) return

    const tl = gsap.timeline()

    // Backdrop fade in
    tl.fromTo(backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    )

    // Content entrance
    tl.fromTo(contentRef.current,
      { y: 60, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' },
      '-=0.1'
    )

    // Trophy bounce
    tl.fromTo(trophyRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' },
      '-=0.3'
    )

    // Trophy floating animation
    gsap.to(trophyRef.current, {
      y: -8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-modal-backdrop p-6"
    >
      <div
        ref={contentRef}
        className="bg-bg-panel border-2 rounded-xl p-8 max-w-md w-full text-center"
        style={{ borderColor: statusColor }}
      >
        {/* Trophy Icon */}
        <div
          ref={trophyRef}
          className="w-24 h-24 mx-auto mb-6 rounded-lg border-2 flex items-center justify-center"
          style={{
            backgroundColor: `${statusColor}15`,
            borderColor: statusColor,
          }}
        >
          <Trophy
            className="w-12 h-12"
            style={{ color: statusColor }}
            strokeWidth={2}
          />
        </div>

        {/* Result Title */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <StatusIcon
            className="w-8 h-8"
            style={{ color: statusColor }}
            strokeWidth={2.5}
          />
          <h2
            className="text-4xl font-black"
            style={{ color: statusColor }}
          >
            {isDraw ? "DRAW" : (didWin ? "VICTORY" : "DEFEAT")}
          </h2>
          <StatusIcon
            className="w-8 h-8"
            style={{ color: statusColor }}
            strokeWidth={2.5}
          />
        </div>

        <p className="text-[var(--color-text-secondary)] text-lg mb-8">
          {isDraw
            ? "The game ended in a tie!"
            : (didWin
              ? `You defeated ${gameMode === "ai" ? "the AI" : winnerName}!`
              : `${gameMode === "ai" ? "AI" : winnerName} won this round!`)
          }
        </p>

        {/* Final Score Card */}
        <div className="card border mb-6">
          <p className="text-sm text-[var(--color-text-tertiary)] mb-3">Final Score</p>
          <div className="text-5xl font-black text-white mb-2">
            {myScore} - {opponentScore}
          </div>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            {isPlayerOne ? "You" : player1Name} vs {isPlayerOne ? (gameMode === "ai" ? "AI" : player2Name) : "You"}
          </p>
        </div>

        {/* Prize Card (only for winner in multiplayer, not for draw) */}
        {!isDraw && didWin && gameMode === "multiplayer" && (
          <div className="card border-2 mb-8" style={{ borderColor: 'var(--color-accent-amber)' }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-accent-amber" />
              <p className="text-sm text-[var(--color-text-tertiary)]">Prize Claimed</p>
            </div>
            <p className="text-3xl font-black text-accent-amber">0.02 STT</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="button-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>

          <button
            onClick={onBackToMenu || onPlayAgain}
            className="w-full py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-bg-elevated hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  )
}
