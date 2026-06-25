import { NeynarAPIClient } from '@neynar/nodejs-sdk'
import { GameState } from '@farcaster-risk/game-logic'

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || ''

type ServerGame = GameState & { inviteCode?: string; creatorFid?: number }

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export class GameService {
  private neynarClient: NeynarAPIClient | null = null
  private games: { [key: string]: ServerGame } = {}
  private playerGames: Map<number, string> = new Map()
  private inviteCodeMap: Map<string, string> = new Map()

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

  async createGame(farcasterFid: number): Promise<ServerGame> {
    const existingGameId = this.playerGames.get(farcasterFid)
    if (existingGameId && this.games[existingGameId]?.status === 'waiting') {
      return this.games[existingGameId]
    }

    const userData = await this.getUserData(farcasterFid)
    const gameId = `game-${Date.now()}`
    let inviteCode = generateInviteCode()
    while (this.inviteCodeMap.has(inviteCode)) {
      inviteCode = generateInviteCode()
    }

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
    const game: ServerGame = {
      id: gameId,
      status: 'waiting',
      currentPlayerId: '',
      players: [{
        id: `player-${farcasterFid}`,
        farcasterFid: userData.fid,
        username: userData.username,
        color: colors[0],
        armiesToPlace: 0
      }],
      territories: [],
      phase: 'placement',
      inviteCode,
      creatorFid: farcasterFid,
    }

    this.games[gameId] = game
    this.inviteCodeMap.set(inviteCode, gameId)
    this.playerGames.set(farcasterFid, gameId)
    return game
  }

  async joinGame(farcasterFid: number, gameIdOrCode: string): Promise<ServerGame> {
    let gameId = gameIdOrCode
    if (!gameId.startsWith('game-')) {
      gameId = this.inviteCodeMap.get(gameIdOrCode) || gameIdOrCode
    }

    const game = this.games[gameId]
    if (!game) throw new Error('Game not found')
    if (game.status !== 'waiting') throw new Error('Game is already in progress')
    if (game.players.length >= 4) throw new Error('Game is full')
    if (game.players.some(p => p.farcasterFid === farcasterFid)) return game

    const existingGameId = this.playerGames.get(farcasterFid)
    if (existingGameId && this.games[existingGameId]) {
      throw new Error('You are already in a game')
    }

    const userData = await this.getUserData(farcasterFid)
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
    const usedColors = game.players.map(p => p.color)
    const availableColor = colors.find(c => !usedColors.includes(c)) || '#ffffff'

    game.players.push({
      id: `player-${farcasterFid}`,
      farcasterFid: userData.fid,
      username: userData.username,
      color: availableColor,
      armiesToPlace: 0
    })

    this.playerGames.set(farcasterFid, gameId)
    return game
  }

  async startGame(gameId: string, farcasterFid: number): Promise<GameState> {
    const game = this.games[gameId]
    if (!game) throw new Error('Game not found')
    if (game.creatorFid !== farcasterFid) throw new Error('Only the creator can start the game')
    if (game.status !== 'waiting') throw new Error('Game is already in progress')
    if (game.players.length < 2) throw new Error('Need at least 2 players to start')

    const { redistributeTerritories } = await import('@farcaster-risk/game-logic')
    const activeGame = redistributeTerritories(game) as ServerGame
    activeGame.status = 'active'

    this.games[gameId] = activeGame
    return activeGame
  }

  listOpenGames(): ServerGame[] {
    return Object.values(this.games).filter(g => g.status === 'waiting')
  }

  // Legacy
  async joinOrCreateGame(farcasterFid: number): Promise<GameState> {
    const existingGameId = this.playerGames.get(farcasterFid)
    if (existingGameId && this.games[existingGameId]) {
      return this.games[existingGameId]
    }

    const userData = await this.getUserData(farcasterFid)
    let found = Object.values(this.games).find(g => g.status === 'waiting' && g.players.length < 4)

    if (!found) {
      const gameId = `game-${Date.now()}`
      const inviteCode = generateInviteCode()
      const { initializeGame } = await import('@farcaster-risk/game-logic')

      const game: ServerGame = {
        ...initializeGame(gameId, [{
          id: `player-${farcasterFid}`,
          farcasterFid: userData.fid,
          username: userData.username,
          color: '#ff0000',
          armiesToPlace: 0
        }]),
        inviteCode,
        creatorFid: farcasterFid,
      }

      this.games[gameId] = game
      this.inviteCodeMap.set(inviteCode, gameId)
      return game
    }

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
    const usedColors = found.players.map(p => p.color)
    const availableColor = colors.find(c => !usedColors.includes(c)) || '#ffffff'

    found.players.push({
      id: `player-${farcasterFid}`,
      farcasterFid: userData.fid,
      username: userData.username,
      color: availableColor,
      armiesToPlace: 0
    })

    if (found.players.length >= 2) {
      const { redistributeTerritories } = await import('@farcaster-risk/game-logic')
      const activeGame = redistributeTerritories(found) as ServerGame
      activeGame.status = 'active'
      this.games[found.id] = activeGame
      return activeGame
    }

    this.playerGames.set(farcasterFid, found.id)
    return found
  }

  async getGame(gameId: string): Promise<GameState> {
    const game = this.games[gameId]
    if (!game) throw new Error('Game not found')
    return game
  }

  async attack(gameId: string, fromTerritoryId: string, toTerritoryId: string, playerId: number): Promise<GameState> {
    const game = this.games[gameId]
    if (!game) throw new Error('Game not found')

    const { executeAttack } = await import('@farcaster-risk/game-logic')
    const updatedGame = executeAttack(game, fromTerritoryId, toTerritoryId, playerId) as ServerGame
    this.games[gameId] = updatedGame
    return updatedGame
  }

  async fortify(gameId: string, fromTerritoryId: string, toTerritoryId: string, armies: number, playerId: number): Promise<GameState> {
    const game = this.games[gameId]
    if (!game) throw new Error('Game not found')

    const { executeFortify } = await import('@farcaster-risk/game-logic')
    const updatedGame = executeFortify(game, fromTerritoryId, toTerritoryId, armies, playerId) as ServerGame
    this.games[gameId] = updatedGame
    return updatedGame
  }

  async placeArmies(gameId: string, territoryId: string, armies: number, playerId: number): Promise<GameState> {
    const game = this.games[gameId]
    if (!game) throw new Error('Game not found')

    const { executePlaceArmies } = await import('@farcaster-risk/game-logic')
    const updatedGame = executePlaceArmies(game, territoryId, armies, playerId) as ServerGame
    this.games[gameId] = updatedGame
    return updatedGame
  }

  async endTurn(gameId: string, playerId: number): Promise<GameState> {
    const game = this.games[gameId]
    if (!game) throw new Error('Game not found')

    const { executeEndTurn } = await import('@farcaster-risk/game-logic')
    const updatedGame = executeEndTurn(game, playerId) as ServerGame
    this.games[gameId] = updatedGame
    return updatedGame
  }
}
