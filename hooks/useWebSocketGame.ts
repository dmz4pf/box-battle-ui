import { useEffect, useRef, useState, useCallback } from 'react'
import { ENV } from '@/lib/env'

export interface WebSocketGameMessage {
  type: 'joined' | 'player-joined' | 'opponent-move' | 'player-left' | 'grid-size' | 'player-quit' | 'play-again-request' | 'play-again-response'
  gameId?: string
  playersInRoom?: number
  playerNum?: number
  address?: string
  lineId?: string
  gridSize?: number
  timestamp?: number
  accepted?: boolean
}

export interface UseWebSocketGameProps {
  gameId?: bigint
  playerAddress?: string
  playerNum?: number
  gridSize?: number
  onOpponentMove?: (lineId: string, playerNum: number) => void
  onPlayerJoined?: (playerNum: number, address: string) => void
  onPlayerLeft?: (playerNum: number, address: string) => void
  onPlayerQuit?: (playerNum: number) => void
  onGridSizeReceived?: (gridSize: number) => void
  onPlayAgainRequest?: (playerNum: number) => void
  onPlayAgainResponse?: (accepted: boolean) => void
  enabled?: boolean
}

const WS_URL = ENV.WS_URL

export function useWebSocketGame({
  gameId,
  playerAddress,
  playerNum,
  gridSize,
  onOpponentMove,
  onPlayerJoined,
  onPlayerLeft,
  onPlayerQuit,
  onGridSizeReceived,
  onPlayAgainRequest,
  onPlayAgainResponse,
  enabled = true
}: UseWebSocketGameProps) {
  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Store callbacks in refs to avoid reconnection on callback change
  const onOpponentMoveRef = useRef(onOpponentMove)
  const onPlayerJoinedRef = useRef(onPlayerJoined)
  const onPlayerLeftRef = useRef(onPlayerLeft)
  const onPlayerQuitRef = useRef(onPlayerQuit)
  const onGridSizeReceivedRef = useRef(onGridSizeReceived)
  const onPlayAgainRequestRef = useRef(onPlayAgainRequest)
  const onPlayAgainResponseRef = useRef(onPlayAgainResponse)

  // Update refs when callbacks change
  useEffect(() => {
    onOpponentMoveRef.current = onOpponentMove
    onPlayerJoinedRef.current = onPlayerJoined
    onPlayerLeftRef.current = onPlayerLeft
    onPlayerQuitRef.current = onPlayerQuit
    onGridSizeReceivedRef.current = onGridSizeReceived
    onPlayAgainRequestRef.current = onPlayAgainRequest
    onPlayAgainResponseRef.current = onPlayAgainResponse
  }, [onOpponentMove, onPlayerJoined, onPlayerLeft, onPlayerQuit, onGridSizeReceived, onPlayAgainRequest, onPlayAgainResponse])

  // Send move to opponent via WebSocket
  const sendMove = useCallback((lineId: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Cannot send move - not connected')
      return false
    }

    const message = {
      type: 'move',
      lineId,
      playerNum
    }

    console.log('[WebSocket] Sending move:', message)
    ws.current.send(JSON.stringify(message))
    return true
  }, [playerNum])

  // Send quit notification to opponent
  const sendQuit = useCallback(() => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Cannot send quit - not connected')
      return false
    }

    const message = {
      type: 'player-quit',
      playerNum
    }

    console.log('[WebSocket] Sending quit notification:', message)
    ws.current.send(JSON.stringify(message))
    return true
  }, [playerNum])

  // Send play again request to opponent
  const sendPlayAgainRequest = useCallback(() => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Cannot send play-again request - not connected')
      return false
    }

    const message = {
      type: 'play-again-request',
      playerNum
    }

    console.log('[WebSocket] Sending play-again request:', message)
    ws.current.send(JSON.stringify(message))
    return true
  }, [playerNum])

  // Send play again response to opponent
  const sendPlayAgainResponse = useCallback((accepted: boolean) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Cannot send play-again response - not connected')
      return false
    }

    const message = {
      type: 'play-again-response',
      playerNum,
      accepted
    }

    console.log('[WebSocket] Sending play-again response:', message)
    ws.current.send(JSON.stringify(message))
    return true
  }, [playerNum])

  // Connect to WebSocket server
  useEffect(() => {
    if (!enabled || !gameId || !playerAddress || playerNum === undefined) {
      console.log('[WebSocket] Not connecting - missing requirements', {
        enabled,
        gameId: gameId?.toString(),
        playerAddress,
        playerNum
      })
      return
    }

    console.log('[WebSocket] Connecting to game', gameId.toString())

    // Create WebSocket connection
    const socket = new WebSocket(WS_URL)
    ws.current = socket

    socket.onopen = () => {
      console.log('[WebSocket] Connected to server')
      setIsConnected(true)
      setError(null)

      // Join the game room
      const joinMessage = {
        type: 'join',
        gameId: gameId.toString(),
        address: playerAddress,
        playerNum,
        gridSize: gridSize || 5 // Send grid size (Player 1's selection)
      }

      console.log('[WebSocket] Joining game room:', joinMessage)
      socket.send(JSON.stringify(joinMessage))
    }

    socket.onmessage = (event) => {
      try {
        const message: WebSocketGameMessage = JSON.parse(event.data)
        console.log('[WebSocket] Received:', message)

        switch (message.type) {
          case 'joined':
            console.log(`[WebSocket] Successfully joined game ${message.gameId}`)
            console.log(`[WebSocket] Players in room: ${message.playersInRoom}`)
            break

          case 'player-joined':
            console.log(`[WebSocket] Player ${message.playerNum} joined`)
            if (onPlayerJoinedRef.current && message.playerNum && message.address) {
              onPlayerJoinedRef.current(message.playerNum, message.address)
            }
            break

          case 'opponent-move':
            console.log(`[WebSocket] Opponent placed line: ${message.lineId}`)
            if (onOpponentMoveRef.current && message.lineId && message.playerNum) {
              onOpponentMoveRef.current(message.lineId, message.playerNum)
            }
            break

          case 'player-left':
            console.log(`[WebSocket] Player ${message.playerNum} left`)
            if (onPlayerLeftRef.current && message.playerNum && message.address) {
              onPlayerLeftRef.current(message.playerNum, message.address)
            }
            break

          case 'grid-size':
            console.log(`[WebSocket] Received grid size: ${message.gridSize}`)
            if (onGridSizeReceivedRef.current && message.gridSize) {
              onGridSizeReceivedRef.current(message.gridSize)
            }
            break

          case 'player-quit':
            console.log(`[WebSocket] Player ${message.playerNum} quit the game`)
            if (onPlayerQuitRef.current && message.playerNum) {
              onPlayerQuitRef.current(message.playerNum)
            }
            break

          case 'play-again-request':
            console.log(`[WebSocket] Player ${message.playerNum} wants to play again`)
            if (onPlayAgainRequestRef.current && message.playerNum) {
              onPlayAgainRequestRef.current(message.playerNum)
            }
            break

          case 'play-again-response':
            console.log(`[WebSocket] Play again response: ${message.accepted ? 'accepted' : 'declined'}`)
            if (onPlayAgainResponseRef.current && message.accepted !== undefined) {
              onPlayAgainResponseRef.current(message.accepted)
            }
            break

          default:
            console.warn('[WebSocket] Unknown message type:', message)
        }
      } catch (error) {
        console.error('[WebSocket] Error parsing message:', error)
      }
    }

    socket.onerror = (error) => {
      console.error('[WebSocket] Error:', error)
      setError('WebSocket connection error')
    }

    socket.onclose = () => {
      console.log('[WebSocket] Disconnected')
      setIsConnected(false)
    }

    // Cleanup on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log('[WebSocket] Sending leave message and closing')
        socket.send(JSON.stringify({ type: 'leave' }))
        socket.close()
      }
    }
  }, [enabled, gameId, playerAddress, playerNum])

  return {
    isConnected,
    error,
    sendMove,
    sendQuit,
    sendPlayAgainRequest,
    sendPlayAgainResponse
  }
}
