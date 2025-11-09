<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero / Heading -->
    <section class="bg-white py-12 border-b border-gray-100">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-xs uppercase tracking-widest text-gray-500">Explorer</p>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Find Your Dream Property</h1>
            <p class="mt-1 text-gray-600 text-base">Browse through our extensive collection of properties</p>
          </div>
          <ViewToggle v-model="viewMode" class="mt-2 sm:mt-0" />
        </div>

        <!-- Search + filters row -->
        <div class="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
          <form @submit.prevent="onSubmitSearch" class="grid grid-cols-1 gap-3 md:grid-cols-12">
            <label class="md:col-span-5 relative block">
              <span class="sr-only">Search</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search properties (city, area, address, keyword)"
                class="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-gray-900 placeholder:text-gray-400
                       focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
              <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"/></svg>
            </label>

            <label class="md:col-span-2">
              <span class="sr-only">Type</span>
              <select v-model="selectedType"
                class="w-full rounded-lg border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent">
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
              </select>
            </label>

            <label class="md:col-span-2">
              <span class="sr-only">Status</span>
              <select v-model="selectedStatus"
                class="w-full rounded-lg border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent">
                <option value="">All Status</option>
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
              </select>
            </label>

            <label class="md:col-span-2">
              <span class="sr-only">Sort by</span>
              <select v-model="sortBy"
                class="w-full rounded-lg border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent">
                <option value="relevant">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </label>

            <div class="md:col-span-1 flex">
              <button type="submit"
                class="inline-flex w-full items-center justify-center rounded-lg
                       bg-[var(--brand)] px-4 py-3 font-semibold text-white
                       hover:bg-[var(--brand-600)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
                Search
              </button>
            </div>
          </form>

          <!-- Active chips / reset -->
          <div v-if="hasActiveFilters" class="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span class="text-gray-500">Filters:</span>
            <FilterChip v-if="searchQuery" :label="`Keyword: ${searchQuery}`" @clear="searchQuery=''; triggerFilter()" />
            <FilterChip v-if="selectedType" :label="`Type: ${labelType}`" @clear="selectedType=''; triggerFilter()" />
            <FilterChip v-if="selectedStatus" :label="`Status: ${labelStatus}`" @clear="selectedStatus=''; triggerFilter()" />
            <button type="button" class="ml-1 text-[var(--brand)] hover:text-[var(--brand-700)] underline underline-offset-2"
              @click="resetFilters">Clear all</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Results -->
    <section class="py-10">
      <div class="container mx-auto px-4">
        <div class="mb-6 flex items-center justify-between gap-3">
          <p class="text-sm text-gray-600">
            <span class="font-semibold text-gray-900">{{ sortedProperties.length }}</span> properties found
          </p>
          <ViewToggle v-model="viewMode" class="sm:hidden" />
        </div>

        <!-- Map view -->
        <div v-if="viewMode==='map'" class="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <aside class="lg:col-span-1">
            <MapSearch ref="mapSearchRef" @search="handleMapSearch" @filters-changed="handleFiltersChanged" />
          </aside>
          <div class="lg:col-span-3">
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <PropertyMap
                :properties="sortedProperties"
                :center="mapCenter"
                :zoom="mapZoom"
                height="600px"
                @property-selected="handlePropertySelected"
                @map-moved="handleMapMoved"
              />
            </div>
          </div>
        </div>

        <!-- List view -->
        <div v-else>
          <div v-if="!sortedProperties.length" class="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p class="text-gray-800 font-medium">No property matches your search.</p>
            <p class="mt-1 text-gray-500">Try broadening filters or changing keywords.</p>
            <button
              class="mt-4 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="resetFilters">Reset filters</button>
          </div>

          <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <PropertyCard
              v-for="property in paged"
              :key="property.id"
              :property="property"
              @click="goToProperty(property.id)"
            />
          </div>

          <!-- Pagination -->
          <Pagination
            v-if="sortedProperties.length > pageSize"
            class="mt-8"
            :total="sortedProperties.length"
            :page-size="pageSize"
            v-model:page="page"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PropertyMap from '../components/PropertyMap.vue'
import MapSearch from '../components/MapSearch.vue'

/* ---------- Couleur de ta capture ---------- */
onMounted(() => {
  document.documentElement.style.setProperty('--brand', '#EF4445')   // couleur principale
  document.documentElement.style.setProperty('--brand-600', '#E23D3E') // hover
  document.documentElement.style.setProperty('--brand-700', '#C93637') // active/texte
})

const router = useRouter()
const route = useRoute()

const viewMode = ref(route.query.view || 'list')
const mapCenter = ref([34.0522, -118.2437]) // LA
const mapZoom = ref(10)
const mapSearchRef = ref(null)
const mapFilters = ref({})

const searchQuery = ref(route.query.q || '')
const selectedType = ref(route.query.type || '')
const selectedStatus = ref(route.query.status || '')
const sortBy = ref(route.query.sort || 'relevant')

const page = ref(Number(route.query.page || 1))
const pageSize = 9

const properties = ref([
  { id: 1, title: 'House on the Hollywood', address: '374 Johnson Ave', price: 4600, beds: 6, baths: 2, sqft: 200, status: 'For Sale', type: 'house', image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', latitude: 34.0928, longitude: -118.3287, createdAt: '2025-09-12' },
  { id: 2, title: 'Comfortable Villa Green', address: '178 Broadway, Brooklyn', price: 5800, beds: 9, baths: 3, sqft: 600, status: 'For Sale', type: 'villa', image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', latitude: 34.0522, longitude: -118.2437, createdAt: '2025-10-22' },
  { id: 3, title: 'Quality House For Sale', address: '873 Bedford Ave', price: 2500, beds: 10, baths: 2, sqft: 500, status: 'For Sale', type: 'house', image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', latitude: 34.0195, longitude: -118.4912, createdAt: '2025-10-05' },
  { id: 4, title: 'Luxury Downtown Apartment', address: '456 Park Avenue, Manhattan', price: 7200, beds: 3, baths: 2, sqft: 1200, status: 'For Rent', type: 'apartment', image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', latitude: 34.0407, longitude: -118.2468, createdAt: '2025-08-29' }
])

const filteredProperties = computed(() => {
  const q = String(searchQuery.value).trim().toLowerCase()
  return properties.value.filter(p => {
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
    const matchesType = !selectedType.value || p.type === selectedType.value
    const matchesStatus = !selectedStatus.value || p.status.toLowerCase().replace(' ', '-') === selectedStatus.value
    const matchesMap = !Object.keys(mapFilters.value).length || (
      (!mapFilters.value.minPrice || p.price >= Number(mapFilters.value.minPrice)) &&
      (!mapFilters.value.maxPrice || p.price <= Number(mapFilters.value.maxPrice)) &&
      (!mapFilters.value.beds || p.beds >= Number(mapFilters.value.beds)) &&
      (!mapFilters.value.type || p.type === mapFilters.value.type)
    )
    return matchesSearch && matchesType && matchesStatus && matchesMap
  })
})

const sortedProperties = computed(() => {
  const arr = [...filteredProperties.value]
  switch (sortBy.value) {
    case 'price-asc':  return arr.sort((a,b)=>a.price-b.price)
    case 'price-desc': return arr.sort((a,b)=>b.price-a.price)
    case 'newest':     return arr.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
    default:           return arr
  }
})

const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return sortedProperties.value.slice(start, start + pageSize)
})

const hasActiveFilters = computed(() => !!(searchQuery.value || selectedType.value || selectedStatus.value))
const labelType = computed(() => ({ house: 'House', apartment: 'Apartment', villa: 'Villa' })[selectedType.value] || '')
const labelStatus = computed(() => ({ 'for-sale': 'For Sale', 'for-rent': 'For Rent' })[selectedStatus.value] || '')

function syncQuery() {
  router.replace({ query: {
    view: viewMode.value || undefined,
    q: searchQuery.value || undefined,
    type: selectedType.value || undefined,
    status: selectedStatus.value || undefined,
    sort: sortBy.value !== 'relevant' ? sortBy.value : undefined,
    page: page.value !== 1 ? String(page.value) : undefined
  }})
}

watch([viewMode, searchQuery, selectedType, selectedStatus, sortBy, page], syncQuery)

function triggerFilter() { page.value = 1 }
function onSubmitSearch() { triggerFilter() }

function goToProperty(id) { router.push(`/properties/${id}`) }
function handlePropertySelected(p) { goToProperty(p.id) }
function handleMapMoved({ center, zoom }) { mapCenter.value = center; mapZoom.value = zoom }
function handleMapSearch({ location, filters }) {
  mapFilters.value = filters
  const l = String(location || '').toLowerCase()
  if (l.includes('hollywood'))      mapCenter.value = [34.0928, -118.3287]
  else if (l.includes('downtown'))  mapCenter.value = [34.0522, -118.2437]
  mapZoom.value = 12
}
function handleFiltersChanged(filters) {
  mapFilters.value = filters
  if (mapSearchRef.value) mapSearchRef.value.updateResultCount(sortedProperties.value.length)
}

function resetFilters() {
  searchQuery.value = ''
  selectedType.value = ''
  selectedStatus.value = ''
  sortBy.value = 'relevant'
  page.value = 1
}
</script>

<script>
import { defineComponent, h } from 'vue'

export default {}

/* ---------- Petits composants ---------- */
export const ViewToggle = defineComponent({
  name: 'ViewToggle',
  props: { modelValue: { type: String, required: true } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const btn = (val, label) =>
      h('button', {
        class: [
          'px-4 py-2 rounded-lg font-medium transition-colors border',
          props.modelValue === val
            ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        ],
        onClick: () => emit('update:modelValue', val)
      }, label)

    return () => h('div', { class: 'inline-flex gap-2' }, [btn('list', 'List View'), btn('map', 'Map View')])
  }
})

export const FilterChip = defineComponent({
  name: 'FilterChip',
  props: { label: { type: String, required: true } },
  emits: ['clear'],
  setup(p, { emit }) {
    return () => h('span', { class: 'inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700' }, [
      p.label,
      h('button', { class: 'text-[var(--brand)] hover:text-[var(--brand-700)]', onClick: () => emit('clear') }, '×')
    ])
  }
})

export const Pagination = defineComponent({
  name: 'Pagination',
  props: { total: { type: Number, required: true }, pageSize: { type: Number, required: true }, page: { type: Number, default: 1 } },
  emits: ['update:page'],
  setup(props, { emit }) {
    const pages = () => Math.ceil(props.total / props.pageSize)
    const to = (p) => emit('update:page', Math.min(Math.max(1, p), pages()))
    return () => h('nav', { class: 'flex items-center justify-center gap-2' }, [
      h('button', { class: 'rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50', onClick: () => to(props.page - 1) }, 'Prev'),
      ...Array.from({ length: pages() }, (_, i) => i + 1).map(n =>
        h('button', {
          class: [
            'rounded-md px-3 py-1.5 text-sm',
            n === props.page ? 'bg-[var(--brand)] text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          ],
          onClick: () => to(n)
        }, String(n))
      ),
      h('button', { class: 'rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50', onClick: () => to(props.page + 1) }, 'Next')
    ])
  }
})

export const PropertyCard = defineComponent({
  name: 'PropertyCard',
  props: { property: { type: Object, required: true } },
  setup({ property }) {
    const badge = property.status === 'For Rent' ? 'For Rent' : 'For Sale'
    const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(property.price)
    return () => h('article', { class: 'group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition' }, [
      h('div', { class: 'relative' }, [
        h('img', { src: property.image, alt: property.title, class: 'h-56 w-full object-cover' }),
        // Badge couleur capture
        h('div', { class: 'absolute top-4 left-4 rounded bg-[var(--brand)] px-3 py-1 text-sm font-medium text-white' }, badge),
        h('div', { class: 'absolute bottom-4 left-4 rounded bg-white/95 px-3 py-2 text-lg font-bold text-gray-900 shadow' }, price)
      ]),
      h('div', { class: 'p-5' }, [
        h('h3', { class: 'text-lg font-semibold text-gray-900 line-clamp-1' }, property.title),
        h('p', { class: 'mt-1 text-sm text-gray-600 line-clamp-1' }, property.address),
        h('div', { class: 'mt-4 flex items-center gap-6 border-t border-gray-200 pt-4 text-sm' }, [
          h('div', { class: 'flex items-center gap-1' }, [ h('span', { class: 'font-semibold text-gray-900' }, property.beds), h('span', { class: 'text-gray-600' }, 'Beds') ]),
          h('div', { class: 'flex items-center gap-1' }, [ h('span', { class: 'font-semibold text-gray-900' }, property.baths), h('span', { class: 'text-gray-600' }, 'Baths') ]),
          h('div', { class: 'flex items-center gap-1' }, [ h('span', { class: 'font-semibold text-gray-900' }, property.sqft), h('span', { class: 'text-gray-600' }, 'sqft') ])
        ])
      ])
    ])
  }
})
</script>

<style scoped>
/* rien d’obligatoire ici */
</style>
