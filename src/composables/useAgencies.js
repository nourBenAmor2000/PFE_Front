import { defineStore } from 'pinia'
import axios from 'axios'

export const useAgencies = defineStore('agencies', {
  state: () => ({
    agencies: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // 🔐 Helper: get Authorization header
    getAuthHeaders() {
      const token = localStorage.getItem('token') // Assuming your token is stored here
      return {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    },

    // ✅ Fetch all agencies
    async fetchAgencies() {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/agencies`,
          this.getAuthHeaders()
        )
        this.agencies = response.data.agencies
      } catch (err) {
        console.error('Failed to fetch agencies:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add a new agency
    async addAgency(payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/admin/agencies`,
          payload,
          this.getAuthHeaders()
        )
        this.agencies.push(response.data.data)
      } catch (err) {
        console.error('Failed to add agency:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update agency by ID
    async updateAgency(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/admin/agencies/${id}`,
          payload,
          this.getAuthHeaders()
        )
        const index = this.agencies.findIndex(a => a.id === id)
        if (index !== -1) this.agencies[index] = response.data.data
      } catch (err) {
        console.error('Failed to update agency:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete agency by ID
    async deleteAgency(id) {
      this.isLoading = true
      this.error = null
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/admin/agencies/${id}`,
          this.getAuthHeaders()
        )
        this.agencies = this.agencies.filter(a => a.id !== id)
      } catch (err) {
        console.error('Failed to delete agency:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
