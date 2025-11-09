
<template>
  <div v-if="isOpen" :class="[
    'fixed bottom-4 right-4 z-50 border-2 rounded-2xl shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-xl',
    isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
  ]">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3l7 4v6c0 5-7 8-7 8s-7-3-7-8V7l7-4z"/></svg>
          </div>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        </div>
        <div>
          <h3 class="font-bold text-base text-gray-800">Chat Assistant</h3>
          <p class="text-xs text-gray-600">Propulsé par {{ providerLabel }}</p>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <button class="h-8 w-8 p-0 rounded hover:bg-gray-100" @click="showSettings = true" title="Paramètres">
          <span class="sr-only">Settings</span>⚙️
        </button>
        <button class="h-8 w-8 p-0 rounded hover:bg-gray-100" @click="isMinimized = !isMinimized" :title="isMinimized ? 'Agrandir' : 'Réduire'">
          <span v-if="isMinimized">🗖</span><span v-else>🗕</span>
        </button>
        <button class="h-8 w-8 p-0 rounded hover:bg-gray-100" @click="onToggle" title="Fermer">✖</button>
      </div>
    </div>

    <template v-if="!isMinimized">
      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 h-[400px] bg-gradient-to-b from-white to-purple-50/30">
        <div v-for="m in messages" :key="m.id" :class="['flex gap-3', m.role === 'user' ? 'justify-end' : 'justify-start']">
          <div v-if="m.role==='assistant'" class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span v-if="m.isLoading" class="animate-spin">⏳</span>
            <span v-else>🤖</span>
          </div>

          <div :class="['max-w-[80%] space-y-2', m.role==='user' ? 'items-end' : '']">
            <div :class="[
              'rounded-2xl px-4 py-3 text-sm shadow-lg whitespace-pre-wrap',
              m.role==='user' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-auto' : 'bg-white border border-purple-100',
              m.isLoading ? 'animate-pulse' : ''
            ]">
              <div>{{ m.content }}</div>
              <div v-if="!m.isLoading" class="flex items-center gap-2 mt-2 text-xs opacity-70">
                🕒 <span>{{ formatTime(m.timestamp) }}</span>
                <span v-if="m.confidence!==undefined" class="border px-2 py-0.5 rounded">{{ Math.round(m.confidence*100) }}%</span>
                <div v-if="m.role==='assistant'" class="flex gap-1 ml-auto">
                  <button class="h-5 w-5 p-0 rounded hover:bg-purple-100" @click="copy(m.content)" title="Copier">📋</button>
                  <button class="h-5 w-5 p-0 rounded hover:bg-green-100" title="Utile">👍</button>
                  <button class="h-5 w-5 p-0 rounded hover:bg-red-100" title="Pas utile">👎</button>
                </div>
              </div>
            </div>

            <!-- Sources -->
            <div v-if="m.sources?.length" class="flex gap-1 flex-wrap">
              <span v-for="(s, i) in m.sources" :key="i" class="text-xs bg-blue-50 text-blue-700 border px-2 py-0.5 rounded">📊 {{ s }}</span>
            </div>

            <!-- Suggestions -->
            <div v-if="m.suggestions?.length" class="space-y-2">
              <p class="text-xs text-gray-600 font-medium">💡 Sujets proposés :</p>
              <div class="grid grid-cols-1 gap-2">
                <button v-for="(sugg, i) in m.suggestions" :key="i" class="text-xs py-2 px-3 text-left border rounded bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200" :disabled="isLoading" @click="onSuggestion(sugg)">
                  💬 {{ sugg }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="m.role==='user'" class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg">🧑</div>
        </div>
        <div ref="endRef" />
      </div>

      <!-- Input -->
      <div class="p-4 border-t bg-gradient-to-r from-white to-purple-50/30">
        <div class="flex gap-2">
          <input ref="inputRef" v-model="inputValue" :disabled="isLoading" @keydown.enter.prevent="send()" class="flex-1 border-2 border-purple-200 focus:border-purple-400 bg-white/90 backdrop-blur-sm rounded px-3 py-2" :placeholder="placeholder" />
          <button :disabled="!inputValue.trim() || isLoading" @click="send" class="px-4 rounded text-white shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <span v-if="isLoading" class="animate-spin">⏳</span>
            <span v-else>➤</span>
          </button>
        </div>
        <div class="flex gap-2 mt-3">
          <button class="text-xs border rounded px-2 py-1 bg-white/80 hover:bg-purple-50 border-purple-200" @click="clearChat">↻ Vider</button>
          <span class="text-xs border rounded px-2 py-1 bg-purple-50 text-purple-700 border-purple-200">{{ userCount }} questions posées</span>
        </div>
      </div>
    </template>

    <!-- Settings dialog (simple) -->
    <div v-if="showSettings" class="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
      <div class="w-full max-w-md space-y-6 p-6 bg-gradient-to-br from-white to-purple-50 rounded-2xl">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800">Paramètres</h3>
          <button class="h-8 w-8 rounded hover:bg-gray-100" @click="showSettings=false">✖</button>
        </div>

        <div class="space-y-4">
          <label class="text-sm font-semibold text-gray-700 mb-3 block">Fournisseur IA</label>
          <div class="flex gap-3">
            <button :class="provider==='openrouter' ? 'text-white bg-gradient-to-r from-purple-500 to-pink-500' : 'border border-purple-200 hover:bg-purple-50'" class="rounded px-3 py-1" @click="provider='openrouter'">OpenRouter</button>
            <button :class="provider==='gemini' ? 'text-white bg-gradient-to-r from-purple-500 to-pink-500' : 'border border-purple-200 hover:bg-purple-50'" class="rounded px-3 py-1" @click="provider='gemini'">Gemini</button>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-semibold text-gray-700">Lecture vocale auto</label>
            <button class="h-10 w-10 rounded border border-purple-200 hover:bg-purple-50" @click="autoSpeak=!autoSpeak">{{ autoSpeak ? '🔊' : '🔇' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, reactive, ref, computed, watch } from 'vue'
import { aiAssistant } from '@/services/aiAssistant'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  confidence?: number
  sources?: string[]
  suggestions?: string[]
  isLoading?: boolean
}

const props = defineProps<{ isOpen: boolean; onToggle: () => void; className?: string; userName?: string; userId?: string }>()

const messages = ref<ChatMessage[]>([])
const inputValue = ref('')
const isLoading = ref(false)
const provider = ref<'openrouter'|'gemini'>('openrouter')
const isMinimized = ref(false)
const showSettings = ref(false)
const autoSpeak = ref(false)

const endRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const placeholder = 'Posez-moi des questions (clients, visites, logements, facturation...)'

const providerLabel = computed(()=> provider.value==='openrouter' ? 'OpenRouter' : 'Gemini')
const userCount = computed(()=> messages.value.filter(m=>m.role==='user').length)

function scrollToEnd(){ endRef.value?.scrollIntoView({behavior:'smooth'}) }
function focusInput(){ setTimeout(()=> inputRef.value?.focus(), 100) }

onUpdated(scrollToEnd)
watch(()=>[props.isOpen, isMinimized.value], ()=>{ if(props.isOpen && !isMinimized.value) focusInput() })

onMounted(()=>{
  if(messages.value.length===0){
    const welcome: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Bonjour ${props.userName || '👋'} ! Je suis votre assistant intelligent.\n\nJe peux :\n• Retrouver des infos (clients, logements, visites)\n• Analyser les réservations / paiements\n• Générer des résumés et stats\n• Suggérer des actions\n\nQue souhaitez‑vous savoir ?`,
      timestamp: new Date(),
      confidence: 1,
      suggestions: [
        "Résumé des visites d'aujourd'hui",
        'Clients sans numéro de téléphone',
        'Logements disponibles ce mois‑ci',
        'Revenus du trimestre',
      ]
    }
    messages.value = [welcome]
  }
})

function speak(text:string){
  if(autoSpeak.value && 'speechSynthesis' in window){
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'fr-FR'; u.rate = 0.95; u.pitch = 1
    const voices = speechSynthesis.getVoices();
    const fr = voices.find(v=> v.lang.startsWith('fr'))
    if(fr) u.voice = fr
    speechSynthesis.speak(u)
  }
}

function formatTime(d:Date){
  try { return new Date(d).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) } catch { return '' }
}

async function send(){
  if(!inputValue.value.trim() || isLoading.value) return
  const userMsg: ChatMessage = { id: crypto.randomUUID(), role:'user', content: inputValue.value.trim(), timestamp: new Date() }
  const loading: ChatMessage = { id: crypto.randomUUID(), role:'assistant', content:'Analyse en cours et recherche dans la base...', timestamp: new Date(), isLoading:true }
  messages.value.push(userMsg, loading)
  isLoading.value = true
  const text = inputValue.value
  inputValue.value = ''

  try {
    const resp = await aiAssistant.query({
      query: text,
      userId: props.userId || 'anonymous',
      provider: provider.value,
    })
    const assistant: ChatMessage = {
      id: crypto.randomUUID(),
      role:'assistant',
      content: resp.answer,
      timestamp: new Date(resp.timestamp || Date.now()),
      confidence: resp.confidence,
      sources: resp.sources,
      suggestions: resp.suggestions,
    }
    // remplace le loader
    messages.value.splice(messages.value.length-1, 1, assistant)
    speak(resp.answer)
  } catch (e:any){
    messages.value.splice(messages.value.length-1, 1, {
      id: crypto.randomUUID(), role:'assistant', timestamp: new Date(), content: "Désolé, une erreur est survenue (API). Réessayez.", confidence:0
    })
  } finally { isLoading.value = false }
}

function onSuggestion(s:string){ inputValue.value = s; setTimeout(()=> send(), 100) }
function copy(t:string){ navigator.clipboard.writeText(t) }
function clearChat(){
  messages.value = []
  const welcome: ChatMessage = {
    id: crypto.randomUUID(), role:'assistant', timestamp: new Date(), confidence:1,
    content: `Bonjour ${props.userName || ''}! Comment puis‑je aider ?`,
    suggestions: ["Visites d'aujourd'hui", 'Nouveaux clients cette semaine']
  }
  messages.value = [welcome]
}

</script>

<style scoped>
/* Ajoutez vos styles utilitaires / Tailwind si besoin */
</style>


