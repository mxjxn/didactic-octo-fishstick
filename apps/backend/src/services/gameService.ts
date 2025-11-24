import { prisma } from '@farcaster-risk/db'
import { AppError } from '../middleware/errorHandler'
import { getNeynarUser } from './neynarService'
import { territories as initialTerritories } from './territories'

interface Move {
  type: 'deploy' | 'attack' | 'fortify'
  fromTerritory?: string
  toTerritory: string
  armies: number
}

const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']

export async function createGame(fid: string) {
  // Fetch user data from Neynar
  const userData = await getNeynarUser(fid)

  // Create game with territories
  const game = await prisma.game.create({
    data: {
      status: 'waiting',
      currentTurn: fid,
      players: {
        create: {
          fid,
          username: userData?.username || null,
          pfp: userData?.pfp_url || null,
          color: PLAYER_COLORS[0],
          armies: 30,
        },
      },
      territories: {
        create: initialTerritories.map((territory) => ({
          name: territory.name,
          continent: territory.continent,
          adjacentIds: territory.adjacentTerritories,
          positionX: territory.position.x,
          positionY: territory.position.y,
          armies: 0,
        })),
      },
    },
    include: {
      players: true,
      territories: true,
    },
  })

  return formatGameState(game)
}

export async function getGame(gameId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      players: true,
      territories: true,
    },
  })

  if (!game) {
    throw new AppError('Game not found', 404)
  }

  return formatGameState(game)
}

export async function getPlayerActiveGame(fid: string) {
  const player = await prisma.player.findFirst({
    where: {
      fid,
      isActive: true,
      game: {
        status: {
          in: ['waiting', 'active'],
        },
      },
    },
    include: {
      game: {
        include: {
          players: true,
          territories: true,
        },
      },
    },
  })

  if (!player || !player.game) {
    return null
  }

  return formatGameState(player.game)
}

export async function joinGame(gameId: string, fid: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { players: true },
  })

  if (!game) {
    throw new AppError('Game not found', 404)
  }

  if (game.status !== 'waiting') {
    throw new AppError('Game has already started', 400)
  }

  if (game.players.length >= 6) {
    throw new AppError('Game is full', 400)
  }

  if (game.players.some((p) => p.fid === fid)) {
    throw new AppError('Player already in game', 400)
  }

  const userData = await getNeynarUser(fid)

  const updatedGame = await prisma.game.update({
    where: { id: gameId },
    data: {
      players: {
        create: {
          fid,
          username: userData?.username || null,
          pfp: userData?.pfp_url || null,
          color: PLAYER_COLORS[game.players.length],
          armies: 30,
        },
      },
      status: game.players.length >= 1 ? 'active' : 'waiting',
    },
    include: {
      players: true,
      territories: true,
    },
  })

  // If game is starting, distribute territories
  if (updatedGame.status === 'active') {
    await distributeTerritories(gameId)
  }

  return getGame(gameId)
}

async function distributeTerritories(gameId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      players: true,
      territories: true,
    },
  })

  if (!game) return

  const players = game.players
  const territories = game.territories

  // Shuffle and distribute territories
  const shuffled = [...territories].sort(() => Math.random() - 0.5)

  for (let i = 0; i < shuffled.length; i++) {
    const player = players[i % players.length]
    await prisma.territory.update({
      where: { id: shuffled[i].id },
      data: {
        ownerId: player.id,
        armies: 1,
      },
    })
  }

  // Update player territory counts
  for (const player of players) {
    const territoryCount = territories.filter(
      (t, idx) => players[idx % players.length].id === player.id
    ).length
    await prisma.player.update({
      where: { id: player.id },
      data: { territories: territoryCount },
    })
  }
}

