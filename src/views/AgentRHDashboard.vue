<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Tableau de Bord RH</h1>
            <p class="text-gray-600 mt-1">Gestion des ressources humaines de l'agence</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">Agent RH:</span>
            <span class="font-medium text-gray-900">{{ user?.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- HR Stats -->
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
              <p class="text-2xl font-bold text-gray-900">{{ hrStats.totalAgents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Agents Actifs</p>
              <p class="text-2xl font-bold text-gray-900">{{ hrStats.activeAgents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Nouveaux ce Mois</p>
              <p class="text-2xl font-bold text-gray-900">{{ hrStats.newThisMonth }}</p>
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
              <p class="text-sm font-medium text-gray-600">Visites Supervisées</p>
              <p class="text-2xl font-bold text-gray-900">{{ hrStats.supervisedVisits }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Tabs -->
      <div class="bg-white rounded-lg shadow">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Agents Management Tab -->
          <div v-if="activeTab === 'agents'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Gestion des Agents</h2>
              <button 
                @click="showAddAgentModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Recruter un Agent
              </button>
            </div>

            <!-- Agents List -->
            <div class="space-y-4">
              <div v-for="agent in agents" :key="agent.id" class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <img :src="agent.avatar" :alt="agent.name" class="w-16 h-16 rounded-full">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">{{ agent.name }}</h3>
                      <p class="text-gray-600">{{ agent.email }}</p>
                      <div class="flex items-center space-x-3 mt-2">
                        <span :class="getRoleBadgeClass(agent.role)" class="px-2 py-1 text-xs rounded-full">
                          {{ getRoleLabel(agent.role) }}
                        </span>
                        <span :class="getStatusBadgeClass(agent.status)" class="px-2 py-1 text-xs rounded-full">
                          {{ agent.status }}
                        </span>
                        <span class="text-sm text-gray-500">
                          Embauché le {{ formatDate(agent.hireDate) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="viewAgentDetails(agent)"
                      class="text-blue-600 hover:text-blue-800 p-2"
                      title="Voir détails"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="editAgent(agent)"
                      class="text-green-600 hover:text-green-800 p-2"
                      title="Modifier"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2-2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="toggleAgentStatus(agent)"
                      :class="agent.status === 'Actif' ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'"
                      class="p-2"
                      :title="agent.status === 'Actif' ? 'Suspendre' : 'Activer'"
                    >
                      <svg v-if="agent.status === 'Actif'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="deleteAgent(agent.id)"
                      class="text-red-600 hover:text-red-800 p-2"
                      title="Supprimer"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Agent Performance Metrics -->
                <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div class="bg-white rounded-lg p-3 text-center">
                    <p class="text-sm text-gray-600">Logements gérés</p>
                    <p class="text-lg font-semibold text-gray-900">{{ agent.managedProperties }}</p>
                  </div>
                  <div class="bg-white rounded-lg p-3 text-center">
                    <p class="text-sm text-gray-600">Contrats signés</p>
                    <p class="text-lg font-semibold text-gray-900">{{ agent.signedContracts }}</p>
                  </div>
                  <div class="bg-white rounded-lg p-3 text-center">
                    <p class="text-sm text-gray-600">Visites ce mois</p>
                    <p class="text-lg font-semibold text-gray-900">{{ agent.monthlyVisits }}</p>
                  </div>
                  <div class="bg-white rounded-lg p-3 text-center">
                    <p class="text-sm text-gray-600">Performance</p>
                    <p class="text-lg font-semibold" :class="getPerformanceColor(agent.performance)">
                      {{ agent.performance }}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Visits Supervision Tab -->
          <div v-if="activeTab === 'visits'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Supervision des Visites</h2>
              <div class="flex space-x-2">
                <select v-model="visitFilter" class="border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Toutes les visites</option>
                  <option value="Programmée">Programmées</option>
                  <option value="Terminée">Terminées</option>
                  <option value="Annulée">Annulées</option>
                </select>
              </div>
            </div>

            <!-- Visits List -->
            <div class="space-y-4">
              <div v-for="visit in filteredVisits" :key="visit.id" class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h3 class="font-medium text-gray-900">{{ visit.propertyTitle }}</h3>
                      <span :class="getVisitStatusClass(visit.status)" class="px-2 py-1 text-xs rounded-full">
                        {{ visit.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">{{ visit.propertyAddress }}</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Client: {{ visit.clientName }}
                      </div>
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        Agent: {{ visit.agentName }}
                      </div>
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {{ formatDateTime(visit.dateTime) }}
                      </div>
                    </div>
                    <div v-if="visit.notes" class="mt-2 text-sm text-gray-600">
                      <strong>Notes:</strong> {{ visit.notes }}
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      @click="viewVisitDetails(visit)"
                      class="text-blue-600 hover:text-blue-800 p-1"
                      title="Voir détails"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reports Tab -->
          <div v-if="activeTab === 'reports'">
            <h2 class="text-lg font-semibold text-gray-900 mb-6">Rapports RH</h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Performance Report -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-md font-semibold text-gray-900 mb-4">Performance des Agents</h3>
                <div class="space-y-3">
                  <div v-for="agent in agents" :key="agent.id" class="flex justify-between items-center">
                    <span class="text-sm text-gray-700">{{ agent.name }}</span>
                    <div class="flex items-center space-x-2">
                      <div class="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          class="h-2 rounded-full" 
                          :class="getPerformanceBarColor(agent.performance)"
                          :style="{ width: agent.performance + '%' }"
                        ></div>
                      </div>
                      <span class="text-sm font-medium" :class="getPerformanceColor(agent.performance)">
                        {{ agent.performance }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Activity Summary -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-md font-semibold text-gray-900 mb-4">Résumé d'Activité</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Total visites ce mois</span>
                    <span class="font-medium">{{ getTotalVisits() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Contrats signés</span>
                    <span class="font-medium">{{ getTotalContracts() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Logements gérés</span>
                    <span class="font-medium">{{ getTotalProperties() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Performance moyenne</span>
                    <span class="font-medium">{{ getAveragePerformance() }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Agent Modal -->
    <div v-if="showAddAgentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Recruter un Nouvel Agent</h3>
        <form @submit.prevent="addAgent">
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
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date d'embauche</label>
              <input v-model="newAgent.hireDate" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showAddAgentModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Annuler
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Recruter
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const { user } = useAuth()

// Reactive data
const activeTab = ref('agents')
const visitFilter = ref('')

const hrStats = ref({
  totalAgents: 6,
  activeAgents: 5,
  newThisMonth: 1,
  supervisedVisits: 42
})

const tabs = [
  { id: 'agents', name: 'Gestion des Agents' },
  { id: 'visits', name: 'Supervision des Visites' },
  { id: 'reports', name: 'Rapports' }
]

const agents = ref([
  {
    id: 1,
    name: 'Marie Dubois',
    email: 'marie.dubois@agence.com',
    phone: '+33 1 23 45 67 90',
    role: 'agent_personnel',
    status: 'Actif',
    hireDate: new Date('2023-01-15'),
    avatar: 'https://ui-avatars.com/api/?name=Marie+Dubois&background=f97316&color=fff',
    managedProperties: 12,
    signedContracts: 8,
    monthlyVisits: 24,
    performance: 85
  },
  {
    id: 2,
    name: 'Pierre Martin',
    email: 'pierre.martin@agence.com',
    phone: '+33 1 23 45 67 91',
    role: 'agent_personnel',
    status: 'Actif',
    hireDate: new Date('2023-03-20'),
    avatar: 'https://ui-avatars.com/api/?name=Pierre+Martin&background=f97316&color=fff',
    managedProperties: 8,
    signedContracts: 5,
    monthlyVisits: 18,
    performance: 72
  },
  {
    id: 3,
    name: 'Sophie Laurent',
    email: 'sophie.laurent@agence.com',
    phone: '+33 1 23 45 67 92',
    role: 'agent_personnel',
    status: 'Inactif',
    hireDate: new Date('2022-11-10'),
    avatar: 'https://ui-avatars.com/api/?name=Sophie+Laurent&background=f97316&color=fff',
    managedProperties: 6,
    signedContracts: 3,
    monthlyVisits: 12,
    performance: 58
  }
])

const visits = ref([
  {
    id: 1,
    propertyTitle: 'Appartement 3P - Marais',
    propertyAddress: '15 Rue des Rosiers, 75004 Paris',
    clientName: 'Jean Dupont',
    agentName: 'Marie Dubois',
    dateTime: new Date('2024-02-15T14:00:00'),
    status: 'Programmée',
    notes: 'Client intéressé par la luminosité'
  },
  {
    id: 2,
    propertyTitle: 'Studio - Bastille',
    propertyAddress: '8 Place de la Bastille, 75011 Paris',
    clientName: 'Anna Smith',
    agentName: 'Pierre Martin',
    dateTime: new Date('2024-02-14T10:30:00'),
    status: 'Terminée',
    notes: 'Visite réussie, client satisfait'
  },
  {
    id: 3,
    propertyTitle: 'Maison 4P - Vincennes',
    propertyAddress: '25 Avenue de Paris, 94300 Vincennes',
    clientName: 'Paul Bernard',
    agentName: 'Sophie Laurent',
    dateTime: new Date('2024-02-13T16:00:00'),
    status: 'Annulée',
    notes: 'Client indisponible'
  }
])

// Modal states
const showAddAgentModal = ref(false)

// Form data
const newAgent = ref({
  name: '',
  email: '',
  phone: '',
  role: 'agent_personnel',
  hireDate: ''
})

// Computed
const filteredVisits = computed(() => {
  if (!visitFilter.value) return visits.value
  return visits.value.filter(visit => visit.status === visitFilter.value)
})

// Methods
const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getRoleLabel = (role) => {
  const labels = {
    'agent_personnel': 'Agent Personnel'
  }
  return labels[role] || role
}

const getRoleBadgeClass = (role) => {
  const classes = {
    'agent_personnel': 'bg-blue-100 text-blue-800'
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
    'Programmée': 'bg-blue-100 text-blue-800',
    'Terminée': 'bg-green-100 text-green-800',
    'Annulée': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPerformanceColor = (performance) => {
  if (performance >= 80) return 'text-green-600'
  if (performance >= 60) return 'text-orange-600'
  return 'text-red-600'
}

const getPerformanceBarColor = (performance) => {
  if (performance >= 80) return 'bg-green-500'
  if (performance >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

const addAgent = () => {
  const agent = {
    id: agents.value.length + 1,
    ...newAgent.value,
    status: 'Actif',
    hireDate: new Date(newAgent.value.hireDate),
    avatar: `https://ui-avatars.com/api/?name=${newAgent.value.name}&background=f97316&color=fff`,
    managedProperties: 0,
    signedContracts: 0,
    monthlyVisits: 0,
    performance: 0
  }
  agents.value.push(agent)
  hrStats.value.totalAgents++
  hrStats.value.activeAgents++
  
  // Reset form
  newAgent.value = {
    name: '',
    email: '',
    phone: '',
    role: 'agent_personnel',
    hireDate: ''
  }
  showAddAgentModal.value = false
}

const viewAgentDetails = (agent) => {
  console.log('View agent details:', agent)
}

const editAgent = (agent) => {
  console.log('Edit agent:', agent)
}

const toggleAgentStatus = (agent) => {
  const wasActive = agent.status === 'Actif'
  agent.status = wasActive ? 'Inactif' : 'Actif'
  
  if (wasActive) {
    hrStats.value.activeAgents--
  } else {
    hrStats.value.activeAgents++
  }
}

const deleteAgent = (agentId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
    const agent = agents.value.find(a => a.id === agentId)
    if (agent?.status === 'Actif') {
      hrStats.value.activeAgents--
    }
    agents.value = agents.value.filter(a => a.id !== agentId)
    hrStats.value.totalAgents--
  }
}

const viewVisitDetails = (visit) => {
  console.log('View visit details:', visit)
}

const getTotalVisits = () => {
  return agents.value.reduce((total, agent) => total + agent.monthlyVisits, 0)
}

const getTotalContracts = () => {
  return agents.value.reduce((total, agent) => total + agent.signedContracts, 0)
}

const getTotalProperties = () => {
  return agents.value.reduce((total, agent) => total + agent.managedProperties, 0)
}

const getAveragePerformance = () => {
  const total = agents.value.reduce((sum, agent) => sum + agent.performance, 0)
  return Math.round(total / agents.value.length)
}
</script>
