import { create } from 'zustand'
import axios from 'axios'
import { GameState, Move, AttackResult } from '@/types/game'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface GameStore {
  currentGame: GameState | null
  selectedTerritory: string | null
  loading: boolean
  error: string | null

  loadGame: (fid: number) => Promise<void>
  createGame: (fid: number) => Promise<void>
  joinGame: (gameId: string, fid: number) => Promise<void>
  makeMove: (move: Move) => Promise<void>
  endTurn: () => Promise<void>
  selectTerritory: (territoryId: string | null) => void
  refreshGame: () => Promise<void>
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentGame: null,
  selectedTerritory: null,
  loading: false,
  error: null,

  loadGame: async (fid: number) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get(`${API_URL}/api/games/player/${fid}`)
      set({ currentGame: response.data, loading: false })
    } catch (error: any) {
      if (error.response?.status === 404) {
        set({ currentGame: null, loading: false })
      } else {
        set({
          error: error.response?.data?.message || 'Failed to load game',
          loading: false
        })
      }
    }
  },

  createGame: async (fid: number) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/api/games`, { fid })
      set({ currentGame: response.data, loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create game',
        loading: false
      })
    }
  },

  joinGame: async (gameId: string, fid: number) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/api/games/${gameId}/join`, { fid })
      set({ currentGame: response.data, loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to join game',
        loading: false
      })
    }
  },

  makeMove: async (move: Move) => {
    const game = get().currentGame
    if (!game) return

    set({ loading: true, error: null })
    try {
      const response = await axios.post(
        `${API_URL}/api/games/${game.id}/move`,
        move
      )
      set({ currentGame: response.data, loading: false, selectedTerritory: null })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to make move',
        loading: false
      })
    }
  },

  endTurn: async () => {
    const game = get().currentGame
    if (!game) return

    set({ loading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/api/games/${game.id}/end-turn`)
      set({ currentGame: response.data, loading: false, selectedTerritory: null })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to end turn',
        loading: false
      })
    }
  },

  selectTerritory: (territoryId: string | null) => {
    set({ selectedTerritory: territoryId })
  },

  refreshGame: async () => {
    const game = get().currentGame
    if (!game) return

    try {
      const response = await axios.get(`${API_URL}/api/games/${game.id}`)
      set({ currentGame: response.data })
    } catch (error: any) {
      console.error('Failed to refresh game:', error)
    }
  },
}))
