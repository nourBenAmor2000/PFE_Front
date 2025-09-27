<template>
  <div class="map-search bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Search on Map</h3>
    
    <!-- Search Controls -->
    <div class="space-y-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <input
          v-model="searchLocation"
          type="text"
          placeholder="Enter city, address, or ZIP code"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          @keyup.enter="searchByLocation"
        />
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
          <select
            v-model="filters.minPrice"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">No Min</option>
            <option value="100000">$100K</option>
            <option value="250000">$250K</option>
            <option value="500000">$500K</option>
            <option value="750000">$750K</option>
            <option value="1000000">$1M</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
          <select
            v-model="filters.maxPrice"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">No Max</option>
            <option value="250000">$250K</option>
            <option value="500000">$500K</option>
            <option value="750000">$750K</option>
            <option value="1000000">$1M</option>
            <option value="2000000">$2M+</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
          <select
            v-model="filters.beds"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
          <select
            v-model="filters.type"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Types</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="condo">Condo</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex space-x-3">
      <button
        @click="applyFilters"
        class="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium"
      >
        Search Area
      </button>
      <button
        @click="clearFilters"
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Clear
      </button>
    </div>
    
    <!-- Results Count -->
    <div v-if="resultCount !== null" class="mt-4 text-sm text-gray-600">
      {{ resultCount }} properties found in this area
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['search', 'filters-changed'])

const searchLocation = ref('')
const resultCount = ref(null)

const filters = reactive({
  minPrice: '',
  maxPrice: '',
  beds: '',
  type: ''
})

const searchByLocation = () => {
  if (searchLocation.value.trim()) {
    emit('search', {
      location: searchLocation.value,
      filters: { ...filters }
    })
  }
}

const applyFilters = () => {
  emit('filters-changed', { ...filters })
}

const clearFilters = () => {
  searchLocation.value = ''
  filters.minPrice = ''
  filters.maxPrice = ''
  filters.beds = ''
  filters.type = ''
  resultCount.value = null
  emit('filters-changed', {})
}

const updateResultCount = (count) => {
  resultCount.value = count
}

// Expose method to parent component
defineExpose({
  updateResultCount
})
</script>
