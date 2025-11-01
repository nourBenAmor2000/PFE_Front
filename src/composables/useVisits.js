import { defineStore } from 'pinia'
import axios from 'axios'

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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/visits`)
        this.visits = response.data.data
      } catch (err) {
        console.error('Failed to fetch visits:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add visit
    async addVisit(payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/visits`, payload)
        this.visits.push(response.data.data)
      } catch (err) {
        console.error('Failed to add visit:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update visit
    async updateVisit(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/visits/${id}`, payload)
        const index = this.visits.findIndex(v => v.id === id)
        if (index !== -1) this.visits[index] = response.data.data
      } catch (err) {
        console.error('Failed to update visit:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete visit
    async deleteVisit(id) {
      this.isLoading = true
      this.error = null
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/visits/${id}`)
        this.visits = this.visits.filter(v => v.id !== id)
      } catch (err) {
        console.error('Failed to delete visit:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
