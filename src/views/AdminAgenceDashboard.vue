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
