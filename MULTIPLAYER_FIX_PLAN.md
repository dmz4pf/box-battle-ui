# BoxBattle Multiplayer - Comprehensive Fix Plan

## Executive Summary
This document outlines a systematic approach to fixing all 28+ identified issues in the BoxBattle multiplayer system. The plan is divided into phases to ensure stability at each step.

---

## Phase 1: Critical Infrastructure Fixes (P0)
**Goal:** Make multiplayer functional in production
**Timeline:** Complete before any production deployment

### 1.1 Environment Configuration System
**Files:** `lib/env.ts` (new), `.env.example` (update)

**Create robust environment validation:**
```typescript
// lib/env.ts
export const ENV = {
  // Contract
  GAME_CONTRACT_ADDRESS: validateAddress(process.env.NEXT_PUBLIC_GAME_CONTRACT),

  // WebSocket
  WS_URL: process.env.NEXT_PUBLIC_WS_URL ||
    (typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? `wss://${window.location.host}/ws`
      : 'ws://localhost:8080'),

  // Network
  CHAIN_ID: 50312, // Somnia Testnet
  RPC_URL: 'https://dream-rpc.somnia.network',
} as const

function validateAddress(addr: string | undefined): `0x${string}` {
  if (!addr || !addr.startsWith('0x') || addr.length !== 42) {
    throw new Error('Invalid GAME_CONTRACT_ADDRESS')
  }
  return addr as `0x${string}`
}
```

**Action Items:**
- [ ] Create `lib/env.ts` with validation
- [ ] Update `.env.example` with all required variables
- [ ] Add startup validation in `app/layout.tsx`
- [ ] Create deployment checklist for environment variables

---

### 1.2 WebSocket Production Architecture
**Files:** `lib/websocket-client.ts` (new), `server/websocket-server.js` (rewrite)

**New WebSocket Client with Reconnection:**
```typescript
// lib/websocket-client.ts
export class ReliableWebSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private heartbeatInterval: NodeJS.Timeout | null = null
  private messageQueue: Array<any> = []
  private sequenceNumber = 0

  constructor(
    private url: string,
    private onMessage: (data: any) => void,
    private onConnectionChange: (connected: boolean) => void
  ) {
    this.connect()
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected')
        this.reconnectAttempts = 0
        this.onConnectionChange(true)
        this.startHeartbeat()
        this.flushMessageQueue()
      }

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)

        // Handle heartbeat
        if (data.type === 'ping') {
          this.send({ type: 'pong' })
          return
        }

        this.onMessage(data)
      }

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
      }

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected')
        this.onConnectionChange(false)
        this.stopHeartbeat()
        this.attemptReconnect()
      }
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    setTimeout(() => this.connect(), delay)
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' })
      }
    }, 30000) // 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  send(data: any) {
    const message = {
      ...data,
      seq: this.sequenceNumber++,
      timestamp: Date.now()
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      // Queue message for retry when reconnected
      this.messageQueue.push(message)
    }
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      this.send(message)
    }
  }

  disconnect() {
    this.stopHeartbeat()
    this.ws?.close()
  }
}
```

**Production WebSocket Server Requirements:**
```javascript
// server/websocket-server.js (production-ready)
const WebSocket = require('ws')
const https = require('https')
const fs = require('fs')

// SSL Certificate for wss://
const server = https.createServer({
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  key: fs.readFileSync(process.env.SSL_KEY_PATH)
})

const wss = new WebSocket.Server({
  server,
  // Security
  verifyClient: (info, cb) => {
    // Verify origin
    const origin = info.origin
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
    if (!allowedOrigins.includes(origin)) {
      cb(false, 403, 'Forbidden')
      return
    }
    cb(true)
  }
})

// Rate limiting
const rateLimits = new Map() // clientId -> { messages: number, resetAt: timestamp }

