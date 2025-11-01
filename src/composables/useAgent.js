import { defineStore } from 'pinia'
import axios from 'axios'

export const useAgents = defineStore('agents', {
  state: () => ({
    agents: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all agents
    async fetchAgents() {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/agents`)
        this.agents = response.data.data
      } catch (err) {
        console.error('Failed to fetch agents:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add new agent
    async addAgent(payload) {
      /**
       * payload example:
       * {
       *   name: 'Alice Dupont',
       *   email: 'alice@example.com',
       *   phone: '+21612345678',
       *   agency_name: 'Smart Immo',
       *   position: 'Agent Immobilier'
       * }
       */
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/agents`, payload)
        this.agents.push(response.data.data)
      } catch (err) {
        console.error('Failed to add agent:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update agent by ID
    async updateAgent(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/agents/${id}`, payload)
        const index = this.agents.findIndex(a => a.id === id)
        if (index !== -1) this.agents[index] = response.data.data
      } catch (err) {
        console.error('Failed to update agent:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete agent by ID
    async deleteAgent(id) {
      this.isLoading = true
      this.error = null
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/agents/${id}`)
        this.agents = this.agents.filter(a => a.id !== id)
      } catch (err) {
        console.error('Failed to delete agent:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
