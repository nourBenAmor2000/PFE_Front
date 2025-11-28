<template>
  <AdminLayout>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Administration Agence</h1>
            <p class="text-gray-600 mt-1">Gestion de votre agence et de vos agents</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">Agence:</span>
            <span class="font-medium text-gray-900">{{ agencyInfo.name }}</span>
          </div>
        </div>
      </div>
    </div>
<template>
  <AdminLayout>
    <div class="min-h-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">Administration Agence</h1>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Gestion de votre agence et de vos agents</p>
          </div>
        </div>
        <div v-if="agencyInfo.name" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span class="font-medium">Agence:</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ agencyInfo.name }}</span>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="mb-8">
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Agents"
            :value="stats.totalAgents"
            :delta="`+${stats.newAgents || 0}`">
            <template #icon>
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white grid place-items-center shadow-lg shadow-blue-500/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </template>
          </StatCard>

          <StatCard
            title="Logements Actifs"
            :value="stats.activeProperties"
            :delta="`${stats.availableProperties || 0} disponibles`">
            <template #icon>
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white grid place-items-center shadow-lg shadow-green-500/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
            </template>
          </StatCard>

          <StatCard
            title="Contrats Actifs"
            :value="stats.activeContracts"
            :delta="`${stats.monthlyRevenue ? formatCurrencyShort(stats.monthlyRevenue) : ''}`">
            <template #icon>
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white grid place-items-center shadow-lg shadow-purple-500/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </template>
          </StatCard>

          <StatCard
            title="Visites ce Mois"
            :value="stats.monthlyVisits"
            :delta="`${stats.completedVisits || 0} terminées`">
            <template #icon>
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white grid place-items-center shadow-lg shadow-orange-500/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
            </template>
          </StatCard>
        </section>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Management Actions -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Agent Management -->
          <div class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
            <div class="px-6 py-5 border-b border-gray-200/80 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Gestion des Agents</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Gérer les agents de votre agence</p>
              </div>
              <button 
                @click="showCreateAgentModal = true"
                class="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-500/30 transition-all duration-200"
              >
                Nouvel Agent
              </button>
            </div>
            <div class="p-6">
              <div v-if="isLoading" class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <div v-else-if="agencyAgents.length === 0" class="text-center py-12 text-gray-500">
                Aucun agent trouvé
              </div>
              <div v-else class="space-y-4">
                <div v-for="agent in agencyAgents" :key="agent._id || agent.id" class="flex items-center justify-between p-4 border border-gray-200/80 dark:border-gray-800 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                      {{ getInitials(agent.name || agent.email) }}
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-white">{{ agent.name || agent.email }}</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ agent.email }}</p>
                      <div class="flex items-center space-x-2 mt-1">
                        <span :class="getRoleBadgeClass(agent.role)" class="px-2 py-1 text-xs rounded-full font-medium">
                          {{ getRoleLabel(agent.role) }}
                        </span>
                        <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 font-medium">
                          Actif
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="editAgent(agent)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="deleteAgent(agent._id || agent.id)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Agency Information -->
          <div class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
            <div class="px-6 py-5 border-b border-gray-200/80 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Informations de l'Agence</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Détails de votre agence</p>
              </div>
              <button 
                @click="showEditAgencyModal = true"
                class="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold hover:from-gray-600 hover:to-gray-700 shadow-md shadow-gray-500/30 transition-all duration-200"
              >
                Modifier
              </button>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de l'agence</label>
                  <p class="text-gray-900 dark:text-white font-medium">{{ agencyInfo.name || 'Non renseigné' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
                  <p class="text-gray-900 dark:text-white">{{ agencyInfo.address || agencyInfo.location || 'Non renseigné' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                  <p class="text-gray-900 dark:text-white">{{ agencyInfo.phone || 'Non renseigné' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <p class="text-gray-900 dark:text-white">{{ agencyInfo.email || 'Non renseigné' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville</label>
                  <p class="text-gray-900 dark:text-white">{{ agencyInfo.city || 'Non renseigné' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                  <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 font-medium">
                    Actif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Stats -->
        <div class="space-y-6">
          <!-- Recent Visits -->
          <div class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
            <div class="px-6 py-5 border-b border-gray-200/80 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30 rounded-t-2xl">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Visites Récentes</h2>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Dernières visites organisées</p>
            </div>
            <div class="p-6">
              <div v-if="recentVisits.length === 0" class="text-center py-8 text-gray-500 text-sm">
                Aucune visite récente
              </div>
              <div v-else class="space-y-3">
                <div v-for="visit in recentVisits.slice(0, 5)" :key="visit._id || visit.id" class="flex items-center justify-between p-3 border border-gray-200/80 dark:border-gray-800 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white text-sm">{{ visit.logement?.title || 'Propriété' }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ visit.client?.name || 'Client' }} • {{ formatDateShort(visit.visit_date) }}</p>
                  </div>
                  <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-medium">
                    {{ visit.status || 'Confirmée' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
            <div class="px-6 py-5 border-b border-gray-200/80 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30 rounded-t-2xl">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Performance</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Taux de conversion</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ stats.conversionRate }}%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Satisfaction client</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ stats.clientSatisfaction }}/5</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Revenus ce mois</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(stats.monthlyRevenue) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Create Agent Modal -->
  <div v-if="showCreateAgentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Créer un Nouvel Agent</h3>
      <form @submit.prevent="createAgent">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom complet</label>
            <input v-model="newAgent.name" type="text" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input v-model="newAgent.email" type="email" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
            <input v-model="newAgent.phone" type="tel" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rôle</label>
            <select v-model="newAgent.role" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" required>
              <option value="agent">Agent Personnel</option>
              <option value="agent_rh">Agent RH</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" @click="showCreateAgentModal = false" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            Annuler
          </button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Créer
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Edit Agency Modal -->
  <div v-if="showEditAgencyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Modifier les Informations de l'Agence</h3>
      <form @submit.prevent="updateAgencyInfo">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de l'agence</label>
            <input v-model="editedAgency.name" type="text" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
            <input v-model="editedAgency.address" type="text" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
            <input v-model="editedAgency.phone" type="tel" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input v-model="editedAgency.email" type="email" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" required>
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" @click="showEditAgencyModal = false" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            Annuler
          </button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAgents } from '@/composables/useAgent'
import { useLogements } from '@/composables/useLogements'
import { useContracts } from '@/composables/useContrats'
import { useVisits } from '@/composables/useVisits'
import { useAgencies } from '@/composables/useAgencies'
import AdminLayout from '@/layouts/AdminLayout.vue'

const { user } = useAuth()
const router = useRouter()

// Stores
const agentStore = useAgents()
const logementStore = useLogements()
const contractStore = useContracts()
const visitStore = useVisits()
const agencyStore = useAgencies()

const isLoading = ref(false)
const showCreateAgentModal = ref(false)
const showEditAgencyModal = ref(false)

// Agency info from user or fetched
const agencyInfo = computed(() => {
  if (user.value?.agency) {
    return user.value.agency
  }
  // Try to find agency in the store
  const agencyId = user.value?.agency_id
  if (agencyId && agencyStore.agencies) {
    return agencyStore.agencies.find(a => (a._id || a.id) === agencyId) || {}
  }
  return {}
})

// Stats calculées depuis les stores filtrées par agency_id
const stats = computed(() => {
  const agencyId = user.value?.agency_id
  
  // Filter agents by agency
  const agencyAgents = agentStore.agents && Array.isArray(agentStore.agents) 
    ? agentStore.agents.filter(a => a?.agency_id === agencyId) 
    : []
  
  // Filter logements by agency
  const agencyLogements = logementStore.logements && Array.isArray(logementStore.logements)
    ? logementStore.logements.filter(l => l?.agency_id === agencyId)
    : []
  
  // Filter contracts by agency (via logement relationship)
  const agencyContracts = contractStore.contracts && Array.isArray(contractStore.contracts)
    ? contractStore.contracts.filter(c => {
        const logement = agencyLogements.find(l => (l._id || l.id) === (c.logement_id || c.logement?._id))
        return !!logement
      })
    : []
  
  // Filter visits by agency (via logement relationship)
  const agencyVisits = visitStore.visits && Array.isArray(visitStore.visits)
    ? visitStore.visits.filter(v => {
        const logement = agencyLogements.find(l => (l._id || l.id) === (v.logement_id || v.logement?._id))
        return !!logement
      })
    : []
  
  // Calculate monthly visits (current month)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyVisits = agencyVisits.filter(v => {
    const visitDate = new Date(v.visit_date || v.created_at)
    return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear
  }).length
  
  // Calculate revenue from active contracts
  const monthlyRevenue = agencyContracts.reduce((sum, c) => {
    return sum + (Number(c.amount) || 0)
  }, 0)
  
  // Calculate available properties
  const availableProperties = agencyLogements.filter(l => l.free === true || l.free === 'true').length
  
  // Calculate completed visits
  const completedVisits = agencyVisits.filter(v => v.status === 'completed' || v.status === 'Terminée').length
  
  return {
    totalAgents: agencyAgents.length,
    activeProperties: agencyLogements.length,
    availableProperties,
    activeContracts: agencyContracts.length,
    monthlyVisits,
    completedVisits,
    monthlyRevenue,
    conversionRate: agencyVisits.length > 0 ? ((agencyContracts.length / agencyVisits.length) * 100).toFixed(1) : 0,
    clientSatisfaction: 4.2 // Could be calculated from reviews
  }
})

// Agency agents
const agencyAgents = computed(() => {
  const agencyId = user.value?.agency_id
  if (!agencyId || !agentStore.agents || !Array.isArray(agentStore.agents)) return []
  return agentStore.agents.filter(a => a?.agency_id === agencyId)
})

// Recent visits
const recentVisits = computed(() => {
  const agencyId = user.value?.agency_id
  if (!agencyId || !visitStore.visits || !Array.isArray(visitStore.visits)) return []
  
  // Filter visits by agency logements
  const agencyLogements = logementStore.logements && Array.isArray(logementStore.logements)
    ? logementStore.logements.filter(l => l?.agency_id === agencyId)
    : []
  
  const agencyLogementIds = agencyLogements.map(l => l._id || l.id)
  
  return visitStore.visits
    .filter(v => agencyLogementIds.includes(v.logement_id || v.logement?._id))
    .sort((a, b) => new Date(b.visit_date || b.created_at) - new Date(a.visit_date || a.created_at))
    .slice(0, 10)
})

// Form data
const newAgent = ref({
  name: '',
  email: '',
  phone: '',
  role: 'agent',
  agency_id: user.value?.agency_id
})

const editedAgency = ref({ ...agencyInfo.value })

// Methods
const formatCurrency = (amount) => {
  const num = Number(amount || 0)
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(num)
}

const formatCurrencyShort = (amount) => {
  const num = Number(amount || 0)
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K TND'
  }
  return num + ' TND'
}

const formatDateShort = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d)
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getRoleLabel = (role) => {
  const labels = {
    'agent': 'Agent Personnel',
    'agent_personnel': 'Agent Personnel',
    'agent_rh': 'Agent RH',
    'admin_agence': 'Admin Agence'
  }
  return labels[role] || role
}

const getRoleBadgeClass = (role) => {
  const classes = {
    'agent': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    'agent_personnel': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    'agent_rh': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    'admin_agence': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
  }
  return classes[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
}

const createAgent = async () => {
  try {
    newAgent.value.agency_id = user.value?.agency_id
    await agentStore.addAgent(newAgent.value)
    await agentStore.fetchAgents()
    newAgent.value = { name: '', email: '', phone: '', role: 'agent', agency_id: user.value?.agency_id }
    showCreateAgentModal.value = false
    alert('Agent créé avec succès!')
  } catch (error) {
    console.error('Error creating agent:', error)
    alert('Erreur lors de la création: ' + (error.message || 'Erreur inconnue'))
  }
}

const editAgent = (agent) => {
  router.push(`/admin/agents/edit/${agent._id || agent.id}`)
}

const deleteAgent = async (agentId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) return
  
  try {
    await agentStore.deleteAgent(agentId)
    await agentStore.fetchAgents()
    alert('Agent supprimé avec succès!')
  } catch (error) {
    console.error('Error deleting agent:', error)
    alert('Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'))
  }
}

const updateAgencyInfo = async () => {
  try {
    const agencyId = user.value?.agency_id || agencyInfo.value._id || agencyInfo.value.id
    if (!agencyId) {
      alert('Impossible de trouver l\'ID de l\'agence')
      return
    }
    await agencyStore.updateAgency(agencyId, editedAgency.value)
    await agencyStore.fetchAgencies()
    showEditAgencyModal.value = false
    alert('Agence mise à jour avec succès!')
  } catch (error) {
    console.error('Error updating agency:', error)
    alert('Erreur lors de la mise à jour: ' + (error.message || 'Erreur inconnue'))
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      agencyStore.fetchAgencies().catch(err => console.error('Error fetching agencies:', err)),
      agentStore.fetchAgents().catch(err => console.error('Error fetching agents:', err)),
      logementStore.fetchLogements().catch(err => console.error('Error fetching logements:', err)),
      contractStore.fetchContracts().catch(err => console.error('Error fetching contracts:', err)),
      visitStore.fetchVisits().catch(err => console.error('Error fetching visits:', err))
    ])
    editedAgency.value = { ...agencyInfo.value }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<!-- Components -->
<script>
export default {
  components: {
    StatCard: {
      props: { title: String, value: [String, Number], delta: String },
      template: `
        <div class="group relative rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative flex items-start justify-between gap-4">
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{{ title }}</p>
              <div class="flex items-baseline gap-2 mb-3">
                <h4 class="text-3xl font-bold text-gray-900 dark:text-white leading-none">{{ value }}</h4>
                <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold" v-if="delta">{{ delta }}</span>
              </div>
              <div class="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-orange-500 via-orange-600 to-rose-500 rounded-full transition-all duration-500" :style="{ width: '70%' }"></div>
              </div>
            </div>
            <div class="flex-shrink-0">
              <slot name="icon"/>
            </div>
          </div>
        </div>
      `
    }
  }
}
</script>
    <!-- Agency Stats -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Agents</p>
              <p class="text-2xl font-bold text-gray-900">{{ agencyStats.totalAgents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Logements Actifs</p>
              <p class="text-2xl font-bold text-gray-900">{{ agencyStats.activeProperties }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Contrats Actifs</p>
              <p class="text-2xl font-bold text-gray-900">{{ agencyStats.activeContracts }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Visites ce Mois</p>
              <p class="text-2xl font-bold text-gray-900">{{ agencyStats.monthlyVisits }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Agent Management -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Agent Management -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold text-gray-900">Gestion des Agents</h2>
                <button 
                  @click="showCreateAgentModal = true"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Nouvel Agent
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div v-for="agent in agents" :key="agent.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div class="flex items-center space-x-4">
                    <img :src="agent.avatar" :alt="agent.name" class="w-12 h-12 rounded-full">
                    <div>
                      <h3 class="font-medium text-gray-900">{{ agent.name }}</h3>
                      <p class="text-sm text-gray-600">{{ agent.email }}</p>
                      <div class="flex items-center space-x-2 mt-1">
                        <span :class="getRoleBadgeClass(agent.role)" class="px-2 py-1 text-xs rounded-full">
                          {{ getRoleLabel(agent.role) }}
                        </span>
                        <span :class="getStatusBadgeClass(agent.status)" class="px-2 py-1 text-xs rounded-full">
                          {{ agent.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="editAgent(agent)"
                      class="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2-2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="toggleAgentStatus(agent)"
                      :class="agent.status === 'Actif' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'"
                      class="p-2"
                    >
                      <svg v-if="agent.status === 'Actif'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="deleteAgent(agent.id)"
                      class="text-red-600 hover:text-red-800 p-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Agency Information -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold text-gray-900">Informations de l'Agence</h2>
                <button 
                  @click="showEditAgencyModal = true"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Modifier
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'agence</label>
                  <p class="text-gray-900">{{ agencyInfo.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <p class="text-gray-900">{{ agencyInfo.address }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <p class="text-gray-900">{{ agencyInfo.phone }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p class="text-gray-900">{{ agencyInfo.email }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
                  <p class="text-gray-900">{{ formatDate(agencyInfo.createdAt) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <span :class="getStatusBadgeClass(agencyInfo.status)" class="px-2 py-1 text-xs rounded-full">
                    {{ agencyInfo.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Recent Activity -->
        <div class="space-y-6">
          <!-- Recent Visits -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Visites Récentes</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div v-for="visit in recentVisits" :key="visit.id" class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ visit.property }}</p>
                    <p class="text-sm text-gray-600">{{ visit.client }} • {{ visit.agent }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-900">{{ formatDate(visit.date) }}</p>
                    <span :class="getVisitStatusClass(visit.status)" class="text-xs px-2 py-1 rounded-full">
                      {{ visit.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Performance</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Taux de conversion</span>
                  <span class="font-medium text-gray-900">{{ agencyStats.conversionRate }}%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Satisfaction client</span>
                  <span class="font-medium text-gray-900">{{ agencyStats.clientSatisfaction }}/5</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Revenus ce mois</span>
                  <span class="font-medium text-gray-900">{{ formatCurrency(agencyStats.monthlyRevenue) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Agent Modal -->
    <div v-if="showCreateAgentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Créer un Nouvel Agent</h3>
        <form @submit.prevent="createAgent">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input v-model="newAgent.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="newAgent.email" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input v-model="newAgent.phone" type="tel" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <select v-model="newAgent.role" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                <option value="agent_personnel">Agent Personnel</option>
                <option value="agent_rh">Agent RH</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showCreateAgentModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Annuler
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Agency Modal -->
    <div v-if="showEditAgencyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Modifier les Informations de l'Agence</h3>
        <form @submit.prevent="updateAgencyInfo">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'agence</label>
              <input v-model="editedAgency.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input v-model="editedAgency.address" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input v-model="editedAgency.phone" type="tel" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="editedAgency.email" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showEditAgencyModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Annuler
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </AdminLayout>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import AdminLayout from '@/layouts/AdminLayout.vue'

const { user } = useAuth()

// Reactive data
const agencyInfo = ref({
  name: 'Agence Centre-Ville',
  address: '123 Rue de la Paix, 75001 Paris',
  phone: '+33 1 23 45 67 89',
  email: 'contact@agence-centre-ville.com',
  createdAt: new Date('2020-01-15'),
  status: 'Actif'
})

const agencyStats = ref({
  totalAgents: 8,
  activeProperties: 45,
  activeContracts: 23,
  monthlyVisits: 156,
  conversionRate: 18.5,
  clientSatisfaction: 4.2,
  monthlyRevenue: 45000
})

const agents = ref([
  {
    id: 1,
    name: 'Marie Dubois',
    email: 'marie.dubois@agence.com',
    phone: '+33 1 23 45 67 90',
    role: 'agent_personnel',
    status: 'Actif',
    avatar: 'https://ui-avatars.com/api/?name=Marie+Dubois&background=f97316&color=fff'
  },
  {
    id: 2,
    name: 'Pierre Martin',
    email: 'pierre.martin@agence.com',
    phone: '+33 1 23 45 67 91',
    role: 'agent_rh',
    status: 'Actif',
    avatar: 'https://ui-avatars.com/api/?name=Pierre+Martin&background=f97316&color=fff'
  },
  {
    id: 3,
    name: 'Sophie Laurent',
    email: 'sophie.laurent@agence.com',
    phone: '+33 1 23 45 67 92',
    role: 'agent_personnel',
    status: 'Inactif',
    avatar: 'https://ui-avatars.com/api/?name=Sophie+Laurent&background=f97316&color=fff'
  }
])

const recentVisits = ref([
  {
    id: 1,
    property: 'Appartement 3P - Marais',
    client: 'Jean Dupont',
    agent: 'Marie Dubois',
    date: new Date(),
    status: 'Confirmée'
  },
  {
    id: 2,
    property: 'Studio - Bastille',
    client: 'Anna Smith',
    agent: 'Pierre Martin',
    date: new Date(Date.now() - 86400000),
    status: 'Terminée'
  },
  {
    id: 3,
    property: 'Maison 4P - Vincennes',
    client: 'Paul Bernard',
    agent: 'Sophie Laurent',
    date: new Date(Date.now() - 172800000),
    status: 'Annulée'
  }
])

// Modal states
const showCreateAgentModal = ref(false)
const showEditAgencyModal = ref(false)

// Form data
const newAgent = ref({
  name: '',
  email: '',
  phone: '',
  role: 'agent_personnel'
})

const editedAgency = ref({ ...agencyInfo.value })

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const getRoleLabel = (role) => {
  const labels = {
    'agent_personnel': 'Agent Personnel',
    'agent_rh': 'Agent RH'
  }
  return labels[role] || role
}

const getRoleBadgeClass = (role) => {
  const classes = {
    'agent_personnel': 'bg-blue-100 text-blue-800',
    'agent_rh': 'bg-purple-100 text-purple-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'Actif': 'bg-green-100 text-green-800',
    'Inactif': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getVisitStatusClass = (status) => {
  const classes = {
    'Confirmée': 'bg-blue-100 text-blue-800',
    'Terminée': 'bg-green-100 text-green-800',
    'Annulée': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const createAgent = () => {
  const agent = {
    id: agents.value.length + 1,
    ...newAgent.value,
    status: 'Actif',
    avatar: `https://ui-avatars.com/api/?name=${newAgent.value.name}&background=f97316&color=fff`
  }
  agents.value.push(agent)
  agencyStats.value.totalAgents++
  
  // Reset form
  newAgent.value = { name: '', email: '', phone: '', role: 'agent_personnel' }
  showCreateAgentModal.value = false
}

const editAgent = (agent) => {
  // Implementation for editing agent
  console.log('Edit agent:', agent)
}

const toggleAgentStatus = (agent) => {
  agent.status = agent.status === 'Actif' ? 'Inactif' : 'Actif'
}

const deleteAgent = (agentId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
    agents.value = agents.value.filter(a => a.id !== agentId)
    agencyStats.value.totalAgents--
  }
}

const updateAgencyInfo = () => {
  agencyInfo.value = { ...editedAgency.value }
  showEditAgencyModal.value = false
}

onMounted(() => {
  editedAgency.value = { ...agencyInfo.value }
})
</script>
