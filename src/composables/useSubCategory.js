import { defineStore } from 'pinia'
import { useApi } from './useApi'

export const useSubcategories = defineStore('subcategories', {
  state: () => ({
    subcategories: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all subcategories
    async fetchSubcategories() {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('subcategories')
        const response = await api.get(endpoint)
        const data = extractData(response)
        this.subcategories = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Failed to fetch subcategories:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch subcategories'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add new subcategory
    async addSubcategory(payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('subcategories')
        const response = await api.post(endpoint, payload)
        const data = extractData(response)
        this.subcategories.push(data)
        return data
      } catch (err) {
        console.error('Failed to add subcategory:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to add subcategory'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update subcategory by ID
    async updateSubcategory(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('subcategories')
        const response = await api.put(`${endpoint}/${id}`, payload)
        const data = extractData(response)
        const index = this.subcategories.findIndex(s => s._id === id || s.id === id)
        if (index !== -1) {
          this.subcategories[index] = data
        }
        return data
      } catch (err) {
        console.error('Failed to update subcategory:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to update subcategory'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete subcategory by ID
    async deleteSubcategory(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint } = useApi()
        const endpoint = getEndpoint('subcategories')
        await api.delete(`${endpoint}/${id}`)
        this.subcategories = this.subcategories.filter(s => (s._id !== id && s.id !== id))
      } catch (err) {
        console.error('Failed to delete subcategory:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to delete subcategory'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
