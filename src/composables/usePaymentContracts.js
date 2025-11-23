import { defineStore } from 'pinia'
import { useApi } from './useApi'

export const usePaymentContracts = defineStore('paymentContracts', {
  state: () => ({
    paymentContracts: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all payment contracts
    async fetchPaymentContracts() {
      this.isLoading = true
      this.error = null
      try {
        const { api, extractData } = useApi()
        // Note: l'endpoint backend est 'payment-contracts' avec un tiret - utiliser directement
        const response = await api.get('/payment-contracts')
        const data = extractData(response)
        this.paymentContracts = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Failed to fetch payment contracts:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch payment contracts'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add a new payment contract
    async addPaymentContract(payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, extractData } = useApi()
        const response = await api.post('/payment-contracts', payload)
        const data = extractData(response)
        this.paymentContracts.push(data)
        return data
      } catch (err) {
        console.error('Failed to add payment contract:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to add payment contract'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update payment contract by ID
    async updatePaymentContract(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, extractData } = useApi()
        const response = await api.put(`/payment-contracts/${id}`, payload)
        const data = extractData(response)
        const index = this.paymentContracts.findIndex(pc => pc._id === id || pc.id === id)
        if (index !== -1) {
          this.paymentContracts[index] = data
        }
        return data
      } catch (err) {
        console.error('Failed to update payment contract:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to update payment contract'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete payment contract by ID
    async deletePaymentContract(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api } = useApi()
        await api.delete(`/payment-contracts/${id}`)
        this.paymentContracts = this.paymentContracts.filter(pc => (pc._id !== id && pc.id !== id))
      } catch (err) {
        console.error('Failed to delete payment contract:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to delete payment contract'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})

