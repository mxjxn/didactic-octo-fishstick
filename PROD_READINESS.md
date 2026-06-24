# Production Readiness Assessment

This document captures the issues that must be resolved before this app is suitable for real users. Issues are grouped by severity.

---

## 🔴 Critical — Blockers

These will prevent the app from working at all as a multiplayer game.

### 1. Game state is never persisted

**File:** `apps/backend/src/services/GameService.ts`

The `GameService` class stores all active games in `this.games = {}` (in-memory). The `packages/database` Prisma schema is fully defined but **never imported or called anywhere in the backend**. A server restart silently destroys every active game.

**Fix:** Wire up Prisma client in `GameService`. On game creation, write to the `Game`, `Player`, and `Territory` tables. On each action, update the relevant rows. On `getGame`, read from the DB rather than the map.

---

### 2. No server-side authentication — players can impersonate anyone

**Files:** `apps/backend/src/routes/games.ts`, `apps/backend/src/services/GameService.ts`

Every route accepts a raw `farcasterFid` integer in the request body with zero verification. There is nothing stopping a client from sending any FID and acting as that user.

**Fix:** Farcaster Frames provide a signed `trustedData` payload in every action. Use `neynarClient.validateFrameAction(trustedData.messageBytes)` to verify each request server-side and extract the verified FID from the validated message. Reject requests that fail validation.

Reference: https://docs.neynar.com/docs/how-to-validate-a-frame-request

---

### 3. No real-time updates — multiplayer is non-functional

**File:** `apps/frontend/src/App.tsx`

The frontend fetches game state once on mount and never again. When another player takes a turn, the current player's screen never updates.

**Fix:** Add polling (`setInterval` calling `apiClient.getGame(gameState.id)`) as a short-term solution, or implement WebSocket/SSE on the backend for push updates. Polling every 2–3 seconds is the fastest path.

---

### 4. No UI for the placement phase

**File:** `apps/frontend/src/App.tsx`

The `placeArmies` API endpoint exists (`POST /api/games/:id/place-armies`) and the game logic handles it correctly, but the frontend has no UI to trigger it. Players enter the placement phase with armies to place but have no way to place them.

**Fix:** In `App.tsx`, when `gameState.phase === 'placement'` and it is the current user's turn, render territory buttons that call `apiClient.placeArmies(...)`. The `ArmyModal` component can be reused for army count selection.

---

### 5. Game logic bugs

**File:** `packages/game-logic/src/game.ts`

#### a. Double-subtraction on territory conquest (lines 133–140)

When a territory is conquered, `attackerDiceCount` armies are moved to the captured territory. However, they are *also* subtracted from the attacking territory a second time — after `attackerLosses` was already applied — which can leave the attacker with 0 or negative armies.

```ts
// BUG: armies already reduced by attackerLosses above; this subtracts again
newTerritories[attackerIdx] = {
  ...newTerritories[attackerIdx],
  armies: newTerritories[attackerIdx].armies - attackerDiceCount
}
```

**Fix:** Track whether conquest happened before mapping territories. When conquered, set attacker armies to `fromTerritory.armies - attackerLosses - attackerDiceCount` in a single pass.

#### b. `initializeGame` always starts game as `'active'` (line 23)

A single player joining sets `status: 'active'` immediately. The game should be `'waiting'` until a second player joins.

**Fix:** Set `status: game.players.length >= 2 ? 'active' : 'waiting'` (the `joinOrCreateGame` logic in `GameService` already handles the join case — `initializeGame` just needs to default to `'waiting'`).

#### c. `executeEndTurn` phase transition is broken (lines 294–301)

The phase transition logic reads the *previous* player's phase to decide the *next* player's phase. Phases (placement → attack → fortify) should be per-turn, not inherited from the outgoing player's state.

```ts
// Current (wrong): reads game.phase which is the outgoing player's phase
if (game.phase === 'placement') {
  nextPhase = newPlayers[nextPlayerIndex].armiesToPlace > 0 ? 'placement' : 'attack'
} else if (game.phase === 'attack') {
  nextPhase = 'fortify'
} else {
  nextPhase = 'placement'  // fortify → placement is correct, others are not
}
```

**Fix:** Each turn always starts at `'placement'`. Calculate reinforcements for the next player, set `armiesToPlace`, and always set `nextPhase = 'placement'`. The phase should only advance *within* a turn (placement → attack → fortify), not across the `endTurn` boundary.

#### d. Territory distribution is deterministic, not random (lines 10–13)

`initializeGame` and `redistributeTerritories` assign territories sequentially by array index modulo player count. The same players always get the same territories.

**Fix:** Shuffle `INITIAL_TERRITORIES` before distributing:
```ts
const shuffled = [...INITIAL_TERRITORIES].sort(() => Math.random() - 0.5)
```

---

### 6. Territory ownership is invisible in the UI

**File:** `apps/frontend/src/components/GameBoard.tsx` (line 91)

```tsx
style={{ borderColor: territory.ownerId }}
```

