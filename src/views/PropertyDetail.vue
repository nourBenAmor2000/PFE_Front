<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
    <!-- État de chargement -->
    <div v-if="loading" class="container mx-auto max-w-6xl px-4 py-20">
      <div class="flex flex-col items-center justify-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent"></div>
        <p class="text-gray-700 font-medium">Chargement du logement...</p>
      </div>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="container mx-auto max-w-3xl px-4 py-16">
      <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-sm">
        <p class="text-red-800 font-semibold text-lg mb-2">Une erreur est survenue</p>
        <p class="text-red-600">{{ error }}</p>
        <p class="text-sm text-red-500 mt-4">
          Vous allez être redirigé(e) vers la liste des logements...
        </p>
      </div>
    </div>

    <!-- Contenu du logement -->
    <template v-else>
      <!-- Bloc principal logement -->
      <section class="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div class="container mx-auto max-w-6xl px-4 py-8 lg:py-10">
          <!-- Fil d’Ariane -->
          <nav class="mb-6 text-sm">
            <ol class="flex items-center space-x-2 text-gray-500">
              <li>
                <router-link to="/" class="hover:text-orange-500 font-medium">
                  Accueil
                </router-link>
              </li>
              <li>/</li>
              <li>
                <router-link to="/properties" class="hover:text-orange-500 font-medium">
                  Logements
                </router-link>
              </li>
              <li>/</li>
              <li class="text-gray-900 font-semibold truncate max-w-[200px]">
                {{ property.title || 'Détails du logement' }}
              </li>
            </ol>
          </nav>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <!-- Images du logement -->
            <div class="lg:col-span-2">
              <div
                class="relative mb-4 rounded-2xl overflow-hidden shadow-lg group bg-gray-100"
              >
                <img
                  :src="mainImage"
                  :alt="property.title || 'Photo du logement'"
                  class="w-full h-80 sm:h-96 object-cover transform transition-transform duration-300 group-hover:scale-[1.03]"
                />

                <!-- Badge statut -->
                <div
                  class="absolute top-4 left-4 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg"
                >
                  <span
                    class="inline-block w-2 h-2 rounded-full"
                    :class="property.free ? 'bg-emerald-300' : 'bg-red-300'"
                  ></span>
                  <span>{{ status }}</span>
                </div>

                <!-- Prix -->
                <div
                  v-if="property.price"
                  class="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg text-right"
                >
                  <p class="text-[11px] uppercase tracking-wide text-gray-500">
                    Loyer mensuel
                  </p>
                  <p class="text-2xl font-extrabold text-orange-600">
                    {{ formatPrice(property.price) }}
                  </p>
                </div>
              </div>

              <!-- Galerie d’images -->
              <div v-if="gallery.length > 1" class="grid grid-cols-4 gap-2 mt-2">
                <button
                  v-for="(image, index) in gallery"
                  :key="index"
                  type="button"
                  class="relative group focus:outline-none"
                  @click="selectedImage = image"
                >
                  <img
                    :src="image"
                    :alt="`Image ${index + 1}`"
                    class="w-full h-20 object-cover rounded-lg border-2 transition-all duration-200"
                    :class="
                      image === mainImage
                        ? 'border-orange-500 shadow-md'
                        : 'border-transparent group-hover:border-orange-300 group-hover:shadow-sm'
                    "
                  />
                </button>
              </div>
            </div>

            <!-- Informations du logement -->
            <div class="space-y-6">
              <div
                class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-7 transition-transform duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                <div class="mb-6">
                  <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-snug">
                    {{ property.title || 'Logement à louer' }}
                  </h1>
                  <p class="flex items-start text-gray-600 text-sm sm:text-base">
                    <svg
                      class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{{ address }}</span>
                  </p>
                </div>

                <!-- Caractéristiques principales -->
                <div
                  class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                >
                  <div v-if="property.surface" class="text-center">
                    <div class="text-xl font-bold text-gray-900">
                      {{ property.surface }}
                    </div>
                    <div class="text-xs uppercase tracking-wide text-gray-600">m²</div>
                  </div>
                  <div v-if="property.beds" class="text-center">
                    <div class="text-xl font-bold text-gray-900">
                      {{ property.beds }}
                    </div>
                    <div class="text-xs uppercase tracking-wide text-gray-600">
                      Chambres
                    </div>
                  </div>
                  <div v-if="property.baths" class="text-center">
                    <div class="text-xl font-bold text-gray-900">
                      {{ property.baths }}
                    </div>
                    <div class="text-xs uppercase tracking-wide text-gray-600">
                      Salles de bain
                    </div>
                  </div>
                  <div v-if="property.floor !== null" class="text-center">
                    <div class="text-xl font-bold text-gray-900">
                      {{ property.floor }}
                    </div>
                    <div class="text-xs uppercase tracking-wide text-gray-600">Étage</div>
                  </div>
                </div>

                <!-- Catégorie & agence -->
                <div class="mb-6 space-y-2">
                  <div
                    v-if="property.category"
                    class="flex flex-wrap items-center text-sm text-gray-700"
                  >
                    <span class="font-semibold mr-2">Catégorie :</span>
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                    >
                      {{ property.category.name || property.category }}
                    </span>
                  </div>
                  <div
                    v-if="property.agency"
                    class="flex flex-wrap items-center text-sm text-gray-700"
                  >
                    <span class="font-semibold mr-2">Agence :</span>
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium"
                    >
                      {{ property.agency.name || property.agency }}
                    </span>
                  </div>
                </div>

                <!-- Informations conseiller / agence -->
                <div
                  class="p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white"
                >
                  <h3 class="text-sm font-semibold text-gray-800 mb-3">
                    Contacter l’agence
                  </h3>
                  <div class="flex items-center space-x-3">
                    <img
                      :src="agent.photo"
                      :alt="agent.name"
                      class="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                    />
                    <div class="flex-1">
                      <div class="font-semibold text-gray-900">
                        {{ agent.name }}
                      </div>
                      <div class="text-sm text-gray-600 flex items-center">
                        <svg
                          class="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {{ agent.phone }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Composant de prise de rendez-vous -->
              <VisitBooking
                v-if="property.id || property._id"
                :property-id="property.id || property._id"
                :agent-id="agent.id"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Description & carte -->
      <section class="py-14 lg:py-16">
        <div class="container mx-auto max-w-6xl px-4">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <!-- Description du logement -->
            <div class="lg:col-span-2 space-y-6">
              <div
                class="bg-white rounded-2xl shadow-lg p-6 lg:p-7 border border-gray-100 transition-transform duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p class="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                  {{ property.description || 'Aucune description disponible pour ce logement.' }}
                </p>

                <h3 class="text-xl font-bold text-gray-900 mb-4">Caractéristiques détaillées</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="(feature, index) in features"
                    :key="index"
                    class="flex items-center p-2.5 bg-gray-50 rounded-lg"
                  >
                    <svg
                      class="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="text-gray-700 text-sm">{{ feature }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Carte interactive -->
            <div
              class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              <div class="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <svg
                    class="w-5 h-5 mr-2 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Localisation
                </h3>
              </div>

              <div v-if="property.latitude && property.longitude" class="h-64">
                <PropertyMap
                  :properties="[property]"
                  :center="[property.latitude, property.longitude]"
                  :zoom="15"
                  height="256px"
                />
              </div>
              <div v-else class="h-64 flex items-center justify-center bg-gray-100">
                <p class="text-gray-500 text-sm">
                  Coordonnées géographiques non disponibles
                </p>
              </div>

              <div class="p-4 bg-gray-50">
                <p class="text-sm text-gray-800 font-medium mb-2">
                  {{ address }}
                </p>
                <div
                  v-if="property.latitude && property.longitude"
                  class="text-xs text-gray-500"
                >
                  <span>Lat. : {{ property.latitude.toFixed(6) }}, </span>
                  <span>Long. : {{ property.longitude.toFixed(6) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PropertyMap from '../components/PropertyMap.vue'
import VisitBooking from '../components/VisitBooking.vue'
import { useApi } from '@/composables/useApi'

const route = useRoute()
const router = useRouter()
const { api, getEndpoint } = useApi()

const property = ref({
  title: '',
  location: '',
  price: 0,
  description: '',
  latitude: null,
  longitude: null,
  image: null,
  surface: null,
  floor: null,
  free: true,
  category: null,
  agency: null,
  beds: null,
  baths: null,
  features: []
})

const loading = ref(true)
const error = ref(null)

// Image sélectionnée pour l’aperçu principal
const selectedImage = ref(null)

// Image principale affichée
const mainImage = computed(() => {
  if (selectedImage.value) return selectedImage.value
  return (
    property.value.image ||
    property.value.mainImage ||
    'https://via.placeholder.com/800x600?text=Aucune+image'
  )
})

// Galerie d’images
const gallery = computed(() => {
  if (property.value.gallery && Array.isArray(property.value.gallery)) {
    return property.value.gallery
  }
  return [mainImage.value]
})

// Statut du logement
const status = computed(() => {
  return property.value.free ? 'Disponible' : 'Occupé'
})

// Adresse affichée
const address = computed(() => {
  return property.value.location || property.value.address || 'Adresse non disponible'
})

// Informations conseiller / agence
const agent = computed(() => {
  if (property.value.agent) {
    return property.value.agent
  }
  if (property.value.agency?.agent) {
    return property.value.agency.agent
  }
  return {
    id: null,
    name: 'Aucun conseiller assigné',
    phone: property.value.agency?.phone || 'N/A',
    photo: 'https://via.placeholder.com/100?text=Conseiller'
  }
})

// Caractéristiques détaillées
const features = computed(() => {
  if (property.value.features && Array.isArray(property.value.features)) {
    return property.value.features
  }

  const featuresList = []
  if (property.value.surface) {
    featuresList.push(`${property.value.surface} m²`)
  }
  if (property.value.floor !== null && property.value.floor !== undefined) {
    featuresList.push(`Étage ${property.value.floor}`)
  }
  if (property.value.beds) {
    featuresList.push(`${property.value.beds} chambre(s)`)
  }
  if (property.value.baths) {
    featuresList.push(`${property.value.baths} salle(s) de bain`)
  }
  if (property.value.free) {
    featuresList.push('Disponible immédiatement')
  }

  return featuresList.length > 0
    ? featuresList
    : ['Caractéristiques non spécifiées']
})

async function fetchProperty() {
  loading.value = true
  error.value = null

  try {
    const propertyId = route.params.id
    if (!propertyId) {
      throw new Error('ID de logement manquant')
    }

    const endpoint = getEndpoint('logements')
    const response = await api.get(`${endpoint}/${propertyId}`)

    if (response.data.success && response.data.logement) {
      property.value = response.data.logement

      // Initialiser l’image principale si besoin
      if (!selectedImage.value) {
        selectedImage.value =
          property.value.image ||
          property.value.mainImage ||
          null
      }

      // S’assurer que nous avons des coordonnées
      if (!property.value.latitude && !property.value.longitude) {
        if (property.value.location) {
          try {
            const { geocodingService } = await import('@/services/geocoding')
            const geocoded = await geocodingService.geocode(property.value.location)
            if (geocoded) {
              property.value.latitude = geocoded.lat
              property.value.longitude = geocoded.lng
            }
          } catch (e) {
            console.warn('Échec du géocodage :', e)
          }
        }
      }
    } else {
      throw new Error('Logement non trouvé')
    }
  } catch (err) {
    console.error('Erreur lors du chargement du logement :', err)
    error.value =
      err.response?.data?.error ||
      err.message ||
      'Erreur lors du chargement du logement'

    // Redirection vers la liste après 3 secondes
    setTimeout(() => {
      router.push('/properties')
    }, 3000)
  } finally {
    loading.value = false
  }
}

// Chargement au montage
onMounted(() => {
  fetchProperty()
})

// Formatage du prix
function formatPrice(price) {
  if (!price) return 'Prix non disponible'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'TND',
    maximumFractionDigits: 0
  }).format(price)
}
</script>
