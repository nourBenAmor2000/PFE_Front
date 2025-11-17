<template>
  
  <div class="map-search bg-white rounded-lg shadow-lg p-2">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Search on Map</h3>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500">Tunisia only</span>
        <button
          class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
          @click="fitTunisia"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Controls -->
    <div class="space-y-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div class="relative">
            <input
              v-model.trim="searchLocation"
              type="text"
              placeholder="Enter city, address, or ZIP code"
              class="w-full pl-10 pr-28 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              @keyup.enter="searchByLocation"
              aria-label="Search location"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
            </svg>
            <div class="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                @click="geolocate"
                title="Use my location"
              >
                Use my location
              </button>
              <button
                v-if="searchLocation"
                class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                @click="searchLocation=''"
                title="Clear"
              >Clear</button>
            </div>
          </div>

          <!-- Quick cities -->
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="c in quickCities"
              :key="c.name"
              class="px-2 py-1 rounded-full text-xs border border-gray-200 hover:bg-gray-50"
              @click="flyTo(c.lat, c.lng, 12)"
            >
              {{ c.name }}
            </button>
          </div>
        </div>

        <!-- Price -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
            <select v-model="filters.minPrice" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500">
              <option value="">No Min</option>
              <option v-for="p in minPriceOptions" :key="'min'+p" :value="p">{{ formatMoney(p) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
            <select v-model="filters.maxPrice" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500">
              <option value="">No Max</option>
              <option v-for="p in maxPriceOptions" :key="'max'+p" :value="p">{{ formatMoney(p) }}</option>
            </select>
          </div>
        </div>

        <!-- Beds / Type -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
            <select v-model="filters.beds" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500">
              <option value="">Any</option>
              <option v-for="n in [1,2,3,4,5]" :key="n" :value="String(n)">{{ n }}+</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
            <select v-model="filters.type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500">
              <option value="">All Types</option>
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
            Searching…
          </span>
          <span v-else>Search this area</span>
        </button>
        <button
          @click="applyFiltersDebounced"
          class="sm:w-44 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors py-2"
        >
          Apply filters
        </button>
        <button
          @click="clearFilters"
          class="sm:w-32 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
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
          <button class="text-orange-700/80 hover:text-orange-900" @click="removeChip(chip.key)">✕</button>
        </span>
      </div>

      <!-- Results Count -->
      <div v-if="resultCount !== null" class="text-sm text-gray-600">
        {{ resultCount }} properties found in this area
      </div>
    </div>

    <!-- MAP -->
    <div class="relative">
      <div
        ref="mapEl"
        class="w-full h-80 sm:h-[420px] lg:h-[70vh] rounded-lg overflow-hidden border border-gray-200"
        role="img"
        aria-label="Interactive map of Tunisia with property markers"
      ></div>

      <!-- Helper ribbon -->
      <div
        class="pointer-events-none absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md text-xs text-gray-600 shadow"
      >
        Drag • Zoom • Click “Search this area”
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/* ===== Emits ===== */
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

/* Options */
const minPriceOptions = [100000, 250000, 500000, 750000, 1000000]
const maxPriceOptions = [250000, 500000, 750000, 1000000, 2000000]
const types = ['house', 'apartment', 'villa', 'condo']

/* Quick cities */
const quickCities = [
  { name: 'Tunis',   lat: 36.8065, lng: 10.1815 },
  { name: 'Sfax',    lat: 34.7406, lng: 10.7603 },
  { name: 'Sousse',  lat: 35.8256, lng: 10.6360 },
  { name: 'Bizerte', lat: 37.2746, lng: 9.8739  },
  { name: 'Nabeul',  lat: 36.4513, lng: 10.7353 },
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
    preferCanvas: true,        // smoother on large markers
    tap: false                 // better mobile tap handling
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    detectRetina: true,
    tileSize: 256,
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)

  /* Throttled bounds change emit */
  const notifyBounds = throttle(() => {
    const b = map.getBounds()
    emit('bounds-changed', {
      north: b.getNorth(),
      south: b.getSouth(),
      east:  b.getEast(),
      west:  b.getWest()
    })
  }, 250)
  map.on('moveend', notifyBounds)

  /* keep map sized when container resizes */
  resizeObs = new ResizeObserver(() => map?.invalidateSize())
  resizeObs.observe(mapEl.value)

  fitTunisia()
})

