import { useState, useEffect } from 'react'
import './App.css'
import GameBoard from './components/GameBoard'
import PlayerInfo from './components/PlayerInfo'
import Lobby from './components/Lobby'
import WaitingRoom from './components/WaitingRoom'
import { GameState } from './types'
import { apiClient, LobbyGame } from './services/api'

interface FarcasterContext {
  user?: {
    fid: number
    username?: string
  }
}

// App views: landing, waiting, playing
type AppView = 'landing' | 'waiting' | 'playing'

function App() {
  const [isReady, setIsReady] = useState(false)
  const [context, setContext] = useState<FarcasterContext | null>(null)
  const [view, setView] = useState<AppView>('landing')
  const [lobbyGame, setLobbyGame] = useState<LobbyGame | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null)

  // Load SDK with timeout fallback
  useEffect(() => {
    const load = async () => {
      // Detect Farcaster environment before attempting SDK import
      const inFarcaster = window.parent !== window && typeof window.parent.postMessage === 'function'

      if (!inFarcaster) {
        console.warn('Not in Farcaster context — running in standalone mode')
        setIsReady(true)
        setContext({ user: { fid: 0, username: 'Guest' } })
        return
      }

      try {
        const mod = await import('@farcaster/miniapp-sdk')
        const sdkModule = (mod as { sdk: { actions: { ready: () => Promise<void> }; context: Promise<unknown> } }).sdk
        if (!sdkModule) throw new Error('SDK module has no sdk export')

        await sdkModule.actions.ready()

        setIsReady(true)

        try {
          const ctx = await sdkModule.context
          setContext(ctx as FarcasterContext)
        } catch {
          setContext({ user: { fid: 0, username: 'Guest' } })
        }
      } catch (error) {
        console.error('SDK load failed:', error)
        setIsReady(true)
        setContext({ user: { fid: 0, username: 'Guest' } })
      }
    }

    load()
  }, [])

  // Check URL for invite code on load
  useEffect(() => {
    if (!isReady || !context) return
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code && context.user?.fid && context.user.fid > 0) {
      handleJoinByCode(code, context.user.fid)
    }
  }, [isReady, context])

  const handleJoinByCode = async (code: string, fid: number) => {
    try {
      const game = await apiClient.joinGame(fid, code.toUpperCase())
      if (game.status === 'waiting') {
        setLobbyGame(game)
        setView('waiting')
      } else {
        setGameState(game)
        setView('playing')
      }
    } catch (err) {
      console.error('Failed to join by code:', err)
      // Silently fail — show landing page
    }
  }

  const handleGameJoined = (game: LobbyGame) => {
    if (game.status === 'waiting') {
      setLobbyGame(game)
      setView('waiting')
    } else {
      setGameState(game)
      setView('playing')
    }
  }

  const handleGameStarted = (game: GameState) => {
    setGameState(game)
    setView('playing')
  }

  const handleLeave = () => {
    setLobbyGame(null)
    setGameState(null)
    setView('landing')
    // Clear code from URL
    window.history.replaceState({}, '', window.location.pathname)
  }

  const handleTerritorySelect = (territoryId: string) => {
    setSelectedTerritory(territoryId)
  }

  const handleAttack = async (fromId: string, toId: string) => {
    if (!gameState || !context?.user?.fid) return

    try {
      const updatedGame = await apiClient.attack(gameState.id, fromId, toId, context.user.fid)
      setGameState(updatedGame)
      setSelectedTerritory(null)
    } catch (error) {
      console.error('Attack failed:', error)
    }
  }

  const handleFortify = async (fromId: string, toId: string, armies: number) => {
    if (!gameState || !context?.user?.fid) return

    try {
      const updatedGame = await apiClient.fortify(gameState.id, fromId, toId, armies, context.user.fid)
      setGameState(updatedGame)
      setSelectedTerritory(null)
    } catch (error) {
      console.error('Fortify failed:', error)
    }
  }

  const handleEndTurn = async () => {
    if (!gameState || !context?.user?.fid) return

    try {
      const updatedGame = await apiClient.endTurn(gameState.id, context.user.fid)
      setGameState(updatedGame)
    } catch (error) {
      console.error('End turn failed:', error)
    }
  }

  if (!isReady) {
    return <div className="loading">Loading...</div>
  }

  // Landing page
  if (view === 'landing' && context?.user?.fid !== undefined) {
    return (
      <Lobby
        fid={context.user.fid}
        username={context.user.username}
        onGameJoined={handleGameJoined}
      />
    )
  }

  // Waiting room / lobby
  if (view === 'waiting' && lobbyGame) {
    return (
      <WaitingRoom
        game={lobbyGame}
        fid={context?.user?.fid || 0}
        onGameStarted={handleGameStarted}
        onLeave={handleLeave}
      />
    )
  }

  // Game board
  if (view === 'playing' && gameState) {
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId)

    return (
      <div className="app">
        <h1>Farcaster Risk</h1>

        <PlayerInfo
          player={currentPlayer}
          gameState={gameState}
          isYourTurn={context?.user?.fid === currentPlayer?.farcasterFid}
        />

        <GameBoard
          territories={gameState.territories}
          selectedTerritory={selectedTerritory}
          onTerritorySelect={handleTerritorySelect}
          onAttack={handleAttack}
          onFortify={handleFortify}
          currentPlayerId={gameState.currentPlayerId}
        />

        {context?.user?.fid === currentPlayer?.farcasterFid && (
          <div className="actions">
            <button onClick={handleEndTurn}>End Turn</button>
          </div>
        )}
      </div>
    )
  }

  return <div className="loading">Loading...</div>
}

export default App