// Game rooms with validation
class GameRoom {
  constructor(gameId) {
    this.gameId = gameId
    this.players = new Map() // playerAddress -> { ws, playerNum, lastSeen }
    this.gameState = {
      drawnLines: new Set(),
      completedBoxes: new Map(),
      scores: { player1: 0, player2: 0 },
      currentTurn: 1,
      sequenceNumber: 0
    }
  }

  addPlayer(address, ws, playerNum) {
    if (this.players.size >= 2) {
      throw new Error('Room full')
    }

    this.players.set(address, { ws, playerNum, lastSeen: Date.now() })
    return playerNum
  }

  isFull() {
    return this.players.size === 2
  }

  validateTurn(playerNum) {
    return this.gameState.currentTurn === playerNum
  }

  processMove(lineId, playerNum) {
    if (!this.validateTurn(playerNum)) {
      throw new Error('Not your turn')
    }

    if (this.gameState.drawnLines.has(lineId)) {
      throw new Error('Line already drawn')
    }

    // Add line
    this.gameState.drawnLines.add(lineId)
    this.gameState.sequenceNumber++

    // Check for completed boxes
    const completedBoxes = this.checkBoxCompletion(lineId)

    if (completedBoxes.length === 0) {
      // Switch turn
      this.gameState.currentTurn = this.gameState.currentTurn === 1 ? 2 : 1
    } else {
      // Player keeps turn
      const scoreKey = `player${playerNum}`
      this.gameState.scores[scoreKey] += completedBoxes.length
    }

    return {
      lineId,
      completedBoxes,
      newState: this.getState()
    }
  }

  getState() {
    return {
      drawnLines: Array.from(this.gameState.drawnLines),
      completedBoxes: Object.fromEntries(this.gameState.completedBoxes),
      scores: this.gameState.scores,
      currentTurn: this.gameState.currentTurn,
      sequenceNumber: this.gameState.sequenceNumber
    }
  }

  checkBoxCompletion(lineId) {
    // Implementation depends on grid size
    // Return array of box IDs that were completed
    return []
  }

  broadcast(message, excludeAddress = null) {
    this.players.forEach((player, address) => {
      if (address !== excludeAddress && player.ws.readyState === WebSocket.OPEN) {
        player.ws.send(JSON.stringify(message))
      }
    })
  }
}

const gameRooms = new Map() // gameId -> GameRoom

wss.on('connection', (ws, req) => {
  let currentGameId = null
  let currentAddress = null

  // Heartbeat
  ws.isAlive = true
  ws.on('pong', () => { ws.isAlive = true })

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data)

      // Rate limiting
      const clientId = req.socket.remoteAddress
      if (!checkRateLimit(clientId)) {
        ws.send(JSON.stringify({ type: 'error', message: 'Rate limit exceeded' }))
        return
      }

      switch (message.type) {
        case 'join':
          handleJoin(ws, message)
          break
        case 'move':
          handleMove(ws, message)
          break
        case 'leave':
          handleLeave(ws)
          break
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }))
          break
      }
    } catch (error) {
      console.error('Error processing message:', error)
      ws.send(JSON.stringify({ type: 'error', message: error.message }))
    }
  })

  ws.on('close', () => {
    handleLeave(ws)
  })

  function handleJoin(ws, message) {
    const { gameId, playerAddress, playerNum } = message

    if (!gameRooms.has(gameId)) {
      gameRooms.set(gameId, new GameRoom(gameId))
    }

    const room = gameRooms.get(gameId)
    room.addPlayer(playerAddress, ws, playerNum)

    currentGameId = gameId
    currentAddress = playerAddress

    // Send current state to joining player
    ws.send(JSON.stringify({
      type: 'state-sync',
      state: room.getState()
    }))

    // Notify other players
    room.broadcast({
      type: 'player-joined',
      playerNum,
      playerAddress
    }, playerAddress)

    // If room is full, start game
    if (room.isFull()) {
      room.broadcast({
        type: 'game-start'
      })
    }
  }

  function handleMove(ws, message) {
    const { gameId, lineId, playerNum } = message

    const room = gameRooms.get(gameId)
    if (!room) {
      throw new Error('Game not found')
    }

    const result = room.processMove(lineId, playerNum)

    // Broadcast move to all players
    room.broadcast({
      type: 'move',
      lineId,
      playerNum,
      completedBoxes: result.completedBoxes,
      state: result.newState
    })
  }

  function handleLeave(ws) {
    if (currentGameId && currentAddress) {
      const room = gameRooms.get(currentGameId)
      if (room) {
        room.players.delete(currentAddress)

        // Notify other players
        room.broadcast({
          type: 'player-left',
          playerAddress: currentAddress
        })

        // Clean up empty rooms
        if (room.players.size === 0) {
          gameRooms.delete(currentGameId)
        }
      }
    }
  }
})

