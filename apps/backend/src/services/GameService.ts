import { NeynarAPIClient } from '@neynar/nodejs-sdk'

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || ''

export class GameService {
  private neynarClient: NeynarAPIClient | null = null
  private games: Map<string, any> = new Map()
  private playerGames: Map<number, string> = new Map()

  constructor() {
    if (NEYNAR_API_KEY) {
      this.neynarClient = new NeynarAPIClient(NEYNAR_API_KEY)
    }
  }

  async getUserData(farcasterFid: number) {
    if (!this.neynarClient) {
      return {
        fid: farcasterFid,
        username: `Player${farcasterFid}`,
        displayName: `Player ${farcasterFid}`
      }
    }

    try {
      const user = await this.neynarClient.fetchBulkUsers([farcasterFid])
      const userData = user.users[0]
      return {
        fid: userData.fid,
        username: userData.username,
        displayName: userData.display_name
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      return {
        fid: farcasterFid,
        username: `Player${farcasterFid}`,
        displayName: `Player ${farcasterFid}`
      }
    }
  }

  async joinOrCreateGame(farcasterFid: number) {
    // Check if player already in a game
    const existingGameId = this.playerGames.get(farcasterFid)
    if (existingGameId && this.games.has(existingGameId)) {
      return this.games.get(existingGameId)
    }

    // Get user data from Neynar
    const userData = await this.getUserData(farcasterFid)

    // Find an open game or create new one
    let game = Array.from(this.games.values()).find(g => g.status === 'waiting' && g.players.length < 4)

    if (!game) {
      // Create new game
      const gameId = `game-${Date.now()}`
      const { initializeGame } = await import('@farcaster-risk/game-logic')
      
      game = initializeGame(gameId, [{
        id: `player-${farcasterFid}`,
        farcasterFid: userData.fid,
        username: userData.username,
        color: '#ff0000',
        armiesToPlace: 0
      }])

      this.games.set(gameId, game)
    } else {
      // Add player to existing game
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
      const usedColors = game.players.map((p: any) => p.color)
      const availableColor = colors.find(c => !usedColors.includes(c)) || '#ffffff'

      game.players.push({
        id: `player-${farcasterFid}`,
        farcasterFid: userData.fid,
        username: userData.username,
        color: availableColor,
        armiesToPlace: 0
      })

      // Start game if we have enough players
      if (game.players.length >= 2) {
        game.status = 'active'
        // Redistribute territories among all players
        const { redistributeTerritories } = await import('@farcaster-risk/game-logic')
        game = redistributeTerritories(game)
      }
    }

    this.playerGames.set(farcasterFid, game.id)
    this.games.set(game.id, game)
    return game
  }

  async getGame(gameId: string) {
    const game = this.games.get(gameId)
    if (!game) {
      throw new Error('Game not found')
    }
    return game
  }

  async attack(gameId: string, fromTerritoryId: string, toTerritoryId: string, playerId: number) {
    const game = this.games.get(gameId)
    if (!game) throw new Error('Game not found')

    const { executeAttack } = await import('@farcaster-risk/game-logic')
    const updatedGame = executeAttack(game, fromTerritoryId, toTerritoryId, playerId)
    
    this.games.set(gameId, updatedGame)
    return updatedGame
  }

  async fortify(gameId: string, fromTerritoryId: string, toTerritoryId: string, armies: number, playerId: number) {
    const game = this.games.get(gameId)
    if (!game) throw new Error('Game not found')

    const { executeFortify } = await import('@farcaster-risk/game-logic')
    const updatedGame = executeFortify(game, fromTerritoryId, toTerritoryId, armies, playerId)
    
    this.games.set(gameId, updatedGame)
    return updatedGame
  }

  async placeArmies(gameId: string, territoryId: string, armies: number, playerId: number) {
    const game = this.games.get(gameId)
    if (!game) throw new Error('Game not found')

    const { executePlaceArmies } = await import('@farcaster-risk/game-logic')
    const updatedGame = executePlaceArmies(game, territoryId, armies, playerId)
    
    this.games.set(gameId, updatedGame)
    return updatedGame
  }

  async endTurn(gameId: string, playerId: number) {
    const game = this.games.get(gameId)
    if (!game) throw new Error('Game not found')

    const { executeEndTurn } = await import('@farcaster-risk/game-logic')
    const updatedGame = executeEndTurn(game, playerId)
    
    this.games.set(gameId, updatedGame)
    return updatedGame
  }
}
