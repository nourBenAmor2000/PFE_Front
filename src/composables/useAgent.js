import { defineStore } from 'pinia'
import axios from 'axios'

export const useAgents = defineStore('agents', {
  state: () => ({
    agents: [],
    selectedAgent: null, // ✅ store single agent details
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Helper to get auth headers with token
    getAuthHeaders() {
      const token = localStorage.getItem('token')
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    },

    // ✅ Fetch all agents
    async fetchAgents() {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/agents`,
          this.getAuthHeaders()
        )
        this.agents = response.data.agents
      } catch (err) {
        console.error('Failed to fetch agents:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Get agent by ID
    async getAgentById(id) {
      this.isLoading = true
      this.error = null
      this.selectedAgent = null
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/agents/${id}`,
          this.getAuthHeaders()
        )
        this.selectedAgent = response.data.agent // 👈 adjust key based on your backend response
      } catch (err) {
        console.error('Failed to fetch agent by ID:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add new agent
    async addAgent(payload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/admin/agents`,
          payload,
          this.getAuthHeaders()
        )
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
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/admin/agents/${id}`,
          payload,
          this.getAuthHeaders()
        )
        const index = this.agents.findIndex(a => a._id === id)
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
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/admin/agents/${id}`,
          this.getAuthHeaders()
        )
        this.agents = this.agents.filter(a => a._id !== id)
      } catch (err) {
        console.error('Failed to delete agent:', err.response?.data || err.message)
        this.error = err.response?.data || err.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
