# Farcaster Risk Game - Miniapp

A turn-based Risk-like strategy game built as a Farcaster miniapp using the `@farcaster/frame-sdk` and Neynar for user integration.

## 🎮 Features

- **Turn-based Risk gameplay** with territory conquest
- **Farcaster integration** using the official miniapp SDK
- **Neynar SDK** for user data and authentication
- **Real-time game state** management
- **Multiplayer support** (2-4 players)
- **Classic Risk mechanics**: attack, fortify, and conquer territories
- **Continent bonuses** for strategic gameplay

## 📁 Project Structure

This is a **Turborepo** monorepo containing:

```
├── apps/
│   ├── frontend/          # React + Vite frontend with Farcaster SDK
│   ├── backend/           # Express API server with game logic
│   └── contracts/         # Foundry smart contracts (placeholder)
├── packages/
│   ├── game-logic/        # Core Risk game mechanics
│   └── database/          # Prisma database schema and client
```

### Frontend (`apps/frontend`)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Farcaster**: `@farcaster/frame-sdk` for miniapp integration
- **API Client**: Axios for backend communication
- **Styling**: CSS with custom components

### Backend (`apps/backend`)
- **Framework**: Express + TypeScript
- **Game Service**: Manages game state and player actions
- **Neynar Integration**: `@neynar/nodejs-sdk` for Farcaster user data
- **API**: RESTful endpoints for game actions

### Game Logic (`packages/game-logic`)
- **Territories**: Full Risk game map with 42 territories across 6 continents
- **Combat System**: Dice-based attack resolution
- **Turn Management**: Placement, attack, and fortify phases
- **Victory Conditions**: Eliminate all opponents

### Database (`packages/database`)
- **ORM**: Prisma with SQLite (easily swappable)
- **Schema**: Users, Games, Players, Territories, Moves
- **Migrations**: Ready for production database

### Contracts (`apps/contracts`)
- **Framework**: Foundry (placeholder)
- **Planned Features**: Entry fees, prize pools, NFT rewards
- **Status**: 🚧 Under construction

## 🚀 Quick Start

### Quick Setup (Recommended)

Use the setup script for automated configuration:

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Install all dependencies
- Create environment files
- Generate Prisma client
- Build all packages

### Manual Setup

#### Prerequisites

- Node.js >= 18.0.0
- npm >= 10.8.2

### Installation

```bash
# Install dependencies
npm install

# Setup database (optional - for persistence)
cd packages/database
cp .env.example .env
npm run db:generate
npm run db:push
```

### Development

```bash
# Run all apps in development mode
npm run dev

# Or run individually:
cd apps/frontend && npm run dev  # Frontend on http://localhost:3000
cd apps/backend && npm run dev   # Backend on http://localhost:4000
```

### Build

```bash
# Build all packages and apps
npm run build
```

## 🎯 Game Mechanics

### Setup Phase
1. Players join a game lobby
2. Territories are randomly distributed
3. Each player receives initial armies based on player count

### Gameplay Phases

**1. Placement Phase**
- Place reinforcement armies on your territories
- Receive armies based on territory count and continent bonuses

**2. Attack Phase**
- Attack adjacent enemy territories
- Roll dice for combat resolution (attacker up to 3, defender up to 2)
- Conquer territories by eliminating all defender armies

**3. Fortify Phase**
- Move armies between your adjacent territories
- Strengthen defensive positions

### Victory Condition
Eliminate all opponents by conquering all territories on the map!

## 🌍 Map & Continents

- **North America** (9 territories) - Bonus: 5 armies
- **South America** (4 territories) - Bonus: 2 armies
- **Europe** (7 territories) - Bonus: 5 armies
- **Africa** (6 territories) - Bonus: 3 armies
- **Asia** (12 territories) - Bonus: 7 armies
- **Australia** (4 territories) - Bonus: 2 armies

Total: **42 territories**

## 🔧 Configuration

### Environment Variables

**Backend** (`apps/backend/.env`):
```env
PORT=4000
NEYNAR_API_KEY=your_neynar_api_key
```

**Frontend** (`apps/frontend/.env`):
```env
VITE_API_URL=http://localhost:4000/api
```

**Database** (`packages/database/.env`):
```env
DATABASE_URL="file:./dev.db"
```

## 📦 Tech Stack

- **Frontend**: React, TypeScript, Vite, Farcaster Frame SDK
- **Backend**: Express, TypeScript, Node.js
- **Database**: Prisma, SQLite (configurable)
- **Game Logic**: Custom TypeScript implementation
- **Blockchain**: Foundry (Solidity) - Coming soon
- **Monorepo**: Turborepo
- **Package Manager**: npm

## 🔮 Future Enhancements

- [ ] Smart contract integration for entry fees and prizes
- [ ] NFT rewards for achievements
- [ ] Tournament mode with brackets
- [ ] Spectator mode
- [ ] Replay system
- [ ] Leaderboards and rankings
- [ ] Custom game rules and variants
- [ ] Mobile-optimized UI
- [ ] AI opponents
- [ ] Chat system

## 🤝 Contributing

This is a hackathon/demo project. Feel free to fork and build upon it!

## 📄 License

MIT

## 🙏 Acknowledgments

- **Farcaster** for the miniapp SDK
- **Neynar** for the Farcaster API client
- Classic **Risk** board game for inspiration