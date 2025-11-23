import { defineStore } from 'pinia'
import { useApi } from './useApi'

export const useContracts = defineStore('contracts', {
  state: () => ({
    contracts: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all contracts
    async fetchContracts() {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('contracts')
        const response = await api.get(endpoint)
        const data = extractData(response)
        this.contracts = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Failed to fetch contracts:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch contracts'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add new contract
    async addContract(payload) {
      /**
       * payload example:
       * {
       *   logement_id: 1,
       *   client_id: '...',
       *   start_date: '2025-10-01',
       *   end_date: '2026-10-01',
       *   amount: 1200
       * }
       */
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('contracts')
        const response = await api.post(endpoint, payload)
        const data = extractData(response)
        this.contracts.push(data)
        return data
      } catch (err) {
        console.error('Failed to add contract:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to add contract'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update contract by ID
    async updateContract(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('contracts')
        const response = await api.put(`${endpoint}/${id}`, payload)
        const data = extractData(response)
        const index = this.contracts.findIndex(c => c._id === id || c.id === id)
        if (index !== -1) {
          this.contracts[index] = data
        }
        return data
      } catch (err) {
        console.error('Failed to update contract:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to update contract'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete contract by ID
    async deleteContract(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint } = useApi()
        const endpoint = getEndpoint('contracts')
        await api.delete(`${endpoint}/${id}`)
        this.contracts = this.contracts.filter(c => (c._id !== id && c.id !== id))
      } catch (err) {
        console.error('Failed to delete contract:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to delete contract'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
