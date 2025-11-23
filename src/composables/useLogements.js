import { defineStore } from 'pinia'
import { useApi } from './useApi'

export const useLogements = defineStore('logements', {
  state: () => ({
    logements: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all logements
    async fetchLogements() {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('logements')
        const response = await api.get(endpoint)
        const data = extractData(response)
        this.logements = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Failed to fetch logements:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch logements'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add new logement
    async addLogement(payload) {
      // payload example: { title, description, price, location, image }
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('logements')
        const response = await api.post(endpoint, payload)
        const data = extractData(response)
        this.logements.push(data)
        return data
      } catch (err) {
        console.error('Failed to add logement:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to add logement'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update logement by ID
    async updateLogement(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('logements')
        const response = await api.put(`${endpoint}/${id}`, payload)
        const data = extractData(response)
        const index = this.logements.findIndex(log => log._id === id || log.id === id)
        if (index !== -1) {
          this.logements[index] = data
        }
        return data
      } catch (err) {
        console.error('Failed to update logement:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to update logement'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete logement by ID
    async deleteLogement(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint } = useApi()
        const endpoint = getEndpoint('logements')
        await api.delete(`${endpoint}/${id}`)
        this.logements = this.logements.filter(log => (log._id !== id && log.id !== id))
      } catch (err) {
        console.error('Failed to delete logement:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to delete logement'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Map search - search properties by bounds, location, and filters
    async mapSearch(params) {
      this.isLoading = true
      this.error = null
      try {
        const { api } = useApi()
        const response = await api.post('/logements/map-search', {
          bounds: params.bounds,
          location: params.location,
          minPrice: params.filters?.minPrice,
          maxPrice: params.filters?.maxPrice,
          beds: params.filters?.beds,
          type: params.filters?.type,
          free: params.filters?.free ?? true
        })
        return response.data.properties || []
      } catch (err) {
        console.error('Failed to search properties on map:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to search properties'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Search logements with filters
    async searchLogements(filters = {}) {
      this.isLoading = true
      this.error = null
      try {
        const { api } = useApi()
        const params = new URLSearchParams()
        
        if (filters.search) params.append('search', filters.search)
        if (filters.price_min) params.append('price_min', filters.price_min)
        if (filters.price_max) params.append('price_max', filters.price_max)
        if (filters.free !== undefined) params.append('free', filters.free)
        if (filters.category_id) params.append('category_id', filters.category_id)
        if (filters.agency_id) params.append('agency_id', filters.agency_id)
        if (filters.bounds) {
          params.append('bounds[north]', filters.bounds.north)
          params.append('bounds[south]', filters.bounds.south)
          params.append('bounds[east]', filters.bounds.east)
          params.append('bounds[west]', filters.bounds.west)
        }
        if (filters.sort) params.append('sort', filters.sort)
        if (filters.sort_dir) params.append('sort_dir', filters.sort_dir)
        if (filters.per_page) params.append('per_page', filters.per_page)

        const response = await api.get(`/logements?${params.toString()}`)
        const { extractData } = useApi()
        const data = extractData(response)
        this.logements = Array.isArray(data) ? data : (data.logements || [])
        return this.logements
      } catch (err) {
        console.error('Failed to search logements:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to search logements'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
