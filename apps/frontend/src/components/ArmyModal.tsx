import { useState } from 'react'
import './ArmyModal.css'

interface ArmyModalProps {
  isOpen: boolean
  maxArmies: number
  onConfirm: (armies: number) => void
  onCancel: () => void
}

const ArmyModal = ({ isOpen, maxArmies, onConfirm, onCancel }: ArmyModalProps) => {
  const [armies, setArmies] = useState(1)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (armies > 0 && armies <= maxArmies) {
      onConfirm(armies)
      setArmies(1)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Move Armies</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Number of armies to move (max {maxArmies}):
            <input
              type="number"
              min={1}
              max={maxArmies}
              value={armies}
              onChange={(e) => setArmies(parseInt(e.target.value) || 1)}
              autoFocus
            />
          </label>
          <div className="modal-actions">
            <button type="submit" disabled={armies < 1 || armies > maxArmies}>
              Confirm
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ArmyModal
