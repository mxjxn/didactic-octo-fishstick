import { Router } from 'express'
import { GameService } from '../services/GameService'

const router = Router()
const gameService = new GameService()

// Create a new game (returns lobby game with invite code)
router.post('/', async (req, res) => {
  try {
    const { farcasterFid } = req.body
    if (farcasterFid === undefined || farcasterFid === null) {
      return res.status(400).json({ error: 'farcasterFid is required' })
    }
    const game = await gameService.createGame(farcasterFid)
    res.json(game)
  } catch (error) {
    console.error('Error creating game:', error)
    res.status(500).json({ error: 'Failed to create game' })
  }
})

// List open games
router.get('/open', async (_req, res) => {
  try {
    const games = gameService.listOpenGames()
    res.json(games)
  } catch (error) {
    console.error('Error listing games:', error)
    res.status(500).json({ error: 'Failed to list games' })
  }
})

// Join or create a game (legacy)
router.post('/join', async (req, res) => {
  try {
    const { farcasterFid } = req.body
    const game = await gameService.joinOrCreateGame(farcasterFid)
    res.json(game)
  } catch (error) {
    console.error('Error joining game:', error)
    res.status(500).json({ error: 'Failed to join game' })
  }
})

// Get game state
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params
    const game = await gameService.getGame(gameId)
    res.json(game)
  } catch (error) {
    console.error('Error getting game:', error)
    res.status(404).json({ error: 'Game not found' })
  }
})

// Join a specific game by ID or invite code
router.post('/:gameId/join', async (req, res) => {
  try {
    const { gameId } = req.params
    const { farcasterFid } = req.body
    if (farcasterFid === undefined || farcasterFid === null) {
      return res.status(400).json({ error: 'farcasterFid is required' })
    }
    const game = await gameService.joinGame(farcasterFid, gameId)
    res.json(game)
  } catch (error) {
    console.error('Error joining game:', error)
    const status = error instanceof Error && error.message.includes('already in a game') ? 409 : 400
    res.status(status).json({ error: error instanceof Error ? error.message : 'Failed to join game' })
  }
})

// Start a waiting game (creator only)
router.post('/:gameId/start', async (req, res) => {
  try {
    const { gameId } = req.params
    const { farcasterFid } = req.body
    if (farcasterFid === undefined || farcasterFid === null) {
      return res.status(400).json({ error: 'farcasterFid is required' })
    }
    const game = await gameService.startGame(gameId, farcasterFid)
    res.json(game)
  } catch (error) {
    console.error('Error starting game:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to start game' })
  }
})

// Attack action
router.post('/:gameId/attack', async (req, res) => {
  try {
    const { gameId } = req.params
    const { fromTerritoryId, toTerritoryId, playerId } = req.body
    const result = await gameService.attack(gameId, fromTerritoryId, toTerritoryId, playerId)
    res.json(result)
  } catch (error) {
    console.error('Error attacking:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Attack failed' })
  }
})

// Fortify action
router.post('/:gameId/fortify', async (req, res) => {
  try {
    const { gameId } = req.params
    const { fromTerritoryId, toTerritoryId, armies, playerId } = req.body
    const result = await gameService.fortify(gameId, fromTerritoryId, toTerritoryId, armies, playerId)
    res.json(result)
  } catch (error) {
    console.error('Error fortifying:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Fortify failed' })
  }
})

// Place armies
router.post('/:gameId/place-armies', async (req, res) => {
  try {
    const { gameId } = req.params
    const { territoryId, armies, playerId } = req.body
    const result = await gameService.placeArmies(gameId, territoryId, armies, playerId)
    res.json(result)
  } catch (error) {
    console.error('Error placing armies:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Place armies failed' })
  }
})

// End turn
router.post('/:gameId/end-turn', async (req, res) => {
  try {
    const { gameId } = req.params
    const { playerId } = req.body
    const result = await gameService.endTurn(gameId, playerId)
    res.json(result)
  } catch (error) {
    console.error('Error ending turn:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'End turn failed' })
  }
})

export default router
