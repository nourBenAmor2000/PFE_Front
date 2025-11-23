import { defineStore } from 'pinia'
import { useApi } from './useApi'

export const useAttributes = defineStore('attributes', {
  state: () => ({
    attributes: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all attributes
    async fetchAttributes() {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('attributes')
        const response = await api.get(endpoint)
        const data = extractData(response)
        this.attributes = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Failed to fetch attributes:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch attributes'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add a new attribute
    async addAttribute(payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('attributes')
        const response = await api.post(endpoint, payload)
        const data = extractData(response)
        this.attributes.push(data)
        return data
      } catch (err) {
        console.error('Failed to add attribute:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to add attribute'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update attribute by ID
    async updateAttribute(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('attributes')
        const response = await api.put(`${endpoint}/${id}`, payload)
        const data = extractData(response)
        const index = this.attributes.findIndex(attr => attr._id === id || attr.id === id)
        if (index !== -1) {
          this.attributes[index] = data
        }
        return data
      } catch (err) {
        console.error('Failed to update attribute:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to update attribute'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete attribute by ID
    async deleteAttribute(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint } = useApi()
        const endpoint = getEndpoint('attributes')
        await api.delete(`${endpoint}/${id}`)
        this.attributes = this.attributes.filter(attr => (attr._id !== id && attr.id !== id))
      } catch (err) {
        console.error('Failed to delete attribute:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to delete attribute'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})

