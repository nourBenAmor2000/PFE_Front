<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Administration Globale</h1>
            <p class="text-gray-600 mt-1">Gestion complète du système</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">Connecté en tant que:</span>
            <span class="font-medium text-gray-900">{{ user?.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Agences</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalAgencies }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Agents</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalAgents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Clients</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalClients }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Revenus Totaux</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.totalRevenue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Management Actions -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Agency Management -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold text-gray-900">Gestion des Agences</h2>
                <button 
                  @click="showCreateAgencyModal = true"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Nouvelle Agence
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div v-for="agency in agencies" :key="agency.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
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

          <!-- Subscription Management -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold text-gray-900">Gestion des Abonnements</h2>
                <button 
                  @click="showCreateSubscriptionModal = true"
                  class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Nouvel Abonnement
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="subscription in subscriptions" :key="subscription.id" class="border border-gray-200 rounded-lg p-4">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="font-medium text-gray-900">{{ subscription.name }}</h3>
                    <span class="text-lg font-bold text-green-600">{{ formatCurrency(subscription.price) }}</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ subscription.description }}</p>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500">{{ subscription.duration }} mois</span>
                    <div class="flex space-x-1">
                      <button 
                        @click="editSubscription(subscription)"
                        class="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2-2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button 
                        @click="deleteSubscription(subscription.id)"
                        class="text-red-600 hover:text-red-800 p-1"
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
          </div>
        </div>

        <!-- Right Column - Recent Activity & Quick Stats -->
        <div class="space-y-6">
          <!-- Recent Payments -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Paiements Récents</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div v-for="payment in recentPayments" :key="payment.id" class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ payment.type }}</p>
                    <p class="text-sm text-gray-600">{{ payment.agency }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900">{{ formatCurrency(payment.amount) }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(payment.date) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- System Health -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">État du Système</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Serveurs</span>
                  <span class="flex items-center text-green-600">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Opérationnel
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Base de données</span>
                  <span class="flex items-center text-green-600">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Opérationnel
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Paiements</span>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Admin</label>
              <input v-model="newAgency.adminEmail" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
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

    <!-- Create Subscription Modal -->
    <div v-if="showCreateSubscriptionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Créer un Nouvel Abonnement</h3>
        <form @submit.prevent="createSubscription">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom du plan</label>
              <input v-model="newSubscription.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <input v-model="newSubscription.price" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Durée (mois)</label>
              <input v-model="newSubscription.duration" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="newSubscription.description" class="w-full border border-gray-300 rounded-lg px-3 py-2" rows="3" required></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showCreateSubscriptionModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Annuler
            </button>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

const { user } = useAuth()

// Reactive data
const stats = ref({
  totalAgencies: 12,
  totalAgents: 48,
  totalClients: 1247,
  totalRevenue: 125000
})

const agencies = ref([
  { id: 1, name: 'Agence Centre-Ville', location: 'Paris 1er', agentCount: 8, adminEmail: 'admin@centre-ville.com' },
  { id: 2, name: 'Agence Montparnasse', location: 'Paris 14e', agentCount: 6, adminEmail: 'admin@montparnasse.com' },
  { id: 3, name: 'Agence La Défense', location: 'La Défense', agentCount: 12, adminEmail: 'admin@ladefense.com' }
])

const subscriptions = ref([
  { id: 1, name: 'Plan Basique', price: 99, duration: 1, description: 'Fonctionnalités de base pour petites agences' },
  { id: 2, name: 'Plan Premium', price: 199, duration: 1, description: 'Toutes les fonctionnalités + support prioritaire' },
  { id: 3, name: 'Plan Entreprise', price: 499, duration: 12, description: 'Solution complète pour grandes agences' }
])

const recentPayments = ref([
  { id: 1, type: 'Abonnement Premium', agency: 'Agence Centre-Ville', amount: 199, date: new Date() },
  { id: 2, type: 'Commission Contrat', agency: 'Agence Montparnasse', amount: 1500, date: new Date(Date.now() - 86400000) },
  { id: 3, type: 'Abonnement Basique', agency: 'Agence La Défense', amount: 99, date: new Date(Date.now() - 172800000) }
])

// Modal states
const showCreateAgencyModal = ref(false)
const showCreateSubscriptionModal = ref(false)

// Form data
const newAgency = ref({
  name: '',
  location: '',
  adminEmail: ''
})

const newSubscription = ref({
  name: '',
  price: 0,
  duration: 1,
  description: ''
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

const createAgency = () => {
  const agency = {
    id: agencies.value.length + 1,
    ...newAgency.value,
    agentCount: 0
  }
  agencies.value.push(agency)
  stats.value.totalAgencies++
  
  // Reset form
  newAgency.value = { name: '', location: '', adminEmail: '' }
  showCreateAgencyModal.value = false
}

const editAgency = (agency) => {
  // Implementation for editing agency
  console.log('Edit agency:', agency)
}

const deleteAgency = (agencyId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) {
    agencies.value = agencies.value.filter(a => a.id !== agencyId)
    stats.value.totalAgencies--
  }
}

const createSubscription = () => {
  const subscription = {
    id: subscriptions.value.length + 1,
    ...newSubscription.value
  }
  subscriptions.value.push(subscription)
  
  // Reset form
  newSubscription.value = { name: '', price: 0, duration: 1, description: '' }
  showCreateSubscriptionModal.value = false
}

const editSubscription = (subscription) => {
  // Implementation for editing subscription
  console.log('Edit subscription:', subscription)
}

const deleteSubscription = (subscriptionId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
    subscriptions.value = subscriptions.value.filter(s => s.id !== subscriptionId)
  }
}

onMounted(() => {
  // Load initial data
})
</script>
