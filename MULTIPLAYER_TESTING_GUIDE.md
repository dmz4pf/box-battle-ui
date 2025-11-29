# BoxBattle Multiplayer Testing Guide

## 🎮 How to Test Multiplayer as a Single User

Since multiplayer mode requires two different wallet addresses, here are the **best methods** to test it yourself:

---

## ✅ **RECOMMENDED: Two Browser Method**

This is the easiest and most reliable way to test multiplayer.

### Setup:
1. **Browser 1** (e.g., Chrome)
   - Install MetaMask or your wallet
   - Connect with **Wallet Address #1**
   - Go to http://localhost:3000/game

2. **Browser 2** (e.g., Firefox or Brave)
   - Install MetaMask or another wallet
   - Connect with **Wallet Address #2** (different from #1)
   - Go to http://localhost:3000/game

### Testing Steps:
1. **In Browser 1:**
   - Create a username (e.g., "Player1")
   - Select grid size (e.g., 5x5)
   - Click "Play On-Chain"
   - Click "Create Game"
   - Wait for transaction to confirm
   - **Copy the Game ID** (it will be displayed)

2. **In Browser 2:**
   - Create a username (e.g., "Player2")
   - Select same grid size (5x5)
   - Click "Play On-Chain"
   - Click "Join Game"
   - Enter the Game ID from Browser 1
   - Wait for transaction to confirm

3. **Play the Game:**
   - Browser 1 (Player 1) makes the first move
   - Wait for transaction to confirm
   - Browser 2 (Player 2) makes their move
   - Continue alternating
   - Complete boxes to get bonus turns
   - Game ends when all boxes are filled

---

## 🔄 **ALTERNATIVE: Incognito Window Method**

Use if you only have one browser and one wallet with multiple accounts.

### Setup:
1. **Regular Window:**
   - Connect with Account #1
   - http://localhost:3000/game

2. **Incognito/Private Window:**
   - Connect with Account #2 (switch accounts in MetaMask)
   - http://localhost:3000/game

### Note:
- Some wallets don't work properly in incognito mode
- You'll need to reconnect wallet each time you open incognito

---

## 📱 **ALTERNATIVE: Desktop + Mobile**

If you have a mobile device on the same network.

### Setup:
1. **Desktop:**
   - Connect with Wallet #1
   - http://localhost:3000/game

2. **Mobile:**
   - Install MetaMask mobile app
   - Connect with Wallet #2
   - Go to http://YOUR_LOCAL_IP:3000/game
   - (Find IP: `ipconfig` on Windows, `ifconfig` on Mac/Linux)

---

## 🧪 **What to Test**

### Basic Multiplayer Flow:
- ✅ Create game transaction works
- ✅ Game ID is generated
- ✅ Join game transaction works
- ✅ Both players can see the game board
- ✅ Turn alternates between players
- ✅ Only current player can make a move
- ✅ Line placement transactions work
- ✅ Boxes complete correctly
- ✅ Bonus turns work (player who completes box plays again)
- ✅ Scores update on-chain
- ✅ Game ends when all boxes are filled
- ✅ Winner is determined correctly
- ✅ Results are recorded on-chain

### Edge Cases to Test:
- ✅ Player tries to click when it's not their turn
- ✅ Player tries to click an already drawn line
- ✅ Game state syncs after page refresh
- ✅ Both players see the same game state
- ✅ Transaction failures are handled gracefully
- ✅ Network delays don't break the game

---

## 🔍 **Debugging Tips**

### Check Blockchain State:
```javascript
// Open browser console and check:
console.log("Game State:", gameState)
console.log("Current Player:", currentPlayer)
console.log("My Address:", address)
```

### Verify Transactions:
- Each move creates a blockchain transaction
- Check transaction status in MetaMask
- Verify on Somnia testnet explorer

### Common Issues:
1. **"Not your turn"**: Wait for other player to move
2. **Transaction pending**: Network might be slow, wait
3. **Game not updating**: Refresh the page (state syncs from blockchain)
4. **Wrong winner**: Check if box counting logic is correct

---

## 💰 **Testnet Tokens**

You'll need Somnia testnet tokens (STT) for:
- Creating a game (entry fee: 0.01 STT)
- Joining a game (entry fee: 0.01 STT)
- Making moves (gas fees)

**Get Testnet Tokens:**
- Somnia Faucet: https://faucet.somnia.network
- Request tokens for both wallet addresses

---

## ✅ **Expected Behavior**

### On-Chain Storage:
- Game ID
- Player 1 address
- Player 2 address
- Current turn (player address)
- All drawn lines (row, col, direction)
- Player 1 score
- Player 2 score
- Game status (active, completed)
- Winner address

### Off-Chain (Local):
- Player usernames
- Animation states
- Move history text

---

## 🚀 **Ready to Test!**

1. Get two wallet addresses with testnet tokens
2. Choose your testing method (Two Browsers recommended)
3. Follow the testing steps above
4. Report any issues you find!

Good luck! 🎮
