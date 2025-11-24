'use client'

import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useFarcasterContext } from '@/hooks/useFarcasterContext'

export default function GameControls() {
  const { currentGame, selectedTerritory, makeMove, endTurn, createGame, loading } = useGameStore()
  const { fid } = useFarcasterContext()
  const [armies, setArmies] = useState(1)

  if (!fid) return null

  const isCurrentTurn = currentGame?.currentTurn === String(fid)
  const selectedTerritoryData = currentGame?.territories.find(t => t.id === selectedTerritory)

  const handleDeploy = () => {
    if (!selectedTerritory) return
    makeMove({
      type: 'deploy',
      toTerritory: selectedTerritory,
      armies,
    })
  }

  const handleAttack = (targetId: string) => {
    if (!selectedTerritory) return
    makeMove({
      type: 'attack',
      fromTerritory: selectedTerritory,
      toTerritory: targetId,
      armies,
    })
  }

  const handleFortify = (targetId: string) => {
    if (!selectedTerritory) return
    makeMove({
      type: 'fortify',
      fromTerritory: selectedTerritory,
      toTerritory: targetId,
      armies,
    })
  }

  if (!currentGame) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '30px',
        textAlign: 'center',
      }}>
        <button
          onClick={() => createGame(fid)}
          disabled={loading}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          {loading ? 'Creating...' : 'Create New Game'}
        </button>
      </div>
    )
  }

  if (!isCurrentTurn) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '20px',
        textAlign: 'center',
      }}>
        <p style={{ opacity: 0.8 }}>Waiting for other players to make their moves...</p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '20px',
    }}>
      <h2 style={{ marginBottom: '20px' }}>Your Turn - {currentGame.phase.toUpperCase()}</h2>

      {selectedTerritoryData && (
        <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
          <h3 style={{ marginBottom: '10px' }}>Selected: {selectedTerritoryData.name}</h3>
          <p>Armies: {selectedTerritoryData.armies}</p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Number of Armies: {armies}
        </label>
        <input
          type="range"
          min="1"
          max={selectedTerritoryData ? selectedTerritoryData.armies - 1 : 10}
          value={armies}
          onChange={(e) => setArmies(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {currentGame.phase === 'deploy' && selectedTerritory && (
        <button
          onClick={handleDeploy}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            color: '#fff',
            borderRadius: '12px',
            marginBottom: '10px',
          }}
        >
          Deploy {armies} {armies === 1 ? 'Army' : 'Armies'}
        </button>
      )}

      {currentGame.phase === 'attack' && selectedTerritory && selectedTerritoryData?.adjacentTerritories && (
        <div style={{ marginBottom: '10px' }}>
          <h3 style={{ marginBottom: '10px' }}>Attack Adjacent Territory:</h3>
          {selectedTerritoryData.adjacentTerritories
            .filter(adjId => {
              const adjTerritory = currentGame.territories.find(t => t.id === adjId)
              return adjTerritory?.ownerId !== String(fid)
            })
            .map(adjId => {
              const adjTerritory = currentGame.territories.find(t => t.id === adjId)
              if (!adjTerritory) return null
              return (
                <button
                  key={adjId}
                  onClick={() => handleAttack(adjId)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '5px',
                    background: 'linear-gradient(135deg, #f87171, #ef4444)',
                    color: '#fff',
                    borderRadius: '8px',
                  }}
                >
                  Attack {adjTerritory.name} ({adjTerritory.armies} armies)
                </button>
              )
            })}
        </div>
      )}

      {currentGame.phase === 'fortify' && selectedTerritory && selectedTerritoryData?.adjacentTerritories && (
        <div style={{ marginBottom: '10px' }}>
          <h3 style={{ marginBottom: '10px' }}>Fortify Adjacent Territory:</h3>
          {selectedTerritoryData.adjacentTerritories
            .filter(adjId => {
              const adjTerritory = currentGame.territories.find(t => t.id === adjId)
              return adjTerritory?.ownerId === String(fid)
            })
            .map(adjId => {
              const adjTerritory = currentGame.territories.find(t => t.id === adjId)
              if (!adjTerritory) return null
              return (
                <button
                  key={adjId}
                  onClick={() => handleFortify(adjId)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '5px',
                    background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                    color: '#fff',
                    borderRadius: '8px',
                  }}
                >
                  Move to {adjTerritory.name}
                </button>
              )
            })}
        </div>
      )}

      <button
        onClick={endTurn}
        disabled={loading}
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '16px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          color: '#fff',
          borderRadius: '12px',
        }}
      >
        End Turn
      </button>
    </div>
  )
}