// Heartbeat to detect dead connections
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate()
    }
    ws.isAlive = false
    ws.ping()
  })
}, 30000)

function checkRateLimit(clientId) {
  const limit = 100 // messages per minute
  const now = Date.now()

  if (!rateLimits.has(clientId)) {
    rateLimits.set(clientId, { messages: 1, resetAt: now + 60000 })
    return true
  }

  const clientLimit = rateLimits.get(clientId)

  if (now > clientLimit.resetAt) {
    clientLimit.messages = 1
    clientLimit.resetAt = now + 60000
    return true
  }

  if (clientLimit.messages >= limit) {
    return false
  }

  clientLimit.messages++
  return true
}

server.listen(process.env.WS_PORT || 8080)
```

**Action Items:**
- [ ] Implement `ReliableWebSocket` class
- [ ] Rewrite WebSocket server with production features
- [ ] Add SSL certificate support
- [ ] Implement authentication tokens
- [ ] Add comprehensive error handling
- [ ] Test reconnection scenarios
- [ ] Load test with 100+ concurrent games

---

### 1.3 Fix Player Number Bug
**File:** `app/game/page.tsx`

**Problem:** `playerNum` sticks after creating/joining multiple games

**Solution:**
```typescript
// app/game/page.tsx
const [playerNum, setPlayerNum] = useState<1 | 2 | undefined>()

// Reset player number when game mode changes
useEffect(() => {
  if (gameMode !== "multiplayer") {
    setPlayerNum(undefined)
    setIsJoiningGame(false)
  }
}, [gameMode])

// Set player number when creating game
useEffect(() => {
  if (gameId && !isJoiningGame && gameMode === "multiplayer") {
    setPlayerNum(1)
  }
}, [gameId, isJoiningGame, gameMode])

