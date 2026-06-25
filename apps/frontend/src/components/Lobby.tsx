import { useState } from 'react'
import { apiClient, LobbyGame } from '../services/api'

interface LobbyProps {
  fid: number
  username?: string
  onGameJoined: (game: LobbyGame) => void
}

export default function Lobby({ fid, username, onGameJoined }: LobbyProps) {
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openGames, setOpenGames] = useState<LobbyGame[]>([])
  const [showOpenGames, setShowOpenGames] = useState(false)

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    try {
      const game = await apiClient.createGame(fid)
      onGameJoined(game)
    } catch (err) {
      setError('Failed to create game')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!joinCode.trim()) return
    setLoading(true)
    setError('')
    try {
      const game = await apiClient.joinGame(fid, joinCode.trim().toUpperCase())
      onGameJoined(game)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to join game'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickPlay = async () => {
    setLoading(true)
    setError('')
    try {
      const games = await apiClient.listOpenGames()
      if (games.length > 0) {
        const game = await apiClient.joinGame(fid, games[0].id)
        onGameJoined(game)
      } else {
        // No open games — create one
        const game = await apiClient.createGame(fid)
        onGameJoined(game)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to find a game'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleShowOpen = async () => {
    setLoading(true)
    setError('')
    try {
      const games = await apiClient.listOpenGames()
      setOpenGames(games)
      setShowOpenGames(true)
    } catch {
      setError('Failed to load open games')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinFromList = async (gameId: string) => {
    setLoading(true)
    setError('')
    try {
      const game = await apiClient.joinGame(fid, gameId)
      onGameJoined(game)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to join game'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lobby">
      <h1>Farcaster Risk</h1>
      {username && <p className="lobby-username">Playing as {username}</p>}

      <div className="lobby-actions">
        <button
          className="lobby-btn primary"
          onClick={handleCreate}
          disabled={loading}
        >
          Create Game
        </button>

        <button
          className="lobby-btn secondary"
          onClick={handleQuickPlay}
          disabled={loading}
        >
          Quick Play
        </button>

        <div className="lobby-join">
          <input
            type="text"
            placeholder="Enter invite code"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
          <button
            className="lobby-btn"
            onClick={handleJoin}
            disabled={loading || !joinCode.trim()}
          >
            Join
          </button>
        </div>

        <button
          className="lobby-btn link"
          onClick={handleShowOpen}
          disabled={loading}
        >
          Browse Open Games
        </button>
      </div>

      {error && <p className="lobby-error">{error}</p>}

      {showOpenGames && (
        <div className="lobby-open-games">
          <h3>Open Games</h3>
          {openGames.length === 0 ? (
            <p>No open games right now. Create one!</p>
          ) : (
            <ul>
              {openGames.map(g => (
                <li key={g.id}>
                  <span className="lobby-game-info">
                    Code: <strong>{g.inviteCode}</strong> — {g.players.length}/4 players
                    {g.players[0] && <span> ({g.players[0].username}'s game)</span>}
                  </span>
                  <button
                    className="lobby-btn small"
                    onClick={() => handleJoinFromList(g.id)}
                    disabled={loading}
                  >
                    Join
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {loading && <p className="lobby-loading">Loading...</p>}
    </div>
  )
}
