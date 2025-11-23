import axios from 'axios'
import { GameState } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const apiClient = {
  async getOrCreateGame(farcasterFid: number): Promise<GameState> {
    const response = await axios.post(`${API_BASE_URL}/games/join`, { farcasterFid })
    return response.data
  },

  async getGame(gameId: string): Promise<GameState> {
    const response = await axios.get(`${API_BASE_URL}/games/${gameId}`)
    return response.data
  },

  async attack(gameId: string, fromTerritoryId: string, toTerritoryId: string, playerId: number) {
    const response = await axios.post(`${API_BASE_URL}/games/${gameId}/attack`, {
      fromTerritoryId,
      toTerritoryId,
      playerId
    })
    return response.data
  },

  async fortify(gameId: string, fromTerritoryId: string, toTerritoryId: string, armies: number, playerId: number) {
    const response = await axios.post(`${API_BASE_URL}/games/${gameId}/fortify`, {
      fromTerritoryId,
      toTerritoryId,
      armies,
      playerId
    })
    return response.data
  },

  async endTurn(gameId: string, playerId: number) {
    const response = await axios.post(`${API_BASE_URL}/games/${gameId}/end-turn`, {
      playerId
    })
    return response.data
  },

  async placeArmies(gameId: string, territoryId: string, armies: number, playerId: number) {
    const response = await axios.post(`${API_BASE_URL}/games/${gameId}/place-armies`, {
      territoryId,
      armies,
      playerId
    })
    return response.data
  }
}
