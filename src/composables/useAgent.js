import { defineStore } from 'pinia'
import { useApi } from './useApi'

export const useAgents = defineStore('agents', {
  state: () => ({
    agents: [],
    selectedAgent: null,
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all agents
    async fetchAgents() {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('agents')
        const response = await api.get(endpoint)
        const data = extractData(response)
        this.agents = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Failed to fetch agents:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch agents'
        throw err
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
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('agents')
        const response = await api.get(`${endpoint}/${id}`)
        const data = extractData(response)
        this.selectedAgent = data
        return data
      } catch (err) {
        console.error('Failed to fetch agent by ID:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch agent'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add new agent
    async addAgent(payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('agents')
        const response = await api.post(endpoint, payload)
        const data = extractData(response)
        this.agents.push(data)
        return data
      } catch (err) {
        console.error('Failed to add agent:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to add agent'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update agent by ID
    async updateAgent(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('agents')
        const response = await api.put(`${endpoint}/${id}`, payload)
        const data = extractData(response)
        const index = this.agents.findIndex(a => a._id === id || a.id === id)
        if (index !== -1) {
          this.agents[index] = data
        }
        return data
      } catch (err) {
        console.error('Failed to update agent:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to update agent'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete agent by ID
    async deleteAgent(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint } = useApi()
        const endpoint = getEndpoint('agents')
        await api.delete(`${endpoint}/${id}`)
        this.agents = this.agents.filter(a => (a._id !== id && a.id !== id))
      } catch (err) {
        console.error('Failed to delete agent:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to delete agent'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
