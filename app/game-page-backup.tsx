"use client"

import { useState } from "react"
import Header from "@/components/header"
import GameBoard from "@/components/game-board"
import PlayerCard from "@/components/player-card"
import WinnerOverlay from "@/components/winner-overlay"
import MoveHistory from "@/components/move-history"

export default function Page() {
  const [currentPlayer, setCurrentPlayer] = useState<"player1" | "player2">("player1")
  const [scores, setScores] = useState({ player1: 0, player2: 0 })
  const [winner, setWinner] = useState<"player1" | "player2" | null>(null)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [timer, setTimer] = useState(180)

  const handleLineClick = () => {
    // Simulate line drawing with animation
    setMoveHistory((prev) => [...prev.slice(-2), `Move ${Date.now()}`])

    // Simulate scoring
    if (Math.random() > 0.7) {
      setScores((prev) => ({
        ...prev,
        [currentPlayer === "player1" ? "player1" : "player2"]:
          prev[currentPlayer === "player1" ? "player1" : "player2"] + 1,
      }))
    } else {
      setCurrentPlayer(currentPlayer === "player1" ? "player2" : "player1")
    }
  }

  const handleReset = () => {
    setScores({ player1: 0, player2: 0 })
    setWinner(null)
    setMoveHistory([])
    setCurrentPlayer("player1")
    setTimer(180)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 via-indigo-950 to-slate-950">
      <Header timer={timer} />

      <div className="flex h-[calc(100vh-120px)] gap-4 p-6">
        {/* Left Player Card */}
        <div className="w-1/4">
          <PlayerCard
            playerNum={1}
            score={scores.player1}
            isActive={currentPlayer === "player1"}
            address="0x1234...5678"
          />
        </div>

        {/* Center Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <GameBoard currentPlayer={currentPlayer} onLineClick={handleLineClick} />
          <div className="text-center">
            <p className="text-sm text-cyan-300 mb-2 font-bold animate-pulse">
              {currentPlayer === "player1" ? "🔵 BLUE PLAYER" : "🔴 RED PLAYER"}'S TURN
            </p>
            <MoveHistory moves={moveHistory} />
          </div>
        </div>

        {/* Right Player Card */}
        <div className="w-1/4">
          <PlayerCard
            playerNum={2}
            score={scores.player2}
            isActive={currentPlayer === "player2"}
            address="0x9876...4321"
          />
        </div>
      </div>

      {/* Winner Overlay */}
      {winner && <WinnerOverlay winner={winner} scores={scores} onPlayAgain={handleReset} />}
    </div>
  )
}
