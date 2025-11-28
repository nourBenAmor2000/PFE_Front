<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero / Heading -->
    <section class="bg-white py-12 border-b border-gray-100">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Trouvez la propriété de vos rêves</h1>
            <p class="mt-1 text-gray-600 text-base">
              Parcourez notre sélection de logements en Tunisie
            </p>
          </div>
          <ViewToggle v-model="viewMode" class="mt-2 sm:mt-0" />
        </div>

     
      </div>
    </section>

    <!-- Results -->
    <section class="py-10">
      <div class="container mx-auto px-4">
        <div class="mb-4 flex items-center justify-between gap-3">
          <p class="text-sm text-gray-600">
            <span class="font-semibold text-gray-900">{{ sortedProperties.length }}</span> properties found
          </p>
          <ViewToggle v-model="viewMode" class="sm:hidden" />
        </div>

        <div v-if="isLoading" class="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <span class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[var(--brand)]"></span>
          Chargement…
        </div>

        <!-- MAP VIEW -->
        <div v-if="viewMode === 'map'" class="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div class="lg:col-span-2 space-y-4">
            <h2 class="text-sm font-semibold text-gray-700">
              {{ sortedProperties.length }} propriétés dans cette zone
            </h2>

            <div class="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              <PropertyCard
                v-for="property in sortedProperties"
                :key="property.id"
                :property="property"
                @click="goToProperty(property.id)"
              />
            </div>
          </div>

          <div class="lg:col-span-3">
            <MapSearch
              ref="mapSearchRef"
              @search="handleMapSearch"
              @filters-changed="handleFiltersChanged"
              @bounds-changed="handleBoundsChanged"
            />
          </div>
        </div>

        <!-- LIST VIEW -->
        <div v-else>
          <div
            v-if="!sortedProperties.length && !isLoading"
            class="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center"
          >
            <p class="text-gray-800 font-medium">No property matches your search.</p>
            <p class="mt-1 text-gray-500">Try broadening filters or changing keywords.</p>
            <button
              class="mt-4 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="resetFilters"
            >
              Reset filters
            </button>
          </div>

          <div
            v-else
            class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <PropertyCard
              v-for="property in paged"
              :key="property.id"
              :property="property"
              @click="goToProperty(property.id)"
            />
          </div>

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
import { ref, computed, watch, onMounted, defineComponent, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MapSearch from '../components/MapSearch.vue'
import { useLogements } from '../composables/useLogements'

onMounted(() => {
  document.documentElement.style.setProperty('--brand', '#EF4445')
  document.documentElement.style.setProperty('--brand-600', '#E23D3E')
  document.documentElement.style.setProperty('--brand-700', '#C93637')
  loadProperties()
})

const router = useRouter()
const route = useRoute()
const logementsStore = useLogements()

const viewMode = ref(route.query.view || 'list')

const mapBounds = ref(null)
const mapSearchRef = ref(null)
const mapFilters = ref({})

const isLoading = ref(false)

const searchQuery = ref(route.query.q || '')
const selectedType = ref(route.query.type || '')
const selectedStatus = ref(route.query.status || '')
const sortBy = ref(route.query.sort || 'relevant')

const page = ref(Number(route.query.page || 1))
const pageSize = 9

const properties = ref([])

function formatPriceTND(value) {
  if (!value && value !== 0) return null
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'TND',
    maximumFractionDigits: 0
  }).format(value)
}

async function loadProperties() {
  isLoading.value = true
  try {
    await logementsStore.searchLogements({
      search: searchQuery.value || undefined,
      free: selectedStatus.value === 'for-rent' ? true : undefined,
      sort:
        sortBy.value === 'price-asc' || sortBy.value === 'price-desc'
          ? 'price'
          : sortBy.value === 'newest'
          ? 'created_at'
          : 'title',
      sort_dir: sortBy.value === 'price-desc' ? 'desc' : 'asc',
      per_page: 100
    })

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

      const status = log.free ? 'For Rent' : 'For Sale'

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
        free: !!log.free,
        image: mainImage,
        latitude: lat,
        longitude: lng,
        lat,
        lng,
        category: log.category,
        agency: log.agency,
        createdAt: log.created_at || log.createdAt || log.created_at_human || new Date().toISOString()
      }
    })

    syncMapMarkers()
  } catch (error) {
    console.error('Failed to load properties:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredProperties = computed(() => {
  const q = String(searchQuery.value || '').trim().toLowerCase()

  return properties.value.filter(p => {
    const title = (p.title || '').toLowerCase()
    const addr  = (p.address || '').toLowerCase()

    const matchesSearch =
      !q ||
      title.includes(q) ||
      addr.includes(q)

    const matchesType =
      !selectedType.value || p.type === selectedType.value

    const matchesStatus =
      !selectedStatus.value ||
      p.status.toLowerCase().replace(' ', '-') === selectedStatus.value

    const f = mapFilters.value || {}
    const price = typeof p.price === 'number' ? p.price : 0
    const beds  = typeof p.beds === 'number' ? p.beds : 0

    const matchesMinPrice =
      !f.minPrice || price >= f.minPrice
    const matchesMaxPrice =
      !f.maxPrice || price <= f.maxPrice
    const matchesBeds =
      !f.beds || beds >= f.beds
    const matchesMapType =
      !f.type || !p.type ? true : p.type === f.type

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesBeds &&
      matchesMapType
    )
  })
})

