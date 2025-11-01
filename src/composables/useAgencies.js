import { defineStore } from 'pinia'
import axios from 'axios'

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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/agencies`)
        this.agencies = response.data.data
      } catch (err) {
        console.error('Failed to fetch agencies:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add a new agency (example: only a name)
    async addAgency(payload) {
      /**
       * payload example:
       * { name: 'Agency Name', address: 'Address', phone: '12345678' }
       */
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/agencies`, payload)
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
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/agencies/${id}`, payload)
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
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/agencies/${id}`)
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
