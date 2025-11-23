export interface Territory {
  id: string
  name: string
  ownerId: string
  armies: number
  neighbors: string[]
  continent: string
}

export interface Player {
  id: string
  farcasterFid: number
  username: string
  color: string
  armiesToPlace: number
}

export interface GameState {
  id: string
  status: 'waiting' | 'active' | 'finished'
  currentPlayerId: string
  players: Player[]
  territories: Territory[]
  phase: 'placement' | 'attack' | 'fortify'
  winner?: string
}

export interface AttackResult {
  success: boolean
  attackerLosses: number
  defenderLosses: number
  conquered: boolean
}
