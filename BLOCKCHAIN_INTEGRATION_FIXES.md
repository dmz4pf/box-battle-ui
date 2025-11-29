# Blockchain Integration Fixes for Multiplayer

## Overview
This document outlines the critical fixes made to ensure multiplayer blockchain integration works correctly.

## Issues Fixed

### 1. ✅ Drawn Lines Not Syncing from Blockchain
**Problem:** When Player 2 made a move, Player 1 couldn't see it on their board (and vice versa).

**Root Cause:** The `useWatchLinePlaced` event handler only refetched game state but didn't update the `drawnLines` Set.

**Fix:** Updated the event handler to convert blockchain line data to UI format and update `drawnLines`:

```typescript
useWatchLinePlaced((event) => {
  if (event.gameId === gameId && gameMode === "multiplayer") {
    // Convert blockchain event (row, col, direction) to UI lineId format
    let lineId: string
    if (event.direction === 0) {
      // Horizontal: h-row-col-row-col+1
      lineId = `h-${event.row}-${event.col}-${event.row}-${Number(event.col) + 1}`
    } else {
      // Vertical: v-row-col-row+1-col
      lineId = `v-${event.row}-${event.col}-${Number(event.row) + 1}-${event.col}`
    }

    setDrawnLines((prev) => {
      const updated = new Set(prev)
      updated.add(lineId)
      return updated
    })

    refetchGame()
  }
})
```

**Location:** `/app/game/page.tsx:94-118`

---

### 2. ✅ Current Player Not Syncing from Blockchain
**Problem:** Turn indicator didn't update based on blockchain state.

**Root Cause:** No sync between `gameState.currentTurn` (from blockchain) and `currentPlayer` (local UI state).

**Fix:** Added useEffect to sync current turn:

```typescript
useEffect(() => {
  if (gameMode === "multiplayer" && gameState && gamePhase === "playing") {
    const isPlayer1Turn = gameState.currentTurn?.toLowerCase() === gameState.player1?.toLowerCase()
    setCurrentPlayer(isPlayer1Turn ? "player1" : "player2")
  }
}, [gameState, gameMode, gamePhase])
```

**Location:** `/app/game/page.tsx:120-127`

---

### 3. ✅ Completed Boxes Not Recalculating
**Problem:** Boxes didn't highlight when all 4 sides were drawn in multiplayer.

**Root Cause:** Box completion logic only ran for AI mode, not multiplayer.

**Fix:** Added useEffect to recalculate completed boxes whenever drawnLines changes:

```typescript
useEffect(() => {
  if (gameMode === "multiplayer" && drawnLines.size > 0) {
    const newBoxes = new Map<string, "player1" | "player2">()

    for (let row = 0; row < gridSize - 1; row++) {
      for (let col = 0; col < gridSize - 1; col++) {
        const boxId = `box-${row}-${col}`
        const top = `h-${row}-${col}-${row}-${col + 1}`
        const bottom = `h-${row + 1}-${col}-${row + 1}-${col + 1}`
        const left = `v-${row}-${col}-${row + 1}-${col}`
        const right = `v-${row}-${col + 1}-${row + 1}-${col + 1}`

        if (drawnLines.has(top) && drawnLines.has(bottom) &&
            drawnLines.has(left) && drawnLines.has(right)) {
          newBoxes.set(boxId, "player1") // Visual placeholder
        }
      }
    }

    setCompletedBoxes(newBoxes)
  }
}, [drawnLines, gameMode, gridSize])
```

**Location:** `/app/game/page.tsx:129-164`

---

### 4. ✅ Game State Not Resetting on Game Start
**Problem:** When Player 2 joined, the game board showed previous game state.

**Root Cause:** `GameStarted` event didn't reset drawnLines and completedBoxes.

**Fix:** Updated GameStarted handler:

```typescript
useWatchGameStarted((event) => {
  if (event.gameId === gameId) {
    setDrawnLines(new Set())
    setCompletedBoxes(new Map())
    setScores({ player1: 0, player2: 0 })
    setGamePhase("playing")
    refetchGame()
  }
})
```

**Location:** `/app/game/page.tsx:88-97`

---

### 5. ✅ Multiplayer Lobby Not Showing Game ID
**Problem:** Players couldn't share/join games because Game ID wasn't visible.

**Root Cause:** MultiplayerLobby component showed mock game data instead of real blockchain game IDs.

**Fix:**
- Updated interface to accept `createdGameId` and `isWaitingForOpponent` props
- Show waiting screen with Game ID when game is created
- Accept Game ID input to join existing games
- Removed mock game listings

**Location:** `/components/multiplayer-lobby.tsx`

---

## Blockchain Data Flow

### Creating a Game:
1. User clicks "Create Game"
2. `createGame()` → blockchain transaction
3. `GameCreated` event fires → `setGameId(event.gameId)`
4. Lobby shows Game ID to share with Player 2
5. `GameStarted` event fires when Player 2 joins → transition to "playing" phase

### Joining a Game:
1. Player 2 enters Game ID
2. `joinGame(gameId)` → blockchain transaction
3. `GameStarted` event fires → both players transition to "playing" phase
4. Game board initialized with empty state

### Making a Move:
1. Player clicks line
2. `placeLine(gameId, lineId)` → blockchain transaction
3. Blockchain processes move, updates state
4. `LinePlaced` event fires → both players see the line appear
5. UI recalculates completed boxes
6. Blockchain updates scores and current turn
7. Both players see updated scores and turn indicator

---

## Testing Checklist

✅ **Line Synchronization:**
- [ ] Player 1 draws a line → Player 2 sees it immediately
- [ ] Player 2 draws a line → Player 1 sees it immediately
- [ ] Lines persist after page refresh

✅ **Box Completion:**
- [ ] When 4th side is drawn, box highlights
- [ ] Both players see the same completed boxes
- [ ] Scores update correctly on blockchain

✅ **Turn Management:**
- [ ] Turn indicator shows correct player
- [ ] Only current player can make a move
- [ ] Bonus turns work (player who completes box goes again)

✅ **Game Flow:**
- [ ] Player 1 creates game → receives Game ID
- [ ] Player 2 joins with Game ID → game starts
- [ ] Game ends when all boxes filled
- [ ] Winner determined correctly
- [ ] Results recorded on-chain

✅ **Edge Cases:**
- [ ] Page refresh during game → state syncs from blockchain
- [ ] Network delay → game recovers gracefully
- [ ] Transaction failure → error handled properly

---

## Next Steps

1. **Test multiplayer** using the two-browser method from `MULTIPLAYER_TESTING_GUIDE.md`
2. **Add game history** to show past multiplayer games from blockchain
3. **Optimize gas costs** if needed
4. **Add loading states** for blockchain transactions
5. **Handle transaction errors** with user-friendly messages

---

## Technical Notes

### Line ID Format
- **UI Format:** `h-row-col-row-col+1` or `v-row-col-row+1-col`
- **Blockchain Format:** `row`, `col`, `direction` (0=horizontal, 1=vertical)
- **Conversion needed** when translating between UI and blockchain

### State Management
- **AI Mode:** All state is local (drawnLines, completedBoxes, scores, currentPlayer)
- **Multiplayer Mode:**
  - Scores come from blockchain (`gameState.player1Score`, `gameState.player2Score`)
  - Turn comes from blockchain (`gameState.currentTurn`)
  - Lines synced via `LinePlaced` events
  - Boxes calculated locally from drawnLines (visual only, scores are on-chain)

### Important Constants
- Entry Fee: 0.01 STT per player
- Winner Prize: 0.02 STT (total pot)
- Refetch Interval: 3 seconds
- Grid Sizes: 3x3, 4x4, 5x5, 6x6