// Set player number when joining game
useEffect(() => {
  if (gameJoined && isJoiningGame && gameMode === "multiplayer") {
    setPlayerNum(2)
  }
}, [gameJoined, isJoiningGame, gameMode])
```

**Action Items:**
- [ ] Convert playerNum to state
- [ ] Add reset logic on mode change
- [ ] Add console logging for debugging
- [ ] Test: Create game → Reset → Create another game
- [ ] Test: Join game → Reset → Join another game

---

### 1.4 Implement Multiplayer Winner Detection
**File:** `app/game/page.tsx`

**Current Issue:** Winner only calculated for AI mode (line 395: `gameMode === "ai"`)

**Solution:**
```typescript
// app/game/page.tsx
useEffect(() => {
  // Check for game end in BOTH AI and Multiplayer modes
  if (completedBoxes.size === totalBoxes && gamePhase === "playing") {
    const p1Score = scores.player1
    const p2Score = scores.player2

    let winningPlayer: "player1" | "player2"

    if (p1Score > p2Score) {
      winningPlayer = "player1"
      if (gameMode === "ai" || (gameMode === "multiplayer" && playerNum === 1)) {
        playWin()
      } else {
        playLose()
      }
    } else if (p2Score > p1Score) {
      winningPlayer = "player2"
      if (gameMode === "ai" || (gameMode === "multiplayer" && playerNum === 2)) {
        playWin()
      } else {
        playLose()
      }
    } else {
      // Tie: player1 wins tiebreaker
      winningPlayer = "player1"
      if (gameMode === "ai" || (gameMode === "multiplayer" && playerNum === 1)) {
        playWin()
      } else {
        playLose()
      }
    }

    console.log("[Game] Game over!", {
      mode: gameMode,
      p1Score,
      p2Score,
      winner: winningPlayer,
      yourPlayerNum: playerNum
    })

    setWinner(winningPlayer)

    // In multiplayer, notify server
    if (gameMode === "multiplayer" && gameId) {
      // Send game end to WebSocket
      sendMessage({
        type: 'game-end',
        gameId,
        winner: winningPlayer,
        scores: { player1: p1Score, player2: p2Score }
      })
    }
  }
}, [completedBoxes, totalBoxes, gamePhase, scores, gameMode, playerNum])
```

**Action Items:**
- [ ] Remove `gameMode === "ai"` condition
- [ ] Add player-specific win/lose sounds
- [ ] Add WebSocket notification for game end
- [ ] Update blockchain with final scores
- [ ] Test with 2 players on separate devices

---

### 1.5 Fix WebSocket URL
**File:** `hooks/useWebSocketGame.ts`

**Replace hardcoded URL with environment variable:**
```typescript
import { ENV } from '@/lib/env'

const wsUrl = ENV.WS_URL
```

**Action Items:**
- [ ] Replace hardcoded URL
- [ ] Add production WebSocket URL to Vercel
- [ ] Test with production deployment
- [ ] Add connection status indicator in UI

---

## Phase 2: Transaction & Blockchain Fixes (P1)
**Goal:** Make transactions reliable and recoverable

### 2.1 Transaction Timeout Handling
**File:** `app/game/page.tsx`

```typescript
const TRANSACTION_TIMEOUT = 60000 // 60 seconds

useEffect(() => {
  if (!createTxHash) return

  const timeout = setTimeout(() => {
    if (isWaitingForReceipt) {
      console.error('Transaction timeout after 60s')
      alert('Transaction is taking longer than expected. Please check your wallet or blockchain explorer.')
      // Reset state to allow retry
      setIsWaitingForReceipt(false)
    }
  }, TRANSACTION_TIMEOUT)

  return () => clearTimeout(timeout)
}, [createTxHash, isWaitingForReceipt])
```

**Action Items:**
- [ ] Add timeout for createGame transactions
- [ ] Add timeout for joinGame transactions
- [ ] Show "Check explorer" link with tx hash
- [ ] Add manual retry button
- [ ] Test with Somnia testnet congestion

---

### 2.2 Transaction Receipt Validation
**File:** `app/game/page.tsx`

```typescript
useEffect(() => {
  if (createReceipt) {
    // VALIDATE transaction succeeded
    if (createReceipt.status !== 'success') {
      console.error('[CreateGame] Transaction failed!', createReceipt)
      alert('Transaction failed. Please try again.')
      // Reset state
      setGamePhase('lobby')
      return
    }

    // Extract gameId from logs
    const gameId = extractGameIdFromReceipt(createReceipt)

    if (!gameId) {
      console.error('[CreateGame] Could not extract gameId from receipt')
      alert('Game created but ID not found. Please check blockchain explorer.')
      return
    }

    console.log('[CreateGame] Success! Game ID:', gameId)
    setGameId(gameId)
  }
}, [createReceipt])
```

**Action Items:**
- [ ] Add status check to all receipt handlers
- [ ] Add better error messages
- [ ] Add retry logic
- [ ] Log failed transactions to analytics

---

### 2.3 Remove Hardcoded Gas Limits
**File:** `hooks/useGameContract.ts`

```typescript
// Use gas estimation instead of hardcoded limits
export function useCreateGame() {
  const { writeContract, hash, isPending } = useWriteContract()

  const createGame = async () => {
    const feeValue = parseEther("0.01")

    try {
      // Estimate gas first
      const estimatedGas = await publicClient.estimateContractGas({
        address: GAME_CONTRACT_ADDRESS,
        abi: GAME_CONTRACT_ABI,
        functionName: 'createGame',
        value: feeValue,
      })

      // Add 20% buffer
      const gasLimit = (estimatedGas * 120n) / 100n

      writeContract({
        address: GAME_CONTRACT_ADDRESS,
        abi: GAME_CONTRACT_ABI,
        functionName: 'createGame',
        value: feeValue,
        gas: gasLimit,
      })
    } catch (error) {
      console.error('Gas estimation failed:', error)
      // Fallback to safe default
      writeContract({
        address: GAME_CONTRACT_ADDRESS,
        abi: GAME_CONTRACT_ABI,
        functionName: 'createGame',
        value: feeValue,
        gas: 500000n,
      })
    }
  }

  return { createGame, hash, isPending }
}
```

**Action Items:**
- [ ] Add gas estimation to createGame
- [ ] Add gas estimation to joinGame
- [ ] Add gas estimation to placeLine
- [ ] Handle estimation failures gracefully
- [ ] Test with different network conditions

---

## Phase 3: Game State Synchronization (P1)

### 3.1 Fix Score Duplication Bug
**File:** `app/game/page.tsx`

**Problem:** Box completion calculated in 2 places

**Solution:** Single source of truth
```typescript
// Remove the recalculation useEffect on lines 271-307
// Keep ONLY the calculation in handleLineClick and onOpponentMove

