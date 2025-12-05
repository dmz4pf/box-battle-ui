# BoxBattle ⚡

## What It Is

BoxBattle is a Web3-powered competitive strategy game that modernizes the classic Dots and Boxes. Players compete for cryptocurrency prizes on the Somnia Testnet blockchain, combining traditional gameplay with blockchain transparency and rewards.

## Blockchain Details

- **Network**: Somnia Testnet (Chain ID: 50312)
- **Prize Pool**: 0.02 STT per player entry fee
- **Supported Wallets**: MetaMask, Rabby, Zerion, Rainbow, Coinbase, Trust Wallet
- **Smart Contract**: 0xDB3CB1af42f41d91e06DeABA286b0918A3422dFe

## Game Modes

### AI Challenge Mode

Practice against intelligent computer opponents without needing a wallet. Choose from:
- **Easy**: Learn the basics with forgiving AI
- **Medium**: Balanced competitive gameplay
- **Hard**: Advanced strategic AI using minimax algorithm for experienced players

Select from multiple grid sizes (3x3, 4x4, 5x5, 6x6) with adaptive timers (2-5 minutes) and play instantly with real-time score tracking.

### Multiplayer On-Chain Mode

Compete against real players worldwide for cryptocurrency prizes:

**How to Play:**
1. **Create Game**: Player 1 connects wallet, pays 0.02 STT entry fee, receives unique Game ID
2. **Join Game**: Player 2 enters Game ID, pays 0.02 STT to join (total prize pool: 0.04 STT)
3. **Play**: Real-time turn-based gameplay with WebSocket synchronization
4. **Win**: Player with most completed boxes wins the entire prize pool (draws result in no winner)

## Technical Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, GSAP animations
- **Web3**: Wagmi v2, Viem for blockchain integration
- **Real-time**: Node.js WebSocket server for instant move synchronization
- **Hosting**: Vercel (Frontend) + Railway (WebSocket Server)

## Key Features

- **Persistent Usernames**: Custom names saved per wallet address with in-game settings to change anytime
- **Real-time Gameplay**: Instant move synchronization between players via WebSocket
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Multiple Grid Sizes**: 3x3, 4x4, 5x5, and 6x6 for varying difficulty and game length
- **Visual Feedback**: Smooth GSAP animations and color-coded players (Blue vs Red)
- **On-Chain Verification**: All games and prizes recorded on blockchain
- **Fair First Turn**: Server-side random coin toss determines starting player
- **Play Again System**: Seamless rematch flow for both AI and multiplayer modes
- **Draw Detection**: Automatic tie detection when players finish with equal scores
- **Sound System**: Background music and sound effects with individual mute controls
- **Settings Modal**: Easy username changes during gameplay without reconnecting wallet

## How It Works

BoxBattle uses a hybrid architecture: blockchain handles game creation, entry fees, and prize distribution, while WebSocket technology powers real-time gameplay. This ensures gas-free moves during gameplay while maintaining blockchain security for monetary transactions.

Players connect their Web3 wallets, set custom usernames that automatically share with opponents, and create or join games with unique blockchain-generated IDs. A server-side coin toss ensures fair random first turns. Players compete in classic Dots and Boxes strategy—but with real stakes and provable outcomes. Moves are synchronized instantly via WebSocket (no blockchain transactions per move), and the smart contract automatically distributes the prize pool to the winner.

The username system stores names locally per wallet address and broadcasts them via WebSocket when joining multiplayer games, so both players see each other's chosen names instead of wallet addresses. Players can change their username anytime via the settings button in the game header. Draw detection ensures fairness when games end in ties, and the play-again system allows instant rematches with a new random coin toss for the first turn.
