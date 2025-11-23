# Architecture Overview

## System Architecture

The Farcaster Risk Game is built as a monorepo using Turborepo, with a clear separation of concerns across multiple packages.

```
┌─────────────────────────────────────────────────────────┐
│                   Farcaster Client                      │
│                  (Frame Container)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Frontend (React)                       │
│           - Farcaster Frame SDK                         │
│           - Game UI Components                          │
│           - State Management                            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend API (Express)                   │
│           - Game State Management                       │
│           - Neynar Integration                          │
│           - Business Logic                              │
└──────┬──────────────────────────────────┬───────────────┘
       │                                  │
       ▼                                  ▼
┌──────────────────┐           ┌──────────────────────┐
│   Game Logic     │           │   Database (Prisma)  │
│   - Risk Rules   │           │   - Game State       │
│   - Combat       │           │   - User Data        │
│   - Territories  │           │   - History          │
└──────────────────┘           └──────────────────────┘
```

## Package Structure

### Frontend (`apps/frontend`)
**Technology:** React 18, TypeScript, Vite

**Responsibilities:**
- Render game UI
- Handle user interactions
- Integrate with Farcaster Frame SDK
- Manage client-side state
- Make API calls to backend

**Key Components:**
- `App.tsx` - Main application component
- `GameBoard.tsx` - Territory visualization
- `PlayerInfo.tsx` - Player status display
- `ArmyModal.tsx` - Army movement modal

### Backend (`apps/backend`)
**Technology:** Express, TypeScript, Node.js

**Responsibilities:**
- RESTful API endpoints
- Game state management
- User authentication via Neynar
- Business logic coordination
- Data persistence

**Key Modules:**
- `routes/games.ts` - Game API endpoints
- `services/GameService.ts` - Core game service
- `index.ts` - Express server setup

### Game Logic (`packages/game-logic`)
**Technology:** TypeScript (Pure Logic)

**Responsibilities:**
- Risk game rules implementation
- Combat resolution
- Territory management
- Turn progression
- Victory conditions

**Key Modules:**
- `game.ts` - Game state mutations
- `territories.ts` - Map definition
- `types.ts` - TypeScript interfaces

### Database (`packages/database`)
**Technology:** Prisma, SQLite (configurable)

**Responsibilities:**
- Data schema definition
- Database migrations
- Type-safe queries
- Data persistence

**Key Files:**
- `prisma/schema.prisma` - Database schema
- `src/index.ts` - Prisma client export

### Contracts (`apps/contracts`)
**Technology:** Foundry (Solidity)

**Responsibilities:** (Future)
- Smart contract logic
- Entry fee collection
- Prize distribution
- NFT minting

## Data Flow

### Game Creation Flow
```
1. User opens miniapp in Farcaster
2. Frontend loads Farcaster SDK
3. SDK provides user context (FID)
4. Frontend calls POST /api/games/join
5. Backend checks Neynar for user data
6. Backend creates/joins game using game-logic
7. Backend returns game state
8. Frontend renders game board
```

### Combat Flow
```
1. Player selects attacking territory
2. Player selects target territory
3. Frontend calls POST /api/games/:id/attack
4. Backend validates turn and ownership
5. Game logic executes dice rolls
6. Game logic updates territory ownership
7. Backend returns updated game state
8. Frontend re-renders with new state
```

## State Management

### Frontend State
- **Local State**: UI interactions, selected territories
- **Context**: Farcaster user data
- **Server State**: Game state from API

### Backend State
- **In-Memory**: Active games (Map structure)
- **Database**: Persistent game history (future)

## API Design

### RESTful Endpoints

```
POST   /api/games/join          - Join or create a game
GET    /api/games/:id           - Get game state
POST   /api/games/:id/attack    - Execute attack
POST   /api/games/:id/fortify   - Move armies
POST   /api/games/:id/place     - Place reinforcements
POST   /api/games/:id/end-turn  - End current turn
```

## Security Considerations

1. **Authentication**: User identity verified via Farcaster FID
2. **Authorization**: Turn validation ensures only current player can act
3. **Input Validation**: All user inputs validated on backend
4. **Type Safety**: TypeScript throughout the stack
5. **No Direct DB Access**: All data access through Prisma

## Scalability

### Current Limitations
- In-memory game state (lost on server restart)
- Single server instance
- No real-time updates

### Future Improvements
- Redis for distributed state
- WebSocket/SSE for real-time updates
- Database persistence for all games
- Horizontal scaling with load balancer
- CDN for static assets

## Technology Choices

### Why Turborepo?
- Efficient monorepo management
- Smart caching
- Parallel builds
- Clear dependency graph

### Why React?
- Component-based UI
- Large ecosystem
- Good TypeScript support
- Efficient rendering

### Why Express?
- Lightweight and flexible
- Large middleware ecosystem
- TypeScript support
- Easy to understand

### Why Prisma?
- Type-safe database access
- Easy migrations
- Multi-database support
- Great developer experience

### Why SQLite (default)?
- Zero configuration
- File-based (easy deployment)
- Good for development
- Can switch to PostgreSQL/MySQL in production

## Development Workflow

```
1. Make changes in package
2. Run local build: npm run build
3. Run tests: npm run test (when implemented)
4. Run linter: npm run lint
5. Start dev servers: npm run dev
6. Test in browser
7. Commit changes
```

## Deployment Strategy

### Frontend
- Build: `npm run build` in apps/frontend
- Output: `dist/` directory
- Deploy to: Vercel, Netlify, or any static host
- Environment: Set VITE_API_URL

### Backend
- Build: `npm run build` in apps/backend
- Output: `dist/` directory
- Deploy to: Railway, Render, Fly.io, or any Node.js host
- Environment: Set PORT, NEYNAR_API_KEY, DATABASE_URL

### Database
- Development: SQLite file
- Production: PostgreSQL on Railway/Supabase/Heroku

## Future Architecture Enhancements

1. **Microservices**: Split backend into game service, user service, match service
2. **Message Queue**: Add Redis/RabbitMQ for async operations
3. **Real-time**: WebSocket server for live game updates
4. **Caching**: Redis cache for frequently accessed data
5. **Analytics**: Add analytics service for game statistics
6. **Monitoring**: Add logging and error tracking