// In onOpponentMove WebSocket handler:
onOpponentMove: (lineId, opponentPlayerNum) => {
  setDrawnLines((prev) => {
    const updated = new Set(prev)
    updated.add(lineId)

    // Calculate boxes ONCE, right here
    const { newBoxes, count: boxesCompleted } = checkBoxCompletion(lineId, updated)

    if (boxesCompleted > 0) {
      // Update completed boxes immediately
      setCompletedBoxes(newBoxes)

      // Update score
      const scoreKey = opponentPlayerNum === 1 ? 'player1' : 'player2'
      setScores(prev => ({
        ...prev,
        [scoreKey]: prev[scoreKey] + boxesCompleted
      }))

      // Opponent keeps turn
    } else {
      // Switch turn
      setCurrentPlayer(opponentPlayerNum === 1 ? "player2" : "player1")
    }

    return updated
  })
}
```

**Action Items:**
- [ ] Remove duplicate useEffect
- [ ] Consolidate box completion logic
- [ ] Add unit tests for scoring
- [ ] Test edge case: simultaneous box completions

---

### 3.2 Add Game State Sync on Reconnect
**File:** `hooks/useWebSocketGame.ts`

```typescript
useEffect(() => {
  if (isConnected && gameId) {
    // Request state sync when reconnecting
    ws.send(JSON.stringify({
      type: 'request-sync',
      gameId,
      playerAddress
    }))
  }
}, [isConnected, gameId])

