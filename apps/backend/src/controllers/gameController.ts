import { Request, Response, NextFunction } from 'express'
import * as gameService from '../services/gameService'
import { AppError } from '../middleware/errorHandler'

export async function createGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { fid } = req.body

    if (!fid) {
      throw new AppError('FID is required', 400)
    }

    const game = await gameService.createGame(String(fid))
    res.status(201).json(game)
  } catch (error) {
    next(error)
  }
}

export async function getGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params
    const game = await gameService.getGame(gameId)

    if (!game) {
      throw new AppError('Game not found', 404)
    }

    res.json(game)
  } catch (error) {
    next(error)
  }
}

export async function getPlayerGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { fid } = req.params
    const game = await gameService.getPlayerActiveGame(String(fid))

    if (!game) {
      throw new AppError('No active game found for player', 404)
    }

    res.json(game)
  } catch (error) {
    next(error)
  }
}

export async function joinGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params
    const { fid } = req.body

    if (!fid) {
      throw new AppError('FID is required', 400)
    }

    const game = await gameService.joinGame(gameId, String(fid))
    res.json(game)
  } catch (error) {
    next(error)
  }
}

export async function makeMove(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params
    const { type, fromTerritory, toTerritory, armies } = req.body

    if (!type || !toTerritory || !armies) {
      throw new AppError('Invalid move data', 400)
    }

    const game = await gameService.makeMove(gameId, {
      type,
      fromTerritory,
      toTerritory,
      armies,
    })

    res.json(game)
  } catch (error) {
    next(error)
  }
}

export async function endTurn(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params
    const game = await gameService.endTurn(gameId)
    res.json(game)
  } catch (error) {
    next(error)
  }
}

export async function getTerritories(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params
    const territories = await gameService.getTerritories(gameId)
    res.json(territories)
  } catch (error) {
    next(error)
  }
}
