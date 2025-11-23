import { defineStore } from 'pinia'
import { useApi } from './useApi'

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
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('admins')
        const response = await api.get(endpoint)
        const data = extractData(response)
        this.admins = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Failed to fetch admins:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch admins'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add new admin
    async addAdmin(payload) {
      /**
       * payload example:
       * { name: 'Admin Name', email: 'admin@example.com', password: 'secret', role: 'admin_global' }
       */
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('admins')
        const response = await api.post(endpoint, payload)
        const data = extractData(response)
        this.admins.push(data)
        return data
      } catch (err) {
        console.error('Failed to add admin:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to add admin'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update admin by ID
    async updateAdmin(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('admins')
        const response = await api.put(`${endpoint}/${id}`, payload)
        const data = extractData(response)
        const index = this.admins.findIndex(a => a._id === id || a.id === id)
        if (index !== -1) {
          this.admins[index] = data
        }
        return data
      } catch (err) {
        console.error('Failed to update admin:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to update admin'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete admin by ID
    async deleteAdmin(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint } = useApi()
        const endpoint = getEndpoint('admins')
        await api.delete(`${endpoint}/${id}`)
        this.admins = this.admins.filter(a => (a._id !== id && a.id !== id))
      } catch (err) {
        console.error('Failed to delete admin:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to delete admin'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