// Add handler for state-sync messages
useEffect(() => {
  if (!ws) return

  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data)

    if (data.type === 'state-sync') {
      console.log('[WebSocket] Syncing state from server:', data.state)

      // Update local state with server state
      setDrawnLines(new Set(data.state.drawnLines))
      setCompletedBoxes(new Map(Object.entries(data.state.completedBoxes)))
      setScores(data.state.scores)
      setCurrentPlayer(data.state.currentTurn === 1 ? 'player1' : 'player2')
    }
  }

  ws.addEventListener('message', handleMessage)
  return () => ws.removeEventListener('message', handleMessage)
}, [ws])
```

**Action Items:**
- [ ] Add state-sync message type
- [ ] Server stores authoritative game state
- [ ] Send full state on reconnect
- [ ] Test: disconnect → reconnect → verify state matches
- [ ] Test: refresh page → verify can resume game

---

### 3.3 Fix Turn Race Condition
**File:** Server-side validation (new)

**Server becomes source of truth for turns:**
```javascript
// In server/websocket-server.js
function handleMove(ws, message) {
  const { gameId, lineId, playerNum } = message

  const room = gameRooms.get(gameId)
  if (!room) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Game not found',
      code: 'GAME_NOT_FOUND'
    }))
    return
  }

  // SERVER-SIDE TURN VALIDATION
  if (room.gameState.currentTurn !== playerNum) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Not your turn',
      code: 'INVALID_TURN',
      currentTurn: room.gameState.currentTurn
    }))
    return
  }

  // SERVER-SIDE LINE VALIDATION
  if (room.gameState.drawnLines.has(lineId)) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Line already drawn',
      code: 'LINE_EXISTS'
    }))
    return
  }

  // Process move
  try {
    const result = room.processMove(lineId, playerNum)

    // Broadcast validated move to ALL players (including sender)
    room.broadcast({
      type: 'move-confirmed',
      lineId,
      playerNum,
      completedBoxes: result.completedBoxes,
      state: result.newState
    })
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'error',
      message: error.message,
      code: 'MOVE_FAILED'
    }))
  }
}
```

**Action Items:**
- [ ] Add server-side turn validation
- [ ] Add server-side line existence check
- [ ] Client waits for 'move-confirmed' before updating UI
- [ ] Show loading state while waiting for confirmation
- [ ] Add rollback if server rejects move

---

## Phase 4: UI/UX Polish (P2)

### 4.1 Fix Wallet Modal Z-Index Issue
**Files:** `components/landing/navigation.tsx`, `components/header.tsx`

**Add explicit z-index inline styles:**
```typescript
<div
  ref={modalBackdropRef}
  className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
  onClick={handleCloseModal}
  style={{
    opacity: 0,
    zIndex: 9999  // Explicit high z-index
  }}
>
```

**Action Items:**
- [ ] Add explicit z-index to modal backdrop
- [ ] Test on all pages (landing, game, etc.)
- [ ] Verify no elements have higher z-index
- [ ] Test with browser dev tools

---

### 4.2 Add Loading States for All Transactions
**File:** `components/multiplayer-lobby.tsx`

```typescript
export default function MultiplayerLobby({ onGameStart, gridSize }: Props) {
  const { createGame, isPending: isCreating } = useCreateGame()
  const { joinGame, isPending: isJoining } = useJoinGame()
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'confirming' | 'confirmed'>('idle')

  return (
    <button
      onClick={handleCreateGame}
      disabled={!isOnSomniaTestnet || isCreating || txStatus !== 'idle'}
      className="..."
    >
      {isCreating && <Spinner className="w-4 h-4 animate-spin" />}
      {txStatus === 'confirming' && <Clock className="w-4 h-4 animate-pulse" />}
      {txStatus === 'idle' && 'Create Game & Wait for Opponent'}
      {txStatus === 'pending' && 'Waiting for wallet...'}
      {txStatus === 'confirming' && 'Confirming transaction...'}
    </button>
  )
}
```

**Action Items:**
- [ ] Add loading spinner component
- [ ] Show different states: wallet approval, tx pending, confirming
- [ ] Add estimated time remaining
- [ ] Add cancel button for stuck transactions
- [ ] Test with MetaMask, Rabby, other wallets

---

### 4.3 Replace alert() with Toast Notifications
**File:** `components/ui/toast.tsx` (new)

```typescript
// Use react-hot-toast or similar
import { Toaster, toast } from 'react-hot-toast'

