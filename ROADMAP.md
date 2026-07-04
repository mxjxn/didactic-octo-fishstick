# NetSiege — Future Directions

## Cross-Platform Play (Telegram + Farcaster)

Telegram mini apps and Farcaster mini apps are both web apps loaded in an in-app browser.
Same game server, two embed surfaces. Key work:

### Auth Abstraction
Currently Farcaster-only (Neynar validates `trustedData.messageBytes` → FID).
Need to accept Telegram `initData` (user ID, username) alongside Farcaster FID.
Normalize both to a `Player` record on the server. Guest play option TBD.

### Real-Time Updates
Currently REST polling only (`GET /games/:id` + `GET /games/:id/feed`).
Polling works for Farcaster frames (ephemeral). Telegram mini apps are persistent
browsers — they need WebSocket or SSE for live opponent moves.

### Frontend SDK Abstraction
Frontend imports `@farcaster/miniapp-sdk` directly. Abstract behind a
`getUserId()` / `getPlatform()` interface so the same React app can load
inside either Telegram or Farcaster. Two entry points, shared game UI.

### Database
SQLite works for prototyping. Concurrent cross-platform play warrants
Postgres or similar for durability under load.

### References
- Telegram Mini Apps SDK: https://core.telegram.org/bots/webapps
- Farcaster Mini Apps: https://docs.farcaster.xyz/developers/mini-apps