onBeforeUnmount(() => {
  resizeObs?.disconnect()
  if (map) { map.remove(); map = null }
})

/* ===== Actions ===== */
const searchByLocation = () => {
  if (!searchLocation.value) return
  emit('search', { location: searchLocation.value, filters: { ...filters } })
}

const searchArea = () => {
  if (!map) return
  loading.value = true
  const b = map.getBounds()
  emit('search', {
    bounds: { north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() },
    filters: { ...filters }
  })
  // parent should call stopLoading() when API returns; fallback auto-stop:
  setTimeout(() => (loading.value = false), 600)
}

const startLoading = () => (loading.value = true)
const stopLoading  = () => (loading.value = false)

const applyFilters = () => emit('filters-changed', { ...filters })
const applyFiltersDebounced = debounce(applyFilters, 300)

const clearFilters = () => {
  searchLocation.value = ''
  Object.assign(filters, { minPrice: '', maxPrice: '', beds: '', type: '' })
  resultCount.value = null
  emit('filters-changed', {})
}

const fitTunisia = () => map?.fitBounds(TN_BOUNDS, { padding: [24, 24] })

const geolocate = () => {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      let { latitude: lat, longitude: lng } = coords
      if (!TN_BOUNDS.contains([lat, lng])) { lat = TN_CENTER[0]; lng = TN_CENTER[1] }
      flyTo(lat, lng, 12)
    },
    () => {}, { enableHighAccuracy: true, timeout: 6000 }
  )
}

/* ===== Public API for parent ===== */
const updateResultCount = (count) => { resultCount.value = count }
const setProperties = (props = []) => {
  if (!map || !markersLayer) return
  markersLayer.clearLayers()
  const pts = []
  props.forEach(p => {
    if (typeof p.lat !== 'number' || typeof p.lng !== 'number') return
    pts.push([p.lat, p.lng])
    L.marker([p.lat, p.lng], { title: p.title || 'Property' })
      .bindPopup(`
        <div class="text-sm">
          <div class="font-semibold text-gray-900">${p.title ?? 'Property'}</div>
          ${p.price ? `<div class="text-gray-600">${Number(p.price).toLocaleString('fr-FR')} TND</div>` : ''}
          ${p.address ? `<div class="text-[12px] text-gray-500">${p.address}</div>` : ''}
        </div>
      `)
      .addTo(markersLayer)
  })
  if (pts.length) map.fitBounds(pts, { padding: [24, 24], maxZoom: 14 })
}
const flyToBounds = (bounds) => {
  if (!map || !bounds) return
  const b = L.latLngBounds([bounds.south, bounds.west], [bounds.north, bounds.east])
  map.fitBounds(b, { padding: [24, 24] })
}
const flyTo = (lat, lng, zoom = 12) => map?.flyTo([lat, lng], zoom, { duration: 0.6 })

defineExpose({ updateResultCount, setProperties, flyToBounds, flyTo, startLoading, stopLoading, fitTunisia })

/* ===== Chips / helpers ===== */
const chips = computed(() => {
  const arr = []
  if (filters.minPrice) arr.push({ key: 'minPrice', label: `Min ${formatMoney(filters.minPrice)}` })
  if (filters.maxPrice) arr.push({ key: 'maxPrice', label: `Max ${formatMoney(filters.maxPrice)}` })
  if (filters.beds)     arr.push({ key: 'beds',     label: `${filters.beds}+ beds` })
  if (filters.type)     arr.push({ key: 'type',     label: capitalize(filters.type) })
  return arr
})
const hasActiveFilters = computed(() => chips.value.length > 0)
const removeChip = (key) => { filters[key] = ''; applyFiltersDebounced() }

/* auto-emit on change (nice UX) */
watch(filters, () => applyFiltersDebounced(), { deep: true })

/* ===== utils ===== */
function formatMoney(v){ return Number(v).toLocaleString('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }) }
function capitalize(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : '' }
function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms) } }
function throttle(fn, ms){ let t=0; return (...a)=>{ const n=Date.now(); if(n-t>=ms){ t=n; fn(...a) } } }
</script>

<style scoped>
:global(.leaflet-container){ font: inherit; }
</style>
