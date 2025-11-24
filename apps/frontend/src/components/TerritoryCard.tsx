'use client'

import { Territory, Player } from '@/types/game'

interface TerritoryCardProps {
  territory: Territory
  isSelected: boolean
  onClick: () => void
  player?: Player
}

export default function TerritoryCard({
  territory,
  isSelected,
  onClick,
  player,
}: TerritoryCardProps) {
  return (
    <div
      className={`territory ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{
        padding: '15px',
        background: player
          ? `linear-gradient(135deg, ${player.color}88, ${player.color}cc)`
          : 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: isSelected
          ? '3px solid #ffd700'
          : player
          ? `2px solid ${player.color}`
          : '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isSelected
          ? '0 0 20px rgba(255, 215, 0, 0.5)'
          : '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>{territory.name}</h3>

      <div style={{ fontSize: '14px', opacity: 0.9 }}>
        <div style={{ marginBottom: '5px' }}>
          <strong>Continent:</strong> {territory.continent}
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>Armies:</strong> {territory.armies}
        </div>
        {player && (
          <div style={{ marginBottom: '5px' }}>
            <strong>Owner:</strong> {player.username || `FID ${player.fid}`}
          </div>
        )}
      </div>
    </div>
  )
}
