export type Provider = 'openrouter'|'gemini'
export interface QueryPayload { query: string; userId: string; provider?: Provider }
export interface ChatResponse { answer: string; timestamp?: string|number; confidence?: number; sources?: string[]; suggestions?: string[] }


const BASE = import.meta.env.VITE_API_BASE || '/api'


export const aiAssistant = {
async query(payload: QueryPayload): Promise<ChatResponse> {
const res = await fetch(`${BASE}/assistant/query`, {
method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
})
if(!res.ok) throw new Error('assistant/query failed')
return await res.json()
},
}