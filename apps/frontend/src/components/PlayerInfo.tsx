import { Player, GameState } from '../types'

interface PlayerInfoProps {
  player?: Player
  gameState: GameState
  isYourTurn: boolean
}

const PlayerInfo = ({ player, gameState, isYourTurn }: PlayerInfoProps) => {
  if (!player) return null

  return (
    <div className="player-info">
      <h2>Player: {player.username}</h2>
      <p>Phase: {gameState.phase}</p>
      <p>Armies to place: {player.armiesToPlace}</p>
      {isYourTurn ? (
        <p style={{ color: '#4ade80', fontWeight: 'bold' }}>It's your turn!</p>
      ) : (
        <p>Waiting for other players...</p>
      )}
      
      <div className="all-players">
        <h3>All Players:</h3>
        {gameState.players.map(p => (
          <div key={p.id} style={{ 
            color: p.id === gameState.currentPlayerId ? '#4ade80' : 'inherit',
            padding: '0.5rem',
            margin: '0.25rem 0'
          }}>
            {p.username} {p.id === gameState.currentPlayerId && '(Current)'}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlayerInfo
