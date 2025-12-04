# BoxBattle - Web3 Multiplayer Strategy Game

A blockchain-powered dots and boxes game built with Next.js, featuring AI opponents, real-time multiplayer, and Web3 wallet integration.

## 🎮 Features

- **AI Mode**: Play against AI with three difficulty levels (Easy, Medium, Hard)
- **Multiplayer Mode**: Real-time PvP gameplay via WebSocket
- **Web3 Integration**: Wallet connection with MetaMask, Rabby, Zerion, and more
- **Smart Contract**: On-chain game state management on Somnia Testnet
- **Custom Usernames**: Players can set and change their display names
- **Play Again**: Seamless rematch system for both AI and multiplayer
- **Dynamic Grid Sizes**: Choose from 3x3, 4x4, 5x5, or 6x6 grids
- **Adaptive Timer**: Game duration adjusts based on grid size
- **Sound System**: Background music and sound effects with individual controls
- **Draw Detection**: Fair tie detection when games end in equal scores
- **Random First Turn**: Server-side coin toss determines starting player

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask, Rabby, Zerion, etc.)
- Somnia Testnet tokens (for blockchain transactions)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd box-battle-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_WS_URL=ws://localhost:8080
   NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
   ```

4. **Start the development servers**

   **Option 1: Run both servers in one terminal (recommended)**
   ```bash
   npm run ws-server &
   sleep 2
   npx next dev --webpack
   ```

   **Option 2: Run in separate terminals**

   Terminal 1 - WebSocket Server:
   ```bash
   node server/websocket-server.js
   ```

   Terminal 2 - Next.js Dev Server:
   ```bash
   npx next dev --webpack
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
box-battle-ui/
├── app/
│   ├── game/
│   │   └── page.tsx           # Main game page
│   ├── page.tsx               # Landing page
│   └── layout.tsx             # Root layout
├── components/
│   ├── header.tsx             # Game header with settings
│   ├── game-board.tsx         # Interactive game board
│   ├── winner-overlay.tsx     # End game modal
│   ├── game-mode-selector.tsx # Mode selection screen
│   ├── multiplayer-lobby.tsx  # Multiplayer lobby
│   ├── difficulty-selector.tsx # AI difficulty selector
│   ├── grid-size-selector.tsx # Grid size picker
│   ├── username-setup.tsx     # Username entry
│   └── landing/               # Landing page components
├── hooks/
│   ├── useWebSocketGame.ts    # WebSocket multiplayer logic
│   ├── useGameContract.ts     # Smart contract integration
│   └── useSound.ts            # Sound effects & music
├── server/
│   └── websocket-server.js    # WebSocket server
├── lib/
│   ├── wagmi-config.ts        # Web3 configuration
│   ├── contract-abi.ts        # Smart contract ABI
│   └── animations.ts          # GSAP animations
├── utils/
│   └── ai-player.ts           # AI opponent logic
├── public/
│   ├── boxbattle-logo.svg     # Game logo
│   └── sounds/                # Audio files
└── styles/
    └── globals.css            # Global styles
