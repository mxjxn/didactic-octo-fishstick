# NetSiege Build Plan — July 7, 2026

## Overview

Rebrand and extend the Farcaster Risk miniapp into **NetSiege** (`netsiege.mxjxn.com`). This build adds game configuration (game types, teams, rules), a card system, real-time updates, and persistent storage — while keeping Farcaster as the auth/platform layer.

---

## 1. Rebrand

- Rename from "Farcaster Risk" to **NetSiege** across all frontend, backend, and package names
- Update `package.json` names from `@farcaster-risk/*` to `@netsiege/*`
- Update homepage/lobby title

---

## 2. Game Configuration System

### 2.1 Game Types

Three game types with distinct win conditions:

| Type | Win Condition |
|---|---|
| **Deathmatch** | Last player/team standing |
| **Capitals** | First to conquer all enemy capitals (capital positions are map-defined) |
| **Assassination** | First to eliminate their assigned target (semi-random assignment, no mutual targeting) |

### 2.2 Team Modes

| Mode | Description |
|---|---|
| **Solo** | Every player for themselves |
| **Pairs** | 2-player teams |
| **Triads** | 3-player teams |
| **Quads** | 4-player teams |

- Teams are **randomly assigned** at game creation
- Available team modes depend on player count (e.g., 9 players: solo or triads; 8 players: solo, pairs, or quads)
- **Friendly fire toggle**: when off, teammates cannot attack each other's territories (default: off for teams, on for solo)

### 2.3 Turn Order in Team Mode

- Players are arranged so teammates do NOT play consecutively
- Example (6 players, triads): A1, B1, C1, A2, B2, C2
- Individual turns, round-robin

### 2.4 Player Count

- **Map-defined min/max** (not global)
- Current default map: min 2, max 8 (up from current hard 4)
- Map designers set limits per map
- Team divisions must be valid for the selected player count

### 2.5 Game Configuration Options (Create Game UI)

When creating a game, the creator sets:

| Setting | Options |
|---|---|
| Game Type | Deathmatch, Capitals, Assassination |
| Team Mode | Solo, Pairs, Triads, Quads (filtered by player count) |
| Player Count | Min–Max (from selected map) |
| Map | Selection from available maps (extensible system) |
| Card Turn-in Value | Fixed at 8 OR linearly incrementing up to cap of 20 |
| Friendly Fire | On/Off toggle |

---

## 3. Card System (New Feature)

### 3.1 Card Deck

- **Territory-based deck**: one card per territory on the map (~42 cards for default map)
- Each card has: territory name + color
- **3 colors** (e.g., Red, Blue, Green)
- Colors are assigned to territory cards (distribution TBD — could be continent-based or evenly divided)
- Deck is shuffled; cards are drawn without replacement
- When deck is empty, reshuffle all previously turned-in cards back into the deck

### 3.2 Earning Cards

- A player earns **one card at the end of their turn** if they **conquered at least one territory** during that turn
- Failing to conquer = no card earned

### 3.3 Card Turn-In

- A valid turn-in requires exactly **3 cards** of:
  - All the same color (3 Reds, 3 Blues, or 3 Greens), OR
  - All different colors (1 Red + 1 Blue + 1 Green)
- Player **manually selects** 3 cards from their hand to turn in
- Turn-in happens during the **placement phase** (before attacking)
- Bonus armies are added to the player's `armiesToPlace`

### 3.4 Card Turn-In Value

Two modes (selected at game creation):

| Mode | Behavior |
|---|---|
| **Fixed at 8** | Every turn-in awards 8 armies |
| **Incrementing** | Starts at 4, increases by 2 each turn-in (4, 6, 8, 10...), caps at 20 |

### 3.5 UI for Cards

- Display player's card hand (count or visual cards)
- Card turn-in UI: player selects 3 cards, validate set, confirm turn-in, bonus armies added
- Show card count in PlayerInfo component

---

## 4. Map System (Extensible)

### 4.1 Current Map

- Keep the existing 42-territory, 6-continent map as the default
- Add metadata: `name`, `minPlayers`, `maxPlayers`, `capitalPositions` (for Capitals mode)

### 4.2 Map Interface

```ts
interface GameMap {
  id: string
  name: string
  minPlayers: number
  maxPlayers: number
  territories: MapTerritory[]
  continents: Continent[]
  capitalPositions?: string[]   // territory IDs for Capitals mode
}
```

- Maps are registered in the game-logic package
- The create game UI presents a dropdown of available maps
- New maps can be added by implementing the interface

---

## 5. Real-Time Updates (WebSocket/SSE)

### 5.1 Waiting Room

- Players see new arrivals in real-time (no refresh needed)
- "Start" button appears/disappears based on player count
- Creator sees live player count

### 5.2 Game Board

- Territory ownership updates live after attacks
- Turn phase transitions visible to all players
- Army counts update without refresh

### 5.3 Implementation

- Add WebSocket server to the Express backend (`ws` or `socket.io`)
- Clients connect on game join and receive events:
  - `player-joined` / `player-left`
  - `game-started`
  - `territory-updated`
  - `turn-changed`
  - `phase-changed`
  - `game-ended`

---

## 6. Persistent Storage (SQLite via Prisma)

### 6.1 Wire Up Prisma

- The Prisma schema already exists but is **not used** by the backend
- Update schema to support new features (cards, teams, game config, invite codes)
- Replace in-memory `GameService` maps with Prisma queries
- Keep SQLite for now (easy upgrade path to PostgreSQL)

### 6.2 Schema Updates Required

Add to existing models / create new ones:

