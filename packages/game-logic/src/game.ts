import { GameState, Player, Territory } from './types'
import { INITIAL_TERRITORIES, CONTINENT_BONUSES } from './territories'

// Game constants
const MAX_ATTACKER_DICE = 3
const MAX_DEFENDER_DICE = 2

export function initializeGame(gameId: string, players: Player[]): GameState {
  // Distribute territories among players
  const territories: Territory[] = INITIAL_TERRITORIES.map((t, index) => ({
    ...t,
    ownerId: players[index % players.length].id,
    armies: 1,
  }))

  // Calculate initial armies to place
  const initialArmies = players.length === 2 ? 40 : players.length === 3 ? 35 : 30
  const playersWithArmies = players.map(p => ({
    ...p,
    armiesToPlace: initialArmies - territories.filter(t => t.ownerId === p.id).length,
  }))

  return {
    id: gameId,
    status: 'active',
    currentPlayerId: players[0].id,
    players: playersWithArmies,
    territories,
    phase: 'placement',
  }
}

export function redistributeTerritories(game: GameState): GameState {
  const territories = INITIAL_TERRITORIES.map((t, index) => ({
    ...t,
    ownerId: game.players[index % game.players.length].id,
    armies: 1,
  }))

  const initialArmies = game.players.length === 2 ? 40 : game.players.length === 3 ? 35 : 30
  const playersWithArmies = game.players.map(p => ({
    ...p,
    armiesToPlace: initialArmies - territories.filter(t => t.ownerId === p.id).length,
  }))

  return {
    ...game,
    territories,
    players: playersWithArmies,
    phase: 'placement',
  }
}

function rollDice(count: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a)
}

function calculateAttackResult(attackerDice: number[], defenderDice: number[]): { attackerLosses: number; defenderLosses: number } {
  let attackerLosses = 0
  let defenderLosses = 0

  const comparisons = Math.min(attackerDice.length, defenderDice.length)
  
  for (let i = 0; i < comparisons; i++) {
    if (attackerDice[i] > defenderDice[i]) {
      defenderLosses++
    } else {
      attackerLosses++
    }
  }

  return { attackerLosses, defenderLosses }
}

export function executeAttack(game: GameState, fromTerritoryId: string, toTerritoryId: string, playerId: number): GameState {
  const player = game.players.find(p => p.farcasterFid === playerId)
  if (!player || player.id !== game.currentPlayerId) {
    throw new Error('Not your turn')
  }

  if (game.phase !== 'attack') {
    throw new Error('Not in attack phase')
  }

  const fromTerritory = game.territories.find(t => t.id === fromTerritoryId)
  const toTerritory = game.territories.find(t => t.id === toTerritoryId)

  if (!fromTerritory || !toTerritory) {
    throw new Error('Territory not found')
  }

  if (fromTerritory.ownerId !== player.id) {
    throw new Error('You do not own the attacking territory')
  }

  if (toTerritory.ownerId === player.id) {
    throw new Error('Cannot attack your own territory')
  }

  if (!fromTerritory.neighbors.includes(toTerritoryId)) {
    throw new Error('Territories are not adjacent')
  }

  if (fromTerritory.armies < 2) {
    throw new Error('Need at least 2 armies to attack')
  }

  // Execute attack
  const attackerDiceCount = Math.min(MAX_ATTACKER_DICE, fromTerritory.armies - 1)
  const defenderDiceCount = Math.min(MAX_DEFENDER_DICE, toTerritory.armies)

  const attackerDice = rollDice(attackerDiceCount)
  const defenderDice = rollDice(defenderDiceCount)

  const { attackerLosses, defenderLosses } = calculateAttackResult(attackerDice, defenderDice)

  const newTerritories = game.territories.map(t => {
    if (t.id === fromTerritoryId) {
      return { ...t, armies: t.armies - attackerLosses }
    }
    if (t.id === toTerritoryId) {
      const newArmies = t.armies - defenderLosses
      if (newArmies <= 0) {
        // Territory conquered
        return { ...t, ownerId: player.id, armies: attackerDiceCount }
      }
      return { ...t, armies: newArmies }
    }
    return t
  })

  // Update attacking territory if conquest occurred
  const conquered = toTerritory.armies - defenderLosses <= 0
  if (conquered) {
    const attackerIdx = newTerritories.findIndex(t => t.id === fromTerritoryId)
    newTerritories[attackerIdx] = {
      ...newTerritories[attackerIdx],
      armies: newTerritories[attackerIdx].armies - attackerDiceCount
    }
  }

  // Check for game over
  const territoryOwners = new Set(newTerritories.map(t => t.ownerId))
  if (territoryOwners.size === 1) {
    return {
      ...game,
      territories: newTerritories,
      status: 'finished',
      winner: player.id,
    }
  }

  return {
    ...game,
    territories: newTerritories,
  }
}

