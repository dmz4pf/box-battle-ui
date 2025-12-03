"use client"

import { History, Circle } from "lucide-react"
import { useEffect, useRef } from "react"
import { animateStaggerIn } from "@/lib/animations"

interface MoveHistoryProps {
  moves: string[]
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  const movesContainerRef = useRef<HTMLDivElement>(null)
  const prevMovesLength = useRef(0)

  // Parse move to determine player color
  const getMovePlayer = (move: string): "player1" | "player2" | null => {
    if (move.includes("Player 1") || move.includes("You (P1)") || move.includes("AI")) {
      return "player1"
    }
    if (move.includes("Player 2") || move.includes("You (P2)")) {
      return "player2"
    }
    return null
  }

  // Animate new moves
  useEffect(() => {
    if (moves.length > prevMovesLength.current && movesContainerRef.current) {
      const newMoveElements = movesContainerRef.current.querySelectorAll('.move-item')
      if (newMoveElements.length > 0) {
        // Animate only the first item (latest move)
        const latestMove = newMoveElements[0] as HTMLElement
        if (latestMove) {
          animateStaggerIn([latestMove], 0)
        }
      }
    }
    prevMovesLength.current = moves.length
  }, [moves.length])

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, #131829 0%, #1E2139 100%)',
        border: '2px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 mb-5 pb-4"
        style={{
          borderBottom: '2px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          <History className="w-5 h-5 text-accent-blue" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white">Move History</h3>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            {moves.length} {moves.length === 1 ? 'move' : 'moves'} recorded
          </p>
        </div>
      </div>

      {/* Moves List */}
      <div
        ref={movesContainerRef}
        className="space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-border)] scrollbar-track-transparent"
        style={{
          maxHeight: '320px',
        }}
      >
        {moves.length === 0 ? (
          <div className="text-center py-10">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(148, 163, 184, 0.05)',
                border: '2px dashed rgba(148, 163, 184, 0.2)',
              }}
            >
              <Circle className="w-8 h-8 text-[var(--color-text-tertiary)] opacity-40" />
            </div>
            <p className="text-sm font-medium text-[var(--color-text-tertiary)]">
              No moves yet
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)] opacity-60 mt-1">
              Make your first move to start
            </p>
          </div>
        ) : (
          moves.slice().reverse().map((move, i) => {
            const player = getMovePlayer(move)
            const playerColor = player === "player1" ? '#3B82F6' :
                               player === "player2" ? '#EF4444' :
                               '#94A3B8'
            const playerColorLight = player === "player1" ? 'rgba(59, 130, 246, 0.1)' :
                                    player === "player2" ? 'rgba(239, 68, 68, 0.1)' :
                                    'rgba(148, 163, 184, 0.05)'

            return (
              <div
                key={moves.length - i}
                className="move-item flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-default"
                style={{
                  background: playerColorLight,
                  border: `1px solid ${playerColor}30`,
                }}
              >
                {/* Move Number Badge */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs"
                  style={{
                    background: playerColor,
                    color: 'white',
                    boxShadow: `0 2px 8px ${playerColor}40`,
                  }}
                >
                  {moves.length - i}
                </div>

                {/* Move Content */}
                <div className="flex-1 min-w-0">
                  {/* Player Indicator */}
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: playerColor,
                        boxShadow: `0 0 4px ${playerColor}80`,
                      }}
                    />
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: playerColor }}
                    >
                      {player === "player1" ? "Player 1" : player === "player2" ? "Player 2" : "System"}
                    </span>
                  </div>

                  {/* Move Text */}
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {move}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer Stats */}
      {moves.length > 0 && (
        <div
          className="mt-5 pt-4 flex items-center justify-between"
          style={{
            borderTop: '2px solid rgba(148, 163, 184, 0.1)',
          }}
        >
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Latest moves shown first
          </p>
          <div
            className="px-3 py-1 rounded-full text-xs font-mono font-bold"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#3B82F6',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            {moves.length} total
          </div>
        </div>
      )}
    </div>
  )
}
