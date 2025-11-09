import { defineStore } from 'pinia'
import axios from 'axios'

export const useAdmins = defineStore('admins', {
  state: () => ({
    admins: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all admins
    async fetchAdmins() {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin`)
        this.admins = response.data.data
      } catch (err) {
        console.error('Failed to fetch admins:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add new admin
    async addAdmin(payload) {
      /**
       * payload example:
       * { name: 'Admin Name', username: 'adminuser', email: 'admin@example.com', phone: '12345678', password: 'secret', agency_id: '...' }
       */
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin`, payload)
        this.admins.push(response.data.data)
      } catch (err) {
        console.error('Failed to add admin:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update admin by ID
    async updateAdmin(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/${id}`, payload)
        const index = this.admins.findIndex(a => a.id === id)
        if (index !== -1) this.admins[index] = response.data.data
      } catch (err) {
        console.error('Failed to update admin:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete admin by ID
    async deleteAdmin(id) {
      this.isLoading = true
      this.error = null
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/${id}`)
        this.admins = this.admins.filter(a => a.id !== id)
      } catch (err) {
        console.error('Failed to delete admin:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
