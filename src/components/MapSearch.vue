<template>
  <div class="map-search bg-white rounded-lg shadow-lg p-2">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Recherche sur la carte</h3>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500">Tunisie uniquement</span>
        <button
          class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
          @click="resetMap"
        >
          Réinitialiser
        </button>
      </div>
    </div>

    <!-- Controls -->
    <div class="space-y-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
          <div class="relative">
            <input
              v-model.trim="searchLocation"
              type="text"
              placeholder="Ville, quartier, adresse…"
              class="w-full pl-10 pr-28 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              @keyup.enter="searchByLocation"
              aria-label="Search location"
            />
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <div class="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                @click="geolocate"
                title="Utiliser ma position"
              >
                Ma position
              </button>
              <button
                v-if="searchLocation"
                class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                @click="searchLocation=''"
                title="Effacer"
              >
                Effacer
              </button>
            </div>
          </div>

          <!-- Quick cities -->
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="c in quickCities"
              :key="c.name"
              class="px-2 py-1 rounded-full text-xs border border-gray-200 hover:bg-gray-50"
              @click="selectQuickCity(c)"
            >
              {{ c.name }}
            </button>
          </div>
        </div>

        <!-- Price -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Prix min</label>
            <select
              v-model="filters.minPrice"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Aucun</option>
              <option v-for="p in minPriceOptions" :key="'min'+p" :value="String(p)">
                {{ formatMoneyTND(p) }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Prix max</label>
            <select
              v-model="filters.maxPrice"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Aucun</option>
              <option v-for="p in maxPriceOptions" :key="'max'+p" :value="String(p)">
                {{ formatMoneyTND(p) }}
              </option>
            </select>
          </div>
        </div>

        <!-- Beds / Type -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Chambres</label>
            <select
              v-model="filters.beds"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Toutes</option>
              <option v-for="n in [1,2,3,4,5]" :key="n" :value="String(n)">{{ n }}+</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type de bien</label>
            <select
              v-model="filters.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Tous les types</option>
              <option v-for="t in types" :key="t" :value="t">{{ capitalize(t) }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="searchArea"
          :disabled="loading"
          class="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-60"
        >
          <span v-if="loading" class="inline-flex items-center gap-2">
            <span class="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Recherche…
          </span>
          <span v-else>Rechercher dans cette zone</span>
        </button>
        <button
          @click="applyFiltersNow"
          class="sm:w-44 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors py-2"
        >
          Appliquer les filtres
        </button>
        <button
          @click="clearFilters"
          class="sm:w-32 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      <!-- Active filter chips -->
      <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-1">
        <span
          v-for="chip in chips"
          :key="chip.key"
          class="px-2.5 py-1 rounded-full text-xs bg-orange-50 text-orange-700 border border-orange-200 inline-flex items-center gap-2"
        >
          {{ chip.label }}
          <button
            class="text-orange-700/80 hover:text-orange-900"
            @click="removeChip(chip.key)"
          >
            ✕
          </button>
        </span>
      </div>

      <!-- Results Count -->
      <div v-if="resultCount !== null" class="text-sm text-gray-600">
        {{ resultCount }} logements trouvés dans cette zone
      </div>
    </div>

    <!-- MAP -->
    <div class="relative">
      <div
        ref="mapEl"
        class="w-full h-80 sm:h-[420px] lg:h-[70vh] rounded-lg overflow-hidden border border-gray-200"
        role="img"
        aria-label="Carte interactive de la Tunisie avec les logements"
      ></div>

      <!-- Helper ribbon -->
      <div
        class="pointer-events-none absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md text-xs text-gray-600 shadow"
      >
        Glissez • Zoomez • Cliquez « Rechercher dans cette zone »
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const emit = defineEmits(['search', 'filters-changed', 'bounds-changed'])

/* ===== State ===== */
const searchLocation = ref('')
const resultCount = ref(null)
const loading = ref(false)

const filters = reactive({
  minPrice: '',
  maxPrice: '',
  beds: '',
  type: ''
})

/* Options (TND) */
const minPriceOptions = [200, 400, 600, 800, 1000]
const maxPriceOptions = [400, 600, 800, 1000, 1500, 2000]
const types = ['house', 'apartment', 'villa', 'studio']

/* Quick cities */
const quickCities = [
  { name: 'Tunis', lat: 36.8065, lng: 10.1815 },
  { name: 'Kélibia', lat: 36.8472, lng: 11.0827 },
  { name: 'Sfax', lat: 34.7406, lng: 10.7603 },
  { name: 'Sousse', lat: 35.8256, lng: 10.6360 },
  { name: 'Bizerte', lat: 37.2746, lng: 9.8739 },
  { name: 'Nabeul', lat: 36.4513, lng: 10.7353 }
]

/* ===== Leaflet ===== */
const mapEl = ref(null)
let map = null
let markersLayer = null
let resizeObs = null

const TN_BOUNDS = L.latLngBounds([30.24, 7.52], [37.55, 11.60])
const TN_CENTER = [33.8869, 9.5375]
const TN_ZOOM = 6

onMounted(() => {
  map = L.map(mapEl.value, {
    center: TN_CENTER,
    zoom: TN_ZOOM,
    minZoom: 5,
    maxZoom: 18,
    maxBounds: TN_BOUNDS,
    maxBoundsViscosity: 0.85,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    preferCanvas: true,
    tap: false
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    detectRetina: true,
    tileSize: 256
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)

  const notifyBounds = throttle(() => {
    if (!map) return
    const safe = getCurrentBounds()
    if (safe) emit('bounds-changed', safe)
  }, 300)

  map.on('moveend', notifyBounds)

  resizeObs = new ResizeObserver(() => map?.invalidateSize())
  resizeObs.observe(mapEl.value)

  fitTunisia()
})

onBeforeUnmount(() => {
  resizeObs?.disconnect()
  if (map) {
    map.remove()
    map = null
  }
})

/* ===== Helpers: filters & bounds ===== */
function buildFiltersPayload () {
  let min = filters.minPrice ? Number(filters.minPrice) : undefined
  let max = filters.maxPrice ? Number(filters.maxPrice) : undefined

  if (min && max && min > max) {
    ;[min, max] = [max, min]
  }

  const payload = {}

  if (min !== undefined && !Number.isNaN(min)) payload.minPrice = min
  if (max !== undefined && !Number.isNaN(max)) payload.maxPrice = max
  if (filters.beds) payload.beds = Number(filters.beds)
  if (filters.type) payload.type = filters.type

  return payload
}

function getCurrentBounds () {
  if (!map) return undefined
  const b = map.getBounds()
  const north = Math.min(b.getNorth(), TN_BOUNDS.getNorth())
  const south = Math.max(b.getSouth(), TN_BOUNDS.getSouth())
  const east  = Math.min(b.getEast(),  TN_BOUNDS.getEast())
  const west  = Math.max(b.getWest(),  TN_BOUNDS.getWest())
  return { north, south, east, west }
}

/* ===== Actions ===== */
const searchByLocation = async () => {
  if (!searchLocation.value) return

  const filtersPayload = buildFiltersPayload()

  try {
    const { geocodingService } = await import('@/services/geocoding')
    const geocoded = await geocodingService.geocode(searchLocation.value)

    if (geocoded && geocoded.lat && geocoded.lng) {
      let { lat, lng } = geocoded
      if (!TN_BOUNDS.contains([lat, lng])) {
        lat = TN_CENTER[0]; lng = TN_CENTER[1]
      }

      flyTo(lat, lng, 12)
      const bounds = getCurrentBounds()

      emit('search', {
        mode: 'location',
        location: searchLocation.value,
        bounds,
        filters: filtersPayload
      })
    } else {
      emit('search', {
        mode: 'location',
        location: searchLocation.value,
        filters: filtersPayload
      })
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    emit('search', {
      mode: 'location',
      location: searchLocation.value,
      filters: filtersPayload
    })
  }
}

const searchArea = () => {
  if (!map) return
  loading.value = true

  const bounds = getCurrentBounds()
  const filtersPayload = buildFiltersPayload()

  emit('search', {
    mode: 'bounds',
    location: searchLocation.value || undefined,
    bounds,
    filters: filtersPayload
  })

  // fallback si le parent n'appelle pas stopLoading
  setTimeout(() => {
    loading.value = false
  }, 800)
}

const startLoading = () => (loading.value = true)
const stopLoading = () => (loading.value = false)

const applyFiltersNow = () => {
  const payload = buildFiltersPayload()
  emit('filters-changed', payload)
}

const applyFiltersDebounced = debounce(applyFiltersNow, 300)

const clearFilters = () => {
  searchLocation.value = ''
  Object.assign(filters, { minPrice: '', maxPrice: '', beds: '', type: '' })
  resultCount.value = null
  emit('filters-changed', {})

  const bounds = getCurrentBounds()
  emit('search', { mode: 'reset', bounds, filters: {} })
}

const fitTunisia = () => map?.fitBounds(TN_BOUNDS, { padding: [24, 24] })
const resetMap = () => {
  fitTunisia()
  clearFilters()
}

const geolocate = () => {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      let { latitude: lat, longitude: lng } = coords
      if (!TN_BOUNDS.contains([lat, lng])) {
        lat = TN_CENTER[0]; lng = TN_CENTER[1]
      }
      flyTo(lat, lng, 12)

      const bounds = getCurrentBounds()
      const filtersPayload = buildFiltersPayload()
      emit('search', {
        mode: 'location',
        location: 'Ma position',
        bounds,
        filters: filtersPayload
      })
    },
    () => {},
    { enableHighAccuracy: true, timeout: 6000 }
  )
}

const selectQuickCity = (city) => {
  searchLocation.value = city.name
  flyTo(city.lat, city.lng, 12)

  const bounds = getCurrentBounds()
  const filtersPayload = buildFiltersPayload()

  emit('search', {
    mode: 'location',
    location: city.name,
    bounds,
    filters: filtersPayload
  })
}

/* ===== Public API for parent ===== */
const updateResultCount = (count) => {
  resultCount.value = count
}

const setProperties = (props = []) => {
  if (!map || !markersLayer) return
  markersLayer.clearLayers()

  const pts = []
  props.forEach((p) => {
    const lat = typeof p.lat === 'number' ? p.lat : p.latitude
    const lng = typeof p.lng === 'number' ? p.lng : p.longitude
    if (typeof lat !== 'number' || typeof lng !== 'number') return

    pts.push([lat, lng])

    L.marker([lat, lng], { title: p.title || 'Logement' })
      .bindPopup(`
        <div class="text-sm">
          <div class="font-semibold text-gray-900">${p.title ?? 'Logement'}</div>
          ${
            p.price
              ? `<div class="text-gray-600">${formatMoneyTND(
                  p.price
                )}</div>`
              : ''
          }
          ${
            p.address
              ? `<div class="text-[12px] text-gray-500">${p.address}</div>`
              : ''
          }
        </div>
      `)
      .addTo(markersLayer)
  })

  if (pts.length) {
    map.fitBounds(pts, { padding: [24, 24], maxZoom: 14 })
  }
}

const flyToBounds = (bounds) => {
  if (!map || !bounds) return
  const b = L.latLngBounds([bounds.south, bounds.west], [bounds.north, bounds.east])
  map.fitBounds(b, { padding: [24, 24] })
}

const flyTo = (lat, lng, zoom = 12) =>
  map?.flyTo([lat, lng], zoom, { duration: 0.6 })

defineExpose({
  updateResultCount,
  setProperties,
  flyToBounds,
  flyTo,
  startLoading,
  stopLoading,
  fitTunisia
})

/* ===== Chips / helpers ===== */
const chips = computed(() => {
  const arr = []
  if (filters.minPrice)
    arr.push({ key: 'minPrice', label: `Min ${formatMoneyTND(filters.minPrice)}` })
  if (filters.maxPrice)
    arr.push({ key: 'maxPrice', label: `Max ${formatMoneyTND(filters.maxPrice)}` })
  if (filters.beds)
    arr.push({ key: 'beds', label: `${filters.beds}+ chambres` })
  if (filters.type)
    arr.push({ key: 'type', label: capitalize(filters.type) })
  return arr
})

const hasActiveFilters = computed(() => chips.value.length > 0)

const removeChip = (key) => {
  filters[key] = ''
  applyFiltersDebounced()
}

/* Auto-emit filters on change */
watch(
  filters,
  () => {
    applyFiltersDebounced()
  },
  { deep: true }
)

/* ===== utils ===== */
function formatMoneyTND(v) {
  if (v === '' || v === null || v === undefined) return ''
  return Number(v).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'TND',
    maximumFractionDigits: 0
  })
}
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}
function debounce(fn, ms) {
  let t
  return (...a) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...a), ms)
  }
}
function throttle(fn, ms) {
  let t = 0
  return (...a) => {
    const n = Date.now()
    if (n - t >= ms) {
      t = n
      fn(...a)
    }
  }
}
</script>

<style scoped>
:global(.leaflet-container) {
  font: inherit;
}
</style>
