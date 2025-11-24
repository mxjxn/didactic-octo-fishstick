'use client'

import { useEffect, useState } from 'react'
import { useFarcasterContext } from '@/hooks/useFarcasterContext'
import GameBoard from '@/components/GameBoard'
import PlayerInfo from '@/components/PlayerInfo'
import GameControls from '@/components/GameControls'
import { useGameStore } from '@/store/gameStore'

export default function Home() {
  const { fid, isContextReady } = useFarcasterContext()
  const { currentGame, loadGame } = useGameStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isContextReady && fid) {
      loadGame(fid).finally(() => setIsLoading(false))
    } else if (isContextReady) {
      setIsLoading(false)
    }
  }, [fid, isContextReady, loadGame])

  if (!isContextReady || isLoading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h1>Loading Farcaster Risk Game...</h1>
          <p style={{ marginTop: '20px', opacity: 0.8 }}>
            Preparing the battlefield
          </p>
        </div>
      </div>
    )
  }

  if (!fid) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h1>Farcaster Risk Game</h1>
          <p style={{ marginTop: '20px', opacity: 0.8 }}>
            Please open this miniapp from Farcaster
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Farcaster Risk Game</h1>
        <p style={{ opacity: 0.8, marginTop: '10px' }}>
          Conquer the world, one territory at a time
        </p>
      </header>

      {currentGame ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          <PlayerInfo />
          <GameBoard />
          <GameControls />
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <h2>No Active Game</h2>
          <p style={{ marginTop: '20px', opacity: 0.8 }}>
            Create a new game or join an existing one to start playing
          </p>
          <GameControls />
        </div>
      )}
    </div>
  )
}