// Replace all alert() calls with:
toast.error('Please switch to Somnia Testnet')
toast.success('Transaction confirmed!')
toast.loading('Waiting for confirmation...')
```

**Action Items:**
- [ ] Install react-hot-toast
- [ ] Create toast wrapper component
- [ ] Replace all alert() calls
- [ ] Replace all console.log errors with toasts
- [ ] Style toasts to match design system

---

### 4.4 Add Connection Status Indicator
**File:** `components/connection-status.tsx` (new)

```typescript
export function ConnectionStatus() {
  const { isConnected: walletConnected } = useAccount()
  const { isConnected: wsConnected } = useWebSocket()

  if (!walletConnected || !wsConnected) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-500/10 border border-yellow-500 rounded-lg px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <span className="text-sm text-yellow-500">
            {!walletConnected && 'Wallet disconnected'}
            {walletConnected && !wsConnected && 'Server disconnected'}
          </span>
        </div>
      </div>
    )
  }

  return null
}
```

**Action Items:**
- [ ] Create connection status component
- [ ] Add to game page
- [ ] Show reconnecting state
- [ ] Add retry button
- [ ] Test with network disconnects

---

## Phase 5: Testing & Validation

### 5.1 End-to-End Testing Scenarios
**Create test suite for critical paths:**

```typescript
// tests/e2e/multiplayer.test.ts
describe('Multiplayer Game Flow', () => {
  test('Player 1 creates game, Player 2 joins, game completes', async () => {
    // 1. Player 1 connects wallet
    // 2. Player 1 creates game
    // 3. Verify game ID generated
    // 4. Player 2 connects wallet
    // 5. Player 2 joins game using ID
    // 6. Verify both players see game start
    // 7. Players alternate moves
    // 8. Verify scores update correctly
    // 9. Game ends, winner declared
    // 10. Verify blockchain state matches
  })

  test('Reconnection mid-game', async () => {
    // 1. Start game with 2 players
    // 2. Player 1 makes 3 moves
    // 3. Player 1 disconnects WebSocket
    // 4. Player 2 makes 2 moves
    // 5. Player 1 reconnects
    // 6. Verify Player 1 sees all 5 moves
    // 7. Verify game can continue
  })

  test('Race condition: both players click simultaneously', async () => {
    // 1. Start game, Player 1's turn
    // 2. Both players click different lines at exact same time
    // 3. Verify only Player 1's move is accepted
    // 4. Verify Player 2 gets "not your turn" error
    // 5. Verify game state is consistent
  })
})
```

**Action Items:**
- [ ] Set up Playwright/Cypress
- [ ] Write 20+ E2E tests
- [ ] Set up CI/CD to run tests on every commit
- [ ] Test on multiple browsers
- [ ] Test on mobile devices

---

### 5.2 Load Testing
**Test with multiple concurrent games:**

```javascript
// tests/load/websocket-stress.js
const WebSocket = require('ws')

// Simulate 100 concurrent games (200 players)
async function stressTest() {
  const games = []

  for (let i = 0; i < 100; i++) {
    const gameId = BigInt(i)

    // Create 2 players per game
    const player1 = new WebSocket('ws://localhost:8080')
    const player2 = new WebSocket('ws://localhost:8080')

    // Join game
    player1.on('open', () => {
      player1.send(JSON.stringify({
        type: 'join',
        gameId,
        playerAddress: `0x${i}1`,
        playerNum: 1
      }))
    })

    player2.on('open', () => {
      player2.send(JSON.stringify({
        type: 'join',
        gameId,
        playerAddress: `0x${i}2`,
        playerNum: 2
      }))
    })

    games.push({ player1, player2, gameId })
  }

  // Simulate random moves from all players
  setInterval(() => {
    games.forEach(({ player1, player2, gameId }) => {
      const player = Math.random() > 0.5 ? player1 : player2
      const lineId = `h-${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}`

      player.send(JSON.stringify({
        type: 'move',
        gameId,
        lineId,
        playerNum: player === player1 ? 1 : 2
      }))
    })
  }, 100) // 10 moves per second per game = 1000 moves/sec total
}

