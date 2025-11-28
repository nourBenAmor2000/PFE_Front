<template>
  <AdminAgentLayout>
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
            <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">Mon Agence</h1>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Détails de votre agence</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-300">Erreur</h3>
            <p class="text-red-600 dark:text-red-400">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Agency Details -->
      <div v-else-if="agency" class="max-w-4xl">
        <div class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 overflow-hidden">
          <!-- Header Card -->
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-8">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-white mb-2">{{ agency.name || 'Nom non défini' }}</h2>
                <p v-if="agency.city" class="text-orange-100 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ agency.city }}
                </p>
              </div>
              <button
                @click="$router.push('/admin-agence/agency/edit')"
                class="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </button>
            </div>
          </div>

          <!-- Details Card -->
          <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nom -->
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Nom</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ agency.name || '-' }}</p>
              </div>

              <!-- Username -->
              <div v-if="agency.username">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Nom d'utilisateur</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ agency.username }}</p>
              </div>

              <!-- Email -->
              <div v-if="agency.email">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ agency.email }}</p>
              </div>

              <!-- Téléphone -->
              <div v-if="agency.phone">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Téléphone</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ agency.phone }}</p>
              </div>

              <!-- Adresse -->
              <div v-if="agency.address" class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Adresse</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ agency.address }}</p>
              </div>

              <!-- Ville -->
              <div v-if="agency.city">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Ville</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ agency.city }}</p>
              </div>

              <!-- Location -->
              <div v-if="agency.location">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Localisation</label>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ agency.location }}</p>
              </div>
            </div>

            <!-- Logo -->
            <div v-if="agency.logo" class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Logo</label>
              <div class="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <img 
                  :src="agency.logo" 
                  :alt="agency.name || 'Logo agence'"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Agency Found -->
      <div v-else class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-300">Aucune agence trouvée</h3>
            <p class="text-yellow-600 dark:text-yellow-400">Votre agence n'a pas encore été configurée.</p>
          </div>
        </div>
      </div>
    </div>
  </AdminAgentLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import AdminAgentLayout from '@/layouts/AdminAgentLayout.vue'

const { api, getEndpoint, extractData } = useApi()
const agency = ref(null)
const isLoading = ref(false)
const error = ref(null)

const fetchAgency = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // L'API /agency pour admin_agence retourne leur propre agence
    // GET /agency appelle myAgencyIndex qui retourne {success: true, agencies: [...]}
    const endpoint = getEndpoint('agency')
    const token = localStorage.getItem('token')
    
    console.log('Fetching agency from endpoint:', endpoint)
    console.log('Full URL will be:', `${api.defaults.baseURL}${endpoint}`)
    console.log('Token exists:', !!token)
    
    if (!token) {
      error.value = 'Vous devez être connecté pour accéder à cette page.'
      isLoading.value = false
      return
    }
    
    const response = await api.get(endpoint)
    const data = extractData(response)
    
    // extractData devrait retourner le tableau agencies directement
    // On récupère la première agence du tableau (car myAgencyIndex retourne un tableau avec une seule agence)
    if (Array.isArray(data)) {
      agency.value = data[0] || null
    } else if (data && typeof data === 'object') {
      // Si extractData retourne l'objet complet, on essaie de trouver l'agence
      if (data.agencies && Array.isArray(data.agencies)) {
        agency.value = data.agencies[0] || null
      } else if (data.agency) {
        agency.value = data.agency
      } else {
        agency.value = data
      }
    } else {
      agency.value = data
    }
  } catch (err) {
    console.error('Failed to fetch agency:', err)
    console.error('Error response:', err.response)
    console.error('Error message:', err.message)
    console.error('Error code:', err.code)
    
    if (err.code === 'ERR_FAILED' || err.message === 'Network Error' || !err.response) {
      error.value = 'Erreur de connexion au serveur. Vérifiez que le serveur Laravel est démarré (php artisan serve) et accessible sur http://localhost:8000'
    } else if (err.response?.status === 401) {
      error.value = 'Non authentifié. Veuillez vous reconnecter.'
    } else if (err.response?.status === 403) {
      error.value = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.'
    } else {
      error.value = err.response?.data?.message || err.message || 'Erreur lors de la récupération de l\'agence'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAgency()
})
</script>

