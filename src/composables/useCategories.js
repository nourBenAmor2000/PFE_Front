import { defineStore } from 'pinia'
import { useApi } from './useApi'

export const useCategories = defineStore('categories', {
  state: () => ({
    categories: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all categories
    async fetchCategories() {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('categories')
        const response = await api.get(endpoint)
        const data = extractData(response)
        this.categories = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Failed to fetch categories:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch categories'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add a new category
    async addCategory(payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('categories')
        const response = await api.post(endpoint, payload)
        const data = extractData(response)
        this.categories.push(data)
        return data
      } catch (err) {
        console.error('Failed to add category:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to add category'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update category by ID
    async updateCategory(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('categories')
        const response = await api.put(`${endpoint}/${id}`, payload)
        const data = extractData(response)
        const index = this.categories.findIndex(cat => cat._id === id || cat.id === id)
        if (index !== -1) {
          this.categories[index] = data
        }
        return data
      } catch (err) {
        console.error('Failed to update category:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to update category'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete category by ID
    async deleteCategory(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint } = useApi()
        const endpoint = getEndpoint('categories')
        await api.delete(`${endpoint}/${id}`)
        this.categories = this.categories.filter(cat => (cat._id !== id && cat.id !== id))
      } catch (err) {
        console.error('Failed to delete category:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to delete category'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
