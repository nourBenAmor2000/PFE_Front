<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestion des Agences</h1>
            <p class="text-gray-600 mt-1">Administration complète de toutes les agences</p>
          </div>
          <button 
            @click="showCreateModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nouvelle Agence
          </button>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="Nom ou ville..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select v-model="statusFilter" class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Suspendu">Suspendu</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Région</label>
            <select v-model="regionFilter" class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Toutes les régions</option>
              <option value="Île-de-France">Île-de-France</option>
              <option value="Provence-Alpes-Côte d'Azur">PACA</option>
              <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
            </select>
          </div>
          <div class="flex items-end">
            <button 
              @click="resetFilters"
              class="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <!-- Agencies Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="agency in filteredAgencies" 
          :key="agency.id" 
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ agency.name }}</h3>
                  <p class="text-sm text-gray-600">{{ agency.city }}, {{ agency.region }}</p>
                </div>
              </div>
              <span :class="getStatusBadgeClass(agency.status)" class="px-2 py-1 text-xs rounded-full">
                {{ agency.status }}
              </span>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Agents:</span>
                <span class="font-medium">{{ agency.agentCount }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Logements:</span>
                <span class="font-medium">{{ agency.propertyCount }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Revenus mensuel:</span>
                <span class="font-medium">{{ formatCurrency(agency.monthlyRevenue) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Admin:</span>
                <span class="font-medium">{{ agency.adminName }}</span>
              </div>
            </div>

            <div class="flex justify-between items-center pt-4 border-t border-gray-200">
              <div class="flex space-x-2">
                <button 
                  @click="viewAgency(agency)"
                  class="text-blue-600 hover:text-blue-800 p-1"
                  title="Voir détails"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <button 
                  @click="editAgency(agency)"
                  class="text-green-600 hover:text-green-800 p-1"
                  title="Modifier"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2-2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button 
                  @click="toggleAgencyStatus(agency)"
                  :class="agency.status === 'Actif' ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'"
                  class="p-1"
                  :title="agency.status === 'Actif' ? 'Suspendre' : 'Activer'"
                >
                  <svg v-if="agency.status === 'Actif'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </button>
              </div>
              <button 
                @click="deleteAgency(agency.id)"
                class="text-red-600 hover:text-red-800 p-1"
                title="Supprimer"
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

    <!-- Create Agency Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-lg font-semibold mb-4">Créer une Nouvelle Agence</h3>
        <form @submit.prevent="createAgency">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'agence</label>
              <input v-model="newAgency.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input v-model="newAgency.city" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Région</label>
              <select v-model="newAgency.region" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                <option value="">Sélectionner une région</option>
                <option value="Île-de-France">Île-de-France</option>
                <option value="Provence-Alpes-Côte d'Azur">PACA</option>
                <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input v-model="newAgency.phone" type="tel" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input v-model="newAgency.address" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Admin</label>
              <input v-model="newAgency.adminEmail" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom Admin</label>
              <input v-model="newAgency.adminName" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showCreateModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Annuler
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Créer l'Agence
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Reactive data
const searchTerm = ref('')
const statusFilter = ref('')
const regionFilter = ref('')
const showCreateModal = ref(false)

const agencies = ref([
  {
    id: 1,
    name: 'Agence Centre-Ville',
    city: 'Paris',
    region: 'Île-de-France',
    address: '123 Rue de la Paix, 75001 Paris',
    phone: '+33 1 23 45 67 89',
    status: 'Actif',
    agentCount: 8,
    propertyCount: 45,
    monthlyRevenue: 45000,
    adminName: 'Marie Dubois',
    adminEmail: 'marie@centre-ville.com'
  },
  {
    id: 2,
    name: 'Agence Montparnasse',
    city: 'Paris',
    region: 'Île-de-France',
    address: '456 Boulevard Montparnasse, 75014 Paris',
    phone: '+33 1 23 45 67 90',
    status: 'Actif',
    agentCount: 6,
    propertyCount: 32,
    monthlyRevenue: 32000,
    adminName: 'Pierre Martin',
    adminEmail: 'pierre@montparnasse.com'
  },
  {
    id: 3,
    name: 'Agence Cannes',
    city: 'Cannes',
    region: 'Provence-Alpes-Côte d\'Azur',
    address: '789 Croisette, 06400 Cannes',
    phone: '+33 4 93 12 34 56',
    status: 'Suspendu',
    agentCount: 4,
    propertyCount: 28,
    monthlyRevenue: 28000,
    adminName: 'Sophie Laurent',
    adminEmail: 'sophie@cannes.com'
  }
])

const newAgency = ref({
  name: '',
  city: '',
  region: '',
  address: '',
  phone: '',
  adminEmail: '',
  adminName: ''
})

// Computed
const filteredAgencies = computed(() => {
  return agencies.value.filter(agency => {
    const matchesSearch = !searchTerm.value || 
      agency.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      agency.city.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesStatus = !statusFilter.value || agency.status === statusFilter.value
    const matchesRegion = !regionFilter.value || agency.region === regionFilter.value
    
    return matchesSearch && matchesStatus && matchesRegion
  })
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'Actif': 'bg-green-100 text-green-800',
    'Inactif': 'bg-red-100 text-red-800',
    'Suspendu': 'bg-orange-100 text-orange-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  regionFilter.value = ''
}

const createAgency = () => {
  const agency = {
    id: agencies.value.length + 1,
    ...newAgency.value,
    status: 'Actif',
    agentCount: 0,
    propertyCount: 0,
    monthlyRevenue: 0
  }
  agencies.value.push(agency)
  
  // Reset form
  newAgency.value = {
    name: '',
    city: '',
    region: '',
    address: '',
    phone: '',
    adminEmail: '',
    adminName: ''
  }
  showCreateModal.value = false
}

const viewAgency = (agency) => {
  console.log('View agency:', agency)
}

const editAgency = (agency) => {
  console.log('Edit agency:', agency)
}

const toggleAgencyStatus = (agency) => {
  if (agency.status === 'Actif') {
    agency.status = 'Suspendu'
  } else {
    agency.status = 'Actif'
  }
}

const deleteAgency = (agencyId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) {
    agencies.value = agencies.value.filter(a => a.id !== agencyId)
  }
}
</script>
