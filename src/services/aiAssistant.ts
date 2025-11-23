import { useApi } from '@/composables/useApi'

export type Provider = 'openrouter'|'gemini'
export interface QueryPayload { query: string; userId: string; provider?: Provider }
export interface ChatResponse { 
  answer: string
  timestamp?: string|number
  confidence?: number
  sources?: string[]
  suggestions?: string[]
  analytics?: Record<string, any>
  data?: any[]
}

export const aiAssistant = {
  async query(payload: QueryPayload): Promise<ChatResponse> {
    try {
      const { api } = useApi()
      const response = await api.post('/assistant/query', payload)
      return response.data
    } catch (error: any) {
      console.error('AI Assistant query error:', error)
      throw new Error(error?.response?.data?.message || 'assistant/query failed')
    }
  },
}