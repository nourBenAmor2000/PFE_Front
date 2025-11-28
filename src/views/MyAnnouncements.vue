<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-white py-8 border-b border-gray-100">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Mes Annonces</h1>
            <p class="mt-1 text-gray-600 text-base">
              Gérez vos propriétés et logements publiés
            </p>
          </div>
          <RouterLink
            v-if="isAgent"
            to="/add-property"
            class="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-5 py-3 font-medium text-white shadow-sm hover:bg-[var(--brand-600)] transition"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Ajouter une annonce
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-6 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-lg bg-white shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Annonces</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-lg bg-white shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Disponibles</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.available }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-lg bg-white shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-orange-100 rounded-lg">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">En attente</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-lg bg-white shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Vues totales</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.views }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Properties List -->
    <section class="py-10">
      <div class="container mx-auto px-4">
        <div class="mb-6 flex items-center justify-between gap-3">
          <p class="text-sm text-gray-600">
            <span class="font-semibold text-gray-900">{{ properties.length }}</span> annonce(s) trouvée(s)
          </p>
          
          <div class="flex items-center gap-3">
            <select
              v-model="statusFilter"
              class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="available">Disponibles</option>
              <option value="rented">Loués</option>
              <option value="sold">Vendus</option>
            </select>
            
            <select
              v-model="sortBy"
              class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent"
            >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand)]"></div>
        </div>

        <div v-else-if="filteredProperties.length === 0" class="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <p class="mt-4 text-gray-800 font-medium">Aucune annonce trouvée</p>
          <p class="mt-1 text-gray-500">
            <span v-if="isAgent">Commencez par ajouter votre première annonce</span>
            <span v-else>Vous n'avez pas encore de propriétés</span>
          </p>
          <RouterLink
            v-if="isAgent"
            to="/add-property"
            class="mt-4 inline-flex items-center rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-600)] transition"
          >
            Ajouter une annonce
          </RouterLink>
        </div>

        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="property in filteredProperties"
            :key="property.id"
            class="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all"
          >
            <div class="relative">
              <img
                :src="property.image"
                :alt="property.title"
                class="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span
                :class="[
                  'absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow',
                  property.status === 'available' ? 'bg-green-500' : property.status === 'rented' ? 'bg-blue-500' : 'bg-gray-500'
                ]"
              >
                {{ getStatusLabel(property.status) }}
              </span>
              <div class="absolute top-4 right-4 flex gap-2">
                <RouterLink
                  :to="`/properties/${property.id}`"
                  class="p-2 rounded-lg bg-white/90 backdrop-blur hover:bg-white transition"
                  title="Voir"
                >
                  <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </RouterLink>
                <button
                  v-if="isAgent"
                  @click.stop="editProperty(property.id)"
                  class="p-2 rounded-lg bg-white/90 backdrop-blur hover:bg-white transition"
                  title="Modifier"
                >
                  <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button
                  v-if="isAgent"
                  @click.stop="deleteProperty(property.id)"
                  class="p-2 rounded-lg bg-white/90 backdrop-blur hover:bg-red-50 transition"
                  title="Supprimer"
                >
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
              <div class="absolute bottom-4 left-4 rounded-lg bg-white/95 px-3 py-2 text-lg font-bold text-gray-900 shadow">
                {{ property.formattedPrice }}
              </div>
            </div>

            <div class="p-5 space-y-3">
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-1">
                {{ property.title }}
              </h3>
              <p class="text-sm text-gray-600 line-clamp-1 flex items-center gap-1">
                <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ property.address || 'Adresse non disponible' }}
              </p>
              <div class="flex items-center gap-4 border-t border-gray-100 pt-3 text-sm text-gray-700">
                <div class="flex items-center gap-1">
                  <span class="font-semibold text-gray-900">{{ property.beds || 0 }}</span>
                  <span class="text-gray-500">ch.</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="font-semibold text-gray-900">{{ property.baths || 0 }}</span>
                  <span class="text-gray-500">sdb</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="font-semibold text-gray-900">{{ property.sqft || 0 }}</span>
                  <span class="text-gray-500">m²</span>
                </div>
              </div>
              <div v-if="property.createdAt" class="text-xs text-gray-500">
                Publié le {{ formatDate(property.createdAt) }}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useLogements } from '../composables/useLogements'
import { useApi } from '../composables/useApi'

/* ==== Couleurs de marque ==== */
document.documentElement.style.setProperty('--brand', '#EF5A1C')
document.documentElement.style.setProperty('--brand-600', '#E25116')
document.documentElement.style.setProperty('--brand-700', '#C94710')

const router = useRouter()
const { user, isAgent, isClient } = useAuth()
const logementsStore = useLogements()
const { api } = useApi()

const isLoading = ref(false)
const properties = ref([])
const statusFilter = ref('')
const sortBy = ref('newest')

const stats = computed(() => {
  const total = properties.value.length
  const available = properties.value.filter(p => p.status === 'available' || p.free === true).length
  const pending = properties.value.filter(p => p.status === 'pending').length
  const views = 0 // TODO: Add views tracking
  
  return { total, available, pending, views }
})

const filteredProperties = computed(() => {
  let filtered = [...properties.value]
  
  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(p => {
      if (statusFilter.value === 'available') return p.status === 'available' || p.free === true
      if (statusFilter.value === 'rented') return p.status === 'rented' || p.free === false
      if (statusFilter.value === 'sold') return p.status === 'sold'
      return true
    })
  }
  
  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'price_asc':
        return (a.price || 0) - (b.price || 0)
      case 'price_desc':
        return (b.price || 0) - (a.price || 0)
      default:
        return 0
    }
  })
  
  return filtered
})

const formatPriceTND = (value) => {
  if (!value && value !== 0) return 'Prix non disponible'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'TND',
    maximumFractionDigits: 0
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

const getStatusLabel = (status) => {
  const labels = {
    'available': 'Disponible',
    'rented': 'Loué',
    'sold': 'Vendu',
    'pending': 'En attente'
  }
  return labels[status] || 'Non disponible'
}

const loadMyProperties = async () => {
  isLoading.value = true
  try {
    if (!user.value) {
      properties.value = []
      return
    }
    
    // For agents: API automatically filters by agency_id
    // For clients: they typically don't own properties, so show empty
    if (isClient.value) {
      // Clients don't own properties, so show empty
      // Or we could fetch properties from their contracts if needed
      properties.value = []
      isLoading.value = false
      return
    }
    
    // Fetch logements (API will auto-filter by agency_id for agents)
    await logementsStore.searchLogements({
      per_page: 100,
      sort: 'created_at',
      sort_dir: 'desc'
    })
    
    // Map logements to properties format
    properties.value = logementsStore.logements.map(log => {
      const lat = log.latitude
      const lng = log.longitude

      const mainImage =
        log.mainImage ||
        log.coverImage ||
        (Array.isArray(log.images) && log.images[0]) ||
        (Array.isArray(log.photos) && log.photos[0]) ||
        log.image ||
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'

      const status = log.free !== false ? 'available' : 'rented'

      return {
        id: log._id || log.id,
        title: log.title || 'Logement',
        address: log.location || log.address || '',
        price: log.price || 0,
        formattedPrice: formatPriceTND(log.price),
        beds: log.beds || log.chambres || 0,
        baths: log.baths || log.sallesDeBain || 0,
        sqft: log.surface || 0,
        status,
        type: log.type || 'house',
        free: log.free !== false,
        image: mainImage,
        latitude: lat,
        longitude: lng,
        category: log.category,
        agency: log.agency,
        createdAt: log.created_at || log.createdAt || log.created_at_human || new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Failed to load properties:', error)
  } finally {
    isLoading.value = false
  }
}

const editProperty = (id) => {
  router.push(`/admin/logements/edit/${id}`)
}

const deleteProperty = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return
  
  try {
    await logementsStore.deleteLogement(id)
    await loadMyProperties()
    alert('Annonce supprimée avec succès')
  } catch (error) {
    console.error('Failed to delete property:', error)
    alert('Erreur lors de la suppression')
  }
}

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }
  
  await loadMyProperties()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>

