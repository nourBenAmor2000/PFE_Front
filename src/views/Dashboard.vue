<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Dashboard Header -->
    <div class="bg-white shadow">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Bienvenue, {{ user?.name }}!</h1>
            <p class="text-gray-600">Gérez vos recherches et vos demandes</p>
          </div>
          <div class="flex space-x-3">
            <router-link
              to="/properties"
              class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Rechercher un Logement
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Visites Programmées</p>
              <p class="text-2xl font-semibold text-gray-900">{{ clientStats.scheduledVisits }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Contrats Actifs</p>
              <p class="text-2xl font-semibold text-gray-900">{{ clientStats.activeContracts }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Favoris</p>
              <p class="text-2xl font-semibold text-gray-900">{{ clientStats.favorites }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Paiements en Attente</p>
              <p class="text-2xl font-semibold text-gray-900">{{ clientStats.pendingPayments }}</p>
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
          <!-- Properties Search Tab -->
          <div v-if="activeTab === 'search'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Recherche de Logements</h2>
            </div>

            <!-- Search Filters -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                  <input v-model="searchFilters.location" type="text" placeholder="Ville, quartier..." class="w-full border border-gray-300 rounded-lg px-3 py-2">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Prix max (€)</label>
                  <input v-model="searchFilters.maxPrice" type="number" placeholder="2000" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select v-model="searchFilters.type" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Tous types</option>
                    <option value="Appartement">Appartement</option>
                    <option value="Maison">Maison</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div class="flex items-end">
                  <button @click="searchProperties" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Rechercher
                  </button>
                </div>
              </div>
            </div>

            <!-- Available Properties -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="property in availableProperties" :key="property.id" class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img :src="property.image" :alt="property.title" class="w-full h-48 object-cover">
                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 mb-2">{{ property.title }}</h3>
                  <p class="text-gray-600 text-sm mb-2">{{ property.address }}</p>
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-lg font-bold text-blue-600">{{ formatCurrency(property.price) }}/mois</span>
                    <span class="text-sm text-gray-500">{{ property.rooms }} pièces</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <button @click="requestVisit(property)" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                      Demander une visite
                    </button>
                    <button @click="toggleFavorite(property)" :class="property.isFavorite ? 'text-red-500' : 'text-gray-400'" class="p-1">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- My Visits Tab -->
          <div v-if="activeTab === 'visits'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Mes Visites</h2>
            </div>

            <div class="space-y-4">
              <div v-for="visit in myVisits" :key="visit.id" class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h3 class="font-medium text-gray-900">{{ visit.propertyTitle }}</h3>
                      <span :class="getVisitStatusClass(visit.status)" class="px-2 py-1 text-xs rounded-full">
                        {{ visit.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">{{ visit.propertyAddress }}</p>
                    <div class="flex items-center space-x-4 text-sm text-gray-600">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {{ formatDateTime(visit.dateTime) }}
                      </div>
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        Agent: {{ visit.agentName }}
                      </div>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button v-if="visit.status === 'Programmée'" @click="cancelVisit(visit.id)" class="text-red-600 hover:text-red-800 text-sm">
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- My Contracts Tab -->
          <div v-if="activeTab === 'contracts'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Mes Contrats</h2>
            </div>

            <div class="space-y-4">
              <div v-for="contract in myContracts" :key="contract.id" class="bg-gray-50 rounded-lg p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-1">{{ contract.propertyTitle }}</h3>
                    <p class="text-sm text-gray-600">{{ contract.propertyAddress }}</p>
                  </div>
                  <span :class="getContractStatusClass(contract.status)" class="px-3 py-1 text-sm rounded-full">
                    {{ contract.status }}
                  </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p class="text-sm text-gray-600">Loyer mensuel</p>
                    <p class="font-semibold text-gray-900">{{ formatCurrency(contract.monthlyRent) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Début du contrat</p>
                    <p class="font-semibold text-gray-900">{{ formatDate(contract.startDate) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Fin du contrat</p>
                    <p class="font-semibold text-gray-900">{{ formatDate(contract.endDate) }}</p>
                  </div>
                </div>

                <div class="flex justify-between items-center">
                  <div class="text-sm text-gray-600">
                    Agent: {{ contract.agentName }}
                  </div>
                  <div class="flex space-x-2">
                    <button @click="viewContract(contract)" class="text-blue-600 hover:text-blue-800 text-sm">
                      Voir détails
                    </button>
                    <button v-if="contract.status === 'Actif'" @click="makePayment(contract)" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                      Payer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Mes Avis</h2>
              <button @click="showAddReviewModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Laisser un Avis
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="review in myReviews" :key="review.id" class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ review.targetName }}</h3>
                    <p class="text-sm text-gray-600">{{ review.targetType === 'agent' ? 'Agent' : 'Agence' }}</p>
                  </div>
                  <div class="flex items-center">
                    <div class="flex text-yellow-400 mr-2">
                      <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= review.rating ? 'fill-current' : 'text-gray-300'" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <span class="text-sm text-gray-600">{{ formatDate(review.date) }}</span>
                  </div>
                </div>
                <p class="text-gray-700">{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Visit Modal -->
    <div v-if="showVisitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Demander une Visite</h3>
        <form @submit.prevent="submitVisitRequest">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Logement</label>
              <p class="text-gray-900">{{ selectedProperty?.title }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date souhaitée</label>
              <input v-model="visitRequest.preferredDate" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Heure souhaitée</label>
              <input v-model="visitRequest.preferredTime" type="time" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
              <textarea v-model="visitRequest.message" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2"></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showVisitModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Annuler
            </button>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Envoyer la Demande
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Review Modal -->
    <div v-if="showAddReviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Laisser un Avis</h3>
        <form @submit.prevent="submitReview">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select v-model="newReview.targetType" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                <option value="">Sélectionner</option>
                <option value="agent">Agent</option>
                <option value="agency">Agence</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input v-model="newReview.targetName" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <div class="flex space-x-1">
                <button
                  v-for="i in 5"
                  :key="i"
                  type="button"
                  @click="newReview.rating = i"
                  class="text-2xl"
                  :class="i <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
              <textarea v-model="newReview.comment" rows="4" class="w-full border border-gray-300 rounded-lg px-3 py-2" required></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showAddReviewModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Annuler
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Publier l'Avis
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user } = useAuth()

// Reactive data
const activeTab = ref('search')
const showVisitModal = ref(false)
const showAddReviewModal = ref(false)
const selectedProperty = ref(null)

const tabs = [
  { id: 'search', name: 'Recherche' },
  { id: 'visits', name: 'Mes Visites' },
  { id: 'contracts', name: 'Mes Contrats' },
  { id: 'reviews', name: 'Mes Avis' }
]

const clientStats = ref({
  scheduledVisits: 3,
  activeContracts: 1,
  favorites: 5,
  pendingPayments: 1
})

const searchFilters = ref({
  location: '',
  maxPrice: '',
  type: ''
})

const availableProperties = ref([
  {
    id: 1,
    title: 'Appartement 2P - Marais',
    address: '15 Rue des Rosiers, 75004 Paris',
    price: 1800,
    rooms: 2,
    image: '/placeholder.svg?height=200&width=300',
    isFavorite: false
  },
  {
    id: 2,
    title: 'Studio - Montmartre',
    address: '8 Rue Lepic, 75018 Paris',
    price: 1200,
    rooms: 1,
    image: '/placeholder.svg?height=200&width=300',
    isFavorite: true
  }
])

const myVisits = ref([
  {
    id: 1,
    propertyTitle: 'Appartement 2P - Marais',
    propertyAddress: '15 Rue des Rosiers, 75004 Paris',
    dateTime: new Date('2024-02-20T14:00:00'),
    agentName: 'Marie Dubois',
    status: 'Programmée'
  }
])

const myContracts = ref([
  {
    id: 1,
    propertyTitle: 'Studio - Bastille',
    propertyAddress: '8 Place de la Bastille, 75011 Paris',
    monthlyRent: 1200,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    agentName: 'Pierre Martin',
    status: 'Actif'
  }
])

const myReviews = ref([
  {
    id: 1,
    targetName: 'Marie Dubois',
    targetType: 'agent',
    rating: 5,
    comment: 'Excellente agent, très professionnelle et à l\'écoute.',
    date: new Date('2024-01-15')
  }
])

// Form data
const visitRequest = ref({
  preferredDate: '',
  preferredTime: '',
  message: ''
})

const newReview = ref({
  targetType: '',
  targetName: '',
  rating: 0,
  comment: ''
})

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

const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getVisitStatusClass = (status) => {
  const classes = {
    'Programmée': 'bg-blue-100 text-blue-800',
    'Terminée': 'bg-green-100 text-green-800',
    'Annulée': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getContractStatusClass = (status) => {
  const classes = {
    'Actif': 'bg-green-100 text-green-800',
    'Expiré': 'bg-red-100 text-red-800',
    'En attente': 'bg-orange-100 text-orange-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const searchProperties = () => {
  console.log('Searching properties with filters:', searchFilters.value)
}

const requestVisit = (property) => {
  selectedProperty.value = property
  showVisitModal.value = true
}

const submitVisitRequest = () => {
  const visit = {
    id: myVisits.value.length + 1,
    propertyTitle: selectedProperty.value.title,
    propertyAddress: selectedProperty.value.address,
    dateTime: new Date(`${visitRequest.value.preferredDate}T${visitRequest.value.preferredTime}`),
    agentName: 'Agent assigné',
    status: 'En attente'
  }
  myVisits.value.push(visit)
  clientStats.value.scheduledVisits++
  
  // Reset form
  visitRequest.value = { preferredDate: '', preferredTime: '', message: '' }
  showVisitModal.value = false
  selectedProperty.value = null
  
  alert('Demande de visite envoyée avec succès!')
}

const cancelVisit = (visitId) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette visite ?')) {
    const visit = myVisits.value.find(v => v.id === visitId)
    if (visit) {
      visit.status = 'Annulée'
      clientStats.value.scheduledVisits--
    }
  }
}

const toggleFavorite = (property) => {
  property.isFavorite = !property.isFavorite
  if (property.isFavorite) {
    clientStats.value.favorites++
  } else {
    clientStats.value.favorites--
  }
}

const viewContract = (contract) => {
  console.log('View contract:', contract)
}

const makePayment = (contract) => {
  console.log('Make payment for contract:', contract)
  alert('Redirection vers le système de paiement...')
}

const submitReview = () => {
  const review = {
    id: myReviews.value.length + 1,
    ...newReview.value,
    date: new Date()
  }
  myReviews.value.push(review)
  
  // Reset form
  newReview.value = { targetType: '', targetName: '', rating: 0, comment: '' }
  showAddReviewModal.value = false
  
  alert('Avis publié avec succès!')
}

onMounted(() => {
  // Check if user is logged in
  if (!user.value) {
    router.push('/login')
  }
})
</script>
