import { Territory } from '../types'

interface GameBoardProps {
  territories: Territory[]
  selectedTerritory: string | null
  onTerritorySelect: (territoryId: string) => void
  onAttack: (fromId: string, toId: string) => void
  onFortify: (fromId: string, toId: string, armies: number) => void
  currentPlayerId: string
}

const GameBoard = ({ 
  territories, 
  selectedTerritory, 
  onTerritorySelect,
  onAttack,
  onFortify,
  currentPlayerId 
}: GameBoardProps) => {
  const handleTerritoryClick = (territory: Territory) => {
    if (!selectedTerritory) {
      // First selection
      if (territory.ownerId === currentPlayerId) {
        onTerritorySelect(territory.id)
      }
    } else {
      // Second selection
      const fromTerritory = territories.find(t => t.id === selectedTerritory)
      if (!fromTerritory) return

      if (territory.id === selectedTerritory) {
        // Deselect
        onTerritorySelect(null!)
      } else if (fromTerritory.neighbors.includes(territory.id)) {
        if (territory.ownerId === currentPlayerId) {
          // Fortify
          const armies = prompt(`How many armies to move? (max ${fromTerritory.armies - 1})`)
          if (armies && parseInt(armies) > 0) {
            onFortify(fromTerritory.id, territory.id, parseInt(armies))
          }
        } else {
          // Attack
          onAttack(fromTerritory.id, territory.id)
        }
      }
    }
  }

  // Group territories by continent
  const continents = territories.reduce((acc, territory) => {
    if (!acc[territory.continent]) {
      acc[territory.continent] = []
    }
    acc[territory.continent].push(territory)
    return acc
  }, {} as Record<string, Territory[]>)

  return (
    <div className="game-board">
      {Object.entries(continents).map(([continent, continentTerritories]) => (
        <div key={continent} className="continent">
          <h3>{continent}</h3>
          <div className="territories">
            {continentTerritories.map(territory => (
              <div
                key={territory.id}
                className={`territory ${selectedTerritory === territory.id ? 'selected' : ''}`}
                onClick={() => handleTerritoryClick(territory)}
                style={{ borderColor: territory.ownerId }}
              >
                <div className="territory-name">{territory.name}</div>
                <div className="territory-armies">Armies: {territory.armies}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GameBoard
