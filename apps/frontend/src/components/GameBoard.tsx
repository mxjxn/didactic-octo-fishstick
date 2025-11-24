'use client'

import { useGameStore } from '@/store/gameStore'
import { Territory } from '@/types/game'
import TerritoryCard from './TerritoryCard'

export default function GameBoard() {
  const { currentGame, selectedTerritory, selectTerritory } = useGameStore()

  if (!currentGame) return null

  const handleTerritoryClick = (territory: Territory) => {
    if (selectedTerritory === territory.id) {
      selectTerritory(null)
    } else {
      selectTerritory(territory.id)
    }
  }

  return (
    <div className="game-board">
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
        World Map - Turn {currentGame.turnNumber}
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '15px',
        }}
      >
        {currentGame.territories.map((territory) => (
          <TerritoryCard
            key={territory.id}
            territory={territory}
            isSelected={selectedTerritory === territory.id}
            onClick={() => handleTerritoryClick(territory)}
            player={currentGame.players.find(p => p.fid === territory.ownerId)}
          />
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
        <h3 style={{ marginBottom: '10px' }}>Game Phase: {currentGame.phase.toUpperCase()}</h3>
        <p style={{ opacity: 0.9, fontSize: '14px' }}>
          {currentGame.phase === 'deploy' && 'Deploy your armies to your territories'}
          {currentGame.phase === 'attack' && 'Attack adjacent territories or pass to fortify'}
          {currentGame.phase === 'fortify' && 'Move armies between your connected territories'}
          {currentGame.phase === 'waiting' && 'Waiting for other players...'}
        </p>
      </div>
    </div>
  )
}