export async function makeMove(gameId: string, move: Move) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      players: true,
      territories: true,
    },
  })

  if (!game) {
    throw new AppError('Game not found', 404)
  }

  if (game.status !== 'active') {
    throw new AppError('Game is not active', 400)
  }

  const territory = game.territories.find((t) => t.id === move.toTerritory)
  if (!territory) {
    throw new AppError('Territory not found', 404)
  }

  switch (move.type) {
    case 'deploy':
      return handleDeploy(game, move)
    case 'attack':
      return handleAttack(game, move)
    case 'fortify':
      return handleFortify(game, move)
    default:
      throw new AppError('Invalid move type', 400)
  }
}

async function handleDeploy(game: any, move: Move) {
  const currentPlayer = game.players.find((p: any) => p.fid === game.currentTurn)
  if (!currentPlayer) {
    throw new AppError('Current player not found', 404)
  }

  if (game.phase !== 'deploy') {
    throw new AppError('Not in deploy phase', 400)
  }

  const territory = game.territories.find((t: any) => t.id === move.toTerritory)
  if (territory.ownerId !== currentPlayer.id) {
    throw new AppError('Can only deploy to your own territories', 400)
  }

  if (move.armies > currentPlayer.armies) {
    throw new AppError('Not enough armies', 400)
  }

  await prisma.territory.update({
    where: { id: move.toTerritory },
    data: { armies: { increment: move.armies } },
  })

  await prisma.player.update({
    where: { id: currentPlayer.id },
    data: { armies: { decrement: move.armies } },
  })

  await prisma.move.create({
    data: {
      gameId: game.id,
      playerId: currentPlayer.id,
      type: 'deploy',
      toTerritoryId: move.toTerritory,
      armies: move.armies,
    },
  })

  return getGame(game.id)
}

async function handleAttack(game: any, move: Move) {
  if (game.phase !== 'attack') {
    throw new AppError('Not in attack phase', 400)
  }

  if (!move.fromTerritory) {
    throw new AppError('Source territory required for attack', 400)
  }

  const fromTerritory = game.territories.find((t: any) => t.id === move.fromTerritory)
  const toTerritory = game.territories.find((t: any) => t.id === move.toTerritory)

  if (!fromTerritory || !toTerritory) {
    throw new AppError('Territory not found', 404)
  }

  const currentPlayer = game.players.find((p: any) => p.fid === game.currentTurn)
  if (fromTerritory.ownerId !== currentPlayer.id) {
    throw new AppError('Can only attack from your own territories', 400)
  }

  if (toTerritory.ownerId === currentPlayer.id) {
    throw new AppError('Cannot attack your own territory', 400)
  }

  if (!fromTerritory.adjacentIds.includes(toTerritory.id)) {
    throw new AppError('Territories must be adjacent', 400)
  }

  if (fromTerritory.armies <= move.armies) {
    throw new AppError('Must leave at least 1 army in source territory', 400)
  }

  // Simple combat resolution
  const attackerDice = Math.min(move.armies, 3)
  const defenderDice = Math.min(toTerritory.armies, 2)

  let attackerLosses = 0
  let defenderLosses = 0

  for (let i = 0; i < Math.min(attackerDice, defenderDice); i++) {
    const attackRoll = Math.floor(Math.random() * 6) + 1
    const defendRoll = Math.floor(Math.random() * 6) + 1

    if (attackRoll > defendRoll) {
      defenderLosses++
    } else {
      attackerLosses++
    }
  }

  const conquered = toTerritory.armies - defenderLosses <= 0

  // Update territories
  await prisma.territory.update({
    where: { id: fromTerritory.id },
    data: { armies: { decrement: attackerLosses } },
  })

  if (conquered) {
    await prisma.territory.update({
      where: { id: toTerritory.id },
      data: {
        ownerId: currentPlayer.id,
        armies: move.armies - attackerLosses,
      },
    })

    await prisma.territory.update({
      where: { id: fromTerritory.id },
      data: { armies: { decrement: move.armies - attackerLosses } },
    })
  } else {
    await prisma.territory.update({
      where: { id: toTerritory.id },
      data: { armies: { decrement: defenderLosses } },
    })
  }

  await prisma.move.create({
    data: {
      gameId: game.id,
      playerId: currentPlayer.id,
      type: 'attack',
      fromTerritoryId: move.fromTerritory,
      toTerritoryId: move.toTerritory,
      armies: move.armies,
      result: {
        attackerLosses,
        defenderLosses,
        conquered,
      },
    },
  })

  return getGame(game.id)
}

