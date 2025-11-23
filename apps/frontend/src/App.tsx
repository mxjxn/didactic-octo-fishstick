import { useState, useEffect } from 'react'
import sdk from '@farcaster/frame-sdk'
import './App.css'
import GameBoard from './components/GameBoard'
import PlayerInfo from './components/PlayerInfo'
import { GameState } from './types'
import { apiClient } from './services/api'

interface FarcasterContext {
  user?: {
    fid: number
    username?: string
  }
}

function App() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<FarcasterContext | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        await sdk.actions.ready()
        setIsSDKLoaded(true)
        
        // Get context from Farcaster
        const ctx = await sdk.context
        setContext(ctx as FarcasterContext)
        
        // Load or create game
        if (ctx?.user?.fid) {
          const game = await apiClient.getOrCreateGame(ctx.user.fid)
          setGameState(game)
        }
      } catch (error) {
        console.error('Failed to load SDK:', error)
      }
    }
    
    load()
  }, [])

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

  if (!isSDKLoaded) {
    return <div>Loading Farcaster SDK...</div>
  }

  if (!gameState) {
    return <div>Loading game...</div>
  }

  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId)

  return (
    <div className="app">
      <h1>Farcaster Risk Game</h1>
      
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

export default App
