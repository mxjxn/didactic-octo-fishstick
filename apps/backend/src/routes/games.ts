import { Router } from 'express'
import * as gameController from '../controllers/gameController'

const router = Router()

// Game management
router.post('/', gameController.createGame)
router.get('/:gameId', gameController.getGame)
router.get('/player/:fid', gameController.getPlayerGame)
router.post('/:gameId/join', gameController.joinGame)

// Game actions
router.post('/:gameId/move', gameController.makeMove)
router.post('/:gameId/end-turn', gameController.endTurn)

// Game state
router.get('/:gameId/territories', gameController.getTerritories)

export default router