const sortedProperties = computed(() => {
  const arr = [...filteredProperties.value]
  switch (sortBy.value) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price)
    case 'newest':
      return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    default:
      return arr
  }
})

const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return sortedProperties.value.slice(start, start + pageSize)
})

const hasActiveFilters = computed(() =>
  !!(searchQuery.value || selectedType.value || selectedStatus.value)
)

const labelType = computed(
  () => ({ house: 'House', apartment: 'Apartment', villa: 'Villa' })[selectedType.value] || ''
)
const labelStatus = computed(
  () => ({ 'for-sale': 'For Sale', 'for-rent': 'For Rent' })[selectedStatus.value] || ''
)

function syncQuery() {
  router.replace({
    query: {
      view: viewMode.value || undefined,
      q: searchQuery.value || undefined,
      type: selectedType.value || undefined,
      status: selectedStatus.value || undefined,
      sort: sortBy.value !== 'relevant' ? sortBy.value : undefined,
      page: page.value !== 1 ? String(page.value) : undefined
    }
  })
}

watch([viewMode, searchQuery, selectedType, selectedStatus, sortBy, page], syncQuery)

watch(sortedProperties, () => {
  syncMapMarkers()
})

function syncMapMarkers() {
  if (!mapSearchRef.value || viewMode.value !== 'map') return

  const pts = sortedProperties.value
    .filter(p => typeof p.lat === 'number' && typeof p.lng === 'number')
    .map(p => ({
      ...p,
      lat: p.lat,
      lng: p.lng,
      title: p.title,
      price: p.price,
      address: p.address
    }))

  mapSearchRef.value.setProperties(pts)
  mapSearchRef.value.updateResultCount(pts.length)
}

function onSubmitSearch() {
  page.value = 1
}

function goToProperty(id) {
  router.push(`/properties/${id}`)
}

async function handleMapSearch({ location, bounds, filters }) {
  isLoading.value = true
  mapFilters.value = filters || {}

  try {
    const results = await logementsStore.mapSearch({
      location: location || undefined,
      bounds: bounds || mapBounds.value || undefined,
      filters: filters || {}
    })

    properties.value = results.map(prop => {
      const lat = prop.lat || prop.latitude
      const lng = prop.lng || prop.longitude

      const mainImage =
        prop.mainImage ||
        prop.coverImage ||
        (Array.isArray(prop.images) && prop.images[0]) ||
        (Array.isArray(prop.photos) && prop.photos[0]) ||
        prop.image ||
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'

      const status = prop.free ? 'For Rent' : 'For Sale'

      return {
        id: prop.id || prop._id,
        title: prop.title || 'Logement',
        address: prop.address || prop.location || '',
        price: prop.price || 0,
        formattedPrice: formatPriceTND(prop.price),
        beds: prop.beds || 0,
        baths: prop.baths || 0,
        sqft: prop.surface || 0,
        status,
        type: prop.type || 'house',
        free: !!prop.free,
        image: mainImage,
        latitude: lat,
        longitude: lng,
        lat,
        lng,
        category: prop.category,
        agency: prop.agency,
        createdAt: prop.createdAt || new Date().toISOString()
      }
    })

    syncMapMarkers()
  } catch (error) {
    console.error('Map search failed:', error)
  } finally {
    isLoading.value = false
    if (mapSearchRef.value) {
      mapSearchRef.value.stopLoading()
    }
  }
}

function handleFiltersChanged(filters) {
  // 👉 ici : ON NE RAPPELLE PAS L'API, on filtre seulement en front
  mapFilters.value = filters || {}
  page.value = 1
}

function handleBoundsChanged(bounds) {
  mapBounds.value = bounds
}

function resetFilters() {
  searchQuery.value = ''
  selectedType.value = ''
  selectedStatus.value = ''
  sortBy.value = 'relevant'
  page.value = 1
  mapFilters.value = {}
  loadProperties()
}

/* ---- Petits composants inline ---- */
const ViewToggle = defineComponent({
  name: 'ViewToggle',
  props: { modelValue: { type: String, required: true } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const btn = (val, label) =>
      h(
        'button',
        {
          class: [
            'px-4 py-2 rounded-lg font-medium transition-colors border',
            props.modelValue === val
              ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          ],
          onClick: () => emit('update:modelValue', val)
        },
        label
      )

    return () =>
      h('div', { class: 'inline-flex gap-2' }, [
        btn('list', 'Liste'),
        btn('map', 'Map')
      ])
  }
})