`territory.ownerId` is a string like `"player-12345"`, not a valid CSS color. Every territory renders with an invalid border color — there is no visual ownership indicator.

**Fix:** Look up the player by `territory.ownerId` in the `territories` array (you have access to `players` via props or context) and use `player.color` as the border color. Pass `players` as a prop to `GameBoard`.

---

### 7. CORS is completely open, no rate limiting

**File:** `apps/backend/src/index.ts`

```ts
app.use(cors())  // allows all origins
```

Any origin can call the API. There is no rate limiting, so a single client can flood the server.

**Fix:**
- Restrict CORS to the deployed frontend origin: `app.use(cors({ origin: process.env.ALLOWED_ORIGIN }))`
- Add `express-rate-limit` middleware (e.g. 60 requests/minute per IP)

---

## 🟡 Important — Should Fix Before Launch

### 8. No request body validation

**File:** `apps/backend/src/routes/games.ts`

No schema validation on request bodies. Missing or malformed fields (e.g. `farcasterFid` being a string instead of a number) produce uncaught errors or silent failures rather than clear 400 responses.

**Fix:** Add [Zod](https://github.com/colinhacks/zod) schemas for each endpoint's expected body and validate before passing to the service layer.

---

### 9. Frontend errors are silent

**File:** `apps/frontend/src/App.tsx`

All `catch` blocks only call `console.error(...)`. Users see a frozen UI with no indication something went wrong.

**Fix:** Add error state (e.g. `const [error, setError] = useState<string | null>(null)`) and display a visible error message or toast when API calls fail.

---

### 10. Prisma schema missing `neighbors` field on `Territory`

**File:** `packages/database/prisma/schema.prisma`

The in-memory `Territory` type (in `packages/game-logic/src/types.ts`) has a `neighbors: string[]` field. The Prisma `Territory` model has no such column. Persisting territory state to the DB would require either a JSON column for neighbors or a separate adjacency table.

**Fix:** Add `neighbors String` (storing JSON) to the Prisma `Territory` model, or store the territory's canonical ID (from `territories.ts`) and derive neighbors at query time rather than storing them per row.

---

### 11. Farcaster Frame `<meta>` tags are missing

**File:** `apps/frontend/index.html`

Farcaster requires specific Open Graph / Frame meta tags for the miniapp to be embeddable in Warpcast and other clients. Without them, sharing a link won't render a playable frame.

**Fix:** Add required tags to `index.html`:
```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://your-domain.com/og-image.png" />
<meta property="fc:frame:button:1" content="Play Risk" />
<meta property="fc:frame:post_url" content="https://your-api.com/api/frame" />
<meta property="og:image" content="https://your-domain.com/og-image.png" />
```

Reference: https://docs.farcaster.xyz/reference/frames/spec

---

### 12. No tests

There are no test files anywhere in the repo. The `packages/game-logic` package is pure TypeScript with no I/O or side effects — it is the highest-value target for unit tests.

**Fix:** Add `vitest` (or `jest`) to `packages/game-logic`. Write tests for:
- `initializeGame` — correct territory count, army count per player count
- `executeAttack` — valid attack, invalid phase, not adjacent, conquest, game over
- `executePlaceArmies` — valid placement, insufficient armies, wrong phase
- `executeFortify` — valid move, not adjacent, insufficient armies
- `executeEndTurn` — phase transitions, reinforcement calculation, continent bonuses

---

## 🟢 Nice to Have — Post-Launch

| Item | Notes |
|------|-------|
| WebSocket / SSE for real-time updates | Replace polling with push; `socket.io` or native `EventSource` |
| Redis for distributed game state | Allows horizontal scaling; replaces in-memory map |
| Structured logging | Replace `console.log/error` with `pino` or `winston` |
| Error tracking | Add Sentry (or equivalent) to both frontend and backend |
| Dockerfile + deployment config | `fly.toml` for Fly.io or `railway.toml` for Railway |
| Smart contract integration | Entry fees, prize distribution (Foundry placeholder exists) |
| Leaderboards | Requires persistent move history (DB schema already has `Move` model) |
| AI opponents | Allows single-player / async play |
| Tournament mode | Bracket-style match progression |
| Spectator mode | Read-only game state view |

---

## Quick Reference: File → Issue Map

| File | Issues |
|------|--------|
| `apps/backend/src/services/GameService.ts` | #1 (no DB), #2 (no auth) |
| `apps/backend/src/routes/games.ts` | #2 (no auth), #8 (no validation) |
| `apps/backend/src/index.ts` | #7 (open CORS, no rate limit) |
| `apps/frontend/src/App.tsx` | #3 (no polling), #4 (no placement UI), #9 (silent errors) |
| `apps/frontend/src/components/GameBoard.tsx` | #6 (broken border color) |
| `apps/frontend/index.html` | #11 (missing Frame meta tags) |
| `packages/game-logic/src/game.ts` | #5a (double subtract), #5b (wrong initial status), #5c (phase transition), #5d (deterministic distribution) |
| `packages/database/prisma/schema.prisma` | #10 (missing neighbors field) |
