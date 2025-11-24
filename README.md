# 🎲 Farcaster Risk Game

A turn-based Risk-like strategy game built as a Farcaster miniapp using the Farcaster Frame SDK and Neynar. Conquer territories, deploy armies, and dominate the world!

## 🏗️ Project Structure

This is a turborepo monorepo containing:

```
farcaster-risk-game/
├── apps/
│   ├── frontend/          # Next.js frontend with Farcaster SDK
│   └── backend/           # Express.js API server
├── packages/
│   ├── db/                # Prisma database schema and client
│   └── contracts/         # Foundry smart contracts (placeholder)
└── turbo.json            # Turborepo configuration
```

## 🚀 Features

### Current Features
- ✅ Turn-based Risk-like gameplay
- ✅ 42 territories across 6 continents
- ✅ Farcaster integration with user profiles
- ✅ Deploy, attack, and fortify phases
- ✅ Real-time game state management
- ✅ Multiplayer support (up to 6 players)
- ✅ Neynar SDK integration for user data

### Planned Features
- 🔜 Smart contract integration for entry fees and prizes
- 🔜 NFT territories with special bonuses
- 🔜 Tournament system
- 🔜 Leaderboards and achievements
- 🔜 Real-time notifications

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **SDK**: @farcaster/frame-sdk
- **State Management**: Zustand
- **Styling**: CSS-in-JS
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **API Integration**: Neynar API for Farcaster data

### Smart Contracts
- **Framework**: Foundry
- **Language**: Solidity ^0.8.24
- **Status**: Placeholder (to be implemented)

## 📦 Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 10.0.0
- **PostgreSQL**: >= 14.0
- **Foundry**: Latest (optional, for contracts)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd didactic-octo-fishstick
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

```bash
# Navigate to the db package
cd packages/db

# Copy environment variables
cp .env.example .env

# Edit .env with your PostgreSQL connection string
# DATABASE_URL="postgresql://user:password@localhost:5432/farcaster_risk"

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Setup Backend

```bash
# Navigate to backend
cd apps/backend

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# - PORT=3001
# - DATABASE_URL (same as packages/db)
# - NEYNAR_API_KEY (get from https://neynar.com)
```

### 5. Setup Frontend

```bash
# Frontend environment is configured through next.config.js
# Default API URL is http://localhost:3001
```

### 6. Run Development Servers

```bash
# From root directory, run all apps in development mode
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📖 How to Play

### Game Phases

1. **Deploy Phase**: Place your armies on your territories
2. **Attack Phase**: Attack adjacent enemy territories
3. **Fortify Phase**: Move armies between your connected territories

### Game Rules

- Each player starts with 30 armies
- Territories are randomly distributed at game start
- Each turn, you receive reinforcements based on territories controlled (minimum 3)
- Combat is resolved with dice rolls (attacker and defender)
- Conquer all territories to win!

### Combat Mechanics

- **Attacker**: Rolls up to 3 dice (based on attacking armies)
- **Defender**: Rolls up to 2 dice (based on defending armies)
- Highest rolls are compared
- Ties favor the defender
- Armies are lost based on combat results

## 🔧 Development

### Project Commands

```bash
# Install all dependencies
npm install

# Run all apps in development mode
npm run dev

# Build all apps
npm run build

# Lint all apps
npm run lint

# Clean build artifacts
npm run clean
```

### Package-specific Commands

#### Frontend (`apps/frontend`)
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Lint code
```

#### Backend (`apps/backend`)
```bash
npm run dev        # Start dev server with watch mode
npm run build      # Build TypeScript
npm run start      # Start production server
npm run lint       # Lint code
```

#### Database (`packages/db`)
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
```

#### Contracts (`packages/contracts`)
```bash
forge build        # Compile contracts
forge test         # Run tests
forge script       # Run deployment scripts
```

## 🔐 Environment Variables

### Backend (`apps/backend/.env`)
```env
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/farcaster_risk"
NEYNAR_API_KEY=your_neynar_api_key_here
NODE_ENV=development
```

### Database (`packages/db/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/farcaster_risk"
```

### Contracts (`packages/contracts/.env`)
```env
MAINNET_RPC_URL=
SEPOLIA_RPC_URL=
BASE_RPC_URL=
BASE_SEPOLIA_RPC_URL=
DEPLOYER_PRIVATE_KEY=
ETHERSCAN_API_KEY=
BASESCAN_API_KEY=
```

## 🎮 Game Flow

1. **Create Game**: First player creates a new game
2. **Join Game**: Other players join the waiting game
3. **Start Game**: Game starts when 2+ players have joined
4. **Territory Distribution**: Territories are randomly distributed
5. **Take Turns**: Players take turns deploying, attacking, and fortifying
6. **Win Condition**: Last player with territories wins!

## 📚 API Endpoints

### Game Management
- `POST /api/games` - Create new game
- `GET /api/games/:gameId` - Get game state
- `GET /api/games/player/:fid` - Get player's active game
- `POST /api/games/:gameId/join` - Join a game

### Game Actions
- `POST /api/games/:gameId/move` - Make a move (deploy/attack/fortify)
- `POST /api/games/:gameId/end-turn` - End current turn
- `GET /api/games/:gameId/territories` - Get all territories

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT

## 🔗 Links

- [Farcaster](https://www.farcaster.xyz/)
- [Neynar](https://neynar.com/)
- [Farcaster Frame SDK](https://github.com/farcasterxyz/frame-sdk)
- [Foundry](https://book.getfoundry.sh/)

## 🚧 Roadmap

- [ ] Implement smart contracts for entry fees and prizes
- [ ] Add real-time game updates with WebSockets
- [ ] Create tournament system
- [ ] Add achievements and leaderboards
- [ ] Implement NFT territories
- [ ] Add game replay functionality
- [ ] Mobile-optimized UI improvements
- [ ] Add sound effects and animations

## ⚠️ Note

This is a work in progress. The smart contracts package is currently a placeholder and will be implemented in future iterations to add blockchain functionality for entry fees, prize pools, and NFT features.
