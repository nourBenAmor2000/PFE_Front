<template>
  <AdminLayout>
    <div class="min-h-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">Administration Globale</h1>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Gestion complète du système E-DAR</p>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="mb-8">
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Agences"
            :value="stats.totalAgencies"
            :delta="'+2'">
            <template #icon>
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white grid place-items-center shadow-lg shadow-blue-500/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"></path>
                </svg>
              </div>
            </template>
          </StatCard>

          <StatCard
            title="Total Agents"
            :value="stats.totalAgents"
            :delta="'+5'">
            <template #icon>
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white grid place-items-center shadow-lg shadow-green-500/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </template>
          </StatCard>

          <StatCard
            title="Total Clients"
            :value="stats.totalClients"
            :delta="'+12'">
            <template #icon>
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white grid place-items-center shadow-lg shadow-purple-500/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </template>
          </StatCard>

          <StatCard
            title="Revenus Totaux"
            :value="formatCurrency(stats.totalRevenue)"
            :delta="'+8.5%'">
            <template #icon>
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white grid place-items-center shadow-lg shadow-orange-500/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
          <!-- Agency Management -->
          <div class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
            <div class="px-6 py-5 border-b border-gray-200/80 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Gestion des Agences</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Gérer toutes les agences du système</p>
              </div>
              <button 
                @click="showCreateAgencyModal = true"
                class="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-500/30 transition-all duration-200"
              >
                Nouvelle Agence
              </button>
            </div>
            <div class="p-6">
              <div v-if="isLoading" class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <div v-else-if="agencies.length === 0" class="text-center py-12 text-gray-500">
                Aucune agence trouvée
              </div>
              <div v-else class="space-y-4">
                <div v-for="agency in agencies" :key="agency._id || agency.id" class="flex items-center justify-between p-4 border border-gray-200/80 dark:border-gray-800 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900">{{ agency.name }}</h3>
                      <p class="text-sm text-gray-600">{{ agency.location }} • {{ agency.agentCount }} agents</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="editAgency(agency)"
                      class="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="deleteAgency(agency.id)"
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

          <!-- Recent Activity -->
          <div class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
            <div class="px-6 py-5 border-b border-gray-200/80 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30 rounded-t-2xl">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Activité Récente</h2>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Dernières actions du système</p>
            </div>
            <div class="p-6">
              <div class="space-y-3">
                <div class="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  Aucune activité récente
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Stats -->
        <div class="space-y-6">
          <!-- System Health -->
          <div class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
            <div class="px-6 py-5 border-b border-gray-200/80 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30 rounded-t-2xl">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">État du Système</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Serveurs</span>
                  <span class="flex items-center text-green-600">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Opérationnel
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Base de données</span>
                  <span class="flex items-center text-green-600">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Opérationnel
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 dark:text-gray-400">API</span>
                  <span class="flex items-center text-green-600">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Opérationnel
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

    <!-- Create Agency Modal -->
    <div v-if="showCreateAgencyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Créer une Nouvelle Agence</h3>
        <form @submit.prevent="createAgency">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'agence</label>
              <input v-model="newAgency.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
              <input v-model="newAgency.location" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input v-model="newAgency.address" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input v-model="newAgency.phone" type="tel" class="w-full border border-gray-300 rounded-lg px-3 py-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="newAgency.email" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2">
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showCreateAgencyModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Annuler
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAgencies } from '@/composables/useAgencies'
import { useAgents } from '@/composables/useAgent'
import { useClients } from '@/composables/useClient'
import { useContracts } from '@/composables/useContrats'
import AdminLayout from '@/layouts/AdminLayout.vue'

const { user } = useAuth()
const router = useRouter()

// Stores
const agencyStore = useAgencies()
const agentStore = useAgents()
const clientStore = useClients()
const contractStore = useContracts()

const isLoading = ref(false)
const showCreateAgencyModal = ref(false)

// Stats calculées depuis les stores
const stats = computed(() => {
  const agenciesCount = (agencyStore.agencies && Array.isArray(agencyStore.agencies)) ? agencyStore.agencies.length : 0
  const agentsCount = (agentStore.agents && Array.isArray(agentStore.agents)) ? agentStore.agents.length : 0
  const clientsCount = (clientStore.clients && Array.isArray(clientStore.clients)) ? clientStore.clients.length : 0
  
  const contracts = (contractStore.contracts && Array.isArray(contractStore.contracts)) ? contractStore.contracts : []
  const totalRevenue = contracts.reduce((sum, c) => {
    if (!c) return sum
    return sum + (Number(c.amount) || 0)
  }, 0)
  
  return {
    totalAgencies: agenciesCount,
    totalAgents: agentsCount,
    totalClients: clientsCount,
    totalRevenue
  }
})

const agencies = computed(() => {
  return (agencyStore.agencies && Array.isArray(agencyStore.agencies)) ? agencyStore.agencies : []
})

// Form data
const newAgency = ref({
  name: '',
  location: '',
  address: '',
  phone: '',
  email: ''
})

// Methods
const formatCurrency = (amount) => {
  const num = Number(amount || 0)
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(num)
}

const getAgencyAgentCount = (agency) => {
  if (!agentStore.agents || !Array.isArray(agentStore.agents)) return 0
  return agentStore.agents.filter(a => a && (a.agency_id === (agency._id || agency.id))).length
}

const createAgency = async () => {
  try {
    await agencyStore.addAgency(newAgency.value)
    await agencyStore.fetchAgencies()
    newAgency.value = { name: '', location: '', address: '', phone: '', email: '' }
    showCreateAgencyModal.value = false
    alert('Agence créée avec succès!')
  } catch (error) {
    console.error('Error creating agency:', error)
    alert('Erreur lors de la création: ' + (error.message || 'Erreur inconnue'))
  }
}

const editAgency = (agency) => {
  router.push(`/admin/agencies/edit/${agency._id || agency.id}`)
}

const deleteAgency = async (agencyId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) return
  
  try {
    await agencyStore.deleteAgency(agencyId)
    await agencyStore.fetchAgencies()
    alert('Agence supprimée avec succès!')
  } catch (error) {
    console.error('Error deleting agency:', error)
    alert('Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'))
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      agencyStore.fetchAgencies().catch(err => console.error('Error fetching agencies:', err)),
      agentStore.fetchAgents().catch(err => console.error('Error fetching agents:', err)),
      clientStore.fetchClients().catch(err => console.error('Error fetching clients:', err)),
      contractStore.fetchContracts().catch(err => console.error('Error fetching contracts:', err))
    ])
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
