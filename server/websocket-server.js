const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

// Store active game rooms: gameId -> Set of WebSocket connections
const gameRooms = new Map();

// Store player info: ws -> { gameId, address, playerNum }
const playerInfo = new Map();

console.log(`🎮 BoxBattle WebSocket Server running on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  console.log('🔌 New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('📨 Received:', data.type, data);

      switch (data.type) {
        case 'join':
          handleJoinGame(ws, data);
          break;

        case 'move':
          handleMove(ws, data);
          break;

        case 'player-quit':
          handlePlayerQuit(ws, data);
          break;

        case 'leave':
          handleLeaveGame(ws);
          break;

        default:
          console.warn('⚠️ Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('👋 Client disconnected');
    handleLeaveGame(ws);
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

function handleJoinGame(ws, data) {
  const { gameId, address, playerNum, gridSize } = data;

  console.log(`🎮 Player ${playerNum} (${address}) joining game ${gameId} with gridSize ${gridSize}`);

  // Store player info (including gridSize for Player 1)
  playerInfo.set(ws, { gameId, address, playerNum, gridSize });

  // Add player to game room
  if (!gameRooms.has(gameId)) {
    gameRooms.set(gameId, new Set());
  }
  gameRooms.get(gameId).add(ws);

  // Notify player they joined successfully
  ws.send(JSON.stringify({
    type: 'joined',
    gameId,
    playersInRoom: gameRooms.get(gameId).size
  }));

  // If Player 2 is joining, send them Player 1's grid size
  if (playerNum === 2) {
    // Find Player 1's grid size
    let player1GridSize = 5; // Default
    gameRooms.get(gameId).forEach((clientWs) => {
      const clientData = playerInfo.get(clientWs);
      if (clientData && clientData.playerNum === 1 && clientData.gridSize) {
        player1GridSize = clientData.gridSize;
      }
    });

    // Send grid size to Player 2
    ws.send(JSON.stringify({
      type: 'grid-size',
      gridSize: player1GridSize
    }));
    console.log(`📏 Sent grid size ${player1GridSize} to Player 2`);
  }

  // Notify other players in the room
  broadcastToRoom(gameId, ws, {
    type: 'player-joined',
    playerNum,
    address,
    playersInRoom: gameRooms.get(gameId).size
  });

  console.log(`✅ Game ${gameId} now has ${gameRooms.get(gameId).size} players`);
}

function handleMove(ws, data) {
  const playerData = playerInfo.get(ws);

  if (!playerData) {
    console.error('❌ Move from unknown player');
    return;
  }

  const { gameId } = playerData;
  const { lineId, playerNum } = data;

  console.log(`🎯 Player ${playerNum} placed line: ${lineId} in game ${gameId}`);

  // Broadcast move to all other players in the room
  broadcastToRoom(gameId, ws, {
    type: 'opponent-move',
    lineId,
    playerNum,
    timestamp: Date.now()
  });
}

function handlePlayerQuit(ws, data) {
  const playerData = playerInfo.get(ws);

  if (!playerData) {
    console.error('❌ Quit from unknown player');
    return;
  }

  const { gameId } = playerData;
  const { playerNum } = data;

  console.log(`🚪 Player ${playerNum} quit game ${gameId}`);

  // Broadcast quit to all other players in the room
  broadcastToRoom(gameId, ws, {
    type: 'player-quit',
    playerNum,
    timestamp: Date.now()
  });
}

function handleLeaveGame(ws) {
  const playerData = playerInfo.get(ws);

  if (!playerData) return;

  const { gameId, playerNum, address } = playerData;

  console.log(`👋 Player ${playerNum} (${address}) leaving game ${gameId}`);

  // Remove from room
  if (gameRooms.has(gameId)) {
    gameRooms.get(gameId).delete(ws);

    // If room is empty, delete it
    if (gameRooms.get(gameId).size === 0) {
      gameRooms.delete(gameId);
      console.log(`🗑️ Game ${gameId} room deleted (empty)`);
    } else {
      // Notify other players
      broadcastToRoom(gameId, ws, {
        type: 'player-left',
        playerNum,
        address
      });
    }
  }

  playerInfo.delete(ws);
}

function broadcastToRoom(gameId, senderWs, message) {
  if (!gameRooms.has(gameId)) return;

  const room = gameRooms.get(gameId);

  room.forEach((ws) => {
    if (ws !== senderWs && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}

// Cleanup interval to remove stale connections
setInterval(() => {
  let staleCount = 0;

  playerInfo.forEach((data, ws) => {
    if (ws.readyState !== WebSocket.OPEN) {
      handleLeaveGame(ws);
      staleCount++;
    }
  });

  if (staleCount > 0) {
    console.log(`🧹 Cleaned up ${staleCount} stale connections`);
  }
}, 30000); // Check every 30 seconds
