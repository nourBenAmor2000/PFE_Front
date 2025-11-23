import { defineStore } from 'pinia'
import { useApi } from './useApi'

export const useAgencies = defineStore('agencies', {
  state: () => ({
    agencies: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all agencies
    async fetchAgencies() {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('agencies')
        const response = await api.get(endpoint)
        const data = extractData(response)
        this.agencies = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Failed to fetch agencies:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch agencies'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add a new agency
    async addAgency(payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('agencies')
        const response = await api.post(endpoint, payload)
        const data = extractData(response)
        this.agencies.push(data)
        return data
      } catch (err) {
        console.error('Failed to add agency:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to add agency'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update agency by ID
    async updateAgency(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('agencies')
        const response = await api.put(`${endpoint}/${id}`, payload)
        const data = extractData(response)
        const index = this.agencies.findIndex(a => a._id === id || a.id === id)
        if (index !== -1) {
          this.agencies[index] = data
        }
        return data
      } catch (err) {
        console.error('Failed to update agency:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to update agency'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete agency by ID
    async deleteAgency(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint } = useApi()
        const endpoint = getEndpoint('agencies')
        await api.delete(`${endpoint}/${id}`)
        this.agencies = this.agencies.filter(a => (a._id !== id && a.id !== id))
      } catch (err) {
        console.error('Failed to delete agency:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to delete agency'
        throw err
      } finally {
        this.isLoading = false
      }
    }
    
  }
})
