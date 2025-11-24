'use client'

import { useGameStore } from '@/store/gameStore'
import { useFarcasterContext } from '@/hooks/useFarcasterContext'

export default function PlayerInfo() {
  const { currentGame } = useGameStore()
  const { fid } = useFarcasterContext()

  if (!currentGame) return null

  const currentPlayer = currentGame.players.find(p => p.fid === String(fid))
  const isCurrentTurn = currentGame.currentTurn === String(fid)

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    }}>
      <h2 style={{ marginBottom: '20px' }}>Players</h2>

      <div style={{ display: 'grid', gap: '15px' }}>
        {currentGame.players.map((player) => {
          const isCurrentPlayer = player.fid === String(fid)
          const isPlayerTurn = currentGame.currentTurn === player.fid

          return (
            <div
              key={player.fid}
              style={{
                padding: '15px',
                background: isPlayerTurn
                  ? `linear-gradient(135deg, ${player.color}66, ${player.color}aa)`
                  : `linear-gradient(135deg, ${player.color}33, ${player.color}55)`,
                borderRadius: '12px',
                border: isCurrentPlayer ? '3px solid #fff' : `2px solid ${player.color}`,
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              {player.pfp && (
                <img
                  src={player.pfp}
                  alt={player.username}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: `2px solid ${player.color}`,
                  }}
                />
              )}

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                  {player.username || `Player ${player.fid}`}
                  {isCurrentPlayer && ' (You)'}
                  {isPlayerTurn && ' 🎯'}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                  Territories: {player.territories} | Armies: {player.armies}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {isCurrentTurn && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(255, 215, 0, 0.2)',
          borderRadius: '10px',
          border: '2px solid #ffd700',
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
          It&apos;s your turn!
        </div>
      )}
    </div>
  )
}
