import { defineStore } from 'pinia'
import axios from 'axios'

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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/categories`)
        this.categories = response.data.data
      } catch (err) {
        console.error('Failed to fetch categories:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add a new category (only a name)
    async addCategory(name) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/categories`, { name })
        this.categories.push(response.data.data)
      } catch (err) {
        console.error('Failed to add category:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update category by ID
    async updateCategory(id, name) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/categories/${id}`, { name })
        const index = this.categories.findIndex(cat => cat.id === id)
        if (index !== -1) this.categories[index] = response.data.data
      } catch (err) {
        console.error('Failed to update category:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete category by ID
    async deleteCategory(id) {
      this.isLoading = true
      this.error = null
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/categories/${id}`)
        this.categories = this.categories.filter(cat => cat.id !== id)
      } catch (err) {
        console.error('Failed to delete category:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