export function executeFortify(game: GameState, fromTerritoryId: string, toTerritoryId: string, armies: number, playerId: number): GameState {
  const player = game.players.find(p => p.farcasterFid === playerId)
  if (!player || player.id !== game.currentPlayerId) {
    throw new Error('Not your turn')
  }

  if (game.phase !== 'fortify') {
    throw new Error('Not in fortify phase')
  }

  const fromTerritory = game.territories.find(t => t.id === fromTerritoryId)
  const toTerritory = game.territories.find(t => t.id === toTerritoryId)

  if (!fromTerritory || !toTerritory) {
    throw new Error('Territory not found')
  }

  if (fromTerritory.ownerId !== player.id || toTerritory.ownerId !== player.id) {
    throw new Error('You must own both territories')
  }

  if (!fromTerritory.neighbors.includes(toTerritoryId)) {
    throw new Error('Territories are not adjacent')
  }

  if (fromTerritory.armies <= armies) {
    throw new Error('Not enough armies to move')
  }

  const newTerritories = game.territories.map(t => {
    if (t.id === fromTerritoryId) {
      return { ...t, armies: t.armies - armies }
    }
    if (t.id === toTerritoryId) {
      return { ...t, armies: t.armies + armies }
    }
    return t
  })

  return {
    ...game,
    territories: newTerritories,
  }
}

export function executePlaceArmies(game: GameState, territoryId: string, armies: number, playerId: number): GameState {
  const player = game.players.find(p => p.farcasterFid === playerId)
  if (!player || player.id !== game.currentPlayerId) {
    throw new Error('Not your turn')
  }

  if (game.phase !== 'placement') {
    throw new Error('Not in placement phase')
  }

  if (player.armiesToPlace < armies) {
    throw new Error('Not enough armies to place')
  }

  const territory = game.territories.find(t => t.id === territoryId)
  if (!territory) {
    throw new Error('Territory not found')
  }

  if (territory.ownerId !== player.id) {
    throw new Error('You do not own this territory')
  }

  const newTerritories = game.territories.map(t => {
    if (t.id === territoryId) {
      return { ...t, armies: t.armies + armies }
    }
    return t
  })

  const newPlayers = game.players.map(p => {
    if (p.id === player.id) {
      return { ...p, armiesToPlace: p.armiesToPlace - armies }
    }
    return p
  })

  return {
    ...game,
    territories: newTerritories,
    players: newPlayers,
  }
}

function calculateReinforcements(game: GameState, playerId: string): number {
  const player = game.players.find(p => p.id === playerId)
  if (!player) return 0

  const playerTerritories = game.territories.filter(t => t.ownerId === playerId)
  
  // Base reinforcements (minimum 3)
  let reinforcements = Math.max(3, Math.floor(playerTerritories.length / 3))

  // Continent bonuses
  for (const [continent, bonus] of Object.entries(CONTINENT_BONUSES)) {
    const continentTerritories = INITIAL_TERRITORIES.filter(t => t.continent === continent)
    const ownedInContinent = playerTerritories.filter(pt => 
      continentTerritories.some(ct => ct.id === pt.id)
    )
    
    if (ownedInContinent.length === continentTerritories.length) {
      reinforcements += bonus
    }
  }

  return reinforcements
}

export function executeEndTurn(game: GameState, playerId: number): GameState {
  const player = game.players.find(p => p.farcasterFid === playerId)
  if (!player || player.id !== game.currentPlayerId) {
    throw new Error('Not your turn')
  }

  // Move to next player
  const currentPlayerIndex = game.players.findIndex(p => p.id === game.currentPlayerId)
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length
  const nextPlayer = game.players[nextPlayerIndex]

  // Calculate reinforcements for next player
  const reinforcements = calculateReinforcements(game, nextPlayer.id)

  const newPlayers = game.players.map(p => {
    if (p.id === nextPlayer.id) {
      return { ...p, armiesToPlace: p.armiesToPlace + reinforcements }
    }
    return p
  })

  // Determine next phase
  let nextPhase: 'placement' | 'attack' | 'fortify' = 'placement'
  if (game.phase === 'placement') {
    nextPhase = newPlayers[nextPlayerIndex].armiesToPlace > 0 ? 'placement' : 'attack'
  } else if (game.phase === 'attack') {
    nextPhase = 'fortify'
  } else {
    nextPhase = 'placement'
  }

  return {
    ...game,
    currentPlayerId: nextPlayer.id,
    players: newPlayers,
    phase: nextPhase,
  }
}
