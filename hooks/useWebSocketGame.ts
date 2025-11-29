import { useEffect, useRef, useState, useCallback } from 'react'

export interface WebSocketGameMessage {
  type: 'joined' | 'player-joined' | 'opponent-move' | 'player-left'
  gameId?: string
  playersInRoom?: number
  playerNum?: number
  address?: string
  lineId?: string
  timestamp?: number
}

export interface UseWebSocketGameProps {
  gameId?: bigint
  playerAddress?: string
  playerNum?: number
  onOpponentMove?: (lineId: string, playerNum: number) => void
  onPlayerJoined?: (playerNum: number, address: string) => void
  onPlayerLeft?: (playerNum: number, address: string) => void
  enabled?: boolean
}

const WS_URL = 'ws://localhost:8080'

export function useWebSocketGame({
  gameId,
  playerAddress,
  playerNum,
  onOpponentMove,
  onPlayerJoined,
  onPlayerLeft,
  enabled = true
}: UseWebSocketGameProps) {
  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        playerNum
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
            if (onPlayerJoined && message.playerNum && message.address) {
              onPlayerJoined(message.playerNum, message.address)
            }
            break

          case 'opponent-move':
            console.log(`[WebSocket] Opponent placed line: ${message.lineId}`)
            if (onOpponentMove && message.lineId && message.playerNum) {
              onOpponentMove(message.lineId, message.playerNum)
            }
            break

          case 'player-left':
            console.log(`[WebSocket] Player ${message.playerNum} left`)
            if (onPlayerLeft && message.playerNum && message.address) {
              onPlayerLeft(message.playerNum, message.address)
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
  }, [enabled, gameId, playerAddress, playerNum, onOpponentMove, onPlayerJoined, onPlayerLeft])

  return {
    isConnected,
    error,
    sendMove
  }
}
