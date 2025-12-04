# BoxBattle Issues - Quick Reference

## 🔴 CRITICAL (P0) - Blocks Production

| # | Issue | Impact | File | Status |
|---|-------|--------|------|--------|
| 1 | Hardcoded WebSocket URL (localhost:8080) | Multiplayer broken in production | `hooks/useWebSocketGame.ts:23` | 🔴 Not Fixed |
| 2 | No environment validation | App crashes if env vars missing | `lib/wagmi-config.ts:127` | 🔴 Not Fixed |
| 3 | Player number bug | Players can't make moves after game reset | `app/game/page.tsx:81` | 🔴 Not Fixed |
| 4 | No multiplayer winner detection | Games never end | `app/game/page.tsx:395` | 🔴 Not Fixed |
| 5 | No WebSocket reconnection | Disconnects = game over | `hooks/useWebSocketGame.ts` | 🔴 Not Fixed |

## 🟠 HIGH (P1) - Severe UX Impact

| # | Issue | Impact | File | Status |
|---|-------|--------|------|--------|
| 6 | No transaction timeout handling | Users stuck on "confirming" forever | `app/game/page.tsx:160-197` | 🔴 Not Fixed |
| 7 | Score calculation duplication | Wrong scores/winner | `app/game/page.tsx:92-119, 271-307` | 🔴 Not Fixed |
| 8 | Turn race condition | Both players can move simultaneously | `app/game/page.tsx:471-528` | 🔴 Not Fixed |
| 9 | WebSocket not SSL | Can't connect from HTTPS sites | `server/websocket-server.js` | 🔴 Not Fixed |
| 10 | No loading states | Users click multiple times = duplicate txs | `components/multiplayer-lobby.tsx` | 🔴 Not Fixed |

## 🟡 MEDIUM (P2) - Quality Issues

| # | Issue | Impact | File | Status |
|---|-------|--------|------|--------|
| 11 | Wallet modal z-index | Modal appears behind content | `components/landing/navigation.tsx:102` | 🔴 Not Fixed |
| 12 | Hardcoded gas limits | Txs fail if contract changes | `hooks/useGameContract.ts:165,218` | 🔴 Not Fixed |
| 13 | No state sync on reconnect | Refreshing page loses game state | `hooks/useWebSocketGame.ts` | 🔴 Not Fixed |
| 14 | BigInt event comparison | Events might not trigger | `hooks/useGameContract.ts:243-300` | 🔴 Not Fixed |
| 15 | alert() blocks UI | Unprofessional UX | `components/multiplayer-lobby.tsx:264,323` | 🔴 Not Fixed |

## 📊 Issue Categories

```
Smart Contract:     ████░░░░░░ 6 issues (21%)
WebSocket:          ████████░░ 9 issues (32%)
Game State:         ██████░░░░ 7 issues (25%)
Transactions:       ████░░░░░░ 4 issues (14%)
UI/UX:              ██░░░░░░░░ 2 issues (7%)
```

## 🎯 Fix Priority Order

### Must Fix Before ANY Production Deployment:
1. WebSocket URL environment variable
2. Environment validation system
3. Player number determination fix
4. Multiplayer winner detection
5. WebSocket reconnection logic

### Must Fix Before Beta Launch:
6. Transaction timeout handling
7. Score calculation consolidation
8. Server-side turn validation
9. SSL WebSocket server
10. Transaction loading states

### Nice to Have for Polish:
11. Modal z-index fix
12. Gas estimation
13. State sync on reconnect
14. Toast notifications
15. Connection status indicator

## 🚀 Quick Wins (Can Fix in <1 hour each)

1. **Wallet Modal Z-Index** (5 min)
   - Add `style={{ zIndex: 9999 }}` to modal backdrop
   - File: `components/landing/navigation.tsx:102`

2. **WebSocket URL** (5 min)
   - Create `lib/env.ts` with `WS_URL` constant
   - Replace hardcoded URL in `hooks/useWebSocketGame.ts:23`

3. **Player Number Reset** (10 min)
   - Convert `playerNum` to state
   - Add reset on game mode change
   - File: `app/game/page.tsx:81`

4. **Multiplayer Winner** (15 min)
   - Remove `gameMode === "ai"` condition
   - Add player-specific sounds
   - File: `app/game/page.tsx:395`

5. **Loading States** (30 min)
   - Add spinner to Create Game button
   - Add disabled state while pending
   - File: `components/multiplayer-lobby.tsx:261-274`

## 📋 Testing Checklist

### Before Each Fix:
- [ ] Read the code section
- [ ] Understand the bug
- [ ] Write a failing test (if possible)

### After Each Fix:
- [ ] Manual testing (at least 3 scenarios)
- [ ] Test on localhost
- [ ] Test on deployment preview
- [ ] Check browser console for errors
- [ ] Check network tab for failed requests

### Before Merging:
- [ ] All tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] Code reviewed
- [ ] Commit message descriptive

## 🆘 Emergency Contacts

If you encounter issues while fixing:
- **Wagmi Docs:** https://wagmi.sh
- **Viem Docs:** https://viem.sh
- **WebSocket API:** https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- **Next.js Docs:** https://nextjs.org/docs

## 📈 Progress Tracking

- **Total Issues:** 28
- **Fixed:** 0 (0%)
- **In Progress:** 0
- **Blocked:** 0
- **Not Started:** 28 (100%)

Update this file as you fix issues!

---

**Last Updated:** 2025-12-04
**Plan Document:** See `MULTIPLAYER_FIX_PLAN.md` for detailed implementation
