import { defineStore } from 'pinia'
import axios from 'axios'

export const useClients = defineStore('clients', {
  state: () => ({
    clients: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // 🔐 Helper to get headers with token
    getAuthHeaders() {
      const token = localStorage.getItem('token')
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    },

    // ✅ Fetch all clients
    async fetchClients() {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/clients`,
          this.getAuthHeaders()
        )
        this.clients = response.data.clients
      } catch (err) {
        console.error('Failed to fetch clients:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add client
    async addClient(payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/admin/clients`,
          payload,
          this.getAuthHeaders()
        )
        this.clients.push(response.data.data)
      } catch (err) {
        console.error('Failed to add client:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update client
    async updateClient(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/admin/clients/${id}`,
          payload,
          this.getAuthHeaders()
        )
        const index = this.clients.findIndex(c => c.id === id)
        if (index !== -1) this.clients[index] = response.data.data
      } catch (err) {
        console.error('Failed to update client:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete client
    async deleteClient(id) {
      this.isLoading = true
      this.error = null
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/admin/clients/${id}`,
          this.getAuthHeaders()
        )
        this.clients = this.clients.filter(c => c._id !== id)
      } catch (err) {
        console.error('Failed to delete client:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Get client by ID (NEW)
    async getClientById(id) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/clients/${id}`,
          this.getAuthHeaders()
        )

        // Return only the client data
        return response.data.data || response.data.client
      } catch (err) {
        console.error('Failed to get client by ID:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
