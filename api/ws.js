// Vercel Serverless WebSocket API Route
// This handles WebSocket connections for multiplayer game rooms

// Store active game rooms in memory (shared across connections)
const gameRooms = new Map();
const playerInfo = new Map();

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req, res) {
  // Check if this is a WebSocket upgrade request
  if (req.headers.upgrade !== 'websocket') {
    res.status(426).json({ error: 'Upgrade Required' })
    return
  }

  // Vercel automatically handles WebSocket upgrades
  // We need to use the socket from the request
  const socket = req.socket
  const ws = socket

  console.log('🔌 New WebSocket connection')

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString())
      console.log('📨 Received:', data.type)

      switch (data.type) {
        case 'join':
          handleJoinGame(ws, data)
          break

        case 'move':
          handleMove(ws, data)
          break

        case 'leave':
          handleLeaveGame(ws)
          break

        default:
          console.warn('⚠️ Unknown message type:', data.type)
      }
    } catch (error) {
      console.error('❌ Error processing message:', error)
    }
  })

  ws.on('close', () => {
    console.log('👋 Client disconnected')
    handleLeaveGame(ws)
  })

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error)
  })
}

function handleJoinGame(ws, data) {
  const { gameId, address, playerNum } = data

  console.log(`🎮 Player ${playerNum} joining game ${gameId}`)

  playerInfo.set(ws, { gameId, address, playerNum })

  if (!gameRooms.has(gameId)) {
    gameRooms.set(gameId, new Set())
  }
  gameRooms.get(gameId).add(ws)

  ws.send(JSON.stringify({
    type: 'joined',
    gameId,
    playersInRoom: gameRooms.get(gameId).size
  }))

  broadcastToRoom(gameId, ws, {
    type: 'player-joined',
    playerNum,
    address,
    playersInRoom: gameRooms.get(gameId).size
  })

  console.log(`✅ Game ${gameId} now has ${gameRooms.get(gameId).size} players`)
}

function handleMove(ws, data) {
  const playerData = playerInfo.get(ws)

  if (!playerData) {
    console.error('❌ Move from unknown player')
    return
  }

  const { gameId } = playerData
  const { lineId, playerNum } = data

  console.log(`🎯 Player ${playerNum} placed line: ${lineId}`)

  broadcastToRoom(gameId, ws, {
    type: 'opponent-move',
    lineId,
    playerNum,
    timestamp: Date.now()
  })
}

function handleLeaveGame(ws) {
  const playerData = playerInfo.get(ws)

  if (!playerData) return

  const { gameId, playerNum, address } = playerData

  console.log(`👋 Player ${playerNum} leaving game ${gameId}`)

  if (gameRooms.has(gameId)) {
    gameRooms.get(gameId).delete(ws)

    if (gameRooms.get(gameId).size === 0) {
      gameRooms.delete(gameId)
      console.log(`🗑️ Game ${gameId} room deleted`)
    } else {
      broadcastToRoom(gameId, ws, {
        type: 'player-left',
        playerNum,
        address
      })
    }
  }

  playerInfo.delete(ws)
}

function broadcastToRoom(gameId, senderWs, message) {
  if (!gameRooms.has(gameId)) return

  const room = gameRooms.get(gameId)

  room.forEach((clientWs) => {
    if (clientWs !== senderWs && clientWs.readyState === 1) { // 1 = OPEN
      try {
        clientWs.send(JSON.stringify(message))
      } catch (error) {
        console.error('Error sending to client:', error)
      }
    }
  })
}