async function handleFortify(game: any, move: Move) {
  if (game.phase !== 'fortify') {
    throw new AppError('Not in fortify phase', 400)
  }

  if (!move.fromTerritory) {
    throw new AppError('Source territory required for fortify', 400)
  }

  const fromTerritory = game.territories.find((t: any) => t.id === move.fromTerritory)
  const toTerritory = game.territories.find((t: any) => t.id === move.toTerritory)

  if (!fromTerritory || !toTerritory) {
    throw new AppError('Territory not found', 404)
  }

  const currentPlayer = game.players.find((p: any) => p.fid === game.currentTurn)

  if (fromTerritory.ownerId !== currentPlayer.id || toTerritory.ownerId !== currentPlayer.id) {
    throw new AppError('Can only fortify your own territories', 400)
  }

  if (!fromTerritory.adjacentIds.includes(toTerritory.id)) {
    throw new AppError('Territories must be adjacent', 400)
  }

  if (fromTerritory.armies <= move.armies) {
    throw new AppError('Must leave at least 1 army in source territory', 400)
  }

  await prisma.territory.update({
    where: { id: fromTerritory.id },
    data: { armies: { decrement: move.armies } },
  })

  await prisma.territory.update({
    where: { id: toTerritory.id },
    data: { armies: { increment: move.armies } },
  })

  await prisma.move.create({
    data: {
      gameId: game.id,
      playerId: currentPlayer.id,
      type: 'fortify',
      fromTerritoryId: move.fromTerritory,
      toTerritoryId: move.toTerritory,
      armies: move.armies,
    },
  })

  return getGame(game.id)
}

export async function endTurn(gameId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      players: true,
      territories: true,
    },
  })

  if (!game) {
    throw new AppError('Game not found', 404)
  }

  // Move to next phase or next player
  let nextPhase = game.phase
  let nextTurn = game.currentTurn
  let turnNumber = game.turnNumber

  if (game.phase === 'deploy') {
    nextPhase = 'attack'
  } else if (game.phase === 'attack') {
    nextPhase = 'fortify'
  } else {
    // Move to next player
    const currentPlayerIndex = game.players.findIndex((p) => p.fid === game.currentTurn)
    const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length
    nextTurn = game.players[nextPlayerIndex].fid
    nextPhase = 'deploy'
    turnNumber += 1

    // Give reinforcements to next player
    const nextPlayer = game.players[nextPlayerIndex]
    const territoryCount = game.territories.filter((t) => t.ownerId === nextPlayer.id).length
    const reinforcements = Math.max(3, Math.floor(territoryCount / 3))

    await prisma.player.update({
      where: { id: nextPlayer.id },
      data: { armies: { increment: reinforcements } },
    })
  }

  await prisma.game.update({
    where: { id: gameId },
    data: {
      phase: nextPhase,
      currentTurn: nextTurn,
      turnNumber,
    },
  })

  return getGame(gameId)
}

export async function getTerritories(gameId: string) {
  const territories = await prisma.territory.findMany({
    where: { gameId },
  })

  return territories
}

function formatGameState(game: any) {
  return {
    id: game.id,
    status: game.status,
    currentTurn: game.currentTurn,
    phase: game.phase,
    turnNumber: game.turnNumber,
    winner: game.winner,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
    players: game.players.map((p: any) => ({
      fid: p.fid,
      username: p.username,
      pfp: p.pfp,
      color: p.color,
      armies: p.armies,
      territories: p.territories,
    })),
    territories: game.territories.map((t: any) => ({
      id: t.id,
      name: t.name,
      continent: t.continent,
      armies: t.armies,
      ownerId: t.ownerId,
      adjacentTerritories: t.adjacentIds,
      position: { x: t.positionX, y: t.positionY },
    })),
  }
}