stressTest()
```

**Action Items:**
- [ ] Set up load testing framework
- [ ] Test with 100, 500, 1000 concurrent games
- [ ] Monitor server CPU, memory, network
- [ ] Identify bottlenecks
- [ ] Optimize server performance
- [ ] Set up auto-scaling for production

---

## Phase 6: Monitoring & Analytics

### 6.1 Add Error Tracking
**Install Sentry or similar:**

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

export function logError(error: Error, context?: Record<string, any>) {
  console.error(error)

  Sentry.captureException(error, {
    extra: context
  })
}

export function logEvent(eventName: string, data?: Record<string, any>) {
  console.log(eventName, data)

  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, data)
  }
}
```

**Action Items:**
- [ ] Install Sentry
- [ ] Add error boundaries
- [ ] Log all transaction failures
- [ ] Log all WebSocket errors
- [ ] Create alert rules for critical errors

---

### 6.2 Add Performance Monitoring
**Track key metrics:**

```typescript
// Track transaction times
const startTime = Date.now()
await writeContract({ ... })
const duration = Date.now() - startTime
logEvent('transaction_time', { type: 'createGame', duration })

// Track WebSocket latency
const sentAt = Date.now()
ws.send(JSON.stringify({ type: 'move', sentAt, ... }))

// On receive:
const latency = Date.now() - message.sentAt
logEvent('websocket_latency', { latency })
```

**Action Items:**
- [ ] Track transaction times
- [ ] Track WebSocket message latency
- [ ] Track game completion rate
- [ ] Track error rates
- [ ] Create performance dashboard

---

## Deployment Checklist

### Pre-Production
- [ ] All P0 issues fixed
- [ ] All P1 issues fixed
- [ ] E2E tests passing (100%)
- [ ] Load tests passing (1000+ concurrent games)
- [ ] Security audit completed
- [ ] SSL certificates installed
- [ ] Environment variables set in Vercel
- [ ] WebSocket server deployed
- [ ] Contract verified on explorer
- [ ] Backup WebSocket server configured

### Production Monitoring
- [ ] Error tracking enabled
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring (ping every 1 min)
- [ ] Alert rules configured
- [ ] Runbook documented
- [ ] Support team trained

---

## Risk Mitigation

### High-Risk Areas
1. **WebSocket server downtime** → Deploy redundant servers, health checks
2. **Blockchain RPC downtime** → Multiple RPC endpoints with fallback
3. **Smart contract bugs** → Thorough audit, bug bounty program
4. **State desync between players** → Server-side validation, state sync on reconnect
5. **Griefing attacks** → Rate limiting, player reporting system

### Rollback Plan
If production issues arise:
1. Disable multiplayer mode (feature flag)
2. Show maintenance message
3. Fix issues in staging
4. Re-enable after validation

---

## Success Metrics

### Week 1 Post-Launch
- [ ] 0 critical errors reported
- [ ] <1% transaction failure rate
- [ ] <5% WebSocket disconnect rate
- [ ] 90%+ game completion rate
- [ ] <2s average transaction time

### Month 1 Post-Launch
- [ ] 1000+ games played
- [ ] 4.5+ star rating
- [ ] <10 support tickets per week
- [ ] 90%+ server uptime

---

## Estimated Timeline

- **Phase 1 (P0):** 3-4 days (critical fixes)
- **Phase 2 (P1):** 2-3 days (transactions)
- **Phase 3 (P1):** 2-3 days (state sync)
- **Phase 4 (P2):** 1-2 days (UI polish)
- **Phase 5:** 2-3 days (testing)
- **Phase 6:** 1 day (monitoring setup)

**Total:** 11-16 days for production-ready multiplayer

---

## Next Steps

1. Review and approve this plan
2. Set up project tracking (Jira/Linear/GitHub Projects)
3. Assign priorities and owners
4. Start with Phase 1, Issue #1
5. Daily standup to track progress
6. Weekly demo of completed fixes

**This plan is comprehensive, systematic, and production-ready. Each fix is isolated and testable.**
