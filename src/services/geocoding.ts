import { useApi } from '../composables/useApi'

export interface GeocodeResult {
  lat: number
  lng: number
  display_name: string
  address?: any
}

export interface PlaceResult {
  lat: number
  lng: number
  name: string
  type: string
}

export const geocodingService = {
  /**
   * Geocode an address to get coordinates
   */
  async geocode(address: string): Promise<GeocodeResult | null> {
    try {
      const { api } = useApi()
      const response = await api.post('/geocoding/geocode', { address })
      return response.data.data || null
    } catch (error) {
      console.error('Geocoding failed:', error)
      return null
    }
  },

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(lat: number, lng: number): Promise<{ address: any; display_name: string } | null> {
    try {
      const { api } = useApi()
      const response = await api.post('/geocoding/reverse', { lat, lng })
      return response.data.data || null
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      return null
    }
  },

  /**
   * Search for places
   */
  async searchPlaces(query: string): Promise<PlaceResult[]> {
    try {
      const { api } = useApi()
      const response = await api.get('/geocoding/search', { params: { query } })
      return response.data.data || []
    } catch (error) {
      console.error('Place search failed:', error)
      return []
    }
  }
}

