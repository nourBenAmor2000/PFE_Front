import { defineStore } from 'pinia'
import axios from 'axios'

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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/logements`)
        this.logements = response.data.data
      } catch (err) {
        console.error('Failed to fetch logements:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
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
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/logements`, payload)
        this.logements.push(response.data.data)
      } catch (err) {
        console.error('Failed to add logement:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update logement by ID
    async updateLogement(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/logements/${id}`, payload)
        const index = this.logements.findIndex(log => log.id === id)
        if (index !== -1) this.logements[index] = response.data.data
      } catch (err) {
        console.error('Failed to update logement:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete logement by ID
    async deleteLogement(id) {
      this.isLoading = true
      this.error = null
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/logements/${id}`)
        this.logements = this.logements.filter(log => log.id !== id)
      } catch (err) {
        console.error('Failed to delete logement:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
