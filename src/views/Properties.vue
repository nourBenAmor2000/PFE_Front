<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Property</h1>
          <p class="text-gray-600 text-lg">Browse through our extensive collection of properties</p>
        </div>
        
        <!-- Search and Filters -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search properties..."
              class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <select
              v-model="selectedType"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
            </select>
            <select
              v-model="selectedStatus"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
            </select>
            <button
              @click="searchProperties"
              class="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Properties Grid -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <!-- View Toggle -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                viewMode === 'list' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              ]"
            >
              List View
            </button>
            <button
              @click="viewMode = 'map'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                viewMode === 'map' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              ]"
            >
              Map View
            </button>
          </div>
          <div class="text-sm text-gray-600">
            {{ filteredProperties.length }} properties found
          </div>
        </div>

        <!-- Map View -->
        <div v-if="viewMode === 'map'" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Map Search Sidebar -->
          <div class="lg:col-span-1">
            <MapSearch 
              ref="mapSearchRef"
              @search="handleMapSearch" 
              @filters-changed="handleFiltersChanged"
            />
          </div>
          
          <!-- Map Container -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
              <PropertyMap
                :properties="filteredProperties"
                :center="mapCenter"
                :zoom="mapZoom"
                height="600px"
                @property-selected="handlePropertySelected"
                @map-moved="handleMapMoved"
              />
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="property in filteredProperties"
            :key="property.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            @click="goToProperty(property.id)"
          >
            <!-- Property Image -->
            <div class="relative">
              <img :src="property.image" :alt="property.title" class="w-full h-64 object-cover" />
              <div class="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium">
                {{ property.status }}
              </div>
              <div class="absolute bottom-4 left-4 bg-white text-gray-900 px-3 py-2 rounded font-bold text-lg shadow-md">
                ${{ property.price.toLocaleString() }}
              </div>
            </div>
            
            <!-- Property Details -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ property.title }}</h3>
              <p class="text-gray-600 mb-4">{{ property.address }}</p>
              
              <!-- Property Features -->
              <div class="flex items-center gap-6 mb-4 pb-4 border-b border-gray-200">
                <div class="flex items-center gap-1">
                  <span class="font-bold text-gray-900">{{ property.beds }}</span>
                  <span class="text-gray-600 text-sm">Beds</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="font-bold text-gray-900">{{ property.baths }}</span>
                  <span class="text-gray-600 text-sm">Baths</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="font-bold text-gray-900">{{ property.sqft }}</span>
                  <span class="text-gray-600 text-sm">sqft</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PropertyMap from '../components/PropertyMap.vue'
import MapSearch from '../components/MapSearch.vue'

const router = useRouter()

const viewMode = ref('list')
const mapCenter = ref([34.0522, -118.2437]) // Los Angeles
const mapZoom = ref(10)
const mapSearchRef = ref(null)
const mapFilters = ref({})

// Search and filter state
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

const properties = ref([
  {
    id: 1,
    title: "House on the Hollywood",
    address: "374 Johnson Ave",
    price: 4600,
    beds: 6,
    baths: 2,
    sqft: 200,
    status: "For Sale",
    type: "house",
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
    latitude: 34.0928,
    longitude: -118.3287
  },
  {
    id: 2,
    title: "Comfortable Villa Green",
    address: "178 Broadway, Brooklyn",
    price: 5800,
    beds: 9,
    baths: 3,
    sqft: 600,
    status: "For Sale",
    type: "villa",
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
    latitude: 34.0522,
    longitude: -118.2437
  },
  {
    id: 3,
    title: "Quality House For Sale",
    address: "873 Bedford Ave",
    price: 2500,
    beds: 10,
    baths: 2,
    sqft: 500,
    status: "For Sale",
    type: "house",
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
    latitude: 34.0195,
    longitude: -118.4912
  },
  {
    id: 4,
    title: "Luxury Downtown Apartment",
    address: "456 Park Avenue, Manhattan",
    price: 7200,
    beds: 3,
    baths: 2,
    sqft: 1200,
    status: "For Rent",
    type: "apartment",
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
    latitude: 34.0407,
    longitude: -118.2468
  }
])

const filteredProperties = computed(() => {
  return properties.value.filter(property => {
    const matchesSearch = !searchQuery.value || 
      property.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesType = !selectedType.value || property.type === selectedType.value
    const matchesStatus = !selectedStatus.value || 
      property.status.toLowerCase().replace(' ', '-') === selectedStatus.value
    
    // Apply map filters
    const matchesMapFilters = Object.keys(mapFilters.value).length === 0 || (
      (!mapFilters.value.minPrice || property.price >= parseInt(mapFilters.value.minPrice)) &&
      (!mapFilters.value.maxPrice || property.price <= parseInt(mapFilters.value.maxPrice)) &&
      (!mapFilters.value.beds || property.beds >= parseInt(mapFilters.value.beds)) &&
      (!mapFilters.value.type || property.type === mapFilters.value.type)
    )
    
    return matchesSearch && matchesType && matchesStatus && matchesMapFilters
  })
})

// Methods
const searchProperties = () => {
  console.log('Searching properties...')
}

const goToProperty = (id) => {
  router.push(`/properties/${id}`)
}

const handlePropertySelected = (property) => {
  router.push(`/properties/${property.id}`)
}

const handleMapMoved = ({ center, zoom }) => {
  mapCenter.value = center
  mapZoom.value = zoom
}

const handleMapSearch = ({ location, filters }) => {
  console.log('Map search:', location, filters)
  mapFilters.value = filters
  
  // Mock geocoding - in real app, use geocoding service
  if (location.toLowerCase().includes('hollywood')) {
    mapCenter.value = [34.0928, -118.3287]
  } else if (location.toLowerCase().includes('downtown')) {
    mapCenter.value = [34.0522, -118.2437]
  }
  
  mapZoom.value = 12
}

const handleFiltersChanged = (filters) => {
  mapFilters.value = filters
  
  // Update result count in map search component
  if (mapSearchRef.value) {
    mapSearchRef.value.updateResultCount(filteredProperties.value.length)
  }
}
</script>