| Model | New Fields |
|---|---|
| **Game** | `inviteCode`, `gameType`, `teamMode`, `playerCount`, `mapId`, `cardTurnInMode`, `cardTurnInCap`, `friendlyFire`, `currentTurnInValue` |
| **Player** | `teamId`, `capitalTerritoryId?`, `assassinationTargetId?`, `cardCount` |
| **Card** (new) | `id`, `gameId`, `playerId?`, `territoryName`, `color`, `isTurnedIn` |
| **Team** (new) | `id`, `gameId`, `teamIndex`, `color` |

---

## 7. Frontend Pages & Components

### 7.1 Homepage / Landing

- NetSiege branding
- Replaces current `Lobby.tsx` as entry point
- Links to: Create Game, Browse Open Games, Join by Code

### 7.2 Create Game Page (New)

- Game configuration form (Section 2.5 options)
- Map selection dropdown
- Player count selector (range based on map)
- Team mode selector (filtered by player count)
- Game type selector
- Card turn-in mode selector
- Friendly fire toggle
- "Create" button, transitions to Waiting Room

### 7.3 Browse Open Games (Enhanced)

- List open games with their configuration visible (game type, team mode, player count, map)
- Filter/sort options
- Join button per game

### 7.4 Waiting Room (Enhanced)

- Real-time player list with team indicators
- Invite code display (copyable)
- Share URL
- Game configuration summary
- Start button (creator only, min player requirement)
- Leave button (needs backend support)

### 7.5 Game Board (Enhanced)

- Team color indicators on territories
- Capital markers (Capitals mode)
- Card hand display
- Card turn-in UI during placement phase
- Turn phase indicator with clear state
- Real-time updates

### 7.6 Player Info (Enhanced)

- Team display
- Card count
- Target indicator (Assassination mode)
- Capital status (Capitals mode)

---

## 8. Backend API Additions

### 8.1 New/Modified Endpoints

| Endpoint | Change |
|---|---|
| `POST /api/games` | Accept game config (type, teams, map, rules) |
| `POST /api/games/:id/leave` | **New** — remove player from waiting game |
| `POST /api/games/:id/cards/turn-in` | **New** — turn in 3 cards for bonus armies |
| `GET /api/games/:id/cards` | **New** — get player's card hand |
| `WS /ws/games/:id` | **New** — WebSocket connection for real-time updates |

### 8.2 Game Service Updates

- Store and validate game configuration
- Team assignment logic (random, non-consecutive ordering)
- Capital assignment logic (map-defined positions)
- Assassination target assignment (semi-random, no mutual targeting)
- Card deck management (shuffle, draw, reshuffle)
- Card turn-in validation and bonus calculation
- Friendly fire validation in attack logic

---

## 9. Game Logic Updates

### 9.1 New Game Types

- **Capitals**: Add `capitalTerritoryId` to players. Win condition: own all capital territories. Capital capture eliminates a player (or in team mode, eliminates the team when all capitals lost).
- **Assassination**: Add `assassinationTargetId`. Win condition: conquer the territory owned by your target (or eliminate them). Semi-random assignment ensures no A->B and B->A pairs.
- **Deathmatch**: Current behavior, no changes needed.

### 9.2 Team Logic

- `GameState` gains `teams` array and `teamMode` field
- Attack validation: if `friendlyFire === false`, reject attacks on teammate territories
- Win condition for teams: entire team eliminated (all members lost all territories)
- Reinforcement bonus calculation unchanged (per-player territory count)

### 9.3 Card Logic (New)

- `drawCard(deck)`: pull top card from shuffled deck, reshuffle if empty
- `validateTurnIn(cards)`: check 3-card set validity (3 same color or 3 different)
- `calculateTurnInBonus(turnInCount, mode, cap)`: compute army bonus
- `GameState` gains `cardDeck`, `turnedInCards`, `currentTurnInValue` fields

---

## 10. Implementation Order

### Phase 1: Foundation
1. Rebrand (package names, titles)
2. Update Prisma schema with new fields
3. Wire up Prisma to backend (replace in-memory storage)

### Phase 2: Game Configuration
4. Map interface + metadata (min/max players, capitals)
5. Game config types and validation
6. Create Game UI (config form)
7. Enhanced Browse Open Games (show config)
8. Backend: accept and store game config

### Phase 3: Team System
9. Team assignment logic
10. Team-based turn ordering
11. Friendly fire toggle + attack validation
12. Team visual indicators in frontend

### Phase 4: Game Types
13. Capitals mode (map-defined capitals, win condition)
14. Assassination mode (target assignment, win condition)
15. Deathmatch (already exists, verify with new systems)

### Phase 5: Card System
16. Card deck initialization (territory-based, 3 colors)
17. Card earning logic (conquer a territory -> draw at end of turn)
18. Card turn-in validation (3 same color or 3 unique)
19. Card turn-in bonus calculation (fixed 8 or incrementing to 20)
20. Card hand UI + turn-in UI

### Phase 6: Real-Time
21. WebSocket server setup
22. Waiting room real-time updates
23. Game board real-time updates

### Phase 7: Polish
24. Leave game endpoint (backend + frontend)
25. Error handling and edge cases
26. Testing

---

## 11. Open Questions / Decisions Deferred

- **Card color distribution**: How are 3 colors assigned to ~42 territory cards? (Even split? Continent-based?) — Decide during Phase 5
- **Card UI design**: Visual card display vs simple count — Decide during Phase 5
- **WebSocket library**: `ws` (raw) vs `socket.io` — Decide during Phase 6
- **Assassination elimination**: When target is eliminated by a third party, what happens to the assassin? (Reassign target? Win by default?) — Needs clarification