const FilterChip = defineComponent({
  name: 'FilterChip',
  props: { label: { type: String, required: true } },
  emits: ['clear'],
  setup(p, { emit }) {
    return () =>
      h(
        'span',
        {
          class:
            'inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700'
        },
        [
          p.label,
          h(
            'button',
            {
              class: 'text-[var(--brand)] hover:text-[var(--brand-700)]',
              onClick: () => emit('clear')
            },
            '×'
          )
        ]
      )
  }
})

const Pagination = defineComponent({
  name: 'Pagination',
  props: {
    total: { type: Number, required: true },
    pageSize: { type: Number, required: true },
    page: { type: Number, default: 1 }
  },
  emits: ['update:page'],
  setup(props, { emit }) {
    const pages = () => Math.ceil(props.total / props.pageSize)
    const to = p => emit('update:page', Math.min(Math.max(1, p), pages()))
    return () =>
      h('nav', { class: 'flex items-center justify-center gap-2' }, [
        h(
          'button',
          {
            class:
              'rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50',
            onClick: () => to(props.page - 1)
          },
          'Prev'
        ),
        ...Array.from({ length: pages() }, (_, i) => i + 1).map(n =>
          h(
            'button',
            {
              class: [
                'rounded-md px-3 py-1.5 text-sm',
                n === props.page
                  ? 'bg-[var(--brand)] text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              ],
              onClick: () => to(n)
            },
            String(n)
          )
        ),
        h(
          'button',
          {
            class:
              'rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50',
            onClick: () => to(props.page + 1)
          },
          'Next'
        )
      ])
  }
})

const PropertyCard = defineComponent({
  name: 'PropertyCard',
  props: { property: { type: Object, required: true } },
  setup({ property }) {
    const isForRent = property.status === 'For Rent'
    const statusText = isForRent ? 'À louer' : 'À vendre'
    const statusColor = isForRent ? 'bg-emerald-500' : 'bg-sky-500'

    const priceLabel =
      property.formattedPrice ||
      new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'TND',
        maximumFractionDigits: 0
      }).format(property.price || 0)

    const address = property.address || 'Adresse non disponible'

    return () =>
      h(
        'article',
        {
          class:
            'group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition'
        },
        [
          h('div', { class: 'relative overflow-hidden' }, [
            h('img', {
              src: property.image,
              alt: property.title,
              class:
                'h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105'
            }),
            h(
              'div',
              {
                class:
                  `absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow ` +
                  statusColor
              },
              statusText
            ),
            h(
              'div',
              {
                class:
                  'absolute bottom-4 left-4 rounded-lg bg-white/95 px-3 py-2 text-lg font-bold text-gray-900 shadow'
              },
              priceLabel
            )
          ]),
          h('div', { class: 'p-5 space-y-3' }, [
            h(
              'h3',
              { class: 'text-lg font-semibold text-gray-900 line-clamp-1' },
              property.title
            ),
            h(
              'p',
              { class: 'mt-1 text-sm text-gray-600 line-clamp-1 flex items-center gap-1' },
              [
                h(
                  'svg',
                  {
                    class: 'w-4 h-4 text-gray-400 flex-shrink-0',
                    fill: 'none',
                    stroke: 'currentColor',
                    viewBox: '0 0 24 24'
                  },
                  [
                    h('path', {
                      'stroke-linecap': 'round',
                      'stroke-linejoin': 'round',
                      'stroke-width': '2',
                      d: 'M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z'
                    }),
                    h('path', {
                      'stroke-linecap': 'round',
                      'stroke-linejoin': 'round',
                      'stroke-width': '2',
                      d: 'M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'
                    })
                  ]
                ),
                address
              ]
            ),
            h(
              'div',
              {
                class:
                  'mt-3 flex items-center gap-4 border-t border-gray-100 pt-3 text-sm text-gray-700'
              },
              [
                h('div', { class: 'flex items-center gap-1' }, [
                  h('span', { class: 'font-semibold text-gray-900' }, property.beds || 0),
                  h('span', { class: 'text-gray-500' }, 'ch.')
                ]),
                h('div', { class: 'flex items-center gap-1' }, [
                  h('span', { class: 'font-semibold text-gray-900' }, property.baths || 0),
                  h('span', { class: 'text-gray-500' }, 'sdb')
                ]),
                h('div', { class: 'flex items-center gap-1' }, [
                  h('span', { class: 'font-semibold text-gray-900' }, property.sqft || 0),
                  h('span', { class: 'text-gray-500' }, 'm²')
                ])
              ]
            ),
            (property.category || property.agency) &&
              h(
                'div',
                { class: 'flex flex-wrap gap-2 text-xs pt-1' },
                [
                  property.category &&
                    h(
                      'span',
                      {
                        class:
                          'rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700'
                      },
                      typeof property.category === 'string'
                        ? property.category
                        : property.category.name
                    ),
                  property.agency &&
                    h(
                      'span',
                      {
                        class:
                          'rounded-full bg-purple-50 px-3 py-1 text-[11px] font-medium text-purple-700'
                      },
                      typeof property.agency === 'string'
                        ? property.agency
                        : property.agency.name
                    )
                ]
              )
          ])
        ]
      )
  }
})
</script>
