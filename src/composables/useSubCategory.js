import { defineStore } from 'pinia'
import axios from 'axios'

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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/subcategories`)
        this.subcategories = response.data.data
      } catch (err) {
        console.error('Failed to fetch subcategories:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add new subcategory
    async addSubcategory(payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/subcategories`, payload)
        this.subcategories.push(response.data.data)
      } catch (err) {
        console.error('Failed to add subcategory:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update subcategory by ID
    async updateSubcategory(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/subcategories/${id}`, payload)
        const index = this.subcategories.findIndex(s => s.id === id)
        if (index !== -1) this.subcategories[index] = response.data.data
      } catch (err) {
        console.error('Failed to update subcategory:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete subcategory by ID
    async deleteSubcategory(id) {
      this.isLoading = true
      this.error = null
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/subcategories/${id}`)
        this.subcategories = this.subcategories.filter(s => s.id !== id)
      } catch (err) {
        console.error('Failed to delete subcategory:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
