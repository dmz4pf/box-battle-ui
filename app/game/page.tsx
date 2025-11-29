"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import Header from "@/components/header"
import GameBoard from "@/components/game-board"
import PlayerCard from "@/components/player-card"
import WinnerOverlay from "@/components/winner-overlay"
import MoveHistory from "@/components/move-history"
import GameModeSelector from "@/components/game-mode-selector"
import MultiplayerLobby from "@/components/multiplayer-lobby"
import DifficultySelector from "@/components/difficulty-selector"
import GridSizeSelector from "@/components/grid-size-selector"
import UsernameSetup from "@/components/username-setup"
import { AIPlayer, type Difficulty } from "@/utils/ai-player"
import {
  useGameState,
  useCreateGame,
  useJoinGame,
  useWatchGameCreated,
  useWatchGameStarted,
  useWatchGameEnded,
  useWaitForTransactionReceipt,
} from "@/hooks/useGameContract"
import { useWebSocketGame } from "@/hooks/useWebSocketGame"
import { decodeEventLog } from "viem"
import { GAME_CONTRACT_ABI } from "@/lib/contract-abi"

type GameMode = "ai" | "multiplayer" | null
type GamePhase = "username-setup" | "mode-select" | "difficulty-select" | "lobby" | "playing"

export default function GamePage() {
  const account = useAccount()
  const { address, isConnected } = account || { address: undefined, isConnected: false }

  // Username state
  const [playerUsername, setPlayerUsername] = useState<string>("")
  const [opponentUsername, setOpponentUsername] = useState<string>("")

  // Game configuration
  const [gameMode, setGameMode] = useState<GameMode>(null)
  const [gamePhase, setGamePhase] = useState<GamePhase>("username-setup")
  const [gridSize, setGridSize] = useState<3 | 4 | 5 | 6>(5)

  // Game state
  const [currentPlayer, setCurrentPlayer] = useState<"player1" | "player2">("player1")
  const [scores, setScores] = useState({ player1: 0, player2: 0 })
  const [winner, setWinner] = useState<"player1" | "player2" | null>(null)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [timer, setTimer] = useState(180)
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [aiPlayer, setAiPlayer] = useState<AIPlayer | null>(null)
  const [drawnLines, setDrawnLines] = useState<Set<string>>(new Set())
  const [completedBoxes, setCompletedBoxes] = useState<Map<string, "player1" | "player2">>(new Map())
  const [isProcessingMove, setIsProcessingMove] = useState(false)
  const [totalBoxes, setTotalBoxes] = useState((gridSize - 1) * (gridSize - 1))
  const [aiNeedsAnotherTurn, setAiNeedsAnotherTurn] = useState(false)

  // Multiplayer blockchain state
  const [gameId, setGameId] = useState<bigint | undefined>()
  const [isJoiningGame, setIsJoiningGame] = useState(false)
  const { data: gameState, refetch: refetchGame } = useGameState(gameId)
  const { createGame, hash: createTxHash } = useCreateGame()
  const { joinGame, isSuccess: gameJoined } = useJoinGame()

  // Determine player number (1 for creator, 2 for joiner)
  const playerNum = isJoiningGame ? 2 : (gameId ? 1 : undefined)

  // WebSocket for real-time moves (NO BLOCKCHAIN SIGNATURES!)
  const { isConnected: wsConnected, sendMove } = useWebSocketGame({
    gameId,
    playerAddress: address,
    playerNum,
    enabled: gameMode === "multiplayer" && gamePhase === "playing",
    onOpponentMove: (lineId, opponentPlayerNum) => {
      console.log('[WebSocket] 📥 Opponent move received:', lineId, 'from player', opponentPlayerNum)

      // Add the line immediately (this updates both players' screens)
      setDrawnLines((prev) => {
        const updated = new Set(prev)
        updated.add(lineId)
        console.log('[WebSocket] Updated drawn lines, total:', updated.size + 1)
        return updated
      })
    },
    onPlayerJoined: (joinedPlayerNum, joinedAddress) => {
      console.log('[WebSocket] 🎮 Player', joinedPlayerNum, 'joined:', joinedAddress)
    },
    onPlayerLeft: (leftPlayerNum, leftAddress) => {
      console.log('[WebSocket] 👋 Player', leftPlayerNum, 'left:', leftAddress)
      alert(`Player ${leftPlayerNum} left the game!`)
    }
  })

  // Wait for create game transaction and extract game ID from logs
  const { data: txReceipt, isSuccess: isTxConfirmed, isLoading: isTxPending } = useWaitForTransactionReceipt({
    hash: createTxHash,
  })


  // Extract gameId from transaction receipt
  useEffect(() => {
    if (isTxConfirmed && txReceipt && !gameId) {
      console.log('[Transaction Confirmed]', txReceipt)

      // Find the GameCreated event in the logs
      const gameCreatedLog = txReceipt.logs.find((log) => {
        try {
          const decoded = decodeEventLog({
            abi: GAME_CONTRACT_ABI,
            data: log.data,
            topics: log.topics,
          })
          return decoded.eventName === 'GameCreated'
        } catch {
          return false
        }
      })

      if (gameCreatedLog) {
        const decoded = decodeEventLog({
          abi: GAME_CONTRACT_ABI,
          data: gameCreatedLog.data,
          topics: gameCreatedLog.topics,
        }) as any

        const extractedGameId = decoded.args.gameId
        console.log('[GameCreated from receipt] Game ID:', extractedGameId)
        setGameId(extractedGameId)
        setGamePhase("lobby")
      }
    }
  }, [isTxConfirmed, txReceipt, gameId])

  // Check for existing username on mount
  useEffect(() => {
    if (address) {
      const savedUsername = localStorage.getItem(`username_${address}`)
      if (savedUsername) {
        setPlayerUsername(savedUsername)
        setGamePhase("mode-select")
      }
    }
  }, [address])

  // Update total boxes when grid size changes
  useEffect(() => {
    setTotalBoxes((gridSize - 1) * (gridSize - 1))
  }, [gridSize])

  // Watch blockchain events
  useWatchGameCreated((event) => {
    console.log('[GameCreated Event]', event)
    console.log('[GameCreated] Creator:', event.creator)
    console.log('[GameCreated] Current address:', address)
    console.log('[GameCreated] Game ID:', event.gameId)

    if (event.creator.toLowerCase() === address?.toLowerCase()) {
      console.log('[GameCreated] This is my game! Setting gameId:', event.gameId)
      setGameId(event.gameId)
    } else {
      console.log('[GameCreated] Not my game, ignoring')
    }
  })

  useWatchGameStarted((event) => {
    console.log('[GameStarted Event]', event)
    console.log('[GameStarted] Event gameId:', event.gameId, 'Type:', typeof event.gameId)
    console.log('[GameStarted] My gameId:', gameId, 'Type:', typeof gameId)
    console.log('[GameStarted] Player 1:', event.player1)
    console.log('[GameStarted] Player 2:', event.player2)
    console.log('[GameStarted] First turn:', event.firstTurn)
    console.log('[GameStarted] Comparison:', event.gameId === gameId, event.gameId == gameId)
    console.log('[GameStarted] String comparison:', event.gameId.toString() === gameId?.toString())

    // Use string comparison for BigInt to be safe
    if (gameId && event.gameId.toString() === gameId.toString()) {
      console.log('[GameStarted] THIS IS MY GAME! Starting now...')
      // Reset game state for new multiplayer game
      setDrawnLines(new Set())
      setCompletedBoxes(new Map())
      setScores({ player1: 0, player2: 0 })
      setCurrentPlayer("player1") // Player 1 always starts
      setGamePhase("playing")
      refetchGame()
    } else {
      console.log('[GameStarted] Not my game, ignoring. Event:', event.gameId.toString(), 'Mine:', gameId?.toString())
    }
  })

  useWatchGameEnded((event) => {
    if (event.gameId === gameId) {
      refetchGame()
      setWinner(event.winner.toLowerCase() === gameState?.player1.toLowerCase() ? "player1" : "player2")
      setGamePhase("playing")
    }
  })

  // Recalculate completed boxes when drawn lines change
  useEffect(() => {
    if (drawnLines.size > 0) {
      const newBoxes = new Map<string, "player1" | "player2">()

      // Check all possible boxes
      for (let row = 0; row < gridSize - 1; row++) {
        for (let col = 0; col < gridSize - 1; col++) {
          const boxId = `box-${row}-${col}`

          // Line format: h-row-col-row-col+1 or v-row-col-row+1-col
          const top = `h-${row}-${col}-${row}-${col + 1}`
          const bottom = `h-${row + 1}-${col}-${row + 1}-${col + 1}`
          const left = `v-${row}-${col}-${row + 1}-${col}`
          const right = `v-${row}-${col + 1}-${row + 1}-${col + 1}`

          if (drawnLines.has(top) && drawnLines.has(bottom) && drawnLines.has(left) && drawnLines.has(right)) {
            // Determine who completed this box based on which player last made a move
            newBoxes.set(boxId, currentPlayer)
          }
        }
      }

      // Update completed boxes and scores
      if (newBoxes.size > completedBoxes.size) {
        const newlyCompleted = newBoxes.size - completedBoxes.size
        console.log('[Game] New boxes completed:', newlyCompleted, 'by', currentPlayer)

        setCompletedBoxes(newBoxes)

        // Update scores
        setScores((prev) => ({
          ...prev,
          [currentPlayer]: prev[currentPlayer] + newlyCompleted
        }))
      }
    }
  }, [drawnLines, gridSize, currentPlayer, completedBoxes.size])

  // Box completion check
  const isBoxComplete = useCallback((boxRow: number, boxCol: number, testLines: Set<string>): boolean => {
    const top = `h-${boxRow}-${boxCol}-${boxRow}-${boxCol + 1}`
    const bottom = `h-${boxRow + 1}-${boxCol}-${boxRow + 1}-${boxCol + 1}`
    const left = `v-${boxRow}-${boxCol}-${boxRow + 1}-${boxCol}`
    const right = `v-${boxRow}-${boxCol + 1}-${boxRow + 1}-${boxCol + 1}`

    return testLines.has(top) && testLines.has(bottom) && testLines.has(left) && testLines.has(right)
  }, [])

  const checkBoxCompletion = useCallback(
    (lineId: string, testLines: Set<string>): { newBoxes: Map<string, "player1" | "player2">; count: number } => {
      const newBoxes = new Map(completedBoxes)
      let completedCount = 0

      // Check all boxes that could be affected by this line
      for (let row = 0; row < gridSize - 1; row++) {
        for (let col = 0; col < gridSize - 1; col++) {
          const boxId = `box-${row}-${col}`

          // Skip if already completed
          if (newBoxes.has(boxId)) continue

          if (isBoxComplete(row, col, testLines)) {
            newBoxes.set(boxId, currentPlayer)
            completedCount++
          }
        }
      }

      return { newBoxes, count: completedCount }
    },
    [completedBoxes, currentPlayer, isBoxComplete, gridSize],
  )

  // AI Move logic
  const makeAIMove = useCallback(() => {
    console.log("[AI] makeAIMove called")
    setIsProcessingMove(true)

    if (!aiPlayer) {
      console.log("[AI] AI player not initialized")
      setIsProcessingMove(false)
      return
    }

    const aiMove = aiPlayer.makeMove(drawnLines, gridSize - 1)
    console.log("[AI] AI move selected:", aiMove.lineId)

    if (!aiMove.lineId) {
      console.log("[AI] No valid AI move found")
      setIsProcessingMove(false)
      return
    }

    // Add the line
    const newDrawnLines = new Set(drawnLines)
    newDrawnLines.add(aiMove.lineId)

    // Check for completed boxes
    const { newBoxes, count: boxesCompleted } = checkBoxCompletion(aiMove.lineId, newDrawnLines)

    console.log("[AI] Boxes completed by AI:", boxesCompleted)

    setDrawnLines(newDrawnLines)
    setCompletedBoxes(newBoxes)

    if (boxesCompleted > 0) {
      setScores((prev) => ({
        ...prev,
        player2: prev.player2 + boxesCompleted,
      }))
      setMoveHistory((prev) => [...prev.slice(-2), `AI completed ${boxesCompleted} box(es) - another turn!`])
      console.log("[AI] AI completed boxes - gets another turn")
      setAiNeedsAnotherTurn(true)
    } else {
      console.log("[AI] AI passed turn - switching to player1")
      setCurrentPlayer("player1")
      setMoveHistory((prev) => [...prev.slice(-2), "AI passed to you"])
    }

    setIsProcessingMove(false)
  }, [aiPlayer, drawnLines, checkBoxCompletion, gridSize])

  // Check for game end
  useEffect(() => {
    if (completedBoxes.size === totalBoxes && gamePhase === "playing" && gameMode === "ai") {
      const p1Score = scores.player1
      const p2Score = scores.player2

      let winningPlayer: "player1" | "player2"

      if (p1Score > p2Score) {
        winningPlayer = "player1"
      } else if (p2Score > p1Score) {
        winningPlayer = "player2"
      } else {
        // Tie: player1 wins tiebreaker
        winningPlayer = "player1"
      }

      console.log("[Game] Game over! Player 1 score:", p1Score, "Player 2 score:", p2Score, "Winner:", winningPlayer)
      setWinner(winningPlayer)
    }
  }, [completedBoxes, totalBoxes, gamePhase, scores, gameMode])

  // Initialize AI player
  useEffect(() => {
    if (gameMode === "ai" && gamePhase === "playing") {
      const player = new AIPlayer(difficulty)
      setAiPlayer(player)
    }
  }, [gameMode, gamePhase, difficulty])

  // AI turn trigger
  useEffect(() => {
    if (gamePhase !== "playing" || isProcessingMove || !aiPlayer) return
    if (currentPlayer !== "player2") return
    if (gameMode !== "ai") return

    const timer = setTimeout(() => {
      console.log("[AI] AI turn triggered")
      makeAIMove()
    }, 1200)

    return () => clearTimeout(timer)
  }, [currentPlayer, gamePhase, isProcessingMove, aiPlayer, gameMode, makeAIMove])

  // AI bonus turn
  useEffect(() => {
    if (!aiNeedsAnotherTurn || isProcessingMove || gamePhase !== "playing") return

    const timer = setTimeout(() => {
      console.log("[AI] AI taking another turn after box completion")
      setAiNeedsAnotherTurn(false)
      makeAIMove()
    }, 1000)

    return () => clearTimeout(timer)
  }, [aiNeedsAnotherTurn, isProcessingMove, gamePhase, makeAIMove])

  // Timer countdown
  useEffect(() => {
    if (gamePhase !== "playing" || timer <= 0) return

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setWinner(scores.player1 > scores.player2 ? "player1" : "player2")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gamePhase, timer, scores])

  // Handle line click
  const handleLineClick = useCallback(
    (lineId: string) => {
      if (isProcessingMove || drawnLines.has(lineId) || gamePhase !== "playing") return

      // AI mode: only allow player 1 to click
      if (gameMode === "ai" && currentPlayer !== "player1") return

      // Multiplayer mode: WebSocket (NO SIGNATURES!)
      if (gameMode === "multiplayer") {
        if (!playerNum) {
          console.log('[Multiplayer] Player number not set')
          return
        }

        // Check if it's my turn
        const isMyTurn = (currentPlayer === "player1" && playerNum === 1) ||
                        (currentPlayer === "player2" && playerNum === 2)

        if (!isMyTurn) {
          console.log('[Multiplayer] Not my turn, ignoring click')
          return
        }

        console.log('[Multiplayer] 📤 Sending move via WebSocket:', lineId)

        // Add line locally (optimistic update)
        const newDrawnLines = new Set(drawnLines)
        newDrawnLines.add(lineId)
        setDrawnLines(newDrawnLines)

        // Check for completed boxes
        const { newBoxes, count: boxesCompleted } = checkBoxCompletion(lineId, newDrawnLines)

        if (boxesCompleted > 0) {
          console.log('[Multiplayer] ✅ Completed', boxesCompleted, 'box(es) - keeping turn')
          setMoveHistory((prev) => [...prev.slice(-2), `You completed ${boxesCompleted} box(es) - your turn again!`])
          // Keep current turn, don't switch
        } else {
          console.log('[Multiplayer] ⏭️ Passing turn to opponent')
          // Switch turns
          setCurrentPlayer(currentPlayer === "player1" ? "player2" : "player1")
          setMoveHistory((prev) => [...prev.slice(-2), "Turn passed to opponent"])
        }

        // Send move to opponent via WebSocket
        sendMove(lineId)
        return
      }

      // AI mode: process move locally
      setIsProcessingMove(true)

      const newDrawnLines = new Set(drawnLines)
      newDrawnLines.add(lineId)

      // Check for completed boxes
      const { newBoxes, count: boxesCompleted } = checkBoxCompletion(lineId, newDrawnLines)

      setDrawnLines(newDrawnLines)
      setCompletedBoxes(newBoxes)

      if (boxesCompleted > 0) {
        setScores((prev) => ({
          ...prev,
          player1: prev.player1 + boxesCompleted,
        }))
        setMoveHistory((prev) => [...prev.slice(-2), `You completed ${boxesCompleted} box(es) - your turn again!`])
      } else {
        setCurrentPlayer("player2")
        setMoveHistory((prev) => [...prev.slice(-2), "Turn passed"])
      }

      setIsProcessingMove(false)
    },
    [drawnLines, isProcessingMove, gameMode, currentPlayer, gamePhase, checkBoxCompletion, playerNum, sendMove],
  )

  const handleUsernameSubmit = (username: string) => {
    setPlayerUsername(username)
    setGamePhase("mode-select")
  }

  const handleSelectMode = (mode: "ai" | "multiplayer") => {
    setGameMode(mode)
    if (mode === "ai") {
      setGamePhase("difficulty-select")
    } else {
      setGamePhase("lobby")
    }
  }

  const handleSelectGridSize = (size: 3 | 4 | 5 | 6) => {
    setGridSize(size)
    if (gameMode === "ai") {
      setGamePhase("difficulty-select")
    } else {
      setGamePhase("lobby")
    }
  }

  const handleSelectDifficulty = (diff: Difficulty) => {
    setDifficulty(diff)
    setGamePhase("playing")
  }

  const handleCreateGame = () => {
    console.log('[GamePage] handleCreateGame called')
    console.log('[GamePage] createGame function:', createGame)
    createGame()
  }

  const handleJoinGame = (gameIdToJoin: bigint) => {
    console.log('[JoinGame] Joining game with ID:', gameIdToJoin)
    setGameId(gameIdToJoin)
    setIsJoiningGame(true)
    console.log('[JoinGame] Calling joinGame function...')
    joinGame(gameIdToJoin)
  }


  // Watch for successful game join - transition to playing after a delay
  useEffect(() => {
    if (gameJoined && gameId && gameMode === "multiplayer") {
      console.log('[GameJoined] Player 2 joined successfully. Waiting for GameStarted event...')
      // Stay in lobby briefly, then check if we should auto-start
      setTimeout(() => {
        console.log('[GameJoined] Timeout - force transition to playing')
        setGamePhase("playing")
        refetchGame()
      }, 3000) // Wait 3 seconds for GameStarted event, then force start
    }
  }, [gameJoined, gameId, gameMode])

  const handleReset = () => {
    setScores({ player1: 0, player2: 0 })
    setWinner(null)
    setMoveHistory([])
    setCurrentPlayer("player1")
    setTimer(180)
    setDrawnLines(new Set())
    setCompletedBoxes(new Map())
    setGamePhase("mode-select")
    setGameMode(null)
    setAiPlayer(null)
    setAiNeedsAnotherTurn(false)
    setGameId(undefined)
  }

  // Username setup phase
  if (!playerUsername && gamePhase === "username-setup" && isConnected) {
    return <UsernameSetup onSubmit={handleUsernameSubmit} address={address || ""} />
  }

  // Show wallet connection prompt
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 via-indigo-950 to-slate-950">
        <Header timer={timer} />
        <div className="flex h-[calc(100vh-120px)] items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full"
          >
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome to BoxBattle!
              </h1>
              <p className="text-xl text-slate-300 mb-2">The Ultimate Web3 Strategy Game</p>
              <p className="text-purple-400">Connect your wallet to start playing</p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }


  // Difficulty selection screen
  if (gamePhase === "difficulty-select" && gameMode === "ai") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 via-indigo-950 to-slate-950">
        <Header timer={timer} />
        <div className="flex h-[calc(100vh-120px)] items-center justify-center p-6">
          <DifficultySelector
            onSelectDifficulty={handleSelectDifficulty}
            onBack={() => setGamePhase("mode-select")}
            gridSize={gridSize}
            onGridSizeChange={(size) => setGridSize(size as 3 | 4 | 5 | 6)}
          />
        </div>
      </div>
    )
  }

  // Mode selection screen
  if (gamePhase === "mode-select") {
    return (
      <GameModeSelector
        onSelectMode={handleSelectMode}
        gridSize={gridSize}
        onGridSizeChange={(size) => setGridSize(size as 3 | 4 | 5 | 6)}
      />
    )
  }

  // Multiplayer lobby
  if (gamePhase === "lobby" && gameMode === "multiplayer") {
    return (
      <MultiplayerLobby
        onJoinGame={handleJoinGame}
        onCreateGame={handleCreateGame}
        onBack={() => setGamePhase("mode-select")}
        playerAddress={address || ""}
        createdGameId={gameId}
        isWaitingForOpponent={gameId !== undefined}
        gridSize={gridSize}
        onGridSizeChange={(size) => setGridSize(size as 3 | 4 | 5 | 6)}
        isJoining={isJoiningGame}
      />
    )
  }

  // Get player names
  const player1Name = gameMode === "ai"
    ? playerUsername
    : address && gameState?.player1.toLowerCase() === address.toLowerCase()
      ? playerUsername // If I'm player 1, use my username
      : localStorage.getItem(`username_${gameState?.player1}`) || `${gameState?.player1?.slice(0, 6)}...${gameState?.player1?.slice(-4)}`

  const player2Name = gameMode === "ai"
    ? `AI (${difficulty})`
    : address && gameState?.player2?.toLowerCase() === address.toLowerCase()
      ? playerUsername // If I'm player 2, use my username
      : localStorage.getItem(`username_${gameState?.player2}`) || (gameState?.player2 ? `${gameState.player2.slice(0, 6)}...${gameState.player2.slice(-4)}` : "Waiting...")

  // Get scores
  const player1Score = gameMode === "ai" ? scores.player1 : (gameState?.player1Score || 0)
  const player2Score = gameMode === "ai" ? scores.player2 : (gameState?.player2Score || 0)

  // Determine if current user is player1
  const isPlayerOne = gameMode === "ai" ? true : (address && gameState ? address.toLowerCase() === gameState.player1.toLowerCase() : true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 via-indigo-950 to-slate-950">
      <Header timer={timer} gameMode={gameMode} />

      <div className="flex h-[calc(100vh-120px)] gap-4 p-6">
        {/* Left Player Card */}
        <div className="w-1/4">
          <PlayerCard
            playerNum={1}
            score={player1Score}
            isActive={currentPlayer === "player1"}
            address={player1Name}
          />
        </div>

        {/* Center Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <GameBoard
            currentPlayer={currentPlayer}
            onLineClick={handleLineClick}
            drawnLines={drawnLines}
            completedBoxes={completedBoxes}
            gridSize={gridSize}
          />
          <div className="text-center">
            <p className="text-sm text-cyan-300 mb-2 font-bold animate-pulse">
              {currentPlayer === "player1"
                ? gameMode === "ai"
                  ? "🟢 YOUR TURN!"
                  : "🔵 BLUE PLAYER'S TURN"
                : gameMode === "ai"
                  ? "🤖 AI IS THINKING..."
                  : "🔴 RED PLAYER'S TURN"}
            </p>
            <MoveHistory moves={moveHistory} />
          </div>
        </div>

        {/* Right Player Card */}
        <div className="w-1/4">
          <PlayerCard
            playerNum={2}
            score={player2Score}
            isActive={currentPlayer === "player2"}
            address={player2Name}
          />
        </div>
      </div>

      {/* Winner Overlay */}
      {winner && (
        <WinnerOverlay
          winner={winner}
          scores={{ player1: player1Score, player2: player2Score }}
          onPlayAgain={handleReset}
          isPlayerOne={isPlayerOne}
          player1Name={player1Name}
          player2Name={player2Name}
          gameMode={gameMode || "ai"}
        />
      )}
    </div>
  )
}
