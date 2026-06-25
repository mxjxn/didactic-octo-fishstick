import { apiClient, LobbyGame } from '../services/api'
import { GameState } from '../types'

interface WaitingRoomProps {
  game: LobbyGame
  fid: number
  onGameStarted: (game: GameState) => void
  onLeave: () => void
}

export default function WaitingRoom({ game, fid, onGameStarted, onLeave }: WaitingRoomProps) {
  const isCreator = game.creatorFid === fid
  const canStart = isCreator && game.players.length >= 2

  const handleStart = async () => {
    try {
      const started = await apiClient.startGame(game.id, fid)
      onGameStarted(started)
    } catch (err: unknown) {
      console.error('Failed to start game:', err)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(game.inviteCode)
  }

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?code=${game.inviteCode}`
    : ''

  return (
    <div className="waiting-room">
      <h2>Waiting Room</h2>

      <div className="waiting-code">
        <p>Invite Code:</p>
        <div className="waiting-code-display">
          <span className="code-text">{game.inviteCode}</span>
          <button className="lobby-btn small" onClick={handleCopyCode}>Copy</button>
        </div>
        {shareUrl && (
          <p className="waiting-share-url">{shareUrl}</p>
        )}
      </div>

      <div className="waiting-players">
        <h3>Players ({game.players.length}/4)</h3>
        <ul>
          {game.players.map(p => (
            <li key={p.id} className="waiting-player">
              <span
                className="player-dot"
                style={{ backgroundColor: p.color }}
              />
              <span>{p.username}</span>
              {p.farcasterFid === game.creatorFid && (
                <span className="creator-badge">Host</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {game.players.length < 2 && (
        <p className="waiting-message">Waiting for at least one more player...</p>
      )}

      <div className="waiting-actions">
        {isCreator && canStart && (
          <button className="lobby-btn primary" onClick={handleStart}>
            Start Game
          </button>
        )}
        {isCreator && !canStart && (
          <button className="lobby-btn" disabled>
            Need at least 2 players
          </button>
        )}
        {!isCreator && (
          <p className="waiting-message">Waiting for the host to start the game...</p>
        )}
      </div>

      <button className="lobby-btn link leave" onClick={onLeave}>
        Leave
      </button>
    </div>
  )
}
