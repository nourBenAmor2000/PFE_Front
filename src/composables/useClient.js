import { defineStore } from 'pinia'
import { useApi } from './useApi'

export const useClients = defineStore('clients', {
  state: () => ({
    clients: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all clients
    async fetchClients() {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('clients')
        const response = await api.get(endpoint)
        const data = extractData(response)
        this.clients = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Failed to fetch clients:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch clients'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add client
    async addClient(payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('clients')
        const response = await api.post(endpoint, payload)
        const data = extractData(response)
        this.clients.push(data)
        return data
      } catch (err) {
        console.error('Failed to add client:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to add client'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update client
    async updateClient(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('clients')
        const response = await api.put(`${endpoint}/${id}`, payload)
        const data = extractData(response)
        const index = this.clients.findIndex(c => c._id === id || c.id === id)
        if (index !== -1) {
          this.clients[index] = data
        }
        return data
      } catch (err) {
        console.error('Failed to update client:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to update client'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete client
    async deleteClient(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint } = useApi()
        const endpoint = getEndpoint('clients')
        await api.delete(`${endpoint}/${id}`)
        this.clients = this.clients.filter(c => (c._id !== id && c.id !== id))
      } catch (err) {
        console.error('Failed to delete client:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to delete client'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Get client by ID
    async getClientById(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('clients')
        const response = await api.get(`${endpoint}/${id}`)
        const data = extractData(response)
        return data
      } catch (err) {
        console.error('Failed to get client by ID:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to get client'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
