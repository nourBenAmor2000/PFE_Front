import { defineStore } from 'pinia'
import { useApi } from './useApi'

export const useVisits = defineStore('visits', {
  state: () => ({
    visits: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all visits
    async fetchVisits() {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('visits')
        const response = await api.get(endpoint)
        const data = extractData(response)
        this.visits = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Failed to fetch visits:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch visits'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add visit
    async addVisit(payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('visits')
        const response = await api.post(endpoint, payload)
        const data = extractData(response)
        this.visits.push(data)
        return data
      } catch (err) {
        console.error('Failed to add visit:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to add visit'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update visit
    async updateVisit(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('visits')
        const response = await api.put(`${endpoint}/${id}`, payload)
        const data = extractData(response)
        const index = this.visits.findIndex(v => v._id === id || v.id === id)
        if (index !== -1) {
          this.visits[index] = data
        }
        return data
      } catch (err) {
        console.error('Failed to update visit:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to update visit'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete visit
    async deleteVisit(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint } = useApi()
        const endpoint = getEndpoint('visits')
        await api.delete(`${endpoint}/${id}`)
        this.visits = this.visits.filter(v => (v._id !== id && v.id !== id))
      } catch (err) {
        console.error('Failed to delete visit:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to delete visit'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
