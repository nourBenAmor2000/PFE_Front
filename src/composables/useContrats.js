import { defineStore } from 'pinia'
import axios from 'axios'

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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/contracts`)
        this.contracts = response.data.data
      } catch (err) {
        console.error('Failed to fetch contracts:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
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
       *   client_name: 'John Doe',
       *   start_date: '2025-10-01',
       *   end_date: '2026-10-01',
       *   price: 1200
       * }
       */
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/contracts`, payload)
        this.contracts.push(response.data.data)
      } catch (err) {
        console.error('Failed to add contract:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update contract by ID
    async updateContract(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/contracts/${id}`, payload)
        const index = this.contracts.findIndex(c => c.id === id)
        if (index !== -1) this.contracts[index] = response.data.data
      } catch (err) {
        console.error('Failed to update contract:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete contract by ID
    async deleteContract(id) {
      this.isLoading = true
      this.error = null
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/contracts/${id}`)
        this.contracts = this.contracts.filter(c => c.id !== id)
      } catch (err) {
        console.error('Failed to delete contract:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