```

## 🎯 How to Play

### Single Player (AI Mode)
1. Connect your Web3 wallet
2. Set your username
3. Select "Play Against AI"
4. Choose grid size (3x3 to 6x6)
5. Choose difficulty (Easy, Medium, Hard)
6. Take turns drawing lines on the grid
7. Complete boxes to score points
8. Player with most boxes wins!

### Multiplayer Mode
1. Connect your Web3 wallet
2. Set your username
3. Select "Play Online"
4. Choose grid size (Player 1 only)
5. Either:
   - Create a game and share the Game ID
   - Join an existing game with a Game ID
6. Wait for opponent to join
7. Server randomly determines first player
8. Take turns drawing lines
9. Winner is determined by most boxes captured

### Game Rules
- Players take turns drawing horizontal or vertical lines
- Complete the 4th side of a box to capture it
- Capturing a box grants another turn
- Game ends when all boxes are captured or timer expires
- Player with most boxes wins
- Equal scores result in a draw

## 🔧 Technical Details

### Tech Stack
- **Frontend**: Next.js 16.0.3 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **Web3**: Wagmi v2, Viem
- **WebSocket**: ws library
- **Smart Contract**: Solidity on Somnia Testnet
- **Deployment**: Vercel (Frontend), Railway (WebSocket)

### Smart Contract
- **Network**: Somnia Testnet (Chain ID: 50312)
- **Contract Address**: `0xDB3CB1af42f41d91e06DeABA286b0918A3422dFe`
- **Functions**:
  - `createGame(gridSize)` - Create new multiplayer game
  - `joinGame(gameId)` - Join existing game
  - `getGameState(gameId)` - Fetch game data

### WebSocket Protocol
The WebSocket server handles real-time multiplayer synchronization:

**Client → Server Messages:**
- `join` - Join a game room
- `move` - Send a line placement
- `player-quit` - Notify opponent of quit
- `play-again-request` - Request rematch
- `play-again-response` - Accept/decline rematch
- `leave` - Leave game room

**Server → Client Messages:**
- `joined` - Confirmation of join
- `player-joined` - Opponent joined (includes username)
- `opponent-move` - Opponent placed a line
- `grid-size` - Grid size from Player 1
- `first-turn` - Server-determined starting player
- `player-quit` - Opponent quit
- `play-again-request` - Opponent wants rematch
- `play-again-response` - Rematch accepted/declined
- `player-left` - Opponent disconnected

### Key Features Implementation

#### Username System
- Usernames stored in localStorage per wallet address
- Shared via WebSocket when joining games
- Settings modal in header for username changes
- Fallback to truncated wallet address if no username

#### Random First Turn
- Server performs coin toss when Player 2 joins
- `Math.random() < 0.5` determines player1 or player2
- Result broadcast to both players simultaneously
- New coin toss on play-again accept

#### Play Again System
- Available for both AI and multiplayer modes
- Multiplayer: Request/response flow between players
- Resets game state while keeping players connected
- New random first turn determined by server

#### Draw Detection
- Compares final scores when game ends
- If scores equal, winner state set to "draw"
- Special UI for draw state (neutral colors)
- No prize awarded for draws in multiplayer

## 🎨 Customization

### Grid Sizes
Adjust timer durations in `app/game/page.tsx`:
```typescript
const getTimerForGridSize = (size: number) => {
  const timerMap: Record<number, number> = {
    6: 300, // 5 minutes
    5: 240, // 4 minutes
    4: 180, // 3 minutes
    3: 120, // 2 minutes
  }
  return timerMap[size] || 180
}
```

### AI Difficulty
Modify AI behavior in `utils/ai-player.ts`:
- `easy`: Random move selection
- `medium`: Basic box completion + random
- `hard`: Advanced minimax algorithm

### Colors
Update colors in `tailwind.config.ts`:
```typescript
colors: {
  'accent-blue': '#3B82F6',
  'accent-purple': '#8B5CF6',
  'bg-primary': '#0F141F',
  'bg-elevated': '#1A1F2E',
  'bg-panel': '#141823',
}
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
vercel --prod --yes
```

Update environment variables in Vercel dashboard:
- `NEXT_PUBLIC_WS_URL` - Your WebSocket server URL
- `NEXT_PUBLIC_VERCEL_URL` - Your production URL

### WebSocket Server (Railway)
1. Create new project on Railway
2. Connect GitHub repository
3. Set root directory to `/`
4. Add start command: `node server/websocket-server.js`
5. Set environment variable: `PORT=8080`
6. Deploy and copy the WebSocket URL

## 🔮 Future Plans

### Mobile Mini App
This project is designed to be extensible into a mobile mini app:

**Planned Features:**
- React Native version for iOS/Android
- Telegram Mini App integration
- Mobile-optimized touch controls
- Push notifications for multiplayer invites
- Offline AI mode
- Achievement system
- Leaderboards
- Tournament mode

**Architecture Considerations:**
- WebSocket server already supports multiple clients
- Game logic is platform-agnostic
- Smart contract works across platforms
- Username system ready for mobile

### Other Enhancements
- Spectator mode
- Replay system
- Custom avatars
- In-game chat
- Ranked matchmaking
- Game history
- Statistics dashboard

## 🐛 Known Issues

- MetaMask SDK warnings (non-blocking, safe to ignore)
- Game music file 404 (optional feature, doesn't break functionality)
- Server restarts required on config changes

## 📝 License

MIT License - feel free to use this project as a base for your own games!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or collaboration on the mobile mini app version, create an issue in the repository.

---

**Note**: This project uses blockchain technology and requires Somnia Testnet tokens. Get testnet tokens from the Somnia faucet before playing multiplayer mode.
