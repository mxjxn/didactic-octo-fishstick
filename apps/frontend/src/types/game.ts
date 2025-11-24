export interface Territory {
  id: string
  name: string
  continent: string
  armies: number
  ownerId: string | null
  adjacentTerritories: string[]
  position: { x: number; y: number }
}

export interface Player {
  fid: string
  username: string
  pfp: string
  color: string
  armies: number
  territories: number
}

export interface GameState {
  id: string
  players: Player[]
  territories: Territory[]
  currentTurn: string
  phase: 'deploy' | 'attack' | 'fortify' | 'waiting'
  turnNumber: number
  status: 'waiting' | 'active' | 'finished'
  winner?: string
  createdAt: string
  updatedAt: string
}

export interface AttackResult {
  success: boolean
  attackerLosses: number
  defenderLosses: number
  conquered: boolean
  message: string
}

export interface Move {
  type: 'deploy' | 'attack' | 'fortify'
  fromTerritory?: string
  toTerritory: string
  armies: number
}
